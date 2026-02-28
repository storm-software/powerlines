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

import {
  PluginContext,
  ResolvedConfig,
  UserConfig
} from "@powerlines/core/types";
import { RolldownOptions } from "./build";

export type RolldownPluginOptions = Partial<RolldownOptions>;

export interface RolldownPluginUserConfig extends UserConfig {
  rolldown: RolldownPluginOptions;
}

export interface RolldownPluginResolvedConfig extends ResolvedConfig {
  rolldown: RolldownOptions;
}

export type RolldownPluginContext<
  TResolvedConfig extends RolldownPluginResolvedConfig =
    RolldownPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
