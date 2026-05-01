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
  EmitEntryOptions,
  EmitOptions,
  ExecutionOptions,
  FetchOptions,
  InferOverridableConfig,
  LogFn,
  LogFnMeta,
  Logger,
  LoggerOptions,
  MetaInfo,
  ParsedTypeScriptConfig,
  ParseOptions,
  PluginConfig,
  ResolvedAssetGlob,
  ResolvedConfig,
  ResolvedCopyConfig,
  ResolvedEntryTypeDefinition,
  ResolvedOutputConfig,
  ResolveOptions,
  ResolveResult,
  TransformResult,
  VirtualFile,
  VirtualFileSystemInterface
} from "@powerlines/core";
import { LogLevelResolvedConfig } from "@powerlines/core";
import {
  CACHE_HASH_LENGTH,
  DEFAULT_DEVELOPMENT_LOG_LEVEL,
  DEFAULT_PRODUCTION_LOG_LEVEL,
  DEFAULT_TEST_LOG_LEVEL,
  ROOT_HASH_LENGTH
} from "@powerlines/core/constants";
import {
  getUniqueInputs,
  isTypeDefinition,
  resolveInputsSync
} from "@powerlines/core/lib/entry";
import {
  createLogger,
  isDuplicate,
  isPlugin,
  mergeConfig,
  replacePathTokens,
  resolveLogLevel,
  withCustomLogger,
  withLogFn
} from "@powerlines/core/plugin-utils";
import { formatLogMessage } from "@storm-software/config-tools/logger/console";
import { toArray } from "@stryke/convert/to-array";
import { EnvPaths, getEnvPaths } from "@stryke/env/get-env-paths";
import { relativeToWorkspaceRoot } from "@stryke/fs/get-workspace-root";
import { murmurhash } from "@stryke/hash";
import { hashDirectory } from "@stryke/hash/node";
import { getUnique, getUniqueBy } from "@stryke/helpers/get-unique";
import { omit } from "@stryke/helpers/omit";
import { fetchRequest } from "@stryke/http/fetch";
import { appendPath } from "@stryke/path/append";
import {
  findFileDotExtensionSafe,
  findFileExtensionSafe
} from "@stryke/path/file-path-fns";
import { isEqual } from "@stryke/path/is-equal";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join";
import { replacePath } from "@stryke/path/replace";
import { titleCase } from "@stryke/string-format/title-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isPromise } from "@stryke/type-checks/is-promise";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { RequiredKeys } from "@stryke/types/base";
import { TypeDefinition } from "@stryke/types/configuration";
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
import { sendWriteLogMessage } from "../_internal/ipc/send";
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

const UNRESOLVED_CONFIG_NAMES = [
  "initialConfig",
  "userConfig",
  "inlineConfig",
  "pluginConfig"
];

