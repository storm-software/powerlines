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
import { appendPath } from "@stryke/path/append";
import defu from "defu";
import { extractTsupConfig, resolveTsupEntry } from "powerlines/lib/build/tsup";
import { TsupResolvedBuildConfig } from "powerlines/types/build";
import { TsupUserConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import { createTsupPlugin } from "./helpers/unplugin";
import { TsupPluginContext, TsupPluginOptions } from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to use Tsup to build the project.
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
      return build(
        await resolveOptions(
          defu(
            {
              config: false,
              entry: Object.fromEntries(
                Object.entries(resolveTsupEntry(this, this.entry)).map(
                  ([key, value]) => [
                    key,
                    appendPath(value, this.config.projectRoot)
                  ]
                )
              ),
              esbuildOptions: (options, ctx) => {
                if (this.config.build.variant === "tsup") {
                  if (
                    (this.config.build as TsupResolvedBuildConfig)
                      .esbuildOptions
                  ) {
                    (
                      this.config.build as TsupResolvedBuildConfig
                    ).esbuildOptions?.(options, ctx);
                  } else if (
                    (this.config.override as TsupResolvedBuildConfig)
                      .esbuildOptions
                  ) {
                    (
                      this.config.override as TsupResolvedBuildConfig
                    ).esbuildOptions?.(options, ctx);
                  }
                }

                options.alias = {
                  ...this.builtins.reduce(
                    (ret, id) => {
                      const path = this.fs.ids[id];
                      if (path) {
                        ret[id] = path;
                      }

                      return ret;
                    },
                    {} as Record<string, string>
                  ),
                  ...options.alias
                };
              },
              silent: false,
              verbose: true
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
