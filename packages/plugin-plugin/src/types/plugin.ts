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

import { PrintTreeOptions } from "@alloy-js/core";
import {
  TsupBuildConfig,
  TsupResolvedBuildConfig
} from "powerlines/types/build";
import { OutputConfig, UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export type PluginPluginAlloyOptions = Partial<PrintTreeOptions> & {
  /**
   * If true, the Alloy framework is used to generate JSON output files.
   *
   * @defaultValue false
   */
  generatesJson?: boolean;

  /**
   * If true, the Alloy framework is used to generate Markdown output files.
   *
   * @defaultValue false
   */
  generatesMarkdown?: boolean;
};

export interface PluginPluginOptions {
  /**
   * The options applied to the [Alloy framework](https://alloy-framework.github.io/alloy/) for rendering templates.
   *
   * @remarks
   * If set to `false`, the Alloy processing step will be skipped. If set to `true`, the Alloy processing step will be enabled with its default settings.
   *
   * @defaultValue false
   */
  alloy?: PluginPluginAlloyOptions | boolean;
}

export type PluginPluginOutputConfig = OutputConfig & {
  /**
   * The output directory path for the project build.
   *
   * @remarks
   * This path is used to determine where the built files will be placed after the build process completes. This will be used in scenarios where the monorepo uses TSConfig paths to link packages together.
   *
   * @defaultValue "dist"
   */
  projectDistPath: string;
};

export interface PluginPluginUserConfig extends UserConfig {
  alloy?: false | Partial<PluginPluginAlloyOptions>;
  output?: Partial<PluginPluginOutputConfig>;
  build?: Partial<TsupBuildConfig>;
  override?: Partial<TsupResolvedBuildConfig>;
}

export type PluginPluginResolvedConfig = ResolvedConfig & {
  alloy: false | Required<PluginPluginAlloyOptions>;
  output: PluginPluginOutputConfig;
  build: TsupResolvedBuildConfig;
  override: TsupResolvedBuildConfig;
};

export type PluginPluginContext<
  TResolvedConfig extends
    PluginPluginResolvedConfig = PluginPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
