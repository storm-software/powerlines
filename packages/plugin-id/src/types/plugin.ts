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

export type UniqueIdFormatType = "nanoid";

export interface IdPluginOptions {
  /**
   * The type of ID generation format to use
   *
   * @remarks
   * This value is used to determine which ID generation format to use. It can be one of the following:
   * - [nanoid](https://github.com/ai/nanoid)
   *
   * @defaultValue "nanoid"
   */
  type?: UniqueIdFormatType;
}

export interface IdPluginUserConfig extends UserConfig {
  /**
   * Options for the ID plugin.
   */
  id?: IdPluginOptions;
}

export interface IdPluginResolvedConfig extends ResolvedConfig {
  /**
   * Options for the ID plugin.
   */
  id: Required<IdPluginOptions>;
}

export type IdPluginContext<
  TResolvedConfig extends IdPluginResolvedConfig = IdPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
