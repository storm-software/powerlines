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

import type { transformAsync } from "@babel/core";
import type { Format } from "@storm-software/build-tools/types";
import type { LogLevelLabel } from "@storm-software/config-tools/types";
import type { StormWorkspaceConfig } from "@storm-software/config/types";
import type { DeepPartial, MaybePromise } from "@stryke/types/base";
import type { TypeDefinitionParameter } from "@stryke/types/configuration";
import type { AssetGlob } from "@stryke/types/file";
import type { ConfigLayer, ResolvedConfig as ParsedConfig } from "c12";
import type {
  ResolvedConfig as ExternalViteResolvedConfig,
  PreviewOptions
} from "vite";
import type { BabelTransformPluginOptions } from "./babel";
import type {
  BuildConfig,
  BuildResolvedConfig,
  BuildVariant,
  ESBuildBuildConfig,
  ESBuildResolvedBuildConfig,
  FarmBuildConfig,
  FarmResolvedBuildConfig,
  RolldownBuildConfig,
  RolldownResolvedBuildConfig,
  RollupBuildConfig,
  RollupResolvedBuildConfig,
  RspackBuildConfig,
  RspackResolvedBuildConfig,
  TsupBuildConfig,
  TsupResolvedBuildConfig,
  UnbuildBuildConfig,
  UnbuildResolvedBuildConfig,
  ViteBuildConfig,
  ViteResolvedBuildConfig,
  WebpackBuildConfig,
  WebpackResolvedBuildConfig
} from "./build";
import type { PluginContext } from "./context";
import type { Plugin } from "./plugin";
import type { TSConfig } from "./tsconfig";
import type { OutputModeType } from "./vfs";

export type LogFn = (type: LogLevelLabel, ...args: string[]) => void;

/**
 * The {@link StormWorkspaceConfig | configuration} object for an entire Powerlines workspace
 */
export type WorkspaceConfig = Partial<StormWorkspaceConfig> &
  Required<Pick<StormWorkspaceConfig, "workspaceRoot">>;

export type PluginFactory<
  in out TContext extends PluginContext = PluginContext,
  TOptions = any
> = (options: TOptions) => MaybePromise<Plugin<TContext>>;

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
  | Promise<Plugin<TContext>>
  | PluginConfigTuple<TContext>
  | PluginConfigObject<TContext>;

export type PartialPlugin<
  in out TContext extends PluginContext = PluginContext
> = DeepPartial<Plugin<TContext>>;

export type PartialPluginFactory<
  in out TContext extends PluginContext = PluginContext,
  TOptions = any
> = (options: TOptions) => MaybePromise<PartialPlugin<TContext>>;

export type ProjectType = "application" | "library";

export type BabelUserConfig = Parameters<typeof transformAsync>[1] & {
  /**
   * The Babel plugins to be used during the build process
   */
  plugins?: BabelTransformPluginOptions[];

  /**
   * The Babel presets to be used during the build process
   */
  presets?: BabelTransformPluginOptions[];
};

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
  distPath?: string;

  /**
   * The format of the output files
   *
   * @defaultValue "virtual"
   */
  mode?: OutputModeType;

  /**
   * The path of the generated runtime declaration file relative to the workspace root.
   *
   * @defaultValue "\{projectRoot\}/powerlines.d.ts"
   */
  dts?: string | false;

  /**
   * A prefix to use for identifying builtin modules
   *
   * @remarks
   * This prefix will be used to identify all builtin modules generated during the "prepare" phase. An example builtin ID for a module called `"utils"` would be `"{builtinPrefix}:utils"`.
   *
   * @defaultValue "powerlines"
   */
  builtinPrefix?: string;

  /**
   * The folder where the generated runtime artifacts will be located
   *
   * @remarks
   * This folder will contain all runtime artifacts and builtins generated during the "prepare" phase.
   *
   * @defaultValue "\{projectRoot\}/.powerlines"
   */
  artifactsFolder?: string;

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
   * A list of assets to copy to the output directory
   *
   * @remarks
   * The assets can be specified as a string (path to the asset) or as an object with a `glob` property (to match multiple files). The paths are relative to the project root directory.
   */
  assets?: Array<string | AssetGlob>;
}

export interface BaseConfig {
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
   * The log level to use for the Powerlines processes.
   *
   * @defaultValue "info"
   */
  logLevel?: LogLevelLabel | null;

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
   * The entry point(s) for the application
   */
  entry?: TypeDefinitionParameter | TypeDefinitionParameter[];

  /**
   * Configuration for the output of the build process
   */
  output?: OutputConfig;

  /**
   * Configuration for linting the source code
   *
   * @remarks
   * If set to `false`, linting will be disabled.
   */
  lint?: Record<string, any> | false;

  /**
   * Configuration for testing the source code
   *
   * @remarks
   * If set to `false`, testing will be disabled.
   */
  test?: Record<string, any> | false;

  /**
   * Configuration for the transformation of the source code
   */
  transform?: Record<string, any>;

  /**
   * Configuration provided to build processes
   *
   * @remarks
   * This configuration can be used by plugins during the `build` command. It will generally contain options specific to the selected {@link BuildVariant | build variant}.
   */
  build?: BuildConfig;

  /**
   * Configuration for documentation generation
   *
   * @remarks
   * This configuration will be used by the documentation generation plugins during the `docs` command.
   */
  docs?: Record<string, any>;

  /**
   * Configuration for deploying the source code
   *
   * @remarks
   * If set to `false`, the deployment will be disabled.
   */
  deploy?: Record<string, any> | false;

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

export interface CommonUserConfig extends BaseConfig {
  /**
   * The type of project being built
   *
   * @defaultValue "application"
   */
  type?: ProjectType;

