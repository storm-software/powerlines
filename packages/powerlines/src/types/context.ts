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
import type { PackageJson } from "@stryke/types/package-json";
import { Worker as JestWorker } from "jest-worker";
import type { Jiti } from "jiti";
import type { DirectoryJSON } from "memfs";
import { ReflectionClass } from "powerlines/deepkit/type";
import { Range } from "semver";
import type { Unimport } from "unimport";
import type { UnpluginBuildContext, UnpluginContext } from "unplugin";
import type { SerializedTypes as CapnpSerializedTypes } from "../../schemas/reflection";
import type { CallHookOptions } from "../internal/helpers/hooks";
import type { SourceFile } from "./compiler";
import type {
  InlineConfig,
  LogFn,
  UserConfig,
  WorkspaceConfig
} from "./config";
import type {
  HookKeys,
  Hooks,
  HooksList,
  InferHookParameters,
  InferHookReturnType
} from "./hooks";
import type { Plugin } from "./plugin";
import type {
  EnvironmentResolvedConfig,
  ResolvedConfig,
  ResolvedEntryTypeDefinition
} from "./resolved";
import type { ParsedTypeScriptConfig } from "./tsconfig";
import type { VirtualFileSystemInterface } from "./vfs";

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

  /**
   * A mapping of runtime ids to their corresponding file paths
   */
  builtinIdMap: Record<string, string>;

  /**
   * A mapping of virtual file paths to their corresponding file contents
   */
  virtualFiles: Record<string, string | null>;
}

export interface Resolver extends Jiti {
  plugin: Jiti;
}

export type UnimportContext = Omit<Unimport, "injectImports"> & {
  dumpImports: () => Promise<void>;
  injectImports: (source: SourceFile) => Promise<SourceFile>;
  refreshRuntimeImports: () => Promise<void>;
};

export type Reflection<T extends Record<string, any> = Record<string, any>> =
  ReflectionClass<T> & {
    dataBuffer?: ArrayBuffer;
    messageRoot?: CapnpSerializedTypes;
  };
export type ReflectionRecord<
  T extends Record<string, any> = Record<string, any>
> = Record<string, Reflection<T>>;

export interface ContextReflectionRecord<
  T extends Record<string, any> = Record<string, any>
> extends Record<string, Reflection<T> | ContextReflectionRecord<T>> {}

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

export interface Context<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> {
  /**
   * The Storm workspace configuration
   */
  workspaceConfig: WorkspaceConfig;

  /**
   * An object containing the options provided to Powerlines
   */
  config: TResolvedConfig;

  /**
   * A logging function for the Powerlines engine
   */
  log: LogFn;

  /**
   * The metadata information
   */
  meta: MetaInfo;

  /**
   * The metadata information currently written to disk
   */
  persistedMeta?: MetaInfo;

  /**
   * The reflections found and used by Powerlines plugins
   *
   * @remarks
   * These reflections are used by plugins to store data that will be passed around the Powerlines processes. Please note: these values are not persisted to disk by default.
   */
  reflections: { [P in keyof unknown]: ReflectionRecord };

  /**
   * The parsed TypeScript configuration from the `tsconfig.json` file
   */
  tsconfig: ParsedTypeScriptConfig;

  /**
   * The entry points of the source code
   */
  entry: ResolvedEntryTypeDefinition[];

  /**
   * The relative path to the Powerlines workspace root directory
   */
  relativeToWorkspaceRoot: string;

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
   * The dependency installations required by the project
   */
  dependencies: Record<string, string | Range>;

  /**
   * The development dependency installations required by the project
   */
  devDependencies: Record<string, string | Range>;

  /**
   * The project's `package.json` file content
   */
  packageJson: PackageJson;

  /**
   * The project's `project.json` file content
   */
  projectJson?: Record<string, any>;

  /**
   * The virtual file system manager used during the build process to reference generated runtime files
   */
  fs: VirtualFileSystemInterface;

  /**
   * The Jiti module resolver
   */
  resolver: Resolver;

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
}

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
}

export interface EnvironmentContextPlugin<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> {
  plugin: Plugin<PluginContext<TResolvedConfig>>;
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
  ) => Hooks[TKey][];
}

export interface PluginContext<
  out TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends Context<TResolvedConfig>,
    UnpluginContext {
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
> = PluginContext<TResolvedConfig> & UnpluginBuildContext;

/**
 * Internal fields and methods for the internal plugin context
 *
 * @internal
 */
// eslint-disable-next-line ts/naming-convention
export interface Internal_PluginContextInternal<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> {
  environment: EnvironmentContext<TResolvedConfig>;
  callHook: <TKey extends HookKeys<PluginContext<TResolvedConfig>>>(
    hook: TKey,
    options: CallHookOptions,
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) => Promise<
    InferHookReturnType<PluginContext<TResolvedConfig>, TKey> | undefined
  >;
}

/**
 * An internal representation of the plugin context, used for managing hooks and environment data.
 *
 * @internal
 */
// eslint-disable-next-line ts/naming-convention
export interface Internal_PluginContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends PluginContext<TResolvedConfig> {
  $$internal: Internal_PluginContextInternal<TResolvedConfig>;
}

export interface SerializedVirtualFileSystem {
  builtinIdMap: Record<string, string>;
  virtualFiles: DirectoryJSON<string | null>;
}
