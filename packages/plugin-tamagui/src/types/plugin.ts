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

import type { TamaguiOptions } from "@tamagui/types";
import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export type TamaguiPluginOptions = Partial<TamaguiOptions> & {
  /**
   * The target platform for the Tamagui build.
   *
   * @defaultValue "web"
   */
  platform?: "web" | "native";

  /**
   * An array of component paths to include in the Tamagui build.
   *
   * @remarks
   * These paths can include glob patterns to match multiple files or directories and placeholder tokens (the `replacePathTokens` function will be applied to allow for dynamic path resolution).
   *
   * @defaultValue ["\{sourceRoot\}/components"]
   */
  components?: string[];
};

export interface TamaguiPluginUserConfig extends UserConfig {
  tamagui: TamaguiPluginOptions;
}

export interface TamaguiPluginResolvedConfig extends ResolvedConfig {
  tamagui: TamaguiOptions & Required<Pick<TamaguiPluginOptions, "platform">>;
}

export type TamaguiPluginContext<
  TResolvedConfig extends
    TamaguiPluginResolvedConfig = TamaguiPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
