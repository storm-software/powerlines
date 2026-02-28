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

import { ReflectionConfig } from "@powerlines/deepkit/vendor/type-compiler/config";
import {
  TypeScriptCompilerPluginContext,
  TypeScriptCompilerPluginOptions,
  TypeScriptCompilerPluginResolvedConfig,
  TypeScriptCompilerPluginUserConfig
} from "@powerlines/plugin-tsc/types/plugin";

export type DeepkitPluginOptions = Partial<ReflectionConfig> &
  TypeScriptCompilerPluginOptions;

export interface DeepkitPluginUserConfig extends TypeScriptCompilerPluginUserConfig {
  /**
   * Deepkit transformation options
   */
  deepkit: DeepkitPluginOptions;
}

export interface DeepkitPluginResolvedConfig extends TypeScriptCompilerPluginResolvedConfig {
  /**
   * Resolved deepkit transformation options
   */
  deepkit: Required<DeepkitPluginOptions>;
}

export type DeepkitPluginContext<
  TResolvedConfig extends DeepkitPluginResolvedConfig =
    DeepkitPluginResolvedConfig
> = TypeScriptCompilerPluginContext<TResolvedConfig>;
