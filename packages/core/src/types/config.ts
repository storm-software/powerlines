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

import type { Format } from "@storm-software/build-tools/types";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import type { StormWorkspaceConfig } from "@storm-software/config/types";
import type {
  DeepPartial,
  MaybePromise,
  NonUndefined
} from "@stryke/types/base";
import { TypeDefinition } from "@stryke/types/configuration";
import type { AssetGlob } from "@stryke/types/file";
import type { ConfigLayer, ResolvedConfig as ParsedConfig } from "c12";
import { CompatibilityDates, CompatibilityDateSpec } from "compatx";
import type {
  ResolvedConfig as ExternalViteResolvedConfig,
  PreviewOptions,
  ResolvedPreviewOptions
} from "vite";

import type { PluginContext } from "./context";
import { StoragePort, StoragePreset } from "./fs";
import type { Plugin } from "./plugin";
import type { TSConfig } from "./tsconfig";

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export type LogFn = (type: LogLevelLabel, ...args: string[]) => void;

/**
 * The {@link StormWorkspaceConfig | configuration} object for an entire Powerlines workspace
 */
export type WorkspaceConfig = Partial<StormWorkspaceConfig> &
  Required<Pick<StormWorkspaceConfig, "workspaceRoot">>;

export type PluginFactory<
  in out TContext extends PluginContext = PluginContext,
  TOptions = any
> = (options: TOptions) => MaybePromise<Plugin<TContext> | Plugin<TContext>[]>;

/**
 * A configuration tuple for a Powerlines plugin.
 */
export type PluginConfigTuple<
  TContext extends PluginContext = PluginContext,
  TOptions = any
> = [string | PluginFactory<TContext, TOptions>, TOptions] | [Plugin<TContext>];

/**
 * A configuration object for a Powerlines plugin.
 */
export type PluginConfigObject<
  TContext extends PluginContext = PluginContext,
  TOptions = any
> =
  | {
      plugin: string | PluginFactory<TContext, TOptions>;
      options: TOptions;
    }
  | {
      plugin: Plugin<TContext>;
      options?: never;
    };

/**
 * A configuration tuple for a Powerlines plugin.
 */
export type PluginConfig<TContext extends PluginContext = PluginContext> =
  | string
  | PluginFactory<TContext, void>
  | Plugin<TContext>
  | PluginConfigTuple<TContext>
  | PluginConfigObject<TContext>
  | Promise<PluginConfig<TContext>>
  | PluginConfig<TContext>[];

export type PartialPlugin<TContext extends PluginContext = PluginContext> =
  DeepPartial<Plugin<TContext>>;

export type PartialPluginFactory<
  in out TContext extends PluginContext = PluginContext,
  TOptions = any
> = (
  options: TOptions
) => MaybePromise<PartialPlugin<TContext> | PartialPlugin<TContext>[]>;

export type ProjectType = "application" | "library";

/**
 * The configuration options for resolving modules in a Powerlines project.
 */
export interface ResolveConfig {
  /**
   * List of fields in `package.json` to try when resolving a package's entry point. Note this takes lower precedence than conditional exports resolved from the exports field: if an entry point is successfully resolved from exports, the main field will be ignored.
   *
   * @defaultValue `["browser", "module", "jsnext:main", "jsnext"]`
   *
   * @see https://vite.dev/config/shared-options#resolve-mainfields
   */
  mainFields?: string[];

  /**
   * Array of strings indicating what conditions should be allowed when resolving [conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports) from a package.
   *
   * @defaultValue `["import", "require", "default"]`
   *
   * @see https://vite.dev/config/shared-options#resolve-conditions
   */
  conditions?: string[];

  /**
   * List of file extensions to try for imports that omit extensions. Note it is NOT recommended to omit extensions for custom import types (e.g. .vue) since it can interfere with IDE and type support.
   *
   * @defaultValue `[".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"]`
   *
   * @see https://vite.dev/config/shared-options#resolve-extensions
   */
  extensions?: string[];

  /**
   * Array of strings indicating what modules should be deduplicated to a single version in the build.
   *
   * @remarks
   * This option is useful for ensuring that only one version of a module is included in the bundle, which can help reduce bundle size and avoid conflicts. If you have duplicated copies of the same dependency in your app (likely due to hoisting or linked packages in monorepos), use this option to force Powerlines to always resolve listed dependencies to the same copy (from project root).
   *
   * @see https://vite.dev/config/shared-options#resolve-dedupe
   */
  dedupe?: string[];

