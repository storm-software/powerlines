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

import { createUnplugin } from "@powerlines/core";
import { resolveOptions } from "@powerlines/unplugin/rspack";
import { rspack as build, MultiRspackOptions } from "@rspack/core";
import defu from "defu";
import type { Plugin } from "powerlines";
import { formatConfig } from "powerlines/plugin-utils";
import { createRspackPlugin } from "unplugin";
import type { RspackPluginContext, RspackPluginOptions } from "./types/plugin";

export type * from "./types";

declare module "powerlines" {
  interface Config {
    rspack?: RspackPluginOptions;
  }
}

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <
  TContext extends RspackPluginContext = RspackPluginContext
>(
  options: RspackPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "rspack",
    config() {
      this.debug(
        "Providing default configuration for the Powerlines `rspack` build plugin."
      );

      return {
        build: {
          ...options,
          variant: "rspack"
        }
      };
    },
    async build() {
      this.debug("Starting Rspack build process...");

      const options = defu(
        {
          entry: this.entry.reduce(
            (ret, entry) => {
              ret[entry.output || entry.name || entry.file] = entry.file;

              return ret;
            },
            {} as Record<string, string>
          )
        },
        resolveOptions(this),
        {
          plugins: [
            createRspackPlugin(
              createUnplugin(this, {
                silenceHookLogging: true,
                name: "rspack"
              })
            )()
          ]
        }
      );

      this.debug({
        meta: {
          category: "config"
        },
        message: `Resolved Rspack configuration: \n${formatConfig(options)}`
      });

      build([options] as MultiRspackOptions);
    }
  };
};

export default plugin;
