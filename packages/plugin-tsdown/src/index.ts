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
import { extractTsdownConfig } from "powerlines/lib/build/tsdown";
import { Plugin } from "powerlines/types/plugin";
import { build } from "tsdown";
import { createTsdownPlugin } from "./helpers/unplugin";
import {
  TsdownPluginContext,
  TsdownPluginOptions,
  TsdownPluginResolvedConfig
} from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to use Tsdown to build the project.
 */
export const plugin = <
  TContext extends TsdownPluginContext = TsdownPluginContext
>(
  options: TsdownPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "tsdown",
    config() {
      this.log(
        LogLevelLabel.TRACE,
        "Providing default configuration for the Powerlines `tsdown` build plugin."
      );

      return {
        output: {
          format: ["cjs", "esm"]
        },
        build: {
          ...options,
          variant: "tsdown"
        }
      } as Partial<TsdownPluginResolvedConfig>;
    },
    async build() {
      await build(
        defu(
          {
            config: false,
            plugins: [createTsdownPlugin(this)]
          },
          extractTsdownConfig(this)
        )
      );
    }
  };
};

export default plugin;
