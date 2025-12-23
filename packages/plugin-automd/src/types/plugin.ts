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
import { TOCOptions } from "./toc";

export type AutoMDPluginOptions = Omit<
  Config,
  "dir" | "watch" | "onWatch" | "prefix"
> & {
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

  /**
   * Alternate prefix strings to use for finding generators
   *
   * @remarks
   * By default, AutoMD looks for generators with the "automd" prefix, so that any `<!-- automd:generator [...args] --> ... <!-- /automd -->` comments will be picked up. If you want to use different prefixes (for example, to avoid conflicts with other tools), you would provide a value like "myPrefix" and AutoMD would also look for `<!-- myPrefix:generator [...args] --> ... <!-- /myPrefix -->` comments.
   *
   * @defaultValue ["automd", "powerlines", "\{framework\}"]
   */
  prefix?: string | string[];

  /**
   * Table of Contents generator options
   *
   * @remarks
   * If set to `false`, the built-in Table of Contents generator will be disabled.
   */
  toc?: false | TOCOptions;
};

export type AutoMDPluginUserConfig = UserConfig & {
  automd?: Config &
    Pick<AutoMDPluginOptions, "configFile" | "allowIssues" | "toc">;
};

export type AutoMDPluginResolvedConfig = ResolvedConfig & {
  automd: Config &
    Pick<AutoMDPluginOptions, "configFile" | "allowIssues" | "toc">;
};

export type AutoMDPluginContext<
  TResolvedConfig extends AutoMDPluginResolvedConfig =
    AutoMDPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
