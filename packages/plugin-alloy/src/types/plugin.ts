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

import type {
  Children,
  PrintTreeOptions
} from "@powerlines/plugin-alloy/vendor";
import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export type AlloyPluginOptions = Partial<PrintTreeOptions> & {
  /**
   * If true, the Alloy framework is used to generate Typescript output files.
   *
   * @defaultValue true
   */
  typescript?: boolean;

  /**
   * If true, the Alloy framework is used to generate JSON output files.
   *
   * @defaultValue false
   */
  json?: boolean;

  /**
   * If true, the Alloy framework is used to generate Markdown output files.
   *
   * @defaultValue false
   */
  markdown?: boolean;
};

export type AlloyPluginUserConfig = UserConfig & {
  alloy?: AlloyPluginOptions;
};

export type AlloyPluginResolvedConfig = ResolvedConfig & {
  alloy: AlloyPluginOptions;
};

export type AlloyPluginContext<
  TResolvedConfig extends AlloyPluginResolvedConfig = AlloyPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  render: <TContext extends AlloyPluginContext>(
    this: TContext,
    children: Children
  ) => Promise<void>;
};
