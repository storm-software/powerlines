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
import { EsbuildOptions } from "./build";

export type EsbuildPluginOptions = Partial<EsbuildOptions>;

export interface EsbuildPluginUserConfig extends UserConfig {
  esbuild?: EsbuildPluginOptions;
}

export interface EsbuildPluginResolvedConfig extends ResolvedConfig {
  esbuild: EsbuildOptions;
}

export type EsbuildPluginContext<
  TResolvedConfig extends EsbuildPluginResolvedConfig =
    EsbuildPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
