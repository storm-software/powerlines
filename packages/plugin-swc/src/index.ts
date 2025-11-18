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

import { transform } from "@swc/core";
import defu from "defu";
import { Plugin } from "powerlines/types/plugin";
import { SwcPluginContext, SwcPluginOptions } from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate SWC for code transformation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <TContext extends SwcPluginContext = SwcPluginContext>(
  options: SwcPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "swc",
    config() {
      return {
        transform: {
          swc: defu(options, {
            outputPath: this.config.output.outputPath,
            cwd: this.config.projectRoot,
            envName: this.config.mode,
            configFile: false
          })
        }
      };
    },
    async transform(code, id) {
      const result = await transform(code, {
        ...this.config.transform.swc,
        filename: id
      });

      return { id, code: result.code, map: result.map };
    }
  };
};

export default plugin;
