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

import tsdown from "@powerlines/plugin-tsdown";
import { joinPaths } from "@stryke/path/join";
import type { Plugin } from "powerlines";
import type { PluginPluginContext, PluginPluginOptions } from "./types/plugin";

declare module "powerlines" {
  interface Config {
    plugin?: PluginPluginOptions;
  }
}

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <
  TContext extends PluginPluginContext = PluginPluginContext
>(
  options: PluginPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    tsdown(options),
    {
      name: "plugin",
      config() {
        this.debug(
          "Providing default configuration for the Powerlines plugin."
        );

        return {
          type: "library",
          platform: "node",
          output: {
            format: ["cjs", "esm"],
            dts: true
          },
          resolve: {
            external: ["powerlines", "@powerlines/*"]
          },
          tsdown: {
            target: "esnext",
            cjsDefault: true,
            nodeProtocol: true,
            fixedExtension: true,
            minify: false,
            exports: true,
            unbundle: true
          }
        };
      },
      async configResolved() {
        if (
          !this.config.input ||
          (Array.isArray(this.config.input) && this.config.input.length === 0)
        ) {
          let input = "src/index.tsx";
          if (!this.fs.existsSync(joinPaths(this.config.root, input))) {
            input = "src/index.ts";
          }

          this.config.input = input;
        }
      }
    }
  ];
};

export default plugin;
