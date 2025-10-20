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
import { build } from "esbuild";
import {
  DEFAULT_ESBUILD_CONFIG,
  extractESBuildConfig,
  resolveESBuildEntry
} from "powerlines/lib/build/esbuild";
import { ESBuildUserConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import { createESBuildPlugin } from "./helpers/unplugin";
import { ESBuildPluginContext, ESBuildPluginOptions } from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <
  TContext extends ESBuildPluginContext = ESBuildPluginContext
>(
  options: ESBuildPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "esbuild",
    config() {
      return {
        output: {
          format: ["esm"]
        },
        build: {
          ...DEFAULT_ESBUILD_CONFIG,
          ...options,
          variant: "esbuild"
        }
      } as Partial<ESBuildUserConfig>;
    },
    configResolved() {
      this.config.build = extractESBuildConfig(this);

      this.dependencies.esbuild = {
        type: "devDependency",
        version: "^0.25.0"
      };
    },
    async build() {
      await build(
        defu(
          {
            entryPoints: resolveESBuildEntry(this, this.entry),
            plugins: [createESBuildPlugin(this)]
          },
          extractESBuildConfig(this)
        )
      );
    }
  };
};

export default plugin;
