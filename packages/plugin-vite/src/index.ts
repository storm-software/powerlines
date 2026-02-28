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

import { Context, Plugin } from "@powerlines/core/types";
import defu from "defu";
import { build, InlineConfig } from "vite";
import { DEFAULT_VITE_CONFIG, resolveOptions } from "./helpers/resolve-options";
import { createVitePlugin } from "./helpers/unplugin";
import { UNSAFE_VitePluginContext } from "./types/_internal";
import {
  VitePluginContext,
  VitePluginOptions,
  VitePluginResolvedConfig
} from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <TContext extends VitePluginContext = VitePluginContext>(
  options: VitePluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "vite",
    config() {
      this.trace(
        "Providing default configuration for the Powerlines `vite` build plugin."
      );

      return {
        output: {
          format: ["cjs", "esm"]
        },
        vite: {
          ...DEFAULT_VITE_CONFIG,
          ...options
        },
        singleBuild: true
      } as Partial<VitePluginResolvedConfig>;
    },
    async build() {
      this.trace(`Building the Powerlines plugin.`);

      const environments = (this as unknown as UNSAFE_VitePluginContext)
        ?.$$internal?.api?.context?.environments;
      if (!environments || Object.keys(environments).length === 0) {
        throw new Error(
          `No environments found in the Powerlines context. At least one environment should have been generated - please report this issue to https://github.com/storm-software/powerlines/issues.`
        );
      }

      this.trace(
        `Running Vite for ${Object.keys(environments).length} environments.`
      );

      const config = defu(
        {
          config: false,
          entry: this.entry,
          environments: Object.fromEntries(
            Object.entries(environments).map(([name, env]) => [
              name,
              resolveOptions(env as Context)
            ])
          )
        },
        resolveOptions(this),
        {
          plugins: [createVitePlugin(this)]
        }
      );

      await build(config as InlineConfig);
    }
  };
};

export default plugin;
