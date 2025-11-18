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

import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";
import type { CreateEnvOptions } from "unenv";

export type UnenvPluginOptions = Partial<CreateEnvOptions>;

export interface UnenvPluginUserConfig extends UserConfig {
  unenv: UnenvPluginOptions;
}

export interface UnenvPluginResolvedConfig extends ResolvedConfig {
  unenv: CreateEnvOptions;
}

export type UnenvPluginContext<
  TResolvedConfig extends UnenvPluginResolvedConfig = UnenvPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  unenv: ReturnType<typeof import("unenv").defineEnv>;
};
