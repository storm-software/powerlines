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

import { findFileExtension, findFileExtensionSafe } from "@stryke/path/find";
import defu from "defu";
import { transformAsync } from "oxc-transform";
import { Plugin } from "powerlines/types/plugin";
import {
  OxcTransformPluginContext,
  OxcTransformPluginOptions,
  OxcTransformPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate oxc-transform for code transformation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends OxcTransformPluginContext = OxcTransformPluginContext
>(
  options: OxcTransformPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "oxc-transform",
    config() {
      return {
        transform: {
          oxc: defu(options, {
            sourceType: "module",
            cwd: this.config.projectRoot,
            envName: this.config.mode,
            outputPath: this.config.output.distPath,
            sourcemap: this.config.mode === "development"
          })
        }
      } as Partial<OxcTransformPluginUserConfig>;
    },
    async transform(code, id) {
      const result = await transformAsync(id, code, {
        lang: (["d.ts", "d.cts", "d.mts"].includes(findFileExtensionSafe(id))
          ? "dts"
          : findFileExtension(id)) as OxcTransformPluginOptions["lang"],
        ...this.config.transform.oxc
      });

      return { id, code: result.code, map: result.map };
    }
  };
};

export default plugin;