  /**
   * The alias mappings to use for module resolution during the build process.
   *
   * @remarks
   * This option allows you to define custom path aliases for modules, which can be useful for simplifying imports and managing dependencies.
   *
   * @example
   * ```ts
   * {
   *   alias: {
   *     "@utils": "./src/utils",
   *     "@components": "./src/components"
   *   }
   * }
   * ```
   *
   * @see https://vite.dev/config/shared-options#resolve-alias
   * @see https://github.com/rollup/plugins/tree/master/packages/alias
   */
  alias?:
    | Record<string, string>
    | Array<{
        find: string | RegExp;
        replacement: string;
      }>;

  /**
   * Enabling this setting causes Powerlines to determine file identity by the original file path (i.e. the path without following symlinks) instead of the real file path (i.e. the path after following symlinks).
   *
   * @defaultValue false
   *
   * @see https://esbuild.github.io/api/#preserve-symlinks
   * @see https://rollupjs.org/configuration-options/#preservesymlinks
   * @see https://webpack.js.org/configuration/resolve/#resolvesymlinks
   * @see https://rolldown.rs/reference/InputOptions.resolve#symlinks
   * @see https://vite.dev/config/shared-options#resolve-preservesymlinks
   */
  preserveSymlinks?: boolean;

  /**
   * A list of modules that should not be bundled, even if they are external dependencies.
   *
   * @remarks
   * This option is useful for excluding specific modules from the bundle, such as Node.js built-in modules or other libraries that should not be bundled.
   */
  external?: (string | RegExp)[];

  /**
   * A list of modules that should always be bundled, even if they are external dependencies.
   */
  noExternal?: (string | RegExp)[];

  /**
   * Should the Powerlines CLI processes skip bundling the `node_modules` directory?
   */
  skipNodeModulesBundle?: boolean;
}

export interface OutputConfig {
  /**
   * The path to output the final compiled files to
   *
   * @remarks
   * If a value is not provided, Powerlines will attempt to:
   * 1. Use the `outDir` value in the `tsconfig.json` file.
   * 2. Use the `dist` directory in the project root directory.
   *
   * @defaultValue "dist/\{projectRoot\}"
   */
  outputPath?: string;

  /**
   * The output directory path for the project build.
   *
   * @remarks
   * This path is used to determine where the built files will be placed after the build process completes. This will be used in scenarios where the monorepo uses TSConfig paths to link packages together.
   *
   * @defaultValue "\{projectRoot\}/dist"
   */
  buildPath?: string;

  /**
   * The folder where the generated runtime artifacts will be located
   *
   * @remarks
   * This folder will contain all runtime artifacts and builtins generated during the "prepare" phase.
   *
   * @defaultValue "\{projectRoot\}/.powerlines"
   */
  artifactsPath?: string;

  /**
   * The path of the generated runtime declaration file relative to the workspace root.
   *
   * @defaultValue "\{projectRoot\}/powerlines.d.ts"
   */
  dts?: string | false;

  /**
   * The module format of the output files
   *
   * @remarks
   * This option can be a single format or an array of formats. If an array is provided, multiple builds will be generated for each format.
   *
   * @defaultValue "esm"
   */
  format?: Format | Format[];

  /**
   * Generate source maps for the output files
   *
   * @remarks
   * This option can be a boolean or a string specifying the type of source map to generate. If set to `true`, external source maps will be generated. If set to `"inline"`, source maps will be included in the output files as data URIs. If set to `"hidden"`, external source maps will be generated but not referenced in the output files.
   */
  sourceMap?: boolean | "inline" | "hidden";

  /**
   * A list of assets to copy to the output directory
   *
   * @remarks
   * The assets can be specified as a string (path to the asset) or as an object with a `glob` property (to match multiple files). The paths are relative to the project root directory.
   */
  assets?: Array<string | AssetGlob>;

  /**
   * A string preset or a custom {@link StoragePort} to provide fine-grained control over generated/output file storage.
   *
   * @remarks
   * If a string preset is provided, it must be one of the following values:
   * - `"virtual"`: Uses the local file system for storage.
   * - `"fs"`: Uses an in-memory virtual file system for storage.
   *
   * If a custom {@link StoragePort} is provided, it will be used for all file storage operations during the build process.
   *
   * @defaultValue "virtual"
   */
  storage?: StoragePort | StoragePreset;
}

export interface BaseConfig {
  /**
   * Defines entries and location(s) of entry modules for the bundle. Relative paths are resolved based on the `root` option.
   */
  input:
    | string
    | RegExp
    | TypeDefinition
    | (string | RegExp | TypeDefinition)[]
    | Record<
        string,
        string | RegExp | TypeDefinition | (string | RegExp | TypeDefinition)[]
      >;