export class PowerlinesContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>
  extends PowerlinesBaseContext
  implements Context<TResolvedConfig>
{
  #checksum: string | null = null;

  #buildId: string = uuid();

  #releaseId: string = uuid();

  #fs!: VirtualFileSystemInterface;

  #tsconfig!: ParsedTypeScriptConfig;

  #parserCache!: FlatCache;

  #requestCache!: FlatCache;

  #configProxy!: TResolvedConfig;

  /**
   * Create a new context from the workspace root and user config.
   *
   * @param options - The options for resolving the context.
   * @returns A promise that resolves to the new context.
   */
  public static async fromInitialConfig<
    TResolvedConfig extends ResolvedConfig = ResolvedConfig
  >(
    options: ExecutionOptions,
    initialConfig: TResolvedConfig["initialConfig"]
  ): Promise<PowerlinesContext<TResolvedConfig>> {
    const context = new PowerlinesContext<TResolvedConfig>(
      options,
      initialConfig
    );
    await context.init();

    return context;
  }

  /**
   * The options provided to the Powerlines process, resolved with default values and merged with any configuration provided by plugins or other sources. This is typically the final configuration used during the build process, but may also include additional options that are relevant to the context and its interactions with the Powerlines engine.
   */
  public override options: RequiredKeys<
    ExecutionOptions,
    "mode" | "cwd" | "root" | "framework" | "logLevel"
  > = {} as RequiredKeys<
    ExecutionOptions,
    "mode" | "cwd" | "root" | "framework" | "logLevel"
  >;

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
   * The resolved tsconfig file paths for the project
   */
  public resolvePatterns: RegExp[] = [];

  /**
   * The input options used to initialize the context, which may be used when cloning the context to ensure the same configuration is applied to the new context
   */
  protected override initialOptions: ExecutionOptions = {} as ExecutionOptions;

  /**
   * The resolved configuration for this context
   */
  protected resolvedConfig: TResolvedConfig = {} as TResolvedConfig;

  /**
   * The configuration options that were overridden by plugins during the build process, which may include additional properties or modifications made during the configuration loading process.
   */
  protected overriddenConfig: InferOverridableConfig<TResolvedConfig> =
    {} as InferOverridableConfig<TResolvedConfig>;

  /**
   * The configuration options provided inline during execution, such as CLI flags or other parameters that may be relevant to the command being executed. These options can be used to override or supplement the configuration options defined in a configuration file on disk, and are typically provided as part of the execution context when running a Powerlines command.
   */
  protected inlineConfig: TResolvedConfig["inlineConfig"] =
    {} as TResolvedConfig["inlineConfig"];

  /**
   * The configuration options read from a configuration file on disk, which may be used to resolve the final configuration for the context. This typically includes the user configuration options defined in the `powerlines.config.ts` file, as well as any inline configuration options provided during execution.
   */
  protected userConfig: TResolvedConfig["userConfig"] =
    {} as TResolvedConfig["userConfig"];

  /**
   * The configuration options provided by plugins added by the user (and other plugins)
   */
  protected pluginConfig: TResolvedConfig["pluginConfig"] = {};

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
      timestamp: this.timestamp,
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
    if (!this.#configProxy) {
      this.#configProxy = this.createConfigProxy();
    }

    return this.#configProxy;
  }

  /**
   * Get the path to the artifacts directory for the project
   */
  public get artifactsPath(): string {
    return joinPaths(
      this.config.cwd,
      this.config.root,
      this.config.output?.artifactsPath ||
        `.${this.config.framework || "powerlines"}`
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
   * Additional arguments provided during execution of the command, such as CLI flags or other parameters that may be relevant to the command being executed.
   */
  public get additionalArgs(): Record<string, string | string[]> {
    return Object.entries(this.config.inlineConfig.additionalArgs ?? {}).reduce(
      (ret, [key, value]) => {
        const formattedKey = key.replace(/^--?/, "");

        if (ret[formattedKey]) {
          if (Array.isArray(ret[formattedKey])) {
            if (Array.isArray(value)) {
              ret[formattedKey] = [...toArray(ret[formattedKey]), ...value];
            } else {
              ret[formattedKey] = [...toArray(ret[formattedKey]), value];
            }
          } else {
            ret[formattedKey] = [
              ret[formattedKey],
              ...(Array.isArray(value) ? value : [value])
            ];
          }
        } else {
          ret[formattedKey] = value;
        }
        return ret;
      },
      {} as Record<string, string | string[]>
    );
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
   * The log level for the context, which determines the minimum level of log messages that will be emitted by the logger. This is resolved based on the configuration options provided by the user, and can be set to different levels for development, production, and test environments. The log level can also be overridden by plugins or other parts of the build process to provide more granular control over logging output.
   */
  public override get logLevel(): LogLevelResolvedConfig {
    return resolveLogLevel(this.config.logLevel, this.config.mode);
  }

  /**
   * The environment paths for the project, which provide the locations of various directories and files used by the Powerlines framework. These paths are resolved based on the organization ID, application ID, and workspace root directory, and can be used to access configuration files, cache directories, and other resources in a consistent manner.
   */
  public override get envPaths(): EnvPaths {
    return getEnvPaths({
      orgId: this.config.organization,
      appId: this.config.framework || "powerlines",
      workspaceRoot: this.config.cwd
    });
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
   * Creates a new Context instance.
   *
   * @param options - The options to use for creating the context, including the resolved configuration and workspace settings.
   * @param initialConfig - The initial configuration provided by the user, which can be used to resolve the final configuration for the context. This typically includes the user configuration options defined in the `powerlines.config.ts` file, as well as any inline configuration options provided during execution.
   */
  protected constructor(
    options: ExecutionOptions,
    initialConfig: TResolvedConfig["initialConfig"]
  ) {
    super(options, initialConfig);
    this.initialOptions = options;
    this.initialConfig = initialConfig;
  }

  /**
   * Create a new logger instance
   *
   * @param options - The configuration options to use for the logger instance, which can be used to customize the appearance and behavior of the log messages generated by the logger. This is typically the name of the plugin or module that is creating the logger instance.
   * @param logFn - The custom logging function to use for logging messages, which can be used to override the default logging behavior of the original logger.
   * @returns A logger client instance that can be used to generate log messages with consistent formatting and metadata.
   */
  public override createLogger(options: LoggerOptions, logFn?: LogFn): Logger {
    let logger!: Logger;
    if (isSetString(process.env.POWERLINES_EXECUTION_THREAD_TYPE)) {
      logger = createLogger(
        this.config.name,
        { ...this.options, ...this.config, ...options },
        (meta: LogFnMeta, message: string) =>
          sendWriteLogMessage(this, meta, message)
      );
    } else {
      logger = createLogger(this.config.name, {
        ...this.options,
        ...this.config,
        ...options
      });
    }

    if (this.config.customLogger) {
      logger = withCustomLogger(logger, this.config.customLogger);
    }

    if (logFn) {
      logger = withLogFn(logger, logFn);
    }

    return logger;
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

    const logger = this.extendLogger({ category: "network" });
    const startTime = Date.now();

    logger.trace(
      `Sending fetch request (${
        options.method?.toUpperCase() || "GET"
      }): ${input.toString()}`
    );

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

    logger.trace(
      `Fetch request (${
        options.method?.toUpperCase() || "GET"
      }) completed in ${Date.now() - startTime}ms: ${input.toString()} - ${
        response.status
      } / ${response.statusText} \n - Response Headers: ${JSON.stringify(
        result.headers
      )}\n - Response Body: ${
        typeof result.body === "string"
          ? result.body.length > 1000
            ? `${result.body.slice(0, 1000)}... (truncated, total length: ${
                result.body.length
              })`
            : result.body
          : "[Non-string body]"
      }`
    );

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
   * @param path - The root directory of the project to generate the checksum for
   * @returns A promise that resolves to a string representing the checksum
   */
  public async generateChecksum(path?: string): Promise<string> {
    return hashDirectory(
      path || appendPath(this.options.root, this.options.cwd)
    );
  }

  /**
   * A setter function to populate the inline config values provided during execution of the command, such as CLI flags or other parameters that may be relevant to the command being executed. This function can be used to update the context with the inline configuration values, which may be used during the configuration resolution process to ensure that the final configuration reflects both the user configuration and any inline configuration provided during execution.
   *
   * @param config - The inline configuration values to set.
   * @returns A promise that resolves when the inline configuration values have been set.
   */
  public async setInlineConfig(
    config: TResolvedConfig["inlineConfig"]
  ): Promise<void> {
    this.logger.debug({
      meta: { category: "config" },
      message: `Updating inline configuration object: \n${this.logConfig(config)}`
    });

    this.inlineConfig = config;
    await this.resolveConfig();
  }

  /**
   * A setter function to populate the plugin config values provided during execution of the command, such as CLI flags or other parameters that may be relevant to the command being executed. This function can be used to update the context with the plugin configuration values, which may be used during the configuration resolution process to ensure that the final configuration reflects both the user configuration and any plugin configuration provided during execution.
   *
   * @param config - The plugin configuration values to set.
   * @returns A promise that resolves when the plugin configuration values have been set.
   */
  public async setPluginConfig(
    config: TResolvedConfig["pluginConfig"]
  ): Promise<void> {
    this.logger.debug({
      meta: { category: "config" },
      message: `Updating plugin configuration object: \n${this.logConfig(config)}`
    });

    this.pluginConfig = config;
    await this.resolveConfig();
  }

  /**
   * A function to merge the various configuration objects (initial, user, inline, and plugin) into a single resolved configuration object that can be used throughout the Powerlines process. This function takes into account the different sources of configuration and their respective priorities, ensuring that the final configuration reflects the intended settings for the project. The merged configuration is then returned as a new object that can be accessed through the `config` property of the context.
   *
   * @returns The merged configuration object that combines the initial, user, inline, and plugin configurations.
   */
  protected mergeConfig(): TResolvedConfig {
    return mergeConfig(
      {
        mode: this.initialOptions.mode,
        framework: this.initialOptions.framework,
        initialOptions: this.initialOptions,
        options: this.options,
        inlineConfig: this.inlineConfig,
        userConfig: this.userConfig,
        initialConfig: this.initialConfig,
        pluginConfig: this.pluginConfig
      },
      getConfigProps<TResolvedConfig>(this.overriddenConfig),
      omit(this.options, ["mode", "framework"]),
      getConfigProps<TResolvedConfig>(this.inlineConfig),
      getConfigProps<TResolvedConfig>(this.userConfig),
      getConfigProps<TResolvedConfig>(this.initialConfig),
      getConfigProps<TResolvedConfig>(this.pluginConfig),
      {
        version: this.packageJson?.version,
        description: this.packageJson?.description
      },
      {
        environments: {},
        resolve: {}
      }
    ) as TResolvedConfig;
  }

  /**
   * A setter function to populate the user config values provided during execution of the command, such as CLI flags or other parameters that may be relevant to the command being executed. This function can be used to update the context with the user configuration values, which may be used during the configuration resolution process to ensure that the final configuration reflects both the user configuration and any inline configuration provided during execution.
   *
   * @param config - The user configuration values to set.
   * @returns A promise that resolves when the user configuration values have been set.
   */
  protected async setUserConfig(
    config: TResolvedConfig["userConfig"]
  ): Promise<void> {
    this.logger.debug({
      meta: { category: "config" },
      message: `Updating user configuration object: \n${this.logConfig(config)}`
    });

    this.userConfig = config;
    await this.resolveConfig();
  }

  /**
   * Initialize the context with the provided configuration options
   */
  protected override async init() {
    await super.init();

    this.options.executionId = this.initialOptions.executionId || uuid();
    this.options.executionIndex = this.initialOptions.executionIndex ?? 0;

    this.#checksum = await this.generateChecksum();

    const result =
      this.configFile.config &&
      toArray(this.configFile.config).length > this.options.executionIndex
        ? toArray(this.configFile.config)[this.options.executionIndex]!
        : this.configFile.config;
    if (!result) {
      this.logger.warn(
        `No configuration found in ${
          this.options.configFile
        } for execution index ${this.options.executionIndex}.`
      );
    } else {
      await this.setUserConfig(
        (isFunction(result)
          ? await Promise.resolve(result(this.options))
          : result) as TResolvedConfig["userConfig"]
      );
    }
  }

  /**
   * Initialize the context with the provided configuration options
   */
  protected async resolveConfig(): Promise<void> {
    const mergedConfig = this.mergeConfig();

    this.logger.trace({
      meta: { category: "config" },
      message: `Pre-setup Powerlines configuration object: \n --- Pre-Resolved Config --- \n${this.logConfig(
        mergedConfig
      )} \n --- Initial Config --- \n${this.logConfig(
        this.initialConfig
      )} \n --- User Config --- \n${this.logConfig(
        this.userConfig
      )} \n --- Inline Config --- \n${this.logConfig(
        this.inlineConfig
      )} \n --- Plugin Config --- \n${this.logConfig(this.pluginConfig)}`
    });

    mergedConfig.output = defu(mergedConfig.output ?? {}, {
      copy: {
        assets: [
          {
            glob: "LICENSE"
          },
          {
            input: mergedConfig.root,
            glob: "*.md"
          },
          {
            input: mergedConfig.root,
            glob: "package.json"
          }
        ]
      },
      dts: true
    }) as ResolvedOutputConfig;

    if (!mergedConfig.mode) {
      mergedConfig.mode = "production";
    }

    if (!mergedConfig.framework) {
      mergedConfig.framework = "powerlines";
    }

    if (!mergedConfig.projectType) {
      mergedConfig.projectType = "application";
    }

    if (!mergedConfig.platform) {
      mergedConfig.platform = "neutral";
    }

    mergedConfig.compatibilityDate = resolveCompatibilityDates(
      mergedConfig.compatibilityDate,
      "latest"
    );

    if (!this.packageJson) {
      await this.resolvePackageConfigs();
    }

    this.resolvedConfig = mergedConfig;
    this.#configProxy = this.createConfigProxy();

    mergedConfig.input = getUniqueInputs(mergedConfig.input);

    if (
      mergedConfig.name?.startsWith("@") &&
      mergedConfig.name.split("/").filter(Boolean).length > 1
    ) {
      mergedConfig.name = mergedConfig.name.split("/").filter(Boolean)[1]!;
    }

    mergedConfig.title ??= titleCase(mergedConfig.name);

    if (mergedConfig.resolve.external) {
      mergedConfig.resolve.external = getUnique(mergedConfig.resolve.external);
    }
    if (mergedConfig.resolve.noExternal) {
      mergedConfig.resolve.noExternal = getUnique(
        mergedConfig.resolve.noExternal
      );
    }

    mergedConfig.plugins = (mergedConfig.plugins ?? [])
      .flatMap(plugin => toArray(plugin))
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

    if (!mergedConfig.logLevel) {
      if (mergedConfig.mode === "development") {
        mergedConfig.logLevel = DEFAULT_DEVELOPMENT_LOG_LEVEL;
      } else if (mergedConfig.mode === "test") {
        mergedConfig.logLevel = DEFAULT_TEST_LOG_LEVEL;
      } else {
        mergedConfig.logLevel = DEFAULT_PRODUCTION_LOG_LEVEL;
      }
    }

    if (mergedConfig.tsconfig) {
      mergedConfig.tsconfig = replacePath(
        replacePathTokens(this, mergedConfig.tsconfig),
        mergedConfig.cwd
      );
    } else {
      mergedConfig.tsconfig = getTsconfigFilePath(
        mergedConfig.cwd,
        mergedConfig.root
      );
    }

    // #region Configure output

    mergedConfig.output.format = getUnique(
      toArray(
        mergedConfig.output?.format ??
          (mergedConfig.projectType === "library" ? ["cjs", "esm"] : ["esm"])
      )
    );

    if (mergedConfig.output.path) {
      mergedConfig.output.path = appendPath(
        replacePathTokens(this, mergedConfig.output.path),
        mergedConfig.cwd
      );
    } else {
      mergedConfig.output.path = appendPath(
        joinPaths(mergedConfig.root, "dist"),
        mergedConfig.cwd
      );
    }

    mergedConfig.output.copy ??= {} as ResolvedCopyConfig;
    if (mergedConfig.output.copy !== false) {
      if (!mergedConfig.root.replace(/^\.\/?/, "")) {
        mergedConfig.output.copy.path = mergedConfig.output.copy.path
          ? appendPath(
              replacePathTokens(this, mergedConfig.output.copy.path),
              mergedConfig.cwd
            )
          : mergedConfig.output.path;
      } else {
        mergedConfig.output.copy.path = appendPath(
          replacePathTokens(
            this,
            mergedConfig.output.copy.path ||
              joinPaths("dist", mergedConfig.root)
          ),
          mergedConfig.cwd
        );
      }
    }

    if (mergedConfig.output.types !== false) {
      mergedConfig.output.types = appendPath(
        replacePathTokens(
          this,
          mergedConfig.output.types ||
            joinPaths(
              mergedConfig.root,
              `${mergedConfig.framework ?? "powerlines"}.d.ts`
            )
        ),
        mergedConfig.cwd
      );
    }

    if (
      mergedConfig.output.copy &&
      mergedConfig.output.copy.path &&
      mergedConfig.output.copy.assets &&
      Array.isArray(mergedConfig.output.copy.assets)
    ) {
      mergedConfig.output.copy.assets = getUniqueBy(
        mergedConfig.output.copy.assets.map(asset => {
          return {
            glob: isSetObject(asset) ? asset.glob : asset,
            input:
              isString(asset) ||
              !asset.input ||
              asset.input === "." ||
              asset.input === "/" ||
              asset.input === "./"
                ? mergedConfig.cwd
                : isParentPath(asset.input, mergedConfig.cwd) ||
                    isEqual(asset.input, mergedConfig.cwd)
                  ? asset.input
                  : appendPath(asset.input, mergedConfig.cwd),
            output:
              isSetObject(asset) && asset.output
                ? isParentPath(asset.output, mergedConfig.cwd)
                  ? asset.output
                  : appendPath(
                      joinPaths(
                        (mergedConfig.output.copy as CopyConfig).path,
                        replacePath(
                          replacePath(
                            asset.output,
                            replacePath(
                              (mergedConfig.output.copy as CopyConfig).path,
                              mergedConfig.cwd
                            )
                          ),
                          (mergedConfig.output.copy as CopyConfig).path
                        )
                      ),
                      mergedConfig.cwd
                    )
                : appendPath(
                    (mergedConfig.output.copy as CopyConfig).path,
                    mergedConfig.cwd
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

    if (!mergedConfig.output?.sourceMap) {
      if (mergedConfig.mode === "development") {
        mergedConfig.output.sourceMap = true;
      } else {
        mergedConfig.output.sourceMap = false;
      }
    }

    if (!mergedConfig.output.minify) {
      if (mergedConfig.mode === "production") {
        mergedConfig.output.minify = true;
      } else {
        mergedConfig.output.minify = false;
      }
    }

    if (!mergedConfig.output.artifactsPath) {
      mergedConfig.output.artifactsPath = `.${
        mergedConfig.framework || "powerlines"
      }`;
    }

    if (mergedConfig.output.copy && mergedConfig.output.copy.assets) {
      mergedConfig.output.copy.assets = mergedConfig.output.copy.assets.map(
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
      (isSetString(mergedConfig.output?.storage) &&
        mergedConfig.output.storage === "virtual") ||
      (isSetObject(mergedConfig.output?.storage) &&
        Object.values(mergedConfig.output.storage).every(
          adapter => adapter.preset === "virtual"
        ))
    ) {
      mergedConfig.output.overwrite = true;
    }

    // #endregion Configure output

    this.resolvedConfig = mergedConfig;
    this.#configProxy = this.createConfigProxy();

    this.logger.debug({
      meta: { category: "config" },
      message: `Resolved Powerlines configuration object: \n --- Resolved Config --- \n${this.logConfig(
        this.resolvedConfig
      )} \n --- Initial Config --- \n${this.logConfig(
        this.initialConfig
      )} \n --- User Config --- \n${this.logConfig(
        this.userConfig
      )} \n --- Inline Config --- \n${this.logConfig(
        this.inlineConfig
      )} \n --- Plugin Config --- \n${this.logConfig(this.pluginConfig)}`
    });

    this.#fs ??= await VirtualFileSystem.create(this);
  }

  protected logConfig(
    config:
      | TResolvedConfig
      | TResolvedConfig["initialConfig"]
      | TResolvedConfig["userConfig"]
      | TResolvedConfig["inlineConfig"]
      | TResolvedConfig["pluginConfig"]
  ) {
    return formatLogMessage({
      ...omit(config, ["plugins"]),
      plugins: config.plugins
        ? config.plugins
            .flatMap(plugin => toArray(plugin))
            .map(plugin =>
              String(
                isSetString(plugin)
                  ? plugin
                  : isPromise(plugin)
                    ? "<promise>"
                    : isFunction(plugin)
                      ? plugin.name || "<anonymous function>"
                      : Array.isArray(plugin)
                        ? plugin[0] || "<anonymous function plugin>"
                        : "<unknown plugin>"
              )
            )
        : undefined
    });
  }

  private createConfigProxy(): TResolvedConfig {
    return new Proxy(this.resolvedConfig, {
      /**
       * A trap for the `delete` operator.
       * @param target - The original object which is being proxied.
       * @param key - The name or `Symbol` of the property to delete.
       * @returns A `boolean` indicating whether or not the property was deleted.
       */
      deleteProperty: (target: TResolvedConfig, key) => {
        if (UNRESOLVED_CONFIG_NAMES.includes(key.toString())) {
          throw new Error(
            `Cannot delete property ${key.toString()} from config - it is only intended to be used as a reference.`
          );
        }

        Reflect.deleteProperty(this.overriddenConfig, key);
        return Reflect.deleteProperty(target, key);
      },

      /**
       * A trap for getting a property value.
       * @param target - The original object which is being proxied.
       * @param key - The name or `Symbol` of the property to get.
       * @param receiver - The proxy or an object that inherits from the proxy.
       */
      get: (target: TResolvedConfig, key, receiver) => {
        if (UNRESOLVED_CONFIG_NAMES.includes(key.toString())) {
          if (key === "initialConfig") {
            return this.initialConfig;
          }
          if (key === "userConfig") {
            return this.userConfig;
          }
          if (key === "inlineConfig") {
            return this.inlineConfig;
          }
          if (key === "pluginConfig") {
            return this.pluginConfig;
          }
        }

        return Reflect.get(target, key, receiver);
      },

      /**
       * A trap for the `in` operator.
       * @param target - The original object which is being proxied.
       * @param key - The name or `Symbol` of the property to check for existence.
       */
      has: (target: TResolvedConfig, key: string | symbol): boolean => {
        return (
          Reflect.has(target, key) ||
          UNRESOLVED_CONFIG_NAMES.includes(key.toString())
        );
      },

      /**
       * A trap for `Reflect.ownKeys()`.
       * @param target - The original object which is being proxied.
       */
      ownKeys: (target: TResolvedConfig): ArrayLike<string | symbol> => {
        return getUnique([
          ...Reflect.ownKeys(target),
          ...UNRESOLVED_CONFIG_NAMES
        ]);
      },

      /**
       * A trap for setting a property value.
       * @param target - The original object which is being proxied.
       * @param key - The name or `Symbol` of the property to set.
       * @param newValue - The new value to assign to the property.
       * @param receiver - The object to which the assignment was originally directed.
       * @returns A `boolean` indicating whether or not the property was set.
       */
      set: (
        target: TResolvedConfig,
        key: string | symbol,
        newValue: any,
        receiver: any
      ): boolean => {
        if (UNRESOLVED_CONFIG_NAMES.includes(key.toString())) {
          throw new Error(
            `Cannot change property ${key.toString()} from config - it is only intended to be used as a reference.`
          );
        }

        Reflect.set(this.overriddenConfig, key, newValue, receiver);
        return Reflect.set(target, key, newValue, receiver);
      }
    });
  }
}
