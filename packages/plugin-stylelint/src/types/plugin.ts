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

import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";
import { FixMode, LinterOptions } from "stylelint";

export interface StylelintPluginOptions extends Partial<LinterOptions> {
  /**
   * The path to the Stylelint configuration file.
   */
  configFile?: string;

  /**
   * An optional path to output the linting results to.
   */
  outputFile?: string;

  /**
   * Whether to suppress output to the console.
   *
   * @defaultValue false
   */
  silent?: boolean;

  /**
   * Whether to automatically fix problems
   *
   * @defaultValue true
   */
  fix?: boolean | FixMode;
}

export interface StylelintPluginUserConfig extends UserConfig {
  /**
   * Options for the Stylelint plugin.
   */
  lint?: {
    stylelint?: StylelintPluginOptions;
  };
}

export interface StylelintPluginResolvedConfig extends ResolvedConfig {
  /**
   * Options for the Stylelint plugin.
   */
  lint: {
    stylelint: StylelintPluginOptions;
  };
}

export type StylelintPluginContext<
  TResolvedConfig extends
    StylelintPluginResolvedConfig = StylelintPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
