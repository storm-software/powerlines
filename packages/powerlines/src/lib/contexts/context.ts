/* -------------------------------------------------------------------

                   ⚡ Storm Software - Powerlines

 This code was released as part of the Powerlines project. Powerlines
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/powerlines.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/powerlines
 Documentation:            https://docs.stormsoftware.com/projects/powerlines
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { LogLevelLabel } from "@storm-software/config-tools/types";
import { toArray } from "@stryke/convert/to-array";
import { EnvPaths, getEnvPaths } from "@stryke/env/get-env-paths";
import { existsSync } from "@stryke/fs/exists";
import { relativeToWorkspaceRoot } from "@stryke/fs/get-workspace-root";
import { readJsonFile } from "@stryke/fs/json";
import { resolvePackage } from "@stryke/fs/resolve";
import { hashDirectory } from "@stryke/hash/hash-files";
import { murmurhash } from "@stryke/hash/murmurhash";
import { getUnique, getUniqueBy } from "@stryke/helpers/get-unique";
import { omit } from "@stryke/helpers/omit";
import { fetchRequest } from "@stryke/http/fetch";
import { StormJSON } from "@stryke/json/storm-json";
import { appendPath } from "@stryke/path/append";
import { isParentPath } from "@stryke/path/is-parent-path";
import { isAbsolute } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join";
import { replacePath } from "@stryke/path/replace";
import { titleCase } from "@stryke/string-format/title-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isNull } from "@stryke/type-checks/is-null";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { PackageJson } from "@stryke/types/package-json";
import { uuid } from "@stryke/unique-id/uuid";
import { match, tsconfigPathsToRegExp } from "bundle-require";
import defu from "defu";
import { create, FlatCache } from "flat-cache";
import { parse, ParseResult } from "oxc-parser";
import { Range } from "semver";
import { Project } from "ts-morph";
import {
  Agent,
  BodyInit,
  interceptors,
  RequestInfo,
  Response,
  setGlobalDispatcher
} from "undici";
import {
  ExternalIdResult,
  UnpluginBuildContext,
  UnpluginMessage
} from "unplugin";
import {
  createResolver,
  CreateResolverOptions
} from "../../internal/helpers/resolver";
import { checkDedupe, isPlugin } from "../../plugin-utils/helpers";
import { replacePathTokens } from "../../plugin-utils/paths";
import {
  InitialUserConfig,
  LogFn,
  ParsedUserConfig,
  PluginConfig,
  PowerlinesCommand,
  WorkspaceConfig
} from "../../types/config";
import {
  Context,
  EmitEntryOptions,
  EmitOptions,
  FetchOptions,
  InitContextOptions,
  MetaInfo,
  ParseOptions,
  Resolver,
  TransformResult
} from "../../types/context";
import {
  ResolveOptions,
  VirtualFile,
  VirtualFileSystemInterface
} from "../../types/fs";
import { UNSAFE_ContextInternal } from "../../types/internal";
import {
  ResolvedAssetGlob,
  ResolvedConfig,
  ResolvedEntryTypeDefinition
} from "../../types/resolved";
import { ParsedTypeScriptConfig } from "../../types/tsconfig";
import { loadUserConfigFile, loadWorkspaceConfig } from "../config-file";
import { getUniqueEntries, resolveEntriesSync } from "../entry";
import { VirtualFileSystem } from "../fs/vfs";
import { createLog, extendLog } from "../logger";
import { createProgram } from "../typescript/ts-morph";
import { getTsconfigFilePath } from "../typescript/tsconfig";
import {
  CACHE_HASH_LENGTH,
  getPrefixedProjectRootHash,
  PROJECT_ROOT_HASH_LENGTH
} from "../utilities/meta";

interface ConfigCacheKey {
  projectRoot: string;
  mode: "test" | "development" | "production";
  skipCache: boolean;
  configFile?: string;
  framework: string;
  command?: string;
}

interface ConfigCacheResult {
  projectJson: Context["projectJson"];
  packageJson: Context["packageJson"];
  checksum: string;
  resolver: Resolver;
  userConfig: ParsedUserConfig;
}

const configCache = new WeakMap<ConfigCacheKey, ConfigCacheResult>();

interface EnvPathCacheKey {
  framework: string;
  workspaceRoot: string;
}

const envPathCache = new WeakMap<EnvPathCacheKey, EnvPaths>();

const agent = new Agent({ keepAliveTimeout: 10000 });
setGlobalDispatcher(
  agent.compose(
    interceptors.retry({
      maxRetries: 3,
      minTimeout: 1000,
      maxTimeout: 10000,
      timeoutFactor: 2,
      retryAfter: true
    })
  )
);

export class PowerlinesContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> implements Context<TResolvedConfig> {
  /**
   * Internal references storage
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  #internal = {} as UNSAFE_ContextInternal<TResolvedConfig>;

  #workspaceConfig: WorkspaceConfig;

  #checksum: string | null = null;

  #buildId: string = uuid();

  #releaseId: string = uuid();

  #timestamp: number = Date.now();

  #entry: ResolvedEntryTypeDefinition[] | null = null;

  #fs!: VirtualFileSystemInterface;

  #tsconfig!: ParsedTypeScriptConfig;

  #program!: Project;

  #parserCache!: FlatCache;

  #requestCache!: FlatCache;

  #getConfigProps(config: Partial<TResolvedConfig["userConfig"]> = {}) {
    return defu(
      {
        variant: config.build?.variant,
        projectType: config.type,
        projectRoot: config.root,
        name: config.name,
        title: config.title,
        organization: config.organization,
        compatibilityDate: config.compatibilityDate,
        description: config.description,
        sourceRoot: config.sourceRoot,
        configFile: config.configFile,
        customLogger: config.customLogger,
        logLevel: config.logLevel,
        tsconfig: config.tsconfig,
        tsconfigRaw: config.tsconfigRaw,
        skipCache: config.skipCache,
        skipInstalls: config.skipInstalls,
        entry: config.entry,
        output: config.output,
        plugins: config.plugins,
        mode: config.mode,
        lint: config.lint,
        transform: config.transform,
        build: config.build,
        framework: config.framework,
        ...config
      },
      {
        output: config.framework
          ? {
              artifactsPath: joinPaths(
                config.root ?? this.config.projectRoot,
                `.${config.framework ?? "powerlines"}`
              ),
              dts: joinPaths(
                config.root ?? this.config.projectRoot,
                `${config.framework ?? "powerlines"}.d.ts`
              ),
              builtinPrefix: config.framework ?? "powerlines"
            }
          : {}
      }
    );
  }

  /**
   * Create a new Storm context from the workspace root and user config.
   *
   * @param workspaceRoot - The root directory of the workspace.
   * @param config - The user configuration options.
   * @returns A promise that resolves to the new context.
   */
  public static async from<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    workspaceRoot: string,
    config: InitialUserConfig<TResolvedConfig["userConfig"]>
  ): Promise<Context> {
    const context = new PowerlinesContext<TResolvedConfig>(
      await loadWorkspaceConfig(workspaceRoot, config.root)
    );
    await context.withUserConfig(config);

    const powerlinesPath = await resolvePackage("powerlines");
    if (!powerlinesPath) {
      throw new Error("Could not resolve `powerlines` package location.");
    }

    context.powerlinesPath = powerlinesPath;

    return context;
  }

  /**
   * An object containing the dependencies that should be installed for the project
   */
  public dependencies: Record<string, string | Range> = {};

  /**
   * An object containing the development dependencies that should be installed for the project
   */
  public devDependencies: Record<string, string | Range> = {};

  /**
   * The persisted meta information about the current build
   */
  public persistedMeta: MetaInfo | undefined = undefined;

  /**
   * The path to the Powerlines package
   */
  public powerlinesPath!: string;

  /**
   * The parsed `package.json` file for the project
   */
  public packageJson!: PackageJson;

  /**
   * The parsed `project.json` file for the project
   */
  public projectJson: Record<string, any> | undefined = undefined;

  /**
   * The module resolver for the project
   */
  public resolver!: Resolver;

  /**
   * The resolved configuration options
   */
  private resolvePatterns: RegExp[] = [];

  /**
   * Internal context fields and methods
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  public get $$internal(): UNSAFE_ContextInternal<TResolvedConfig> {
    return this.#internal;
  }

  /**
   * Internal context fields and methods
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  public set $$internal(value: UNSAFE_ContextInternal<TResolvedConfig>) {
    this.#internal = value;
  }

  /**
   * The resolved entry type definitions for the project
   */
  public get entry(): ResolvedEntryTypeDefinition[] {
    return resolveEntriesSync(
      this,
      !this.#entry ? toArray(this.config.entry) : this.#entry
    );
  }

  /**
   * Sets the resolved entry type definitions for the project
   */
  public set entry(value: ResolvedEntryTypeDefinition[]) {
    this.#entry = value;
  }

  /**
   * The TypeScript configuration parsed from the tsconfig file
   */
  public get tsconfig(): ParsedTypeScriptConfig {
    if (!this.#tsconfig) {
      this.tsconfig = {
        tsconfigFilePath: this.config.tsconfig
      } as ParsedTypeScriptConfig;
    }

    return this.#tsconfig;
  }

  /**
   * Sets the TypeScript configuration parsed from the tsconfig file
   */
  public set tsconfig(value: ParsedTypeScriptConfig) {
    this.#tsconfig = value;
    this.resolvePatterns = tsconfigPathsToRegExp(value?.options?.paths ?? {});
  }

  /**
   * The virtual file system interface for the project
   */
  public get fs(): VirtualFileSystemInterface {
    if (!this.#fs) {
      this.#fs = VirtualFileSystem.createSync(this);
    }

    return this.#fs;
  }

  /**
   * Get the checksum of the project's current state
   */
  public get checksum(): string | null {
    return this.#checksum;
  }

  /**
   * The meta information about the current build
   */
  public get meta() {
    return {
      buildId: this.#buildId,
      releaseId: this.#releaseId,
      checksum: this.#checksum,
      timestamp: this.#timestamp,
      projectRootHash: murmurhash(
        {
          workspaceRoot: this.workspaceConfig?.workspaceRoot,
          projectRoot: this.config?.projectRoot
        },
        {
          maxLength: PROJECT_ROOT_HASH_LENGTH
        }
      ),
      configHash: murmurhash(this.config, {
        maxLength: CACHE_HASH_LENGTH
      })
    } as MetaInfo;
  }

  /**
   * The resolved configuration options
   */
  public get config(): TResolvedConfig {
    return this.resolvedConfig ?? {};
  }

  /**
   * The logger function
   */
  public get log(): LogFn {
    if (!this.logFn) {
      this.logFn = this.createLog();
    }

    return this.logFn;
  }

  /**
   * The workspace configuration
   */
  public get workspaceConfig(): WorkspaceConfig {
    return this.#workspaceConfig;
  }

  /**
   * The environment paths for the project
   */
  public get envPaths(): EnvPaths {
    if (
      envPathCache.has({
        workspaceRoot: this.workspaceConfig.workspaceRoot,
        framework: this.config?.framework || "powerlines"
      })
    ) {
      return envPathCache.get({
        workspaceRoot: this.workspaceConfig.workspaceRoot,
        framework: this.config?.framework || "powerlines"
      })!;
    }

    const envPaths = getEnvPaths({
      orgId: "storm-software",
      appId: this.config?.framework || "powerlines",
      workspaceRoot: this.workspaceConfig.workspaceRoot
    });
    envPathCache.set(
      {
        workspaceRoot: this.workspaceConfig.workspaceRoot,
        framework: this.config?.framework || "powerlines"
      },
      envPaths
    );

    return envPaths;
  }

  /**
   * Get the path to the artifacts directory for the project
   */
  public get artifactsPath(): string {
    return joinPaths(
      this.workspaceConfig.workspaceRoot,
      this.config.projectRoot,
      this.config.output.artifactsPath
    );
  }

  /**
   * Get the path to the builtin modules used by the project
   */
  public get builtinsPath(): string {
    return joinPaths(this.artifactsPath, "builtins");
  }

  /**
   * Get the path to the entry directory for the project
   */
  public get entryPath(): string {
    return joinPaths(this.artifactsPath, "entry");
  }

  /**
   * Get the path to the data directory for the project
   */
  public get dataPath(): string {
    return joinPaths(
      this.envPaths.data,
      "projects",
      getPrefixedProjectRootHash(this.config.name, this.meta.projectRootHash)
    );
  }

  /**
   * Get the path to the cache directory for the project
   */
  public get cachePath(): string {
    return joinPaths(
      this.envPaths.cache,
      "projects",
      murmurhash(
        {
          checksum: this.#checksum,
          config: this.meta.configHash
        },
        {
          maxLength: CACHE_HASH_LENGTH
        }
      )
    );
  }

  /**
   * Get the path to the generated declaration file for the project
   */
  public get dtsPath(): string {
    return this.config.output.dts
      ? appendPath(this.config.output.dts, this.workspaceConfig.workspaceRoot)
      : joinPaths(
          this.workspaceConfig.workspaceRoot,
          this.config.projectRoot,
          "powerlines.d.ts"
        );
  }

  /**
   * Get the project root relative to the workspace root
   */
  public get relativeToWorkspaceRoot() {
    return relativeToWorkspaceRoot(this.config.projectRoot);
  }

  /**
   * The builtin module id that exist in the Powerlines virtual file system
   */
  public get builtins(): string[] {
    return Object.values(this.fs.metadata)
      .filter(meta => meta && meta.type === "builtin")
      .map(meta => meta?.id)
      .filter(Boolean);
  }

  /**
   * The {@link Project} instance used for type reflection and module manipulation
   *
   * @see https://ts-morph.com/
   *
   * @remarks
   * This instance is created lazily on first access.
   */
  public get program(): Project {
    if (!this.#program) {
      this.#program = createProgram(this, {
        skipAddingFilesFromTsConfig: true
      });
    }

    return this.#program;
  }

  /**
   * Gets the parser cache.
   */
  protected get parserCache(): FlatCache {
    if (!this.#parserCache) {
      this.#parserCache = create({
        cacheId: "parser",
        cacheDir: this.cachePath,
        ttl: 2 * 60 * 60 * 1000,
        lruSize: 5000,
        persistInterval: 250
      });
    }

    return this.#parserCache;
  }

  /**
   * Gets the request cache.
   */
  protected get requestCache(): FlatCache {
    if (!this.#requestCache) {
      this.#requestCache = create({
        cacheId: "http",
        cacheDir: this.cachePath,
        ttl: 6 * 60 * 60 * 1000,
        lruSize: 5000,
        persistInterval: 250
      });
    }

    return this.#requestCache;
  }

  /**
   * A function to perform HTTP fetch requests
   *
   * @remarks
   * This function uses a caching layer to avoid duplicate requests during the Powerlines process.
   *
   * @example
   * ```ts
   * const response = await context.fetch("https://api.example.com/data");
   * const data = await response.json();
   * ```
   *
   * @see https://github.com/nodejs/undici
   *
   * @param input - The URL to fetch.
   * @param options - The fetch request options.
   * @returns A promise that resolves to a response returned by the fetch.
   */
  public async fetch(
    input: RequestInfo,
    options: FetchOptions = {}
  ): Promise<Response> {
    const cacheKey = murmurhash({
      input: input.toString(),
      options: JSON.stringify(options)
    });

    if (!this.config.skipCache && !options.skipCache) {
      const cached = this.requestCache.get<{ body: BodyInit } & ResponseInit>(
        cacheKey
      );
      if (cached) {
        return new Response(cached.body, {
          status: cached.status,
          statusText: cached.statusText,
          headers: cached.headers
        });
      }
    }

    const response = await fetchRequest(input, { timeout: 12_000, ...options });
    const result = {
      body: await response.text(),
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    };

    if (!this.config.skipCache && !options.skipCache) {
      try {
        this.requestCache.set(cacheKey, result);
      } catch {
        // Do nothing
      }
    }

    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers: result.headers
    });
  }

  /**
   * Parse code using [Oxc-Parser](https://github.com/oxc/oxc) into an (ESTree-compatible)[https://github.com/estree/estree] AST object.
   *
   * @remarks
   * This function can be used to parse TypeScript code into an AST for further analysis or transformation.
   *
   * @example
   * ```ts
   * const ast = context.parse("const x: number = 42;");
   * ```
   *
   * @see https://rollupjs.org/plugin-development/#this-parse
   * @see https://github.com/oxc/oxc
   *
   * @param code - The source code to parse.
   * @param options - The options to pass to the parser.
   * @returns An (ESTree-compatible)[https://github.com/estree/estree] AST object.
   */
  public async parse(code: string, options: ParseOptions = {}) {
    const cacheKey = murmurhash({
      code,
      options
    });

    let result!: ParseResult;
    if (!this.config.skipCache) {
      result = this.parserCache.get<ParseResult>(cacheKey);
      if (result) {
        return result;
      }
    }

    result = await parse(`source.${options.lang || "ts"}`, code, {
      ...options,
      sourceType: "module",
      showSemanticErrors: this.config.mode === "development"
    });

    if (!this.config.skipCache) {
      this.parserCache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * A helper function to resolve modules in the Virtual File System
   *
   * @remarks
   * This function can be used to resolve modules relative to the project root directory.
   *
   * @example
   * ```ts
   * const resolved = await context.resolve("some-module", "/path/to/importer");
   * ```
   *
   * @param id - The module to resolve.
   * @param importer - An optional path to the importer module.
   * @param options - Additional resolution options.
   * @returns A promise that resolves to the resolved module path.
   */
  public async resolve(
    id: string,
    importer?: string,
    options: ResolveOptions = {}
  ): Promise<ExternalIdResult | undefined> {
    let moduleId = id;
    if (this.config.build.alias) {
      if (Array.isArray(this.config.build.alias)) {
        const alias = this.config.build.alias.find(a =>
          match(moduleId, [a.find])
        );
        if (alias) {
          moduleId = alias.replacement;
        }
      } else if (
        isSetObject(this.config.build.alias) &&
        this.config.build.alias[id]
      ) {
        moduleId = this.config.build.alias[id];
      }
    }

    if (this.fs.isVirtual(moduleId)) {
      const result = await this.fs.resolve(moduleId, importer, {
        conditions: this.config.build.conditions,
        extensions: this.config.build.extensions,
        ...options
      });
      if (!result) {
        return undefined;
      }

      return {
        id: `\0${result}`,
        external: this.config.projectType !== "application"
      };
    }

    if (this.config.build.skipNodeModulesBundle) {
      if (
        match(moduleId, this.resolvePatterns) ||
        match(moduleId, this.config.build.noExternal)
      ) {
        return undefined;
      }

      if (
        match(moduleId, this.config.build.external) ||
        moduleId.startsWith("node:")
      ) {
        return { id: moduleId, external: true };
      }

      // Exclude any other import that looks like a Node module
      if (!/^[A-Z]:[/\\]|^\.{0,2}\/|^\.{1,2}$/.test(moduleId)) {
        return {
          id: moduleId,
          external: true
        };
      }
    } else {
      if (match(moduleId, this.config.build.noExternal)) {
        return undefined;
      }

      if (
        match(moduleId, this.config.build.external) ||
        moduleId.startsWith("node:")
      ) {
        return { id: moduleId, external: true };
      }
    }

    return undefined;
  }

  /**
   * A helper function to load modules from the Virtual File System
   *
   * @remarks
   * This function can be used to load modules relative to the project root directory.
   *
   * @example
   * ```ts
   * const module = await context.load("some-module", "/path/to/importer");
   * ```
   *
   * @param id - The module to load.
   * @returns A promise that resolves to the loaded module.
   */
  public async load(id: string): Promise<TransformResult | undefined> {
    const resolvedId = await this.fs.resolve(id);
    if (!resolvedId) {
      return undefined;
    }

    const code = await this.fs.read(resolvedId);
    if (!code) {
      return undefined;
    }

    return { code, map: null };
  }

  /**
   * Get the builtin virtual files that exist in the Powerlines virtual file system
   */
  public async getBuiltins() {
    return Promise.all(
      Object.entries(this.fs.metadata)
        .filter(([, meta]) => meta && meta.type === "builtin")
        .map(async ([path, meta]) => {
          const code = await this.fs.read(path);

          return { ...meta, path, code } as VirtualFile;
        })
    );
  }

  /**
   * Resolves a file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the file
   * @param path - The path to write the file to
   * @param options - Additional options for writing the file
   */
  public async emit(
    code: string,
    path: string,
    options: EmitOptions = {}
  ): Promise<void> {
    if (
      isFunction((this as unknown as UnpluginBuildContext).emitFile) &&
      options.emitWithBundler
    ) {
      return (this as unknown as UnpluginBuildContext).emitFile({
        needsCodeReference: options.needsCodeReference,
        originalFileName: options.originalFileName,
        fileName: path,
        source: code,
        type: "asset"
      });
    }

    return this.fs.write(path, code, options);
  }

  /**
   * Synchronously resolves a file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the file
   * @param path - The path to write the file to
   * @param options - Additional options for writing the file
   */
  public emitSync(code: string, path: string, options: EmitOptions = {}) {
    if (
      isFunction((this as unknown as UnpluginBuildContext).emitFile) &&
      options.emitWithBundler
    ) {
      return (this as unknown as UnpluginBuildContext).emitFile({
        needsCodeReference: options.needsCodeReference,
        originalFileName: options.originalFileName,
        fileName: path,
        source: code,
        type: "asset"
      });
    }

    return this.fs.writeSync(path, code, options);
  }

  /**
   * Resolves a entry virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the entry file
   * @param path - A path to write the entry file to
   * @param options - Optional write file options
   */
  public async emitEntry(
    code: string,
    path: string,
    options: EmitEntryOptions = {}
  ): Promise<void> {
    const entryPath = isAbsolute(path)
      ? path
      : appendPath(path, this.entryPath);

    this.entry ??= [];
    this.entry.push({
      name: options.name,
      file: entryPath,
      input: options.input,
      output: options.output
    });

    return this.emit(
      code,
      entryPath,
      defu(omit(options, ["name"]), {
        meta: {
          type: "entry",
          properties: {
            name: options.name,
            output: options.output,
            "input.file": options.input?.file,
            "input.name": options.input?.name
          }
        }
      })
    );
  }

  /**
   * Synchronously resolves a entry virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the entry file
   * @param path - A path to write the entry file to
   * @param options - Optional write file options
   */
  public emitEntrySync(
    code: string,
    path: string,
    options: EmitEntryOptions = {}
  ): void {
    const entryPath = isAbsolute(path)
      ? path
      : appendPath(path, this.entryPath);

    this.entry ??= [];
    this.entry.push({
      name: options?.name,
      file: entryPath,
      input: options?.input,
      output: options?.output
    });

    return this.emitSync(
      code,
      entryPath,
      defu(omit(options, ["name"]), {
        meta: {
          type: "entry",
          properties: {
            name: options?.name,
            output: options?.output,
            "input.file": options?.input?.file,
            "input.name": options?.input?.name
          }
        }
      })
    );
  }

  /**
   * Resolves a builtin virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the builtin file
   * @param id - The unique identifier of the builtin file
   * @param path - An optional path to write the builtin file to
   * @param options - Optional write file options
   */
  public async emitBuiltin(
    code: string,
    id: string,
    path?: string,
    options: EmitOptions = {}
  ): Promise<void> {
    return this.emit(
      code,
      path
        ? isAbsolute(path)
          ? path
          : joinPaths(this.builtinsPath, path)
        : appendPath(id, this.builtinsPath),

      defu(options, { meta: { type: "builtin" } })
    );
  }

  /**
   * Synchronously resolves a builtin virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the builtin file
   * @param id - The unique identifier of the builtin file
   * @param path - An optional path to write the builtin file to
   * @param options - Optional write file options
   */
  public emitBuiltinSync(
    code: string,
    id: string,
    path?: string,
    options: EmitOptions = {}
  ) {
    return this.emitSync(
      code,
      path
        ? isAbsolute(path)
          ? path
          : joinPaths(this.builtinsPath, path)
        : appendPath(id, this.builtinsPath),
      defu(options, { meta: { type: "builtin" } })
    );
  }

  /**
   * Update the context using a new user configuration options
   *
   * @param userConfig - The new user configuration options.
   */
  public async withUserConfig(
    userConfig: InitialUserConfig<TResolvedConfig["userConfig"]>,
    options: InitContextOptions = {
      isHighPriority: true
    }
  ) {
    this.mergeUserConfig(userConfig as Partial<TResolvedConfig["userConfig"]>);

    await this.init(this.config.userConfig, options);
  }

  /**
   * Update the context using a new inline configuration options
   *
   * @param inlineConfig - The new inline configuration options.
   */
  public async withInlineConfig(
    inlineConfig: TResolvedConfig["inlineConfig"],
    options: InitContextOptions = {
      isHighPriority: true
    }
  ) {
    this.config.inlineConfig = inlineConfig;

    if (inlineConfig.command === "new") {
      const workspacePackageJsonPath = joinPaths(
        this.workspaceConfig.workspaceRoot,
        "package.json"
      );
      if (!existsSync(workspacePackageJsonPath)) {
        throw new Error(
          `The workspace package.json file could not be found at ${workspacePackageJsonPath}`
        );
      }

      this.packageJson = await readJsonFile<PackageJson>(
        workspacePackageJsonPath
      );

      this.workspaceConfig.repository ??= isSetString(
        this.packageJson?.repository
      )
        ? this.packageJson.repository
        : this.packageJson?.repository?.url;
    }

    await this.init(this.config.inlineConfig, options);
  }

  /**
   * A logging function for fatal messages
   *
   * @param message - The message to log.
   */
  public fatal(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.FATAL,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for error messages
   *
   * @param message - The message to log.
   */
  public error(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.ERROR,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for warning messages
   *
   * @param message - The message to log.
   */
  public warn(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.WARN,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for informational messages
   *
   * @param message - The message to log.
   */
  public info(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.INFO,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for debug messages
   *
   * @param message - The message to log.
   */
  public debug(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.DEBUG,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for trace messages
   *
   * @param message - The message to log.
   */
  public trace(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.TRACE,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * Create a new logger instance
   *
   * @param name - The name to use for the logger instance
   * @returns A logger function
   */
  public createLog(name: string | null = null): LogFn {
    return createLog(name, {
      ...this.config,
      logLevel: isNull(this.config.logLevel) ? "silent" : this.config.logLevel
    });
  }

  /**
   * Extend the current logger instance with a new name
   *
   * @param name - The name to use for the extended logger instance
   * @returns A logger function
   */
  public extendLog(name: string): LogFn {
    return extendLog(this.log, name);
  }

  /**
   * Generates a checksum representing the current context state
   *
   * @param root - The root directory of the project to generate the checksum for
   * @returns A promise that resolves to a string representing the checksum
   */
  public async generateChecksum(
    root = this.config.projectRoot
  ): Promise<string> {
    this.#checksum = await hashDirectory(root, {
      ignore: ["node_modules", ".git", ".nx", ".cache", ".storm", "tmp", "dist"]
    });

    return this.#checksum;
  }

  /**
   * Creates a new StormContext instance.
   *
   * @param workspaceConfig - The workspace configuration.
   */
  protected constructor(workspaceConfig: WorkspaceConfig) {
    this.#workspaceConfig = workspaceConfig;

    envPathCache.set(
      {
        workspaceRoot: workspaceConfig.workspaceRoot,
        framework: "powerlines"
      },
      getEnvPaths({
        orgId:
          (isSetObject(workspaceConfig.organization)
            ? workspaceConfig.organization.name
            : workspaceConfig.organization) || "storm-software",
        appId: "powerlines",
        workspaceRoot: workspaceConfig.workspaceRoot
      })
    );
  }

  /**
   * The resolved configuration for this context
   */
  protected resolvedConfig: TResolvedConfig = {} as TResolvedConfig;

  /**
   * A logger function specific to this context
   */
  protected logFn!: LogFn;

  /**
   * Initialize the context with the provided configuration options
   *
   * @param config - The partial user configuration to use for initialization.
   */
  protected async init(
    config: Partial<TResolvedConfig["userConfig"]> = {},
    options: InitContextOptions = {
      isHighPriority: true
    }
  ) {
    const cacheKey: ConfigCacheKey = {
      projectRoot:
        config.root ??
        this.config.projectRoot ??
        this.config.userConfig?.root ??
        this.config.inlineConfig?.root,
      mode: (config.mode ?? this.config.mode) || this.workspaceConfig.mode,
      skipCache: config.skipCache ?? this.config.skipCache ?? false,
      configFile: config.configFile ?? this.config.configFile,
      framework: config.framework ?? this.config.framework ?? "powerlines",
      command: this.config.inlineConfig?.command
    };

    if (configCache.has(cacheKey)) {
      const result = configCache.get(cacheKey)!;

      this.projectJson = result.projectJson;
      this.packageJson = result.packageJson;
      this.#checksum = result.checksum;
      this.resolver = result.resolver;

      this.mergeUserConfig(result.userConfig.config, this.config.userConfig);
    } else {
      const projectJsonPath = joinPaths(cacheKey.projectRoot, "project.json");
      if (existsSync(projectJsonPath)) {
        this.projectJson = await readJsonFile(projectJsonPath);
      }

      const packageJsonPath = joinPaths(cacheKey.projectRoot, "package.json");
      if (existsSync(packageJsonPath)) {
        this.packageJson = await readJsonFile<PackageJson>(packageJsonPath);
      }

      this.#checksum = await this.generateChecksum(cacheKey.projectRoot);
      this.resolver = createResolver({
        workspaceRoot: this.workspaceConfig.workspaceRoot,
        projectRoot: cacheKey.projectRoot,
        cacheDir: this.cachePath,
        mode: cacheKey.mode,
        logLevel: (config.logLevel ||
          this.config?.logLevel ||
          this.workspaceConfig.logLevel ||
          "info") as CreateResolverOptions["logLevel"],
        skipCache: cacheKey.skipCache
      });

      const userConfig = await loadUserConfigFile(
        cacheKey.projectRoot,
        this.workspaceConfig.workspaceRoot,
        this.resolver,
        cacheKey.command as PowerlinesCommand | undefined,
        cacheKey.mode,
        cacheKey.configFile,
        cacheKey.framework
      );
      this.mergeUserConfig(userConfig.config);

      configCache.set(cacheKey, {
        projectJson: this.projectJson,
        packageJson: this.packageJson,
        checksum: this.#checksum,
        resolver: this.resolver,
        userConfig
      });
    }

    config.tsconfig ??= getTsconfigFilePath(
      this.workspaceConfig.workspaceRoot,
      cacheKey.projectRoot,
      config.tsconfig
    );

    if (isSetObject(config)) {
      this.resolvedConfig = defu(
        {
          inlineConfig: this.config.inlineConfig,
          userConfig: this.config.userConfig
        },
        options.isHighPriority ? this.#getConfigProps(config) : {},
        {
          command: this.config.inlineConfig?.command,
          ...this.#getConfigProps(this.config.inlineConfig)
        },
        this.#getConfigProps(this.config.userConfig),
        {
          mode: this.workspaceConfig?.mode,
          logLevel: this.workspaceConfig?.logLevel,
          skipCache: this.workspaceConfig?.skipCache
        },
        {
          name: this.projectJson?.name || this.packageJson?.name,
          version: this.packageJson?.version,
          description: this.packageJson?.description,
          sourceRoot:
            this.projectJson?.sourceRoot ||
            appendPath("src", cacheKey.projectRoot),
          output: defu(config.output ?? {}, {
            outputPath: cacheKey.projectRoot
              ? joinPaths(
                  this.workspaceConfig?.directories?.build || "dist",
                  cacheKey.projectRoot
                )
              : this.workspaceConfig?.directories?.build || "dist",
            artifactsPath: joinPaths(
              cacheKey.projectRoot,
              `.${config.framework ?? "powerlines"}`
            ),
            dts: joinPaths(
              cacheKey.projectRoot,
              `${config.framework ?? "powerlines"}.d.ts`
            ),
            builtinPrefix: config.framework ?? "powerlines",
            assets: [
              {
                glob: "LICENSE"
              },
              {
                input: cacheKey.projectRoot,
                glob: "*.md"
              },
              {
                input: cacheKey.projectRoot,
                glob: "package.json"
              }
            ]
          })
        },
        options.isHighPriority ? {} : this.#getConfigProps(config),
        {
          inlineConfig: {},
          userConfig: {},
          framework: "powerlines",
          platform: "neutral",
          mode: "production",
          projectType: "application",
          logLevel: "info",
          preview: false,
          environments: {},
          transform: {
            babel: {
              plugins: [],
              presets: []
            }
          },
          lint: {
            eslint: {}
          },
          build: {
            target: "esnext",
            override: {}
          }
        }
      ) as any;
    }

    this.config.entry = getUniqueEntries(this.config.entry);

    if (
      this.config.name?.startsWith("@") &&
      this.config.name.split("/").filter(Boolean).length > 1
    ) {
      this.config.name = this.config.name.split("/").filter(Boolean)[1]!;
    }

    this.config.title ??= titleCase(this.config.name);

    this.config.organization ??=
      (isSetObject(this.workspaceConfig.organization)
        ? this.workspaceConfig.organization.name
        : this.workspaceConfig.organization) ||
      (isSetObject(this.packageJson?.author)
        ? this.packageJson?.author?.name
        : this.packageJson?.author) ||
      this.config.name;

    if (this.config.userConfig.build?.external) {
      this.config.userConfig.build.external = getUnique(
        this.config.userConfig.build.external
      );
    }
    if (this.config.userConfig.build?.noExternal) {
      this.config.userConfig.build.noExternal = getUnique(
        this.config.userConfig.build.noExternal
      );
    }

    if (this.config.build.external) {
      this.config.build.external = getUnique(this.config.build.external);
    }
    if (this.config.build.noExternal) {
      this.config.build.noExternal = getUnique(this.config.build.noExternal);
    }

    this.config.output.format = getUnique(
      toArray(
        this.config.output?.format ??
          (this.config.projectType === "library" ? ["cjs", "esm"] : ["esm"])
      )
    );

    if (
      this.config.projectRoot &&
      this.config.projectRoot !== "." &&
      this.config.projectRoot !== "./" &&
      this.config.projectRoot !== this.workspaceConfig.workspaceRoot
    ) {
      this.config.output.outputPath ??= joinPaths(
        "dist",
        this.config.projectRoot
      );
      this.config.output.buildPath ??= joinPaths(
        this.config.projectRoot,
        "dist"
      );
    } else {
      this.config.output.outputPath ??= "dist";
      this.config.output.buildPath ??= "dist";
    }

    this.config.output.assets = getUniqueBy(
      this.config.output.assets.map(asset => {
        return {
          glob: isSetObject(asset) ? asset.glob : asset,
          input:
            isString(asset) ||
            !asset.input ||
            asset.input === "." ||
            asset.input === "/" ||
            asset.input === "./"
              ? this.workspaceConfig.workspaceRoot
              : isParentPath(asset.input, this.workspaceConfig.workspaceRoot) ||
                  asset.input === this.workspaceConfig.workspaceRoot
                ? asset.input
                : appendPath(asset.input, this.workspaceConfig.workspaceRoot),
          output:
            isSetObject(asset) && asset.output
              ? isParentPath(asset.output, this.workspaceConfig.workspaceRoot)
                ? asset.output
                : appendPath(
                    joinPaths(
                      this.config.output.outputPath,
                      replacePath(
                        replacePath(
                          asset.output,
                          replacePath(
                            this.config.output.outputPath,
                            this.workspaceConfig.workspaceRoot
                          )
                        ),
                        this.config.output.outputPath
                      )
                    ),
                    this.workspaceConfig.workspaceRoot
                  )
              : appendPath(
                  this.config.output.outputPath,
                  this.workspaceConfig.workspaceRoot
                ),
          ignore:
            isSetObject(asset) && asset.ignore
              ? toArray(asset.ignore)
              : undefined
        };
      }),
      (a: ResolvedAssetGlob) => `${a.input}-${a.glob}-${a.output}`
    );

    this.config.plugins = (this.config.plugins ?? [])
      .filter(Boolean)
      .reduce((ret, plugin) => {
        if (
          isPlugin(plugin) &&
          checkDedupe(
            plugin,
            ret.filter(p => isPlugin(p))
          )
        ) {
          return ret;
        }

        ret.push(plugin);

        return ret;
      }, [] as PluginConfig[]);

    // Apply path token replacements

    if (this.config.tsconfig) {
      this.config.tsconfig = replacePathTokens(this, this.config.tsconfig);
    }

    if (this.config.output.dts) {
      this.config.output.dts = replacePathTokens(this, this.config.output.dts);
    }

    if (this.config.build.polyfill) {
      this.config.build.polyfill = this.config.build.polyfill.map(polyfill =>
        replacePathTokens(this, polyfill)
      );
    }

    if (this.config.output.assets) {
      this.config.output.assets = this.config.output.assets.map(asset => ({
        ...asset,
        glob: replacePathTokens(this, asset.glob),
        ignore: asset.ignore
          ? asset.ignore.map(ignore => replacePathTokens(this, ignore))
          : undefined,
        input: replacePathTokens(this, asset.input),
        output: replacePathTokens(this, asset.output)
      }));
    }

    this.#fs ??= await VirtualFileSystem.create(this);
  }

  protected mergeUserConfig(
    from: Partial<TResolvedConfig["userConfig"]> = {},
    into: Partial<TResolvedConfig["userConfig"]> = this.config.userConfig ?? {}
  ) {
    this.config.userConfig = defu(
      {
        entry:
          Array.isArray(from.entry) && from.entry.length > 0
            ? from.entry
            : Array.isArray(into?.entry) && into.entry.length > 0
              ? into.entry
              : []
      },
      omit(from ?? {}, ["entry"]),
      omit(into ?? {}, ["entry"])
    ) as TResolvedConfig["userConfig"];

    if (this.config.userConfig.output?.format) {
      this.config.userConfig.output.format = getUnique(
        toArray(this.config.userConfig.output?.format)
      );
    }

    this.config.userConfig.plugins = (this.config.userConfig.plugins ?? [])
      .filter(Boolean)
      .reduce((ret, plugin) => {
        if (
          isPlugin(plugin) &&
          checkDedupe(
            plugin,
            ret.filter(p => isPlugin(p))
          )
        ) {
          return ret;
        }

        ret.push(plugin);

        return ret;
      }, [] as PluginConfig[]);
  }
}
