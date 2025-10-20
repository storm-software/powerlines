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

import type { UserConfig as ExternalFarmOptions } from "@farmfe/core";
import type { Configuration as ExternalRspackOptions } from "@rspack/core";
import type { ESBuildOptions as ExternalTsupOptions } from "@storm-software/esbuild/types";
import type { UnbuildOptions as ExternalUnbuildOptions } from "@storm-software/unbuild/types";
import type { BuildOptions as ExternalESBuildOptions } from "esbuild";
import type {
  RolldownOptions as ExternalRolldownOptions,
  RolldownOutput as ExternalRolldownOutputOptions
} from "rolldown";
import type {
  RollupOptions as ExternalRollupOptions,
  OutputOptions as ExternalRollupOutputOptions
} from "rollup";
import type { UserConfig as ExternalViteUserConfig } from "vite";
import type { Configuration as ExternalWebpackOptions } from "webpack";

export type UnpluginBuildVariant =
  | "rollup"
  | "webpack"
  | "rspack"
  | "vite"
  | "esbuild"
  | "farm"
  | "unloader"
  | "rolldown";

export type BuildVariant = UnpluginBuildVariant | "tsup" | "unbuild";

export type InferUnpluginVariant<TBuildVariant extends BuildVariant> =
  TBuildVariant extends "tsup"
    ? "esbuild"
    : TBuildVariant extends "unbuild"
      ? "rollup"
      : TBuildVariant;

export interface BuildConfig {
  /**
   * The platform to build the project for
   *
   * @defaultValue "neutral"
   */
  platform?: "node" | "browser" | "neutral";

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
   */
  alias?: Record<string, string>;

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

  /**
   * Should the Powerlines processes skip the `"prepare"` task prior to building?
   *
   * @defaultValue false
   */
  skipPrepare?: boolean;
}
export type BuildResolvedConfig = BuildConfig;

// ESBuild
export type ESBuildBuildConfig = Omit<
  ExternalESBuildOptions,
  | "entryPoints"
  | "sourceRoot"
  | "platform"
  | "outdir"
  | "env"
  | "assets"
  | "external"
  | "tsconfig"
  | "tsconfigRaw"
  | "logLevel"
> &
  BuildConfig;
export type ESBuildResolvedBuildConfig = ExternalESBuildOptions &
  BuildResolvedConfig;

// Vite
export type ViteBuildConfig = Omit<
  ExternalViteUserConfig,
  | "entry"
  | "entryPoints"
  | "tsconfig"
  | "tsconfigRaw"
  | "environments"
  | "output"
> &
  BuildConfig;
export type ViteResolvedBuildConfig = ExternalViteUserConfig &
  BuildResolvedConfig;

// Webpack
export type WebpackBuildConfig = Omit<
  ExternalWebpackOptions,
  "name" | "entry" | "entryPoints" | "tsconfig" | "tsconfigRaw" | "mode" | "env"
> &
  BuildConfig;
export type WebpackResolvedBuildConfig = ExternalWebpackOptions &
  BuildResolvedConfig;

// Rspack
export type RspackBuildConfig = Omit<
  ExternalRspackOptions,
  "name" | "entry" | "entryPoints" | "tsconfig" | "tsconfigRaw" | "mode" | "env"
> &
  BuildConfig;
export type RspackResolvedBuildConfig = ExternalRspackOptions &
  BuildResolvedConfig;

// Rollup
export type RollupBuildOutputConfig = Omit<
  ExternalRollupOutputOptions,
  "dir" | "format"
>;
export type RollupBuildConfig = Omit<
  ExternalRollupOptions,
  "entry" | "external" | "input" | "output" | "logLevel"
> & {
  output: RollupBuildOutputConfig | RollupBuildOutputConfig[];
} & BuildConfig;
export type RollupResolvedBuildConfig = ExternalRollupOptions &
  BuildResolvedConfig;

// Rolldown
export type RolldownBuildOutputConfig = Omit<
  ExternalRolldownOutputOptions,
  "dir" | "format"
>;
export type RolldownBuildConfig = Omit<
  ExternalRolldownOptions,
  "input" | "external" | "tsconfig" | "logLevel" | "output"
> & {
  output: RolldownBuildOutputConfig | RolldownBuildOutputConfig[];
} & BuildConfig;
export type RolldownResolvedBuildConfig = ExternalRolldownOptions &
  BuildResolvedConfig;

// Tsup
export type TsupBuildConfig = Partial<
  Omit<
    ExternalTsupOptions,
    | "userOptions"
    | "tsconfig"
    | "tsconfigRaw"
    | "assets"
    | "outputPath"
    | "mode"
    | "format"
    | "platform"
    | "projectRoot"
    | "env"
    | "entry"
    | "entryPoints"
    | "external"
    | "noExternal"
    | "skipNodeModulesBundle"
  >
> &
  BuildConfig;
export type TsupResolvedBuildConfig = ExternalTsupOptions & BuildResolvedConfig;

// Unbuild
export type UnbuildBuildConfig = Partial<
  Omit<
    ExternalUnbuildOptions,
    | "tsconfig"
    | "tsconfigRaw"
    | "assets"
    | "outputPath"
    | "mode"
    | "format"
    | "platform"
    | "projectRoot"
    | "env"
    | "entry"
    | "entryPoints"
  >
> &
  BuildConfig;
export type UnbuildResolvedBuildConfig = ExternalUnbuildOptions &
  BuildResolvedConfig;

// Farm
export type FarmBuildConfig = Partial<
  Omit<
    ExternalFarmOptions,
    | "tsconfig"
    | "tsconfigRaw"
    | "assets"
    | "outputPath"
    | "mode"
    | "format"
    | "platform"
    | "projectRoot"
    | "env"
    | "entry"
    | "entryPoints"
  >
> &
  BuildConfig;
export type FarmResolvedBuildConfig = ExternalFarmOptions & BuildResolvedConfig;
