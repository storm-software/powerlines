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

import defu from "defu";
import { marked, MarkedExtension, MarkedOptions } from "marked";
import { Plugin } from "powerlines";
import {
  MarkedPluginContext,
  MarkedPluginOptions,
  MarkedPluginUserConfig
} from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  export interface UserConfig {
    marked?: MarkedPluginOptions;
  }
}

/**
 * Marked Plugin
 *
 * @remarks
 * A Powerlines plugin to use the Marked markdown transformer during the prepare task.
 *
 * @see https://marked.js.org
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends MarkedPluginContext = MarkedPluginContext
>(
  options: MarkedPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "marked",
    async config() {
      return {
        marked: defu(options, {
          async: true,
          breaks: true,
          gfm: true,
          silent: !this.config.logLevel
        })
      } as Partial<MarkedPluginUserConfig>;
    },
    async configResolved() {
      this.marked ??= {} as TContext["marked"];
      this.marked.parse ??= async (
        src: string,
        override: Partial<MarkedOptions> = {}
      ) =>
        marked.parse(src, defu(override, this.config.marked) as MarkedOptions);
      this.marked.use ??= (...args: MarkedExtension[]) => marked.use(...args);
    }
  };
};

export default plugin;
