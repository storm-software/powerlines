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

import { Plugin } from "@powerlines/core";
import { formatConfig } from "@powerlines/core/plugin-utils";
import defu from "defu";
import { build } from "esbuild";
import {
  DEFAULT_ESBUILD_CONFIG,
  resolveEntry,
  resolveOptions
} from "./helpers/resolve-options";
import { createEsbuildPlugin } from "./helpers/unplugin";
import { EsbuildPluginContext, EsbuildPluginOptions } from "./types/plugin";

export * from "./helpers";
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
          ...DEFAULT_ESBUILD_CONFIG,
          ...options
        }
      };
    },
    async build() {
      this.debug("Starting Esbuild build process...");

      const options = defu(
        {
          entryPoints: resolveEntry(this, this.entry),
          plugins: [createEsbuildPlugin(this)]
        },
        resolveOptions(this)
      );

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