  /**
   * Configuration for the output files generated by processing the source code
   */
  output?: OutputConfig;

  /**
   * Configuration for module resolution during processing of the source code
   */
  resolve?: ResolveConfig;

  /**
   * The platform to build the project for
   *
   * @defaultValue "neutral"
   */
  platform?: "node" | "browser" | "neutral";

  /**
   * Define global constant replacements. Entries will be defined as globals during dev and statically replaced during build.
   *
   * @remarks
   * This option allows you to specify global constants that will be replaced in the code during the build process. It is similar to the `define` option in esbuild and Vite, enabling you to replace specific identifiers with constant expressions at build time.
   *
   * @example
   * ```ts
   * {
   *   define: {
   *     __VERSION__: '"1.0.0"',
   *     __DEV__: 'process.env.NODE_ENV !== "production"'
   *   }
   * }
   * ```
   *
   * @see https://esbuild.github.io/api/#define
   * @see https://vitejs.dev/config/build-options.html#define
   * @see https://github.com/rollup/plugins/tree/master/packages/replace
   */
  define?: Record<string, any>;

  /**
   * Global variables that will have import statements injected where necessary
   *
   * @remarks
   * This option allows you to specify global variables that should be automatically imported from specified modules whenever they are used in the code. This is particularly useful for polyfilling Node.js globals in a browser environment.
   *
   * @example
   * ```ts
   * {
   *   inject: {
   *     process: 'process/browser',
   *     Buffer: ['buffer', 'Buffer'],
   *   }
   * }
   * ```
   *
   * @see https://github.com/rollup/plugins/tree/master/packages/inject
   */
  inject?: Record<string, string | string[]>;

  /**
   * The path to the tsconfig file to be used by the compiler
   *
   * @remarks
   * If a value is not provided, the plugin will attempt to find the `tsconfig.json` file in the project root directory. The parsed tsconfig compiler options will be merged with the {@link Options.tsconfigRaw} value (if provided).
   *
   * @defaultValue "\{projectRoot\}/tsconfig.json"
   */
  tsconfig?: string;

  /**
   * The raw {@link TSConfig} object to be used by the compiler. This object will be merged with the `tsconfig.json` file.
   *
   * @see https://www.typescriptlang.org/tsconfig
   *
   * @remarks
   * If populated, this option takes higher priority than `tsconfig`
   */
  tsconfigRaw?: TSConfig;
}

export interface EnvironmentConfig extends BaseConfig {
  /**
   * Configuration options for the preview server
   */
  preview?: PreviewOptions;

  /**
   * A flag indicating whether the build is for a Server-Side Rendering environment.
   */
  ssr?: boolean;

  /**
   * Define if this environment is used for Server-Side Rendering
   *
   * @defaultValue "server" (if it isn't the client environment)
   */
  consumer?: "client" | "server";
}

export interface UserConfig extends BaseConfig {
  /**
   * The root directory of the project
   */
  root: string;

  /**
   * The name of the project
   */
  name?: string;

  /**
   * The project display title
   *
   * @remarks
   * This option is used in documentation generation and other places where a human-readable title is needed.
   */
  title?: string;

  /**
   * A description of the project
   *
   * @remarks
   * If this option is not provided, the build process will try to use the \`description\` value from the `\package.json\` file.
   */
  description?: string;

  /**
   * The organization or author of the project
   *
   * @remarks
   * If this option is not provided, the build process will try to use the \`author\` value from the \`package.json\` file. If the \`author\` value cannot be determined, the {@link name | name configuration} will be used.
   */
  organization?: string;

  /**
   * The date to use for compatibility checks
   *
   * @remarks
   * This date can be used by plugins and build processes to determine compatibility with certain features or APIs. It is recommended to set this date to the date when the project was last known to be compatible with the desired features or APIs. If no value is provided, the latest compatibility date will be used.
   *
   * @see https://developers.cloudflare.com/pages/platform/compatibility-dates/
   * @see https://docs.netlify.com/configure-builds/get-started/#set-a-compatibility-date
   * @see https://github.com/unjs/compatx
   */
  compatibilityDate?: CompatibilityDateSpec;

  /**
   * The log level to use for the Powerlines processes.
   *
   * @defaultValue "info"
   */
  logLevel?: LogLevel | null;

  /**
   * A custom logger function to use for logging messages
   */
  customLogger?: LogFn;

  /**
   * Explicitly set a mode to run in. This mode will be used at various points throughout the Powerlines processes, such as when compiling the source code.
   *
   * @defaultValue "production"
   */
  mode?: "development" | "test" | "production";

