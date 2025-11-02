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

import { Config } from "automd";
import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export type AutoMDPluginOptions = Omit<Config, "dir" | "watch" | "onWatch"> & {
  /**
   * Path to the AutoMD configuration file.
   *
   * @remarks
   * If not provided, the plugin will use the default AutoMD configuration resolution mechanism.
   */
  configFile?: string;

  /**
   * An indicator specifying whether or not issues found by AutoMD during the prepare task are considered fatal.
   *
   * @defaultValue true
   */
  allowIssues?: boolean;
};

export type AutoMDPluginUserConfig = UserConfig & {
  automd?: Config & Pick<AutoMDPluginOptions, "configFile" | "allowIssues">;
};

export type AutoMDPluginResolvedConfig = ResolvedConfig & {
  automd: Config & Pick<AutoMDPluginOptions, "configFile" | "allowIssues">;
};

export type AutoMDPluginContext<
  TResolvedConfig extends
    AutoMDPluginResolvedConfig = AutoMDPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
