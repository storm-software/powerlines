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
import { build, resolveOptions } from "@storm-software/tsup";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join";
import { isFunction } from "@stryke/type-checks/is-function";
import defu from "defu";
import { extractTsupConfig, resolveTsupEntry } from "powerlines/lib/build/tsup";
import { TsupUserConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import { createTsupPlugin } from "./helpers/unplugin";
import { TsupPluginContext, TsupPluginOptions } from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <TContext extends TsupPluginContext = TsupPluginContext>(
  options: TsupPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "tsup",
    config() {
      this.log(
        LogLevelLabel.TRACE,
        "Providing default configuration for the Powerlines `tsup` build plugin."
      );

      return {
        output: {
          format: ["cjs", "esm"]
        },
        build: {
          ...options,
          variant: "tsup"
        }
      } as Partial<TsupUserConfig>;
    },
    async build() {
      this.log(LogLevelLabel.TRACE, "Building the Powerlines plugin.");

      return build(
        await resolveOptions(
          defu(
            {
              config: false,
              esbuildOptions: (buildOptions, ctx) => {
                if (isFunction(options.esbuildOptions)) {
                  options.esbuildOptions(buildOptions, ctx);
                }

                buildOptions.alias = defu(
                  buildOptions.alias ?? {},
                  Object.fromEntries(this.fs.builtinIdMap.entries())
                );
              },
              entry: Object.fromEntries(
                Object.entries(resolveTsupEntry(this, this.entry)).map(
                  ([key, value]) => [
                    key,
                    isParentPath(value, this.config.projectRoot)
                      ? value
                      : joinPaths(this.config.projectRoot, value)
                  ]
                )
              )
            },
            extractTsupConfig(this),
            {
              esbuildPlugins: [createTsupPlugin(this)]
            }
          )
        )
      );
    }
  };
};

export default plugin;
