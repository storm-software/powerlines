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
import { resolveOptions } from "@powerlines/unplugin/rollup";
import { toArray } from "@stryke/convert/to-array";
import defu from "defu";
import { rollup as build, RollupOptions } from "rollup";
import { createRollupPlugin } from "unplugin";
import { RollupPluginContext, RollupPluginOptions } from "./types/plugin";

export * from "./types";

declare module "@powerlines/core" {
  interface Config {
    rollup?: RollupPluginOptions;
  }
}

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
        rollup: {
          ...options
        }
      };
    },
    async build() {
      this.debug("Starting Rollup build process...");

      const resolved = resolveOptions(this);
      const options = defu(this.config.rollup, {
        ...resolved,
        config: false,
        plugins: [
          createRollupPlugin(
            createUnplugin(this, {
              silenceHookLogging: true,
              name: "rollup"
            })
          )()
        ]
      }) as RollupOptions;

      this.debug({
        meta: {
          category: "config"
        },
        message: `Resolved Rollup configuration: \n${formatConfig(options)}`
      });

      const result = await build(options);

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
