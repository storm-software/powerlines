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

import { UnbuildBuildConfig } from "powerlines/types/build";
import { PluginContext } from "powerlines/types/context";
import { UnbuildResolvedConfig } from "powerlines/types/resolved";

export type UnbuildPluginOptions = Partial<UnbuildBuildConfig>;

export type UnbuildPluginResolvedConfig = UnbuildResolvedConfig;

export type UnbuildPluginContext<
  TResolvedConfig extends
    UnbuildPluginResolvedConfig = UnbuildPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
