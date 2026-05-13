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

import type { EnvPaths } from "@stryke/env/get-env-paths";
import { FetchRequestOptions } from "@stryke/http/fetch";
import { DeepReadonly } from "@stryke/types/base";
import type { PackageJson } from "@stryke/types/package-json";
import type { Jiti } from "jiti";
import type MagicString from "magic-string";
import type { SourceMap } from "magic-string";
import type { ParseResult, ParserOptions } from "oxc-parser";
import type { Range } from "semver";
import type { RequestInfo, Response } from "undici";
import type { Unimport } from "unimport";
import type { ExternalIdResult, UnpluginBuildContext } from "unplugin";
import type {
  EnvironmentResolvedConfig,
  ExecutionOptions,
  Options,
  PluginConfig,
  ResolvedConfig,
  ResolvedEntryTypeDefinition
} from "./config";
import type {
  ResolveOptions,
  VirtualFile,
  VirtualFileSystemInterface,
  WriteOptions
} from "./fs";
import type {
  CallHookOptions,
  HooksList,
  HooksListItem,
  InferHookParameters,
  InferHookReturnType
} from "./hooks";
import { LogFn, Logger, LoggerOptions, LogMessage } from "./logging";
import type { Plugin } from "./plugin";
import type { ParsedTypeScriptConfig } from "./tsconfig";

export type MetaInfo = Record<string, any> & {
  /**
   * The checksum generated from the resolved options
   */
  checksum: string;

  /**
   * The execution id
   */
  executionId: string;

  /**
   * The release id
   */
  releaseId: string;

  /**
   * The execution timestamp
   */
  timestamp: number;

  /**
   * A hash that represents the path to the project root directory
   */
  rootHash: string;

  /**
   * A hash that represents the path to the configuration root directory
   */
  configHash: string;
};

export interface Resolver extends Jiti {
  plugin: Jiti;
}

export interface TransformResult {
  code: string;
  map: SourceMap | null;
}

/**
 * The format for providing source code to the compiler
 */
export interface SourceFile {
  /**
   * The name of the file to be compiled
   */
  id: string;

  /**
   * The source code to be compiled
   */
  code: MagicString;

  /**
   * The environment variables used in the source code
   */
  env: string[];

  /**
   * The result of the transformation
   */
  result?: TransformResult;
}

export type UnimportContext = Omit<Unimport, "injectImports"> & {
  dumpImports: () => Promise<void>;
  injectImports: (source: SourceFile) => Promise<SourceFile>;
  refreshRuntimeImports: () => Promise<void>;
};

export interface SelectHooksOptions {
  order?: "pre" | "post" | "normal";
}

/**
 * Options for initializing or updating the context with new configuration values
 */
export interface InitContextOptions {
  /**
   * If false, the plugin will be loaded after all other plugins.
   *
   * @defaultValue true
   */
  isHighPriority: boolean;
}

/**
 * Options for fetch requests made via the context's {@link Context.fetch} method
 */
export interface FetchOptions extends FetchRequestOptions {
  /**
   * An indicator specifying that the request should bypass any caching
   */
  skipCache?: boolean;
}

/**
 * Options for parsing code using [Oxc-Parser](https://github.com/oxc/oxc)
 */
export interface ParseOptions extends ParserOptions {
  /**
   * When true this allows return statements to be outside functions to e.g. support parsing CommonJS code.
   */
  allowReturnOutsideFunction?: boolean;
}

export interface EmitOptions extends WriteOptions {
  /**
   * The file extension to use when emitting the file
   */
  extension?: string;

  /**
   * If true, will emit the file using {@link UnpluginBuildContext.emitFile | the bundler's emit function}.
   */
  emitWithBundler?: boolean;

  needsCodeReference?: Parameters<
    UnpluginBuildContext["emitFile"]
  >[0]["needsCodeReference"];

  originalFileName?: Parameters<
    UnpluginBuildContext["emitFile"]
  >[0]["originalFileName"];
}

/**
 * Options for emitting entry virtual files
 */
export type EmitEntryOptions = EmitOptions &
  Omit<ResolvedEntryTypeDefinition, "file">;

export interface ResolveResult extends ExternalIdResult {
  /**
   * A flag indicating whether the resolved module is part of the generated runtime modules
   */
  virtual?: boolean;
}

/**
 * The base Powerlines context.
 *
 * @remarks
 * This context provides the foundational structure for interacting with the Powerlines engine.
 */
export interface BaseContext<TSystemContext = unknown> extends Pick<
  Required<Options>,
  "cwd"
