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
import { resolveEntry, resolveOptions } from "@powerlines/unplugin/esbuild";
import defu from "defu";
import { build, BuildOptions, SameShape } from "esbuild";
import { createEsbuildPlugin } from "unplugin";
import { EsbuildPluginContext, EsbuildPluginOptions } from "./types/plugin";

export * from "./types";

declare module "@powerlines/core" {
  interface Config {
    esbuild?: EsbuildPluginOptions;
  }
}

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <
  TContext extends EsbuildPluginContext = EsbuildPluginContext
>(
  options: EsbuildPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "esbuild",
    config() {
      return {
        output: {
          format: ["esm"]
        },
        esbuild: {
          ...options
        }
      };
    },
    async build() {
      this.debug("Starting Esbuild build process...");

      const resolved = resolveOptions(this);
      const options = defu(this.config.esbuild, {
        ...resolved,
        entryPoints: resolveEntry(this, this.entry),
        config: false,
        plugins: [
          createEsbuildPlugin(
            createUnplugin(this, {
              silenceHookLogging: true,
              name: "esbuild"
            })
          )()
        ]
      }) as SameShape<BuildOptions, BuildOptions>;

      this.debug({
        meta: {
          category: "config"
        },
        message: `Resolved Esbuild configuration: \n${formatConfig(options)}`
      });

      await build(options);
    }
  };
};

export default plugin;
