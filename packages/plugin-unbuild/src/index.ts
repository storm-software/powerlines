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

import { Plugin } from "@powerlines/core/types";
import { build } from "@storm-software/unbuild";
import {
  DEFAULT_UNBUILD_CONFIG,
  resolveOptions
} from "./helpers/resolve-options";
import {
  UnbuildPluginContext,
  UnbuildPluginOptions,
  UnbuildPluginResolvedConfig
} from "./types/plugin";

export * from "./types";

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
      } as Partial<UnbuildPluginResolvedConfig>;
    },
    async build() {
      await build(resolveOptions(this));
    }
  };
};

export default plugin;