> {
  /**
   * The system instance associated with the context, which can be used to interact with the Powerlines engine and perform various operations during the build process. The specific type of the system may vary depending on the environment and use case, but it typically provides methods for logging, file system operations, and other interactions with the Powerlines engine.
   */
  system: TSystemContext;

  /**
   * The timestamp when the context was initialized
   */
  timestamp: number;

  /**
   * The Powerlines environment paths
   */
  envPaths: EnvPaths;

  /**
   * The file system path to the Powerlines package installation
   */
  powerlinesPath: string;

  /**
   * The options provided to the Powerlines process.
   */
  options: Options;

  /**
   * An instance of the Powerlines logger client that can be used to generate log messages with consistent formatting and metadata.
   */
  logger: Logger;

  /**
   * A logging function for fatal messages
   */
  fatal: (message: string | LogMessage | Error) => void;

  /**
   * A logging function for error messages
   */
  error: (message: string | LogMessage | Error) => void;

  /**
   * A logging function for warning messages
   */
  warn: (message: string | LogMessage) => void;

  /**
   * A logging function for informational messages
   */
  info: (message: string | LogMessage) => void;

  /**
   * A logging function for debug messages
   */
  debug: (message: string | LogMessage) => void;

  /**
   * A logging function for trace messages
   */
  trace: (message: string | LogMessage) => void;

  /**
   * A function to create a timer for measuring the duration of asynchronous operations
   *
   * @example
   * ```ts
   * const stopTimer = context.timer("Your Async Operation");
   * await performAsyncOperation();
   * stopTimer(); // "Your Async Operation completed in 123.45 milliseconds"
   * ```
   *
   * @param name - The name of the timer.
   * @returns A function that, when called, stops the timer and logs the duration.
   */
  timer: (name: string) => () => void;

  /**
   * Create a new logger instance
   *
   * @param options - The configuration options to use for the logger instance, which can be used to customize the appearance and behavior of the log messages generated by the logger. This is typically the name of the plugin or module that is creating the logger instance.
   * @returns A logger client instance that can be used to generate log messages with consistent formatting and metadata.
   */
  createLogger: (options: LoggerOptions, logFn?: LogFn) => Logger;

  /**
   * Extend the current logger instance with a new source
   *
   * @param options - The overlay metadata to use for the badge in the log output.
   * @returns A logger client instance that extends the current logger with the provided configuration options.
   */
  extendLogger: (options: LoggerOptions, logFn?: LogFn) => Logger;
}

/**
 * The unresolved Powerlines context.
 *
 * @remarks
 * This context is used before the user configuration has been fully resolved after the `config`.
 */
