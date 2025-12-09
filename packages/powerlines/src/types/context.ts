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
import type { NonUndefined } from "@stryke/types/base";
import type { PackageJson } from "@stryke/types/package-json";
import type { Worker as JestWorker } from "jest-worker";
import type { Jiti } from "jiti";
import type MagicString from "magic-string";
import type { SourceMap } from "magic-string";
import type { ParseResult, ParserOptions } from "oxc-parser";
import type { Range } from "semver";
import type { Project } from "ts-morph";
import type { RequestInfo, Response } from "undici";
import type { Unimport } from "unimport";
import type {
  ExternalIdResult,
  UnpluginBuildContext,
  UnpluginContext,
  UnpluginMessage
} from "unplugin";
import type {
  InlineConfig,
  LogFn,
  UserConfig,
  WorkspaceConfig
} from "./config";
import type {
  ResolveOptions,
  VirtualFile,
  VirtualFileSystemInterface
} from "./fs";
import type { HookKeys, Hooks, HooksList } from "./hooks";
import type { Plugin } from "./plugin";
import type {
  EnvironmentResolvedConfig,
  ResolvedConfig,
  ResolvedEntryTypeDefinition
} from "./resolved";
import type { ParsedTypeScriptConfig } from "./tsconfig";

/**
 * The severity level of a {@link LogRecord}.
 */
export type LogLevel = "debug" | "info" | "warning" | "error" | "fatal";

// eslint-disable-next-line ts/no-redeclare
export const LogLevel = {
  DEBUG: "debug" as LogLevel,
  INFO: "info" as LogLevel,
  WARNING: "warning" as LogLevel,
  ERROR: "error" as LogLevel,
  FATAL: "fatal" as LogLevel
};

export type WorkerProcess<TExposedMethods extends ReadonlyArray<string>> = {
  [K in TExposedMethods[number]]: (data: any) => Promise<any>;
} & {
  close: () => void;
  end: () => ReturnType<JestWorker["end"]>;
};

export interface MetaInfo {
  /**
   * The checksum generated from the resolved options
   */
  checksum: string;

  /**
   * The build id
   */
  buildId: string;

  /**
   * The release id
   */
  releaseId: string;

  /**
   * The build timestamp
   */
  timestamp: number;

  /**
   * A hash that represents the path to the project root directory
   */
  projectRootHash: string;

  /**
   * A hash that represents the path to the project root directory
   */
  configHash: string;
}

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

export interface InitContextOptions {
  /**
   * If false, the plugin will be loaded after all other plugins.
   *
   * @defaultValue true
   */
  isHighPriority: boolean;
}

export interface FetchOptions extends FetchRequestOptions {
  /**
   * An indicator specifying that the request should bypass any caching
   */
  skipCache?: boolean;
}

export interface ParseOptions extends ParserOptions {
  /**
   * When true this allows return statements to be outside functions to e.g. support parsing CommonJS code.
   */
  allowReturnOutsideFunction?: boolean;
}

/**
 * The unresolved Powerlines context.
 *
 * @remarks
 * This context is used before the user configuration has been fully resolved after the `config`.
 */
export interface UnresolvedContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> {
  /**
   * The Storm workspace configuration
   */
  workspaceConfig: WorkspaceConfig;

  /**
   * An object containing the options provided to Powerlines
   */
  config: Omit<TResolvedConfig["userConfig"], "build" | "output"> &
    Required<Pick<TResolvedConfig["userConfig"], "build" | "output">> & {
      projectRoot: NonUndefined<TResolvedConfig["userConfig"]["root"]>;
      sourceRoot: NonUndefined<TResolvedConfig["userConfig"]["sourceRoot"]>;
      output: TResolvedConfig["output"];
    };

  /**
   * A logging function for the Powerlines engine
   */
  log: LogFn;

  /**
   * A logging function for fatal messages
   */
  fatal: (message: string | UnpluginMessage) => void;

  /**
   * A logging function for error messages
   */
  error: (message: string | UnpluginMessage) => void;

  /**
   * A logging function for warning messages
   */
  warn: (message: string | UnpluginMessage) => void;

  /**
   * A logging function for informational messages
   */
  info: (message: string | UnpluginMessage) => void;

  /**
   * A logging function for debug messages
   */
  debug: (message: string | UnpluginMessage) => void;

  /**
   * A logging function for trace messages
   */
  trace: (message: string | UnpluginMessage) => void;

  /**
   * The metadata information
   */
  meta: MetaInfo;

  /**
   * The metadata information currently written to disk
   */
  persistedMeta?: MetaInfo;

  /**
   * The Powerlines artifacts directory
   */
  artifactsPath: string;

  /**
   * The path to the Powerlines builtin runtime modules directory
   */
  builtinsPath: string;

  /**
   * The path to the Powerlines entry modules directory
   */
  entryPath: string;

  /**
   * The path to the Powerlines TypeScript declaration files directory
   */
  dtsPath: string;

  /**
   * The path to a directory where the reflection data buffers (used by the build processes) are stored
   */
  dataPath: string;

  /**
   * The path to a directory where the project cache (used by the build processes) is stored
   */
  cachePath: string;

  /**
   * The Powerlines environment paths
   */
  envPaths: EnvPaths;

  /**
   * The file system path to the Powerlines package installation
   */
  powerlinesPath: string;

  /**
   * The relative path to the Powerlines workspace root directory
   */
  relativeToWorkspaceRoot: string;

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
   * The virtual file system manager used during the build process to reference generated runtime files
   */
  fs: VirtualFileSystemInterface;

