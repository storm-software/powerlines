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

import { ESBuildBuildConfig } from "powerlines/types/build";
import { PluginContext } from "powerlines/types/context";
import { ESBuildResolvedConfig } from "powerlines/types/resolved";

export type ESBuildPluginOptions = Partial<ESBuildBuildConfig>;

export type ESBuildPluginResolvedConfig = ESBuildResolvedConfig;

export type ESBuildPluginContext<
  TResolvedConfig extends
    ESBuildPluginResolvedConfig = ESBuildPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
