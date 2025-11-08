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
import { murmurhash } from "@stryke/hash/murmurhash";
import { getUnique } from "@stryke/helpers/get-unique";
import { omit } from "@stryke/helpers/omit";
import { StormJSON } from "@stryke/json/storm-json";
import { appendPath } from "@stryke/path/append";
import { hasFileExtension } from "@stryke/path/file-path-fns";
import { isAbsolute } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join";
import { replacePath } from "@stryke/path/replace";
import { titleCase } from "@stryke/string-format/title-case";
import { isNull } from "@stryke/type-checks/is-null";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { PackageJson } from "@stryke/types/package-json";
import { uuid } from "@stryke/unique-id/uuid";
import defu from "defu";
import { DirectoryJSON } from "memfs";
import { parseAsync, ParseResult, ParserOptions } from "oxc-parser";
import { Range } from "semver";
import { UnpluginMessage } from "unplugin";
import { loadUserConfigFile, loadWorkspaceConfig } from "../../lib/config-file";
import { getUniqueEntries, resolveEntriesSync } from "../../lib/entry";
import { createLog, extendLog } from "../../lib/logger";
import {
  CACHE_HASH_LENGTH,
  getChecksum,
  getPrefixedProjectRootHash,
  PROJECT_ROOT_HASH_LENGTH
} from "../../lib/utilities/meta";
import { checkDedupe, isPlugin } from "../../plugin-utils/helpers";
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
  InitContextOptions,
  MetaInfo,
  Resolver
} from "../../types/context";
import {
  ResolvedConfig,
  ResolvedEntryTypeDefinition
} from "../../types/resolved";
import { ParsedTypeScriptConfig } from "../../types/tsconfig";
import {
  OutputModeType,
  PowerlinesWriteFileOptions,
  VirtualFile,
  VirtualFileSystemInterface
} from "../../types/vfs";
import { createResolver } from "../helpers/resolver";
import { createVfs } from "../helpers/vfs";

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

interface ParseCacheKey {
  code: string;
  options: Partial<ParserOptions> | null;
}

const configCache = new WeakMap<ConfigCacheKey, ConfigCacheResult>();
const parseCache = new WeakMap<ParseCacheKey, ParseResult>();

export class PowerlinesContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> implements Context<TResolvedConfig>
{
  #workspaceConfig: WorkspaceConfig;

  #checksum: string | null = null;

  #buildId: string = uuid();

  #releaseId: string = uuid();

  #timestamp: number = Date.now();

  #envPaths: EnvPaths;

  #fs!: VirtualFileSystemInterface;

  #tsconfig!: ParsedTypeScriptConfig;

  #getConfigProps(config: Partial<TResolvedConfig["userConfig"]> = {}) {
    return {
      variant: config.build?.variant,
      projectType: config.type,
      projectRoot: config.root,
      name: config.name,
      title: config.title,
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
      override: config.override,
      framework: config.framework
    };
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

    context.powerlinesPath = await resolvePackage("powerlines");
    if (!context.powerlinesPath) {
      throw new Error("Could not resolve `powerlines` package location.");
    }

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
   * The resolved entry type definitions for the project
   */
  public get entry(): ResolvedEntryTypeDefinition[] {
    return resolveEntriesSync(this, toArray(this.config.entry));
  }