  /**
   * The type of project being built
   *
   * @defaultValue "application"
   */
  projectType?: ProjectType;

  /**
   * A path to a custom configuration file to be used instead of the default `storm.json`, `powerlines.config.js`, or `powerlines.config.ts` files.
   *
   * @remarks
   * This option is useful for running Powerlines commands with different configuration files, such as in CI/CD environments or when testing different configurations.
   */
  configFile?: string;

  /**
   * Should the Powerlines processes automatically install missing package dependencies?
   *
   * @remarks
   * When set to `true`, Powerlines will attempt to install any missing dependencies using the package manager detected in the project (e.g., npm, yarn, pnpm). This can be useful for ensuring that all required packages are available during the build and preparation phases.
   *
   * @defaultValue false
   */
  autoInstall?: boolean;

  /**
   * Should the compiler processes skip any improvements that make use of cache?
   *
   * @defaultValue false
   */
  skipCache?: boolean;

  /**
   * A list of resolvable paths to plugins used during the build process
   */
  plugins?: PluginConfig<any>[];

  /**
   * Environment-specific configurations
   */
  environments?: Record<string, EnvironmentConfig>;

  /**
   * Should a single `build` process be ran for each environment?
   *
   * @remarks
   * This option determines how environments are managed during the `build` process. The available options are:
   *
   * - `false`: A separate build is ran for each environment.
   * - `true`: A single build is ran for all environments.
   *
   * @defaultValue false
   */
  singleBuild?: boolean;

  /**
   * A string identifier that allows a child framework or tool to identify itself when using Powerlines.
   *
   * @remarks
   * If no values are provided for {@link OutputConfig.dts | output.dts} or {@link OutputConfig.artifactsPath | output.artifactsFolder}, this value will be used as the default.
   *
   * @defaultValue "powerlines"
   */
  framework?: string;
}

export type InitialUserConfig<TUserConfig extends UserConfig = UserConfig> =
  Partial<TUserConfig> & { root: string };

export type ParsedUserConfig<TUserConfig extends UserConfig = UserConfig> =
  TUserConfig &
    ParsedConfig<TUserConfig> & {
      /**
       * The path to the user configuration file, if it exists.
       *
       * @remarks
       * This is typically the `powerlines.json`, `powerlines.config.js`, or `powerlines.config.ts` file in the project root.
       */
      configFile?: ConfigLayer<TUserConfig>["configFile"];
    };

export type PowerlinesCommand =
  | "new"
  | "prepare"
  | "build"
  | "lint"
  | "test"
  | "docs"
  | "deploy"
  | "clean";

/**
 * The configuration provided while executing Powerlines commands.
 */
export type InlineConfig<TUserConfig extends UserConfig = UserConfig> =
  Partial<TUserConfig> & {
    /**
     * A string identifier for the Powerlines command being executed
     */
    command: PowerlinesCommand;
  };

export type NewInlineConfig<TUserConfig extends UserConfig = UserConfig> =
  InlineConfig<TUserConfig> &
    Required<Pick<InlineConfig<TUserConfig>, "root">> & {
      /**
       * A string identifier for the Powerlines command being executed
       */
      command: "new";

      /**
       * The package name (from the \`package.json\`) for the project that will be used in the \`new\` command to create a new project based on this configuration
       */
      packageName?: string;
    };

export type CleanInlineConfig<TUserConfig extends UserConfig = UserConfig> =
  InlineConfig<TUserConfig> & {
    /**
     * A string identifier for the Powerlines command being executed
     */
    command: "clean";
  };

export type PrepareInlineConfig<TUserConfig extends UserConfig = UserConfig> =
  InlineConfig<TUserConfig> & {
    /**
     * A string identifier for the Powerlines command being executed
     */
    command: "prepare";
  };

export type BuildInlineConfig<TUserConfig extends UserConfig = UserConfig> =
  InlineConfig<TUserConfig> & {
    /**
     * A string identifier for the Powerlines command being executed
     */
    command: "build";
  };

export type LintInlineConfig<TUserConfig extends UserConfig = UserConfig> =
  InlineConfig<TUserConfig> & {
    /**
     * A string identifier for the Powerlines command being executed
     */
    command: "lint";
  };

export type DocsInlineConfig<TUserConfig extends UserConfig = UserConfig> =
  InlineConfig<TUserConfig> & {
    /**
     * A string identifier for the Powerlines command being executed
     */
    command: "docs";
  };

