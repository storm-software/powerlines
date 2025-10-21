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

import { LogLevelLabel } from "@storm-software/config-tools/types";
import defu from "defu";
import {
  DEFAULT_VITE_CONFIG,
  extractViteConfig
} from "powerlines/lib/build/vite";
import { ViteUserConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import { build } from "vite";
import { createVitePlugin } from "./helpers/unplugin";
import { VitePluginContext, VitePluginOptions } from "./types/plugin";

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
      this.log(
        LogLevelLabel.TRACE,
        "Providing default configuration for the Powerlines `vite` build plugin."
      );

      return {
        output: {
          format: ["cjs", "esm"]
        },
        build: {
          ...DEFAULT_VITE_CONFIG,
          ...options,
          variant: "vite"
        }
      } as Partial<ViteUserConfig>;
    },
    async build() {
      this.log(LogLevelLabel.TRACE, `Building the Powerlines plugin.`);

      await build(
        defu(
          {
            config: false,
            entry: this.entry
          },
          extractViteConfig(this),
          {
            plugins: [createVitePlugin(this)]
          }
        )
      );
    }
  };
};

export default plugin;
