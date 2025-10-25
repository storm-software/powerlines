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

import type { LogLevelLabel } from "@storm-software/config-tools/types";
import type { NonUndefined } from "@stryke/types/base";
import type { TypeDefinition } from "@stryke/types/configuration";
import type { AssetGlob } from "@stryke/types/file";
import type { ResolvedPreviewOptions } from "vite";
import type { BuildVariant } from "./build";
import type {
  BabelUserConfig,
  EnvironmentConfig,
  ESBuildUserConfig,
  FarmUserConfig,
  InlineConfig,
  OutputConfig,
  RolldownUserConfig,
  RollupUserConfig,
  RspackUserConfig,
  TsupUserConfig,
  UnbuildUserConfig,
  UserConfig,
  ViteUserConfig,
  WebpackUserConfig
} from "./config";

export interface ResolvedEntryTypeDefinition extends TypeDefinition {
  /**
   * The user provided entry point in the source code
   */
  input: TypeDefinition;

  /**
   * An optional name to use in the package export during the build process
   */
  output?: string;
}

export type BabelResolvedConfig = Omit<BabelUserConfig, "plugins" | "presets"> &
  Required<Pick<BabelUserConfig, "plugins" | "presets">>;

export type EnvironmentResolvedConfig = Omit<
  EnvironmentConfig,
  "consumer" | "mode" | "ssr" | "preview" | "mainFields" | "extensions"
> &
  Required<
    Pick<
      EnvironmentConfig,
      "consumer" | "mode" | "ssr" | "mainFields" | "extensions"
    >
  > & {
    /**
     * The name of the environment
     */
    name: string;

    /**
     * Configuration options for the preview server
     */
    preview?: ResolvedPreviewOptions;
  };

export type ResolvedAssetGlob = AssetGlob & Required<Pick<AssetGlob, "input">>;

export type OutputResolvedConfig = Required<
  Omit<OutputConfig, "assets"> & {
    assets: ResolvedAssetGlob[];
  }
>;

/**
 * The resolved options for the Powerlines project configuration.
 */
export type ResolvedConfig<TUserConfig extends UserConfig = UserConfig> = Omit<
  TUserConfig,
  | "name"
  | "title"
  | "plugins"
  | "mode"
  | "environments"
  | "platform"
  | "tsconfig"
  | "lint"
  | "test"
  | "build"
  | "transform"
  | "override"
  | "root"
  | "variant"
  | "type"
  | "output"
  | "logLevel"
  | "framework"
> &
  Required<
    Pick<
      TUserConfig,
      | "name"
      | "title"
      | "plugins"
      | "mode"
      | "environments"
      | "tsconfig"
      | "lint"
      | "test"
      | "build"
      | "transform"
      | "override"
      | "framework"
    >
  > & {
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
     * The root directory of the project's source code
     *
     * @defaultValue "\{projectRoot\}/src"
     */
    sourceRoot: NonUndefined<TUserConfig["sourceRoot"]>;

    /**
     * The root directory of the project.
     */
    projectRoot: NonUndefined<TUserConfig["root"]>;

    /**
     * The type of project being built.
     */
    projectType: NonUndefined<TUserConfig["type"]>;

    /**
     * The output configuration options to use for the build process
     */
    output: OutputResolvedConfig;

    /**
     * The log level to use for the Powerlines processes.
     *
     * @defaultValue "info"
     */
    logLevel: LogLevelLabel | null;
  };

export type ViteResolvedConfig = ResolvedConfig<ViteUserConfig>;

export type WebpackResolvedConfig = ResolvedConfig<WebpackUserConfig>;

export type RspackResolvedConfig = ResolvedConfig<RspackUserConfig>;

export type ESBuildResolvedConfig = ResolvedConfig<ESBuildUserConfig>;

export type RollupResolvedConfig = ResolvedConfig<RollupUserConfig>;

export type RolldownResolvedConfig = ResolvedConfig<RolldownUserConfig>;

export type TsupResolvedConfig = ResolvedConfig<TsupUserConfig>;

export type UnbuildResolvedConfig = ResolvedConfig<UnbuildUserConfig>;

export type FarmResolvedConfig = ResolvedConfig<FarmUserConfig>;

export type InferResolvedConfig<
  TBuildVariant extends BuildVariant | undefined
> = TBuildVariant extends undefined
  ? ResolvedConfig
  : TBuildVariant extends "webpack"
    ? WebpackResolvedConfig
    : TBuildVariant extends "rspack"
      ? RspackResolvedConfig
      : TBuildVariant extends "vite"
        ? ViteResolvedConfig
        : TBuildVariant extends "esbuild"
          ? ESBuildResolvedConfig
          : TBuildVariant extends "unbuild"
            ? UnbuildResolvedConfig
            : TBuildVariant extends "tsup"
              ? TsupResolvedConfig
              : TBuildVariant extends "rolldown"
                ? RolldownResolvedConfig
                : TBuildVariant extends "rollup"
                  ? RollupResolvedConfig
                  : TBuildVariant extends "farm"
                    ? FarmResolvedConfig
                    : ResolvedConfig;