  /**
   * The TypeScript configuration parsed from the tsconfig file
   */
  public get tsconfig(): ParsedTypeScriptConfig {
    if (!this.#tsconfig) {
      this.#tsconfig = {
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
  }

  /**
   * The virtual file system interface for the project
   */
  public get fs(): VirtualFileSystemInterface {
    if (!this.#fs) {
      this.#fs = createVfs(this);
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
      }),
      builtinIdMap: {} as Record<string, string>,
      virtualFiles: {} as DirectoryJSON<string | null>
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
    if (!this.#envPaths) {
      this.#envPaths = getEnvPaths({
        orgId: "storm-software",
        appId: "powerlines",
        workspaceRoot: this.workspaceConfig.workspaceRoot
      });
    }

    return this.#envPaths;
  }

  /**
   * Get the path to the artifacts directory for the project
   */
  public get artifactsPath(): string {
    return joinPaths(
      this.workspaceConfig.workspaceRoot,
      this.config.projectRoot,
      this.config.output.artifactsFolder
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
          "storm.d.ts"
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
    return Object.values(this.fs.meta)
      .filter(meta => meta && meta.variant === "builtin")
      .map(meta => meta?.id)
      .filter(Boolean) as string[];
  }

  /**
   * Get the project root relative to the workspace root
   */
  public async getBuiltins() {
    return Promise.all(
      Object.entries(this.fs.meta)
        .filter(([, meta]) => meta && meta.variant === "builtin")
        .map(async ([path, meta]) => {
          const code = await this.fs.readFile(path);

          return { ...meta, path, code } as VirtualFile;
        })
    );
  }

  /**
   * Resolves a entry virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the entry file
   * @param path - A path to write the entry file to
   * @param options - Optional write file options
   */
  public async writeEntry(
    code: string,
    path: string,
    options: PowerlinesWriteFileOptions = {}
  ): Promise<void> {
    return this.fs.writeFile(
      isAbsolute(path) ? path : appendPath(path, this.entryPath),
      { code, variant: "entry" },
      defu(options, { mode: this.config.output.mode })
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
  public async writeBuiltin(
    code: string,
    id: string,
    path?: string,
    options: PowerlinesWriteFileOptions = {}
  ): Promise<void> {
    return this.fs.writeFile(
      path
        ? isAbsolute(path)
          ? path
          : joinPaths(this.builtinsPath, path)
        : appendPath(id, this.builtinsPath),
      { id, code, variant: "builtin" },
      defu(options, { mode: this.config.output.mode })
    );
  }

  /**
   * Parses the source code and returns a {@link ParseResult} object.
   *
   * @param code - The source code to parse.
   * @param id - The unique identifier for the source file.
   * @param options - Optional parser options.
   * @returns The parsed {@link ParseResult} object.
   */
  public async parse(
    code: string,
    id: string,
    options: ParserOptions | null = {}
  ): Promise<ParseResult> {
    if (parseCache.has({ code, options })) {
      return parseCache.get({ code, options })!;
    }

    const result = await parseAsync(
      id,
      code,
      defu(options ?? {}, {
        lang: hasFileExtension(id) ? undefined : "ts",
        astType: hasFileExtension(id) ? undefined : "ts",
        sourceType: "module",
        showSemanticErrors: false
      }) as ParserOptions
    );
    if (result.errors && result.errors.length > 0) {
      throw new Error(
        `Powerlines parsing errors in file: ${id}\n${result.errors
          .map(
            error =>
              `  [${error.severity}] ${error.message}${
                error.codeframe ? ` (${error.codeframe})` : ""
              }${error.helpMessage ? `\n    Help: ${error.helpMessage}` : ""}`
          )
          .join("\n")}`
      );
    }
    parseCache.set({ code, options }, result);

    return result;
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
   * Creates a new StormContext instance.
   *
   * @param workspaceConfig - The workspace configuration.
   */
  protected constructor(workspaceConfig: WorkspaceConfig) {
    this.#workspaceConfig = workspaceConfig;
    this.#envPaths = getEnvPaths({
      orgId: "storm-software",
      appId: "powerlines",
      workspaceRoot: workspaceConfig.workspaceRoot
    });
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

      this.#checksum = await getChecksum(cacheKey.projectRoot);
      this.resolver = createResolver({
        workspaceRoot: this.workspaceConfig.workspaceRoot,
        projectRoot: cacheKey.projectRoot,
        cacheDir: this.cachePath,
        mode: cacheKey.mode,
        skipCache: cacheKey.skipCache
      });

      const userConfig = await loadUserConfigFile(
        cacheKey.projectRoot,
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
          tsconfig: appendPath("tsconfig.json", cacheKey.projectRoot),
          sourceRoot:
            this.projectJson?.sourceRoot ||
            appendPath("src", cacheKey.projectRoot),
          output: {
            outputPath: joinPaths("dist", cacheKey.projectRoot),
            mode: "virtual" as OutputModeType,
            dts: joinPaths(
              cacheKey.projectRoot,
              `${config.framework ?? "powerlines"}.d.ts`
            ),
            builtinPrefix: config.framework ?? "powerlines",
            artifactsFolder: joinPaths(
              cacheKey.projectRoot,
              `.${config.framework ?? "powerlines"}`
            ),
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
          }
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
            target: "esnext"
          },
          override: {}
        }
      ) as TResolvedConfig;
    }

    this.config.entry = getUniqueEntries(this.config.entry);

    if (
      this.config.name?.startsWith("@") &&
      this.config.name.split("/").filter(Boolean).length > 1
    ) {
      this.config.name = this.config.name.split("/").filter(Boolean)[1]!;
    }

    this.config.title ??= titleCase(this.config.name);

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
    this.config.output.outputPath ??= joinPaths(
      "dist",
      this.config.projectRoot || "."
    );
    this.config.output.assets = getUnique(
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
              : appendPath(asset.input, this.workspaceConfig.workspaceRoot),
          output: appendPath(
            isSetObject(asset) && asset.output
              ? joinPaths(
                  this.config.output.outputPath,
                  replacePath(asset.output, this.config.output.outputPath)
                )
              : this.config.output.outputPath,
            this.workspaceConfig.workspaceRoot
          ),
          ignore:
            isSetObject(asset) && asset.ignore
              ? toArray(asset.ignore)
              : undefined
        };
      })
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
