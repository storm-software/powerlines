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

import { build, UnbuildOptions } from "@storm-software/unbuild";
import {
  DEFAULT_UNBUILD_CONFIG,
  extractUnbuildConfig
} from "powerlines/lib/build/unbuild";
import { UnbuildUserConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import { UnbuildPluginContext, UnbuildPluginOptions } from "./types/plugin";

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
        build: {
          ...DEFAULT_UNBUILD_CONFIG,
          ...options,
          variant: "unbuild"
        }
      } as Partial<UnbuildUserConfig>;
    },
    async build() {
      await build(extractUnbuildConfig(this) as UnbuildOptions);
    }
  };
};

export default plugin;
