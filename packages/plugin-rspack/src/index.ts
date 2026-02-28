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

import { Plugin } from "@powerlines/core/types";
import { rspack as build } from "@rspack/core";
import defu from "defu";
import { resolveOptions } from "./helpers";
import { createRspackPlugin } from "./helpers/unplugin";
import {
  RspackPluginContext,
  RspackPluginOptions,
  RspackPluginResolvedConfig
} from "./types/plugin";

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
      this.debug(
        "Providing default configuration for the Powerlines `rspack` build plugin."
      );

      return {
        build: {
          ...options,
          variant: "rspack"
        }
      } as Partial<RspackPluginResolvedConfig>;
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
          resolveOptions(this),
          {
            plugins: [createRspackPlugin(this)]
          }
        )
      );
    }
  };
};

export default plugin;
