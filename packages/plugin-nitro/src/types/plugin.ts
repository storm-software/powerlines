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

import { Nitro, NitroConfig } from "nitro/types";
import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export interface NitroPluginOptions extends Omit<
  NitroConfig,
  "root" | "compatibilityDate" | "logLevel" | "sourcemap" | "minify"
> {
  /**
   * The path to a separate Nitro configuration file.
   */
  configFile?: string;
}

export interface NitroPluginUserConfig extends UserConfig {
  /**
   * Options for the Nitro plugin.
   */
  nitro?: NitroPluginOptions;
}

export interface NitroPluginResolvedConfig extends ResolvedConfig {
  /**
   * Options for the Nitro plugin.
   */
  nitro: NitroConfig;
}

export type NitroPluginContext<
  TResolvedConfig extends NitroPluginResolvedConfig = NitroPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  nitro: Nitro;
};
