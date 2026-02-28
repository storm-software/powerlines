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

import type {
  TsdownPluginContext,
  TsdownPluginOptions,
  TsdownPluginResolvedConfig,
  TsdownPluginUserConfig
} from "@powerlines/plugin-tsdown/types/plugin";
import { TypeDefinitionParameter } from "@stryke/types/configuration";

export interface PluginPluginTypesOptions {
  /**
   * The type definition for the plugin's options.
   */
  options?: TypeDefinitionParameter;

  /**
   * The type definition for the plugin's user config.
   */
  userConfig?: TypeDefinitionParameter;
}

export interface PluginPluginOptions extends TsdownPluginOptions {
  /**
   * The type definitions for the Plugin plugin.
   */
  types?: PluginPluginTypesOptions;
}

export interface PluginPluginUserConfig extends TsdownPluginUserConfig {
  plugin?: PluginPluginOptions;
}

export interface PluginPluginResolvedConfig extends TsdownPluginResolvedConfig {
  plugin: PluginPluginOptions;
}

export type PluginPluginContext<
  TResolvedConfig extends PluginPluginResolvedConfig =
    PluginPluginResolvedConfig
> = TsdownPluginContext<TResolvedConfig>;