export interface UnresolvedContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown
> extends BaseContext<TSystemContext> {
  /**
   * The options provided to the Powerlines process, resolved with default values and merged with any configuration provided by plugins or other sources. This is typically the final configuration used during the build process, but may also include additional options that are relevant to the context and its interactions with the Powerlines engine.
   */
  options: ExecutionOptions;

  /**
   * An object containing the options provided to Powerlines
   */
  config: Omit<TResolvedConfig["userConfig"], "output"> &
    Required<Pick<TResolvedConfig["userConfig"], "output">> &
    Pick<
      TResolvedConfig,
      "cwd" | "mode" | "root" | "framework" | "configFile" | "name" | "logLevel"
    > & {
      /**
       * The output configuration options for the Powerlines process, which may include settings related to the output directory, file naming conventions, and other options that affect how the compiled output is generated and structured. This is typically derived from the user configuration but may also include additional options provided by plugins or other sources.
       */
      output: TResolvedConfig["output"];

      /**
       * The configuration values read from the user configuration file before any resolution or merging with default values or plugin-provided configurations. This represents the raw configuration as defined by the user, and can be useful for debugging or for plugins that need to access the original configuration values before they are processed by Powerlines.
       */
      readonly userConfig: DeepReadonly<TResolvedConfig["userConfig"]>;

      /**
       * The configuration options that were provided inline to the Powerlines CLI.
       */
      readonly inlineConfig: DeepReadonly<TResolvedConfig["inlineConfig"]>;
    };

  /**
   * A place to store metadata information on the context for access in plugins and other parts of the system. This can be used to store information about the current execution, such as a unique identifier for the execution, timestamps, or any other relevant data that may be useful for plugins or other parts of the system to access during the build process.
   */
  meta: MetaInfo;

  /**
   * The metadata information currently written to disk
   */
  persistedMeta?: MetaInfo;

  /**
   * The path to a directory where the reflection data buffers (used by the build processes) are stored
   */
  readonly dataPath: string;

  /**
   * The path to a directory where the project cache (used by the build processes) is stored
   */
  readonly cachePath: string;

  /**
   * The Powerlines artifacts directory
   */
  readonly artifactsPath: string;

  /**
   * The path to the Powerlines builtin runtime modules directory
   */
  readonly builtinsPath: string;

  /**
   * The path to the Powerlines entry modules directory
   */
  readonly entryPath: string;

  /**
   * The path to the Powerlines infrastructure modules directory
   */
  readonly infrastructurePath: string;

  /**
   * The path to the Powerlines TypeScript declaration files directory
   */
  readonly typesPath: string;

  /**
   * Invokes the configured plugin hooks
   *
   * @remarks
   * By default, it will call the `"pre"`, `"normal"`, and `"post"` ordered hooks in sequence
   *
   * @param hook - The hook to call
   * @param options - The options to provide to the hook
   * @param args - The arguments to pass to the hook
   * @returns The result of the hook call
   */
  callHook: <TKey extends string>(
    hook: TKey,
    options: CallHookOptions & {
      environment?: string | EnvironmentContext<TResolvedConfig>;
    },
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) => Promise<
    InferHookReturnType<PluginContext<TResolvedConfig>, TKey> | undefined
  >;

  /**
   * The virtual file system interface for managing files during the build process
   */
  fs: VirtualFileSystemInterface;

  /**
   * The project's `package.json` file content
   */
  packageJson: PackageJson & Record<string, any>;

  /**
   * The project's `project.json` file content
   */
  projectJson?: Record<string, any>;

  /**
   * The dependency installations required by the project
   */
  dependencies: Record<string, string | Range>;

  /**
   * The development dependency installations required by the project
   */
  devDependencies: Record<string, string | Range>;

  /**
   * The parsed TypeScript configuration from the `tsconfig.json` file
   */
  tsconfig: ParsedTypeScriptConfig;

  /**
   * The entry points of the source code
   */
  entry: ResolvedEntryTypeDefinition[];

  /**
   * The Jiti module resolver
   */
  resolver: Resolver;

  /**
   * The builtin module id that exist in the Powerlines virtual file system
   */
  builtins: string[];

  /**
   * The alias mappings for the project used during module resolution
   *
   * @remarks
   * This includes both the built-in module aliases as well as any custom aliases defined in the build configuration.
   */
  alias: Record<string, string>;

  /**
   * The resolved tsconfig file paths for the project
   */
  resolvePatterns: RegExp[];

  /**
   * Additional arguments provided during execution of the command, such as CLI flags or other parameters that may be relevant to the command being executed.
   */
  additionalArgs: Record<string, string | string[]>;

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
  fetch: (input: RequestInfo, options?: FetchOptions) => Promise<Response>;

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
  parse: (code: string, options?: ParseOptions) => Promise<ParseResult>;

  /**
   * A helper function to resolve modules using the Jiti resolver
   *
   * @remarks
   * This function can be used to resolve modules relative to the project root directory.
   *
   * @example
   * ```ts
   * const resolvedPath = await context.resolve("some-module", "/path/to/importer");
   * ```
   *
   * @param id - The module to resolve.
   * @param importer - An optional path to the importer module.
   * @param options - Additional resolution options.
   * @returns A promise that resolves to the resolved module path.
   */
  resolve: (
    id: string,
    importer?: string,
    options?: ResolveOptions
  ) => Promise<ResolveResult | undefined>;

  /**
   * A helper function to load modules using the Jiti resolver
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
  load: (id: string) => Promise<TransformResult | undefined>;

  /**
   * The Powerlines builtin virtual files
   */
  getBuiltins: () => Promise<VirtualFile[]>;

  /**
   * Resolves a file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the file
   * @param path - The path to write the file to
   * @param options - Additional options for writing the file
   */
  emit: (code: string, path: string, options?: EmitOptions) => Promise<void>;

  /**
   * Synchronously resolves a file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the file
   * @param path - The path to write the file to
   * @param options - Additional options for writing the file
   */
  emitSync: (code: string, path: string, options?: EmitOptions) => void;

  /**
   * Resolves a builtin virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the builtin file
   * @param id - The unique identifier of the builtin file
   * @param options - Additional options for writing the builtin file
   */
  emitBuiltin: (
    code: string,
    id: string,
    options?: EmitOptions
  ) => Promise<void>;

  /**
   * Synchronously resolves a builtin virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the builtin file
   * @param id - The unique identifier of the builtin file
   * @param options - Additional options for writing the builtin file
   */
  emitBuiltinSync: (code: string, id: string, options?: EmitOptions) => void;

  /**
   * Resolves a entry virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the entry file
   * @param path - An optional path to write the entry file to
   * @param options - Additional options for writing the entry file
   */
  emitEntry: (
    code: string,
    path: string,
    options?: EmitEntryOptions
  ) => Promise<void>;

  /**
   * Synchronously resolves a entry virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the entry file
   * @param path - An optional path to write the entry file to
   * @param options - Additional options for writing the entry file
   */
  emitEntrySync: (
    code: string,
    path: string,
    options?: EmitEntryOptions
  ) => void;

  /**
   * Resolves a infrastructure virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the infrastructure file
   * @param id - The unique identifier of the infrastructure file
   * @param options - Additional options for writing the infrastructure file
   */
  emitInfrastructure: (
    code: string,
    id: string,
    options?: EmitOptions
  ) => Promise<void>;

  /**
   * Synchronously resolves a infrastructure virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the infrastructure file
   * @param id - The unique identifier of the infrastructure file
   * @param options - Additional options for writing the infrastructure file
   */
  emitInfrastructureSync: (
    code: string,
    id: string,
    options?: EmitOptions
  ) => void;

  /**
   * Generates a checksum representing the current context state
   *
   * @returns A promise that resolves to a string representing the checksum
   */
  generateChecksum: () => Promise<string>;
}

