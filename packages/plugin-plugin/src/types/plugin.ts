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
  BabelPluginContext,
  BabelPluginOptions,
  BabelPluginResolvedConfig,
  BabelPluginUserConfig
} from "@powerlines/plugin-babel/types/plugin";
import {
  TsupPluginContext,
  TsupPluginResolvedConfig,
  TsupPluginUserConfig
} from "@powerlines/plugin-tsup/types/plugin";
import { OutputConfig } from "powerlines/types/config";

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

  /**
   * Babel configuration options to use during the transformation process.
   *
   * @remarks
   * This option allows you to customize the Babel transformation process used during the build. If not provided, the plugin will use default Babel settings.
   */
  babel?: BabelPluginOptions;
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

export type PluginPluginUserConfig = TsupPluginUserConfig &
  BabelPluginUserConfig & {
    alloy?: false | Partial<PluginPluginAlloyOptions>;
    output?: Partial<PluginPluginOutputConfig>;
  };

export type PluginPluginResolvedConfig = TsupPluginResolvedConfig &
  BabelPluginResolvedConfig & {
    alloy: false | Required<PluginPluginAlloyOptions>;
    output: PluginPluginOutputConfig;
  };

export type PluginPluginContext<
  TResolvedConfig extends
    PluginPluginResolvedConfig = PluginPluginResolvedConfig
> = BabelPluginContext<TResolvedConfig> & TsupPluginContext<TResolvedConfig>;
