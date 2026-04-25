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

import type {
  Context,
  CopyConfig,
  CopyResolvedConfig,
  EmitEntryOptions,
  EmitOptions,
  ExecutionOptions,
  FetchOptions,
  LogFn,
  MetaInfo,
  OutputResolvedConfig,
  ParsedTypeScriptConfig,
  ParseOptions,
  PluginConfig,
  ResolvedAssetGlob,
  ResolvedConfig,
  ResolvedEntryTypeDefinition,
  ResolvedExecutionOptions,
  ResolveOptions,
  ResolveResult,
  TransformResult,
  VirtualFile,
  VirtualFileSystemInterface
} from "@powerlines/core";
import {
  CACHE_HASH_LENGTH,
  ROOT_HASH_LENGTH
} from "@powerlines/core/constants";
import {
  getUniqueInputs,
  isTypeDefinition,
  resolveInputsSync
} from "@powerlines/core/lib/entry";
import { createLog } from "@powerlines/core/lib/logger";
import {
  isDuplicate,
  isPlugin,
  mergeConfig,
  replacePathTokens
} from "@powerlines/core/plugin-utils";
import { Unstable_ContextInternal } from "@powerlines/core/types/_internal";
import { toArray } from "@stryke/convert/to-array";
import { existsSync } from "@stryke/fs/exists";
import { relativeToWorkspaceRoot } from "@stryke/fs/get-workspace-root";
import { readJsonFile } from "@stryke/fs/json";
import { resolvePackage } from "@stryke/fs/resolve";
import { murmurhash } from "@stryke/hash";
import { hashDirectory } from "@stryke/hash/node";
import { deepClone } from "@stryke/helpers/deep-clone";
import { getUnique, getUniqueBy } from "@stryke/helpers/get-unique";
import { omit } from "@stryke/helpers/omit";
import { fetchRequest } from "@stryke/http/fetch";
import { appendPath } from "@stryke/path/append";
import {
  findFileDotExtensionSafe,
  findFileExtensionSafe
} from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join";
import { replacePath } from "@stryke/path/replace";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isNull } from "@stryke/type-checks/is-null";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { TypeDefinition } from "@stryke/types/configuration";
import { PackageJson } from "@stryke/types/package-json";
import { uuid } from "@stryke/unique-id/uuid";
import { match, tsconfigPathsToRegExp } from "bundle-require";
import { resolveCompatibilityDates } from "compatx";
import defu from "defu";
import { create, FlatCache } from "flat-cache";
import { parse, ParseResult } from "oxc-parser";
import { Range } from "semver";
import {
  Agent,
  BodyInit,
  interceptors,
  RequestInfo,
  Response,
  setGlobalDispatcher
} from "undici";
import { UnpluginBuildContext } from "unplugin";
import { getConfigProps } from "../_internal/helpers/context";
import { getPrefixedRootHash } from "../_internal/helpers/meta";
import { VirtualFileSystem } from "../_internal/vfs";
import { getTsconfigFilePath } from "../typescript/tsconfig";
import { PowerlinesBaseContext } from "./base-context";

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
>
  extends PowerlinesBaseContext
  implements Context<TResolvedConfig>
{
  /**
   * Internal references storage
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  #internal = {} as Unstable_ContextInternal<TResolvedConfig>;

  #checksum: string | null = null;

  #buildId: string = uuid();

  #releaseId: string = uuid();

  #fs!: VirtualFileSystemInterface;

  #tsconfig!: ParsedTypeScriptConfig;

  #parserCache!: FlatCache;

  #requestCache!: FlatCache;

  /**
   * Create a new Storm context from the workspace root and user config.
   *
   * @param options - The options for resolving the context.
   * @returns A promise that resolves to the new context.
   */
  public static async fromOptions<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(options: ResolvedExecutionOptions): Promise<Context<TResolvedConfig>> {
    const context = new PowerlinesContext<TResolvedConfig>(options);
    await context.init(options);

    const powerlinesPath = await resolvePackage("powerlines");
    if (!powerlinesPath) {
      throw new Error("Could not resolve `powerlines` package location.");
    }
    context.powerlinesPath = powerlinesPath;

    return context;
  }

  /**
   * The options provided to the Powerlines process
   */
  public override options: ResolvedExecutionOptions;

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
   * The parsed `package.json` file for the project
   */
  public packageJson!: PackageJson;

  /**
   * The parsed `project.json` file for the project
   */
  public projectJson: Record<string, any> | undefined = undefined;

  /**
   * The resolved tsconfig file paths for the project
   */
  public resolvePatterns: RegExp[] = [];

  /**
   * Internal context fields and methods
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  public get $$internal(): Unstable_ContextInternal<TResolvedConfig> {
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
  public set $$internal(value: Unstable_ContextInternal<TResolvedConfig>) {
    this.#internal = value;
  }

  /**
   * The resolved entry type definitions for the project
   */
  public get entry(): ResolvedEntryTypeDefinition[] {
    const entry = this.resolvedEntry;

    return resolveInputsSync(
      this,
      entry && entry.length > 0
        ? entry
        : Array.isArray(this.config.input) ||
            (isSetObject(this.config.input) &&
              !isTypeDefinition(this.config.input))
          ? this.config.input
          : toArray(this.config.input).flat()
    );
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
      timestamp: this.timestamp.getTime(),
      rootHash: murmurhash(
        {
          workspaceRoot: this.options?.cwd,
          root: this.config?.root
        },
        {
          maxLength: ROOT_HASH_LENGTH
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
    return this.resolvedConfig;
  }

  /**
   * Get the path to the artifacts directory for the project
   */
  public get artifactsPath(): string {
    return joinPaths(
      this.config.cwd,
      this.config.root,
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
   * Get the path to the infrastructure modules used by the project
   */
  public get infrastructurePath(): string {
    return joinPaths(this.artifactsPath, "infrastructure");
  }

  /**
   * Get the path to the data directory for the project
   */
  public get dataPath(): string {
    return joinPaths(
      this.envPaths.data,
      "projects",
      getPrefixedRootHash(this.config.name, this.meta.rootHash)
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
  public get typesPath(): string {
    return this.config.output.types
      ? appendPath(this.config.output.types, this.config.cwd)
      : joinPaths(this.config.cwd, this.config.root, "powerlines.d.ts");
  }

  /**
   * Get the project root relative to the workspace root
   */
  public get relativeToWorkspaceRoot() {
    return relativeToWorkspaceRoot(this.config.root);
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
   * The alias mappings for the project used during module resolution
   *
   * @remarks
   * This includes both the built-in module aliases as well as any custom aliases defined in the build configuration.
   */
  public get alias(): Record<string, string> {
    return this.builtins.reduce(
      (ret, id) => {
        const moduleId = `${
          this.config?.framework || "powerlines"
        }:${id.replace(/^.*:/, "")}`;
        if (!ret[moduleId]) {
          const path = this.fs.paths[id];
          if (path) {
            ret[moduleId] = path;
          }
        }

        return ret;
      },
      this.config.resolve.alias
        ? Array.isArray(this.config.resolve.alias)
          ? this.config.resolve.alias.reduce(
              (ret, alias) => {
                if (!ret[alias.find.toString()]) {
                  ret[alias.find.toString()] = alias.replacement;
                }

                return ret;
              },
              {} as Record<string, string>
            )
          : this.config.resolve.alias
        : {}
    );
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
   * The entry points that exist in the Powerlines virtual file system
   */
  protected get resolvedEntry(): ResolvedEntryTypeDefinition[] {
    return Object.entries(this.fs.metadata)
      .filter(([, meta]) => meta && meta.type === "entry")
      .map(([path, meta]) => {
        const typeDefinition = {
          file: path
        } as ResolvedEntryTypeDefinition;

        if (meta.properties) {
          if (isSetString(meta.properties.file)) {
            typeDefinition.file = meta.properties.file;
          }
          if (isSetString(meta.properties.name)) {
            typeDefinition.name = meta.properties.name;
          }
          if (
            isSetString(meta.properties["input.file"]) ||
            isSetString(meta.properties["input.name"])
          ) {
            typeDefinition.input ??= {} as TypeDefinition;
            if (isSetString(meta.properties["input.file"])) {
              typeDefinition.input.file = meta.properties["input.file"];
            }
            if (isSetString(meta.properties["input.name"])) {
              typeDefinition.input.name = meta.properties["input.name"];
            }
          }
          if (isSetString(meta.properties.output)) {
            typeDefinition.output = meta.properties.output;
          }
        }

        return typeDefinition;
      })
      .filter(Boolean);
  }

  /**
   * Creates a new StormContext instance.
   *
   * @param options - The options to use for creating the context, including the resolved configuration and workspace settings.
   */
  protected constructor(options: ResolvedExecutionOptions) {
    super();
    this.options = options;
  }

  /**
   * Creates a clone of the current context with the same configuration and workspace settings. This can be useful for running multiple builds in parallel or for creating isolated contexts for different parts of the build process.
   *
   * @remarks
   * The cloned context will have the same configuration and workspace settings as the original context, but will have a different build ID, release ID, and timestamp. The virtual file system and caches will also be separate between the original and cloned contexts.
   *
   * @returns A promise that resolves to the cloned context.
   */
  public override async clone(): Promise<Context<TResolvedConfig>> {
    const clone = await PowerlinesContext.fromOptions<TResolvedConfig>(
      this.config
    );

    return this.copyTo(clone);
  }

  /**
   * Create a new logger instance
   *
   * @param name - The name to use for the logger instance
   * @returns A logger function
   */
  public override createLog(name: string | null = null): LogFn {
    return createLog(name, {
      ...this.config,
      logLevel: isNull(this.logLevel) ? "silent" : this.logLevel
    });
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
      const cached = this.requestCache.get<
        {
          body: BodyInit;
        } & Pick<Response, "status" | "statusText" | "headers">
      >(cacheKey);
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
  ): Promise<ResolveResult | undefined> {
    let moduleId = id;
    if (this.config.resolve.alias) {
      if (Array.isArray(this.config.resolve.alias)) {
        const alias = this.config.resolve.alias.find(a =>
          match(moduleId, [a.find])
        );
        if (alias) {
          moduleId = alias.replacement;
        }
      } else if (
        isSetObject(this.config.resolve.alias) &&
        this.config.resolve.alias[id]
      ) {
        moduleId = this.config.resolve.alias[id];
      }
    }

    if (
      this.fs.isResolvableId(moduleId) ||
      (importer && this.fs.isResolvableId(importer))
    ) {
      let resolvedImporter = importer;
      if (importer && this.fs.isResolvableId(importer)) {
        resolvedImporter = await this.fs.resolve(
          importer,
          undefined,
          defu(
            {
              conditions: this.config.resolve.conditions,
              extensions: this.config.resolve.extensions
            },
            options
          )
        );
      }

      const result = await this.fs.resolve(
        moduleId,
        resolvedImporter,
        defu(
          {
            conditions: this.config.resolve.conditions,
            extensions: this.config.resolve.extensions
          },
          options
        )
      );
      if (!result) {
        return undefined;
      }

      const external = Boolean(
        !match(moduleId, this.config.resolve.noExternal) &&
        (match(moduleId, this.config.resolve.external) ||
          moduleId.startsWith("node:") ||
          ((!this.fs.isVirtual(moduleId, importer, options) ||
            (this.fs.isVirtual(moduleId, importer, options) &&
              this.config.projectType !== "application")) &&
            this.config.resolve.skipNodeModulesBundle &&
            !/^[A-Z]:[/\\]|^\.{0,2}\/|^\.{1,2}$/.test(moduleId)))
      );

      return {
        id: result,
        external,
        virtual: !external
      };
    }

    if (this.config.resolve.skipNodeModulesBundle) {
      if (
        match(moduleId, this.resolvePatterns) ||
        match(moduleId, this.config.resolve.noExternal)
      ) {
        return undefined;
      }

      if (
        match(moduleId, this.config.resolve.external) ||
        moduleId.startsWith("node:")
      ) {
        return { id: moduleId, external: true, virtual: false };
      }

      // Exclude any other import that looks like a Node module
      if (!/^[A-Z]:[/\\]|^\.{0,2}\/|^\.{1,2}$/.test(moduleId)) {
        return {
          id: moduleId,
          external: true,
          virtual: false
        };
      }
    } else {
      if (match(moduleId, this.config.resolve.noExternal)) {
        return undefined;
      }

      if (
        match(moduleId, this.config.resolve.external) ||
        moduleId.startsWith("node:")
      ) {
        return { id: moduleId, external: true, virtual: false };
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
        .map(async ([id, meta]) => {
          const code = await this.fs.read(id);
          const path = this.fs.paths[id];

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
    const filePath = options.extension
      ? findFileExtensionSafe(path)
        ? options.extension.startsWith(".")
          ? path.replace(findFileDotExtensionSafe(path), options.extension)
          : path.replace(findFileExtensionSafe(path), options.extension)
        : options.extension.startsWith(".")
          ? `${path}${options.extension}`
          : `${path}.${options.extension}`
      : findFileExtensionSafe(path)
        ? path
        : `${path}.ts`;

    if (
      isFunction((this as unknown as UnpluginBuildContext).emitFile) &&
      options.emitWithBundler
    ) {
      return (this as unknown as UnpluginBuildContext).emitFile({
        needsCodeReference: options.needsCodeReference,
        originalFileName: options.originalFileName,
        fileName: filePath,
        source: code,
        type: "asset"
      });
    }

    return this.fs.write(filePath, code, options);
  }

  /**
   * Synchronously resolves a file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the file
   * @param path - The path to write the file to
   * @param options - Additional options for writing the file
   */
  public emitSync(code: string, path: string, options: EmitOptions = {}) {
    const filePath = options.extension
      ? findFileExtensionSafe(path)
        ? options.extension.startsWith(".")
          ? path.replace(findFileDotExtensionSafe(path), options.extension)
          : path.replace(findFileExtensionSafe(path), options.extension)
        : options.extension.startsWith(".")
          ? `${path}${options.extension}`
          : `${path}.${options.extension}`
      : findFileExtensionSafe(path)
        ? path
        : `${path}.ts`;

    if (
      isFunction((this as unknown as UnpluginBuildContext).emitFile) &&
      options.emitWithBundler
    ) {
      return (this as unknown as UnpluginBuildContext).emitFile({
        needsCodeReference: options.needsCodeReference,
        originalFileName: options.originalFileName,
        fileName: filePath,
        source: code,
        type: "asset"
      });
    }

    return this.fs.writeSync(filePath, code, options);
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
    return this.emit(
      code,
      appendPath(path, this.entryPath),
      defu(
        {
          meta: {
            type: "entry",
            properties: {
              file: appendPath(path, this.entryPath),
              name: options?.name,
              output: options?.output,
              "input.file": options?.input?.file,
              "input.name": options?.input?.name
            }
          }
        },
        omit(options, ["name"])
      )
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
    return this.emitSync(
      code,
      appendPath(path, this.entryPath),
      defu(
        {
          meta: {
            type: "entry",
            properties: {
              file: appendPath(path, this.entryPath),
              name: options?.name,
              output: options?.output,
              "input.file": options?.input?.file,
              "input.name": options?.input?.name
            }
          }
        },
        omit(options, ["name"])
      )
    );
  }

  /**
   * Resolves a builtin virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the builtin file
   * @param id - The unique identifier of the builtin file
   * @param options - Optional write file options
   */
  public async emitBuiltin(
    code: string,
    id: string,
    options: EmitOptions = {}
  ): Promise<void> {
    if (!this.builtinsPath) {
      throw new Error(
        `The builtins path is not set. Cannot emit builtin file with id "${id}".`
      );
    }

    if (!isSetString(id)) {
      throw new Error(
        `The builtin id must be a non-empty string. Received: ${String(id)}`
      );
    }

    return this.emit(
      code,
      appendPath(id, this.builtinsPath),
      defu(options, { meta: { type: "builtin", id } })
    );
  }

  /**
   * Synchronously resolves a builtin virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the builtin file
   * @param id - The unique identifier of the builtin file
   * @param options - Optional write file options
   */
  public emitBuiltinSync(code: string, id: string, options: EmitOptions = {}) {
    if (!this.builtinsPath) {
      throw new Error(
        `The builtins path is not set. Cannot emit builtin file with id "${id}".`
      );
    }

    if (!isSetString(id)) {
      throw new Error(
        `The builtin id must be a non-empty string. Received: ${String(id)}`
      );
    }

    return this.emitSync(
      code,
      appendPath(id, this.builtinsPath),
      defu(options, { meta: { type: "builtin", id } })
    );
  }

  /**
   * Resolves a builtin virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the builtin file
   * @param id - The unique identifier of the builtin file
   * @param options - Optional write file options
   */
  public async emitInfrastructure(
    code: string,
    id: string,
    options: EmitOptions = {}
  ): Promise<void> {
    if (!this.infrastructurePath) {
      throw new Error(
        `The infrastructure path is not set. Cannot emit infrastructure file with id "${id}".`
      );
    }

    if (!isSetString(id)) {
      throw new Error(
        `The infrastructure id must be a non-empty string. Received: ${String(id)}`
      );
    }

    return this.emit(
      code,
      appendPath(id, this.infrastructurePath),
      defu(options, { meta: { type: "infrastructure", id } })
    );
  }

  /**
   * Synchronously resolves an infrastructure virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the infrastructure file
   * @param id - The unique identifier of the infrastructure file
   * @param options - Optional write file options
   */
  public emitInfrastructureSync(
    code: string,
    id: string,
    options: EmitOptions = {}
  ) {
    if (!this.infrastructurePath) {
      throw new Error(
        `The infrastructure path is not set. Cannot emit infrastructure file with id "${id}".`
      );
    }

    if (!isSetString(id)) {
      throw new Error(
        `The infrastructure id must be a non-empty string. Received: ${String(id)}`
      );
    }

    return this.emitSync(
      code,
      appendPath(id, this.infrastructurePath),
      defu(options, { meta: { type: "infrastructure", id } })
    );
  }

  /**
   * Generates a checksum representing the current context state
   *
   * @param root - The root directory of the project to generate the checksum for
   * @returns A promise that resolves to a string representing the checksum
   */
  public async generateChecksum(root = this.config.root): Promise<string> {
    this.#checksum = await hashDirectory(root, {
      ignore: ["node_modules", ".git", ".nx", ".cache", "tmp", "dist"]
    });

    return this.#checksum;
  }

  /**
   * Initialize the context with the provided configuration options
   */
  public async setup(): Promise<void> {
    this.resolvedConfig = mergeConfig(
      {
        inlineConfig: this.config.inlineConfig ?? {},
        userConfig: this.config.userConfig ?? {},
        pluginConfig: this.config.pluginConfig ?? {}
      },
      this.options,
      this.config.inlineConfig
        ? getConfigProps(
            this.config.inlineConfig,
            this.options.root,
            this.options.cwd
          )
        : {},
      this.config.userConfig
        ? getConfigProps(
            this.config.userConfig,
            this.options.root,
            this.options.cwd
          )
        : {},
      this.config.pluginConfig
        ? getConfigProps(
            this.config.pluginConfig,
            this.options.root,
            this.options.cwd
          )
        : {},
      {
        name: this.projectJson?.name || this.packageJson?.name,
        version: this.packageJson?.version,
        description: this.packageJson?.description
      },
      {
        projectType: "application",
        platform: "neutral",
        logLevel: "info",
        preview: false,
        environments: {},
        resolve: {}
      }
    ) as TResolvedConfig;

    await this.innerSetup();
  }

  /**
   * The resolved configuration for this context
   */
  protected resolvedConfig: TResolvedConfig = {} as TResolvedConfig;

  /**
   * Creates a clone of the current context with the same configuration and workspace settings. This can be useful for running multiple builds in parallel or for creating isolated contexts for different parts of the build process.
   *
   * @remarks
   * The cloned context will have the same configuration and workspace settings as the original context, but will have a different build ID, release ID, and timestamp. The virtual file system and caches will also be separate between the original and cloned contexts.
   *
   * @returns The cloned context.
   */
  protected copyTo(
    context: Context<TResolvedConfig>
  ): Context<TResolvedConfig> {
    context.dependencies = deepClone<typeof this.dependencies>(
      this.dependencies
    );
    context.devDependencies = deepClone<typeof this.devDependencies>(
      this.devDependencies
    );
    context.persistedMeta = this.persistedMeta
      ? deepClone<typeof this.persistedMeta>(this.persistedMeta)
      : undefined;
    context.packageJson = deepClone<typeof this.packageJson>(this.packageJson);
    context.projectJson = this.projectJson
      ? deepClone<typeof this.projectJson>(this.projectJson)
      : undefined;
    context.tsconfig ??= deepClone<typeof this.tsconfig>(
      this.tsconfig
    ) as ParsedTypeScriptConfig;

    context.resolver ??= this.resolver;
    context.fs ??= this.#fs;

    (context as PowerlinesContext<TResolvedConfig>).$$internal =
      this.$$internal;

    return context;
  }

  /**
   * Initialize the context with the provided configuration options
   *
   *   @remarks
   * This method will set up the resolver and load the user configuration file based on the provided options. It is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup.
   *
   * @param options - The configuration options to initialize the context with
   */
  protected override async init(options: Partial<ExecutionOptions> = {}) {
    await super.init(options);

    this.options.configIndex =
      options.configIndex ?? this.options.configIndex ?? 0;

    const projectJsonPath = joinPaths(this.options.root, "project.json");
    if (existsSync(projectJsonPath)) {
      this.projectJson = await readJsonFile(projectJsonPath);
    }

    const packageJsonPath = joinPaths(this.options.root, "package.json");
    if (existsSync(packageJsonPath)) {
      this.packageJson = await readJsonFile<PackageJson>(packageJsonPath);
      this.options.organization ??= isSetObject(this.packageJson?.author)
        ? kebabCase(this.packageJson?.author?.name)
        : kebabCase(this.packageJson?.author);
    }

    this.#checksum = await this.generateChecksum(this.options.root);

    const userConfig = this.configFile.config
      ? Array.isArray(this.configFile.config) &&
        this.configFile.config.length > this.options.configIndex
        ? this.configFile.config[this.options.configIndex]!
        : this.configFile.config
      : {};

    this.resolvedConfig = {
      ...this.options,
      ...userConfig,
      userConfig
    } as TResolvedConfig;
  }

  /**
   * Initialize the context with the provided configuration options
   */
  protected async innerSetup(): Promise<void> {
    this.resolvedConfig.compatibilityDate = resolveCompatibilityDates(
      this.config.inlineConfig.compatibilityDate ??
        this.config.userConfig.compatibilityDate ??
        this.config.pluginConfig.compatibilityDate,
      "latest"
    );

    this.resolvedConfig.output = defu(this.resolvedConfig.output ?? {}, {
      path: this.config.root
        ? appendPath(joinPaths(this.config.root, "dist"), this.config.cwd)
        : undefined,
      copy: {
        assets: [
          {
            glob: "LICENSE"
          },
          {
            input: this.config.root,
            glob: "*.md"
          },
          {
            input: this.config.root,
            glob: "package.json"
          }
        ]
      },
      artifactsPath: `.${this.config.framework ?? "powerlines"}`,
      dts: true,
      types: joinPaths(
        this.config.root,
        `${this.config.framework ?? "powerlines"}.d.ts`
      )
    }) as OutputResolvedConfig;

    this.logger = {
      log: this.createLog(this.config.name),
      level: isNull(this.logLevel) ? "silent" : this.logLevel
    };

    if (this.config.output?.format) {
      this.config.output.format = getUnique(
        toArray(this.config.output?.format)
      );
    }

    this.config.plugins = (this.config.plugins ?? [])
      .filter(Boolean)
      .reduce((ret, plugin) => {
        if (
          isPlugin(plugin) &&
          isDuplicate(
            plugin,
            ret.filter(p => isPlugin(p))
          )
        ) {
          return ret;
        }

        ret.push(plugin);

        return ret;
      }, [] as PluginConfig[]);

    this.config.input = getUniqueInputs(this.config.input);

    if (
      this.config.name?.startsWith("@") &&
      this.config.name.split("/").filter(Boolean).length > 1
    ) {
      this.config.name = this.config.name.split("/").filter(Boolean)[1]!;
    }

    this.config.title ??= titleCase(this.config.name);

    if (this.config.userConfig.resolve?.external) {
      this.config.userConfig.resolve.external = getUnique(
        this.config.userConfig.resolve.external
      );
    }
    if (this.config.userConfig.resolve?.noExternal) {
      this.config.userConfig.resolve.noExternal = getUnique(
        this.config.userConfig.resolve.noExternal
      );
    }

    if (this.config.resolve.external) {
      this.config.resolve.external = getUnique(this.config.resolve.external);
    }
    if (this.config.resolve.noExternal) {
      this.config.resolve.noExternal = getUnique(
        this.config.resolve.noExternal
      );
    }

    this.config.output.format = getUnique(
      toArray(
        this.config.output?.format ??
          (this.config.projectType === "library" ? ["cjs", "esm"] : ["esm"])
      )
    );

    if (this.config.output.dts !== false && !this.config.output.types) {
      this.config.output.types = `${
        this.config.root ? `${this.config.root}/` : ""
      }${this.config.framework ?? "powerlines"}.d.ts`;
    }

    if (!this.config.output.path) {
      this.config.output.path ??= joinPaths(this.config.root, "dist");
    }

    if (this.config.root && this.config.output.copy !== false) {
      this.config.output.copy = {
        path: joinPaths(
          this.config.cwd,
          "dist",
          replacePath(this.config.root, this.config.cwd)
        ),
        ...((this.config.output.copy || {}) as Partial<CopyConfig>)
      } as CopyResolvedConfig;
    }

    if (
      this.config.output.copy &&
      this.config.output.copy.path &&
      this.config.output.copy.assets &&
      Array.isArray(this.config.output.copy.assets)
    ) {
      this.config.output.copy.assets = getUniqueBy(
        this.config.output.copy.assets.map(asset => {
          return {
            glob: isSetObject(asset) ? asset.glob : asset,
            input:
              isString(asset) ||
              !asset.input ||
              asset.input === "." ||
              asset.input === "/" ||
              asset.input === "./"
                ? this.options.cwd
                : isParentPath(asset.input, this.config.cwd) ||
                    asset.input === this.config.cwd
                  ? asset.input
                  : appendPath(asset.input, this.config.cwd),
            output:
              isSetObject(asset) && asset.output
                ? isParentPath(asset.output, this.config.cwd)
                  ? asset.output
                  : appendPath(
                      joinPaths(
                        (this.config.output.copy as CopyConfig).path,
                        replacePath(
                          replacePath(
                            asset.output,
                            replacePath(
                              (this.config.output.copy as CopyConfig).path,
                              this.config.cwd
                            )
                          ),
                          (this.config.output.copy as CopyConfig).path
                        )
                      ),
                      this.config.cwd
                    )
                : appendPath(
                    (this.config.output.copy as CopyConfig).path,
                    this.config.cwd
                  ),
            ignore:
              isSetObject(asset) && asset.ignore
                ? toArray(asset.ignore)
                : undefined
          };
        }),
        (a: ResolvedAssetGlob) => `${a.input}-${a.glob}-${a.output}`
      );
    }

    this.config.plugins = (this.config.plugins ?? [])
      .filter(Boolean)
      .reduce((ret, plugin) => {
        if (
          isPlugin(plugin) &&
          isDuplicate(
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

    if (this.config.output.types) {
      if (isSetString(this.config.output.types)) {
        this.config.output.types = replacePathTokens(
          this,
          this.config.output.types
        );
      } else {
        this.config.output.types = joinPaths(
          this.config.root,
          `${this.config.framework ?? "powerlines"}.d.ts`
        );
      }
    }

    if (
      !this.config.userConfig?.logLevel &&
      !this.config.inlineConfig?.logLevel
    ) {
      if (this.config.mode === "development") {
        this.config.logLevel = "debug";
      } else {
        this.config.logLevel = "info";
      }
    }

    if (
      !this.config.userConfig?.output?.sourceMap &&
      !this.config.inlineConfig?.output?.sourceMap
    ) {
      if (this.config.mode === "development") {
        this.config.output.sourceMap = true;
      } else {
        this.config.output.sourceMap = false;
      }
    }

    if (
      !this.config.userConfig?.output?.minify &&
      !this.config.inlineConfig?.output?.minify
    ) {
      if (this.config.mode === "production") {
        this.config.output.minify = true;
      } else {
        this.config.output.minify = false;
      }
    }

    if (
      !this.config.userConfig?.tsconfig &&
      !this.config.inlineConfig?.tsconfig
    ) {
      this.config.tsconfig = getTsconfigFilePath(
        this.options.cwd,
        this.options.root
      );
    } else if (this.config.tsconfig) {
      this.config.tsconfig = replacePath(
        replacePathTokens(this, this.config.tsconfig),
        this.config.cwd
      );
    }

    if (this.config.output.copy && this.config.output.copy.assets) {
      this.config.output.copy.assets = this.config.output.copy.assets.map(
        asset => ({
          ...asset,
          glob: replacePathTokens(this, asset.glob),
          ignore: asset.ignore
            ? asset.ignore.map(ignore => replacePathTokens(this, ignore))
            : undefined,
          input: replacePathTokens(this, asset.input),
          output: replacePathTokens(this, asset.output)
        })
      );
    }

    if (
      (isSetString(this.config.output?.storage) &&
        this.config.output.storage === "virtual") ||
      (isSetObject(this.config.output?.storage) &&
        Object.values(this.config.output.storage).every(
          adapter => adapter.preset === "virtual"
        ))
    ) {
      this.config.output.overwrite = true;
    }

    this.#fs ??= await VirtualFileSystem.create(this);
  }
}