/**
 * The resolved Powerlines context.
 *
 * @remarks
 * This context is used after the user configuration has been fully resolved and merged with default values, providing access to the final configuration options and utility functions for interacting with the Powerlines engine.
 */
export type Context<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown
> = Omit<
  UnresolvedContext<TResolvedConfig, TSystemContext>,
  "config" | "callHook"
> & {
  /**
   * The fully resolved Powerlines configuration
   */
  config: TResolvedConfig;

  /**
   * Invokes the configured plugin hooks
   *
   * @remarks
   * By default, it will call the `"pre"`, `"normal"`, and `"post"` ordered hooks in sequence
   *
   * @param hook - The hook to call
   * @param options - The options to provide to the hook
   * @param args - The arguments to pass to the hook
   * @returns The result of the hook call
   */
  callHook: <TKey extends string>(
    hook: TKey,
    options: CallHookOptions & {
      environment?: string | EnvironmentContext<any, any>;
    },
    ...args: InferHookParameters<PluginContext<any, any>, TKey>
  ) => Promise<InferHookReturnType<PluginContext<any, any>, TKey> | undefined>;
};

export interface ExecutionContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown
> extends Context<TResolvedConfig, TSystemContext> {
  /**
   * The unique identifier of the execution context, which can be used for logging and other purposes to distinguish between different executions in the same process.
   */
  readonly id: string;

  /**
   * The expected plugins options for the Powerlines project.
   *
   * @remarks
   * This is a record of plugin identifiers to their respective options. This field is populated by the Powerlines engine during both plugin initialization and the `init` command.
   */
  plugins: Plugin<PluginContext<TResolvedConfig, TSystemContext>>[];

  /**
   * A table for storing the current context for each configured environment
   */
  environments: Record<
    string,
    EnvironmentContext<TResolvedConfig, TSystemContext>
  >;

  /**
   * Retrieves the context for a specific environment by name
   *
   * @throws Will throw an error if the environment does not exist
   *
   * @param name - The name of the environment to retrieve. If not provided, the default environment is returned.
   * @returns A promise that resolves to the environment context.
   *
   * @example
   * ```ts
   * const devEnv = await apiContext.getEnvironment("development");
   * const defaultEnv = await apiContext.getEnvironment();
   * ```
   */
  getEnvironment: (
    name?: string
  ) => Promise<EnvironmentContext<TResolvedConfig, TSystemContext>>;

  /**
   * Safely retrieves the context for a specific environment by name
   *
   * @param name - The name of the environment to retrieve. If not provided, the default environment is returned.
   * @returns A promise that resolves to the environment context, or undefined if the environment does not exist.
   *
   * @example
   * ```ts
   * const devEnv = await apiContext.getEnvironmentSafe("development");
   * const defaultEnv = await apiContext.getEnvironmentSafe();
   * ```
   *
   * @remarks
   * This method is similar to `getEnvironment`, but it returns `undefined` instead of throwing an error if the specified environment does not exist.
   * This can be useful in scenarios where the existence of an environment is optional or uncertain.
   *
   * ```ts
   * const testEnv = await apiContext.getEnvironmentSafe("test");
   * if (testEnv) {
   *   // Environment exists, safe to use it
   * } else {
   *   // Environment does not exist, handle accordingly
   * }
   * ```
   *
   * Using this method helps avoid unhandled exceptions in cases where an environment might not be defined.
   */
  getEnvironmentSafe: (
    name?: string
  ) => Promise<EnvironmentContext<TResolvedConfig, TSystemContext> | undefined>;

  /**
   * A function to copy the context and update the fields for a specific environment
   *
   * @param environment - The environment configuration to use.
   * @returns A new context instance with the updated environment.
   */
  createEnvironment: (
    environment: EnvironmentResolvedConfig<TResolvedConfig>["environment"]
  ) => Promise<EnvironmentContext<TResolvedConfig, TSystemContext>>;

  /**
   * A function to merge all configured environments into a single context
   *
   * @returns A promise that resolves to the merged environment context.
   */
  toEnvironment: () => Promise<
    EnvironmentContext<TResolvedConfig, TSystemContext>
  >;

  /**
   * A function used internally to add a plugin to the context and update the configuration options
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  unstable_addPlugin: (
    plugin: PluginConfig<PluginContext<TResolvedConfig, TSystemContext>>
  ) => Promise<void>;
}

export interface EnvironmentPlugin<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown
> extends Plugin<PluginContext<TResolvedConfig, TSystemContext>> {
  /**
   * A internal field to store the plugin configuration and context for the environment context
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  $$internal: {
    /**
     * The unique identifier of the plugin, which can be used for logging and other purposes to distinguish between different plugins in the same process.
     */
    readonly id: string;

    /**
     * The context for the plugin, which provides access to the Powerlines engine and other utilities for interacting with the build process.
     *
     * @remarks
     * This context is specific to the plugin and environment, allowing for environment-specific modifications without affecting the global context.
     */
    readonly context: PluginContext<TResolvedConfig, TSystemContext>;
  };
}

