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
import { build } from "@storm-software/unbuild";
import { omit } from "@stryke/helpers/omit";
import {
  DEFAULT_UNBUILD_CONFIG,
  resolveOptions
} from "./helpers/resolve-options";
import { UnbuildPluginContext, UnbuildPluginOptions } from "./types/plugin";

export * from "./types";

declare module "@powerlines/core" {
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
          ...DEFAULT_UNBUILD_CONFIG,
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
        message: `Resolved Unbuild configuration: \n${JSON.stringify(
          omit(options, ["plugins"]),
          null,
          2
        )}`
      });

      await build(options);
    }
  };
};

export default plugin;