  /**
   * The Jiti module resolver
   */
  resolver: Resolver;

  /**
   * The builtin module id that exist in the Powerlines virtual file system
   */
  builtins: string[];

  /**
   * The {@link Project} instance used for type reflection and module manipulation
   *
   * @see https://ts-morph.com/
   *
   * @remarks
   * This instance is created lazily on first access.
   */
  program: Project;

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
  ) => Promise<ExternalIdResult | undefined>;

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
   * Resolves a builtin virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the builtin file
   * @param id - The unique identifier of the builtin file
   * @param path - An optional path to write the builtin file to
   */
  emitBuiltin: (code: string, id: string, path?: string) => Promise<void>;

  /**
   * Resolves a entry virtual file and writes it to the VFS if it does not already exist
   *
   * @param code - The source code of the entry file
   * @param path - An optional path to write the entry file to
   */
  emitEntry: (code: string, path: string) => Promise<void>;

  /**
   * A function to update the context fields using a new user configuration options
   */
  withUserConfig: (
    userConfig: UserConfig,
    options?: InitContextOptions
  ) => Promise<void>;

  /**
   * A function to update the context fields using inline configuration options
   */
  withInlineConfig: (
    inlineConfig: InlineConfig,
    options?: InitContextOptions
  ) => Promise<void>;

  /**
   * Create a new logger instance
   *
   * @param name - The name to use for the logger instance
   * @returns A logger function
   */
  createLog: (name: string | null) => LogFn;

  /**
   * Extend the current logger instance with a new name
   *
   * @param name - The name to use for the extended logger instance
   * @returns A logger function
   */
  extendLog: (name: string) => LogFn;

  /**
   * Generates a checksum representing the current context state
   *
   * @returns A promise that resolves to a string representing the checksum
   */
  generateChecksum: () => Promise<string>;
}

export type Context<TResolvedConfig extends ResolvedConfig = ResolvedConfig> =
  Omit<UnresolvedContext<TResolvedConfig>, "config"> & {
    /**
     * The fully resolved Powerlines configuration
     */
    config: TResolvedConfig;
  };

export interface APIContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends Context<TResolvedConfig> {
  /**
   * The expected plugins options for the Powerlines project.
   *
   * @remarks
   * This is a record of plugin identifiers to their respective options. This field is populated by the Powerlines engine during both plugin initialization and the `init` command.
   */
  plugins: Plugin<PluginContext<TResolvedConfig>>[];

  /**
   * A function to add a plugin to the context and update the configuration options
   */
  addPlugin: (plugin: Plugin<PluginContext<TResolvedConfig>>) => Promise<void>;

  /**
   * A table for storing the current context for each configured environment
   */
  environments: Record<string, EnvironmentContext<TResolvedConfig>>;

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
  ) => Promise<EnvironmentContext<TResolvedConfig>>;

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
  ) => Promise<EnvironmentContext<TResolvedConfig> | undefined>;

  /**
   * A function to copy the context and update the fields for a specific environment
   *
   * @param environment - The environment configuration to use.
   * @returns A new context instance with the updated environment.
   */
  in: (
    environment: EnvironmentResolvedConfig
  ) => Promise<EnvironmentContext<TResolvedConfig>>;

  /**
   * A function to merge all configured environments into a single context
   *
   * @returns A promise that resolves to the merged environment context.
   */
  toEnvironment: () => Promise<EnvironmentContext<TResolvedConfig>>;
}

export interface EnvironmentContextPlugin<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> {
  plugin: Plugin<PluginContext<TResolvedConfig>>;
  context: PluginContext<TResolvedConfig>;
}

export interface SelectHooksResult<
  TResolvedConfig extends ResolvedConfig,
  TKey extends HookKeys<PluginContext<TResolvedConfig>>
> {
  handle: Hooks[TKey];
  context: PluginContext<TResolvedConfig>;
}

export interface EnvironmentContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends Context<TResolvedConfig> {
  /**
   * The expected plugins options for the Powerlines project.
   *
   * @remarks
   * This is a record of plugin identifiers to their respective options. This field is populated by the Powerlines engine during both plugin initialization and the `init` command.
   */
  plugins: EnvironmentContextPlugin<TResolvedConfig>[];

  /**
   * A function to add a plugin to the context and update the configuration options
   */
  addPlugin: (plugin: Plugin<PluginContext<TResolvedConfig>>) => Promise<void>;

  /**
   * The environment specific resolved configuration
   */
  environment: EnvironmentResolvedConfig;

  /**
   * A table holding references to hook functions registered by plugins
   */
  hooks: HooksList<PluginContext<TResolvedConfig>>;

  /**
   * Retrieves the hook handlers for a specific hook name
   */
  selectHooks: <TKey extends HookKeys<PluginContext<TResolvedConfig>>>(
    hook: TKey,
    options?: SelectHooksOptions
  ) => SelectHooksResult<TResolvedConfig, TKey>[];
}

export interface PluginContext<
  out TResolvedConfig extends ResolvedConfig = ResolvedConfig
>
  extends Context<TResolvedConfig>, UnpluginContext {
  /**
   * The environment specific resolved configuration
   */
  environment: EnvironmentResolvedConfig;

  /**
   * An alternative property name for the {@link log} property
   *
   * @remarks
   * This is provided for compatibility with other logging libraries that expect a `logger` property.
   */
  logger: LogFn;
}

export type BuildPluginContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> = UnpluginBuildContext & PluginContext<TResolvedConfig>;
