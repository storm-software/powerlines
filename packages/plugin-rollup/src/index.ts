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

import { toArray } from "@stryke/convert/to-array";
import defu from "defu";
import { extractRollupConfig } from "powerlines/lib/build/rollup";
import { RollupUserConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import { rollup as build } from "rollup";
import { createRollupPlugin } from "./helpers/unplugin";
import { RollupPluginContext, RollupPluginOptions } from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <
  TContext extends RollupPluginContext = RollupPluginContext
>(
  options: RollupPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "rollup",
    config() {
      return {
        output: {
          format: ["cjs", "esm"]
        },
        build: {
          ...options,
          variant: "rollup"
        }
      } as Partial<RollupUserConfig>;
    },
    async build() {
      const result = await build(
        defu(
          {
            plugins: [createRollupPlugin(this)]
          },
          extractRollupConfig(this)
        )
      );

      await Promise.all(
        toArray(this.config.output.format).map(async format =>
          result.write({
            format
          })
        )
      );
    }
  };
};

export default plugin;
