/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import type { PrintTreeOptions } from "@alloy-js/core";
import {
  BabelPluginResolvedConfig,
  BabelPluginUserConfig
} from "@powerlines/plugin-babel/types/plugin";
import { PluginContext } from "powerlines";

export type AlloyPluginOptions = Partial<PrintTreeOptions>;

export type AlloyPluginUserConfig = BabelPluginUserConfig & {
  alloy?: AlloyPluginOptions;
};

export type AlloyPluginResolvedConfig = BabelPluginResolvedConfig & {
  alloy: AlloyPluginOptions;
};

export type AlloyPluginContext<
  TResolvedConfig extends AlloyPluginResolvedConfig = AlloyPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
