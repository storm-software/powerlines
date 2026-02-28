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
import { UnbuildOptions } from "./build";

export type UnbuildPluginOptions = Partial<UnbuildOptions>;

export interface UnbuildPluginUserConfig extends UserConfig {
  unbuild?: UnbuildPluginOptions;
}

export interface UnbuildPluginResolvedConfig extends ResolvedConfig {
  unbuild: UnbuildOptions;
}

export type UnbuildPluginContext<
  TResolvedConfig extends UnbuildPluginResolvedConfig =
    UnbuildPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
