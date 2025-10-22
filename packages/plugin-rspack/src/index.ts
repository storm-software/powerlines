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

import { rspack as build } from "@rspack/core";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import defu from "defu";
import { extractRspackConfig } from "powerlines/lib/build/rspack";
import { RspackUserConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import { createRspackPlugin } from "./helpers/unplugin";
import { RspackPluginContext, RspackPluginOptions } from "./types/plugin";

export * from "./helpers";
export * from "./types";

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
      this.log(
        LogLevelLabel.TRACE,
        "Providing default configuration for the Powerlines `rspack` build plugin."
      );

      return {
        build: {
          ...options,
          variant: "rspack"
        }
      } as Partial<RspackUserConfig>;
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
          extractRspackConfig(this),
          {
            plugins: [createRspackPlugin(this)]
          }
        )
      );
    }
  };
};

export default plugin;
