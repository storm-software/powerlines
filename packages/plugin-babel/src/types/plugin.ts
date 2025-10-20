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

import { BabelUserConfig, UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { BabelResolvedConfig, ResolvedConfig } from "powerlines/types/resolved";

export type BabelPluginOptions = Partial<BabelUserConfig>;

export type BabelPluginUserConfig = UserConfig;

export interface BabelPluginResolvedConfig extends ResolvedConfig {
  transform: {
    babel: BabelResolvedConfig;
  };
}

export type BabelPluginContext<
  TResolvedConfig extends BabelPluginResolvedConfig = BabelPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
