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
import { createUnplugin } from "@powerlines/core/lib/unplugin";
import { formatConfig } from "@powerlines/core/plugin-utils";
import { resolveOptions } from "@powerlines/unplugin/tsup";
import {
  build,
  BuildOptions,
  resolveOptions as resolveOptionsBase
} from "@storm-software/tsup";
import defu from "defu";
import { Options } from "tsup";
import { createEsbuildPlugin } from "unplugin";
import { TsupPluginContext, TsupPluginOptions } from "./types/plugin";

export * from "./types";

declare module "@powerlines/core" {
  interface Config {
    tsup?: TsupPluginOptions;
  }
}

/**
 * A Powerlines plugin to use Tsup to build the project.
 */
export const plugin = <TContext extends TsupPluginContext = TsupPluginContext>(
  options: TsupPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "tsup",
    config() {
      this.debug(
        "Providing default configuration for the Powerlines `tsup` build plugin."
      );

      return {
        output: {
          format: ["cjs", "esm"]
        },
        tsup: {
          ...options
        }
      };
    },
    async build() {
      this.debug("Starting Tsup build process...");

      const resolved = resolveOptions(this);
      const options = resolveOptionsBase(
        defu(this.config.tsup, {
          ...resolved,
          config: false,
          esbuildPlugins: [
            createEsbuildPlugin(
              createUnplugin(this, {
                silenceHookLogging: true,
                name: "tsup"
              })
            )()
          ]
        }) as BuildOptions
      ) as Options;

      this.debug({
        meta: {
          category: "config"
        },
        message: `Resolved Tsup configuration: \n${formatConfig(options)}`
      });

      return build(options);
    }
  };
};

export default plugin;
