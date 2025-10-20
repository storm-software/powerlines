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
  EnvPluginContext,
  EnvPluginResolvedConfig,
  EnvPluginUserConfig
} from "@powerlines/plugin-env/types/plugin";

export type DateLibraryType = "date-fns" | "dayjs" | "luxon" | "moment";

export interface DatePluginOptions {
  /**
   * The type of date library to use
   *
   * @remarks
   * This value is used to determine which date library to use for date manipulation. It can be one of the following:
   * - [date-fns](https://date-fns.org/)
   * - [dayjs](https://day.js.org/)
   * - [luxon](https://moment.github.io/luxon/)
   * - [moment](https://momentjs.com/)
   *
   * @defaultValue "date-fns"
   */
  type?: DateLibraryType;
}

export interface DatePluginUserConfig extends EnvPluginUserConfig {
  /**
   * Options for the date plugin.
   */
  date?: DatePluginOptions;
}

export interface DatePluginResolvedConfig extends EnvPluginResolvedConfig {
  /**
   * Options for the date plugin.
   */
  date: Required<DatePluginOptions>;
}

export type DatePluginContext<
  TResolvedConfig extends DatePluginResolvedConfig = DatePluginResolvedConfig
> = EnvPluginContext<TResolvedConfig>;