export type DeployInlineConfig<TUserConfig extends UserConfig = UserConfig> =
  InlineConfig<TUserConfig> & {
    /**
     * A string identifier for the Powerlines command being executed
     */
    command: "deploy";
  };

export type ConfigEnv = Pick<
  ExternalViteResolvedConfig,
  "command" | "mode" | "environments" | "preview"
>;

/**
 * The configuration options for a Powerlines project, after being resolved and normalized by the configuration loading process.
 *
 * @remarks
 * This type represents the final shape of the configuration object that will be used throughout the Powerlines processes. It includes all default values, resolved paths, and normalized options. It is expected to be used in `powerlines.config.ts` files and by plugins and build processes to access the configuration options in a consistent format.
 */
export type AnyUserConfig = Partial<Omit<UserConfig, "output" | "resolve">> & {
  /**
   * The output configuration options to use for the build process
   */
  output?: Partial<OutputConfig>;

  /**
   * Configuration for module resolution during processing of the source code
   */
  resolve?: Partial<ResolveConfig>;
} & Record<string, any>;

export interface ResolvedEntryTypeDefinition extends TypeDefinition {
  /**
   * The user provided entry point in the source code
   */
  input?: TypeDefinition;

  /**
   * An optional name to use in the package export during the build process
   */
  output?: string;
}

export type EnvironmentResolvedConfig = Omit<
  EnvironmentConfig,
  "consumer" | "ssr" | "preview"
> &
  Required<Pick<EnvironmentConfig, "consumer" | "ssr">> & {
    /**
     * The name of the environment
     */
    name: string;

    /**
     * Configuration options for the preview server
     */
    preview?: ResolvedPreviewOptions;
  };

/**
 * The configuration options for resolving modules in a Powerlines project.
 */
export type ResolveResolvedConfig = Required<
  Omit<ResolveConfig, "external" | "noExternal">
> & {
  /**
   * A list of modules that should not be bundled, even if they are external dependencies.
   *
   * @remarks
   * This option is useful for excluding specific modules from the bundle, such as Node.js built-in modules or other libraries that should not be bundled.
   */
  external?: string[];

  /**
   * A list of modules that should always be bundled, even if they are external dependencies.
   */
  noExternal?: string[];
};

export type ResolvedAssetGlob = AssetGlob & Required<Pick<AssetGlob, "input">>;

export type OutputResolvedConfig = Required<
  Omit<OutputConfig, "assets" | "storage"> & {
    assets: ResolvedAssetGlob[];
  }
> &
  Pick<OutputConfig, "storage">;

/**
 * The resolved options for the Powerlines project configuration.
 */
export type ResolvedConfig<TUserConfig extends UserConfig = UserConfig> = Omit<
  TUserConfig,
  | "root"
  | "name"
  | "title"
  | "organization"
  | "compatibilityDate"
  | "plugins"
  | "mode"
  | "environments"
  | "tsconfig"
  | "platform"
  | "projectType"
  | "input"
  | "output"
  | "resolve"
  | "logLevel"
  | "framework"
> &
  Required<
    Pick<
      TUserConfig,
      | "root"
      | "name"
      | "title"
      | "organization"
      | "compatibilityDate"
      | "plugins"
      | "mode"
      | "environments"
      | "input"
      | "tsconfig"
      | "platform"
      | "projectType"
      | "framework"
    >
  > & {
    /**
     * The output configuration options to use for the build process
     */
    output: OutputResolvedConfig;

    /**
     * Configuration for module resolution during processing of the source code
     */
    resolve: ResolveResolvedConfig;

    /**
     * The date to use for compatibility checks
     *
     * @remarks
     * This date can be used by plugins and build processes to determine compatibility with certain features or APIs. It is recommended to set this date to the date when the project was last known to be compatible with the desired features or APIs.
     *
     * @see https://developers.cloudflare.com/pages/platform/compatibility-dates/
     * @see https://docs.netlify.com/configure-builds/get-started/#set-a-compatibility-date
     * @see https://github.com/unjs/compatx
     */
    compatibilityDate: CompatibilityDates;

    /**
     * The configuration options that were provided inline to the Powerlines CLI.
     */
    inlineConfig: InlineConfig<TUserConfig>;

    /**
     * The original configuration options that were provided by the user to the Powerlines process.
     */
    userConfig: TUserConfig;

    /**
     * A string identifier for the Powerlines command being executed.
     */
    command: NonUndefined<InlineConfig<TUserConfig>["command"]>;

    /**
     * The log level to use for the Powerlines processes.
     *
     * @defaultValue "info"
     */
    logLevel: LogLevel | null;
  };
