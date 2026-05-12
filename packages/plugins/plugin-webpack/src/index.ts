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

import { createUnplugin, Plugin } from "@powerlines/core";
import { formatConfig } from "@powerlines/core/plugin-utils";
import { resolveOptions } from "@powerlines/unplugin/webpack";
import defu from "defu";
import { createWebpackPlugin } from "unplugin";
import webpack, { Configuration } from "webpack";
import { WebpackPluginContext, WebpackPluginOptions } from "./types/plugin";

export * from "./types";

declare module "@powerlines/core" {
  interface Config {
    webpack?: WebpackPluginOptions;
  }
}

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
        webpack: {
          ...options
        }
      };
    },
    async build() {
      this.debug("Starting Webpack build process...");

      const resolved = resolveOptions(this);
      const options = defu(this.config.webpack, {
        ...resolved,
        config: false,
        entry: this.entry.reduce(
          (ret, entry) => {
            ret[entry.output || entry.name || entry.file] = entry.file;

            return ret;
          },
          {} as Record<string, string>
        ),
        plugins: [
          createWebpackPlugin(
            createUnplugin(this, {
              silenceHookLogging: true,
              name: "webpack"
            })
          )()
        ]
      }) as Configuration;

      this.debug({
        meta: {
          category: "config"
        },
        message: `Resolved Webpack configuration: \n${formatConfig(options)}`
      });

      webpack(options);
    }
  };
};

export default plugin;
