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
import { extractWebpackConfig } from "powerlines/lib/build/webpack";
import { WebpackUserConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import build from "webpack";
import { createWebpackPlugin } from "./helpers/unplugin";
import { WebpackPluginContext, WebpackPluginOptions } from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <
  TContext extends WebpackPluginContext = WebpackPluginContext
>(
  options: WebpackPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "webpack",
    config() {
      this.trace(
        "Providing default configuration for the Powerlines `webpack` build plugin."
      );

      return {
        build: {
          ...options,
          variant: "webpack"
        }
      } as Partial<WebpackUserConfig>;
    },
    async build() {
      build(
        defu(
          {
            entry: this.entry.reduce(
              (ret, entry) => {
                ret[entry.output || entry.name || entry.file] = entry.file;

                return ret;
              },
              {} as Record<string, string>
            )
          },
          extractWebpackConfig(this),
          {
            plugins: [createWebpackPlugin(this)]
          }
        )
      );
    }
  };
};

export default plugin;