  /**
   * The root directory of the project
   */
  root: string;

  /**
   * The root directory of the project's source code
   *
   * @defaultValue "\{root\}/src"
   */
  sourceRoot?: string;

  /**
   * A path to a custom configuration file to be used instead of the default `storm.json`, `powerlines.config.js`, or `powerlines.config.ts` files.
   *
   * @remarks
   * This option is useful for running Powerlines commands with different configuration files, such as in CI/CD environments or when testing different configurations.
   */
  configFile?: string;

  /**
   * Should the Powerlines CLI processes skip installing missing packages?
   *
   * @remarks
   * This option is useful for CI/CD environments where the installation of packages is handled by a different process.
   *
   * @defaultValue false
   */
  skipInstalls?: boolean;

  /**
   * Should the compiler processes skip any improvements that make use of cache?
   *
   * @defaultValue false
   */
  skipCache?: boolean;

  /**
   * A list of resolvable paths to plugins used during the build process
   */
  plugins?: PluginConfig<PluginContext<any>>[];

  /**
   * Environment-specific configurations
   */
  environments?: Record<string, EnvironmentConfig>;

  /**
   * A string identifier that allows a child framework or tool to identify itself when using Powerlines.
   *
   * @remarks
   * If no values are provided for {@link OutputConfig.dts | output.dts}, {@link OutputConfig.builtinPrefix | output.builtinPrefix}, or {@link OutputConfig.artifactsFolder | output.artifactsFolder}, this value will be used as the default.
   *
   * @defaultValue "powerlines"
   */
  framework?: string;
}

export type UserConfig<
  TBuildConfig extends BuildConfig = BuildConfig,
  TBuildResolvedConfig extends BuildResolvedConfig = BuildResolvedConfig,
  TBuildVariant extends string = any
> = Omit<CommonUserConfig, "build"> & {
  /**
   * Configuration provided to build processes
   *
   * @remarks
   * This configuration can be used by plugins during the `build` command. It will generally contain options specific to the selected {@link BuildVariant | build variant}.
   */
  build: Omit<TBuildConfig, "override"> & {
    /**
     * The build variant being used by the Powerlines engine.
     */
    variant?: TBuildVariant;

    /**
     * An optional set of override options to apply to the selected build variant.
     *
     * @remarks
     * This option allows you to provide configuration options with the guarantee that they will **not** be overridden and will take precedence over other build configurations.
     */
    override?: Partial<TBuildResolvedConfig>;
  };
};

export type WebpackUserConfig = UserConfig<
  WebpackBuildConfig,
  WebpackResolvedBuildConfig,
  "webpack"
>;

export type RspackUserConfig = UserConfig<
  RspackBuildConfig,
  RspackResolvedBuildConfig,
  "rspack"
>;

export type RollupUserConfig = UserConfig<
  RollupBuildConfig,
  RollupResolvedBuildConfig,
  "rollup"
>;

export type RolldownUserConfig = UserConfig<
  RolldownBuildConfig,
  RolldownResolvedBuildConfig,
  "rolldown"
>;

export type ViteUserConfig = UserConfig<
  ViteBuildConfig,
  ViteResolvedBuildConfig,
  "vite"
>;

export type ESBuildUserConfig = UserConfig<
  ESBuildBuildConfig,
  ESBuildResolvedBuildConfig,
  "esbuild"
>;

export type UnbuildUserConfig = UserConfig<
  UnbuildBuildConfig,
  UnbuildResolvedBuildConfig,
  "unbuild"
>;

export type TsupUserConfig = UserConfig<
  TsupBuildConfig,
  TsupResolvedBuildConfig,
  "tsup"
>;

export type FarmUserConfig = UserConfig<
  FarmBuildConfig,
  FarmResolvedBuildConfig,
  "farm"
>;

export type InferUserConfig<TBuildVariant extends BuildVariant | undefined> =
  TBuildVariant extends "webpack"
    ? WebpackUserConfig
    : TBuildVariant extends "rspack"
      ? RspackUserConfig
      : TBuildVariant extends "vite"
        ? ViteUserConfig
        : TBuildVariant extends "esbuild"
          ? ESBuildUserConfig
          : TBuildVariant extends "unbuild"
            ? UnbuildUserConfig
            : TBuildVariant extends "tsup"
              ? TsupUserConfig
              : TBuildVariant extends "rolldown"
                ? RolldownUserConfig
                : TBuildVariant extends "rollup"
                  ? RollupUserConfig
                  : TBuildVariant extends "farm"
                    ? FarmUserConfig
                    : UserConfig;

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

export type AnyUserConfig = Record<string, any> &
  (
    | Partial<UserConfig>
    | Partial<WebpackUserConfig>
    | Partial<RspackUserConfig>
    | Partial<ViteUserConfig>
    | Partial<ESBuildUserConfig>
    | Partial<UnbuildUserConfig>
    | Partial<TsupUserConfig>
    | Partial<RolldownUserConfig>
    | Partial<RollupUserConfig>
    | Partial<FarmUserConfig>
  );

export type UserConfigFnObject = (env: ConfigEnv) => DeepPartial<UserConfig>;
export type UserConfigFnPromise = (
  env: ConfigEnv
) => Promise<DeepPartial<UserConfig>>;
export type UserConfigFn = (
  env: ConfigEnv
) => UserConfig | Promise<DeepPartial<UserConfig>>;

export type UserConfigExport =
  | DeepPartial<UserConfig>
  | Promise<DeepPartial<UserConfig>>
  | UserConfigFnObject
  | UserConfigFnPromise
  | UserConfigFn;