export type SelectHookResultItem<
  TContext extends PluginContext,
  TKey extends string
> = HooksListItem<TContext, TKey> & {
  context: TContext;
};

export type SelectHookResult<
  TContext extends PluginContext,
  TKey extends string
> = SelectHookResultItem<TContext, TKey>[];

export interface EnvironmentContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown
> extends Context<EnvironmentResolvedConfig<TResolvedConfig>, TSystemContext> {
  /**
   * The unique identifier of the environment associated with this context, which can be used for logging and other purposes to distinguish between different environments in the same process.
   */
  readonly id: string;

  /**
   * The expected plugins options for the Powerlines project.
   *
   * @remarks
   * This is a record of plugin identifiers to their respective options. This field is populated by the Powerlines engine during both plugin initialization and the `init` command.
   */
  plugins: EnvironmentPlugin<TResolvedConfig, TSystemContext>[];

  /**
   * A table holding references to hook functions registered by plugins
   */
  hooks: HooksList<PluginContext<TResolvedConfig, TSystemContext>>;

  /**
   * The execution context associated with this environment, which provides access to the project configuration, environment, and utility functions for performing the build. The execution context is used to manage the state and behavior of the build process across multiple environments, allowing for hooks to be called at different stages of the build and for environment-specific configurations to be applied.
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  unstable_execution: ExecutionContext<TResolvedConfig, TSystemContext>;

  /**
   * Retrieves the hook handlers for a specific hook name
   */
  selectHooks: <TKey extends string>(
    key: TKey,
    options?: SelectHooksOptions
  ) => SelectHookResult<PluginContext<TResolvedConfig, TSystemContext>, TKey>;

  /**
   * A function used internally to add a plugin to the context and update the configuration options
   *
   * @danger
   * This field is for internal use only and should not be accessed or modified directly. It is unstable and can be changed at anytime.
   *
   * @internal
   */
  unstable_addPlugin: (
    plugin: PluginConfig<PluginContext<TResolvedConfig, TSystemContext>>
  ) => Promise<void>;
}

export interface PluginContext<
  out TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown
> extends Context<EnvironmentResolvedConfig<TResolvedConfig>, TSystemContext> {
  /**
   * The unique identifier of the plugin associated with this context, which can be used for logging and other purposes to distinguish between different plugins in the same process.
   */
  readonly id: string;

  /**
   * The context for the environment associated with this plugin context, which provides access to the Powerlines engine and other utilities for interacting with the build process. This context is specific to the plugin and environment, allowing for environment-specific modifications without affecting the global context.
   */
  readonly environment: EnvironmentContext;
}

export type BuildPluginContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> = UnpluginBuildContext & PluginContext<TResolvedConfig>;

export type WithUnpluginBuildContext<TContext extends PluginContext> =
  UnpluginBuildContext & TContext;
