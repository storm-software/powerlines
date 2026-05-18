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

import { build } from "@storm-software/unbuild";
import type { Plugin } from "powerlines";
import { formatConfig } from "powerlines/plugin-utils";
import { resolveOptions } from "./helpers/resolve-options";
import type {
  UnbuildPluginContext,
  UnbuildPluginOptions
} from "./types/plugin";

export * from "./helpers";
export type * from "./types";

declare module "powerlines" {
  interface Config {
    unbuild?: UnbuildPluginOptions;
  }
}

/**
 * A Powerlines plugin to build projects using Unbuild.
 */
export const plugin = <
  TContext extends UnbuildPluginContext = UnbuildPluginContext
>(
  options: UnbuildPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "unbuild",
    config() {
      return {
        output: {
          format: ["esm"]
        },
        unbuild: {
          ...options
        }
      };
    },
    async build() {
      this.debug("Starting Unbuild build process...");

      const options = resolveOptions(this);

      this.debug({
        meta: {
          category: "config"
        },
        message: `Resolved Unbuild configuration: \n${formatConfig(options)}`
      });

      await build(options);
    }
  };
};

export default plugin;
