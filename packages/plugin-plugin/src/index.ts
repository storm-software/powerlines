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

import alloyBabelPreset from "@alloy-js/babel-preset";
import typescriptBabelPreset from "@babel/preset-typescript";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { build, resolveOptions } from "@storm-software/tsup";
import { StormJSON } from "@stryke/json/storm-json";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join";
import { defu } from "defu";
import eslintBabelPlugin from "esbuild-plugin-babel";
import { extractTsupConfig, resolveTsupEntry } from "powerlines/lib/build/tsup";
import { Plugin } from "powerlines/types/plugin";
import { PluginPluginContext, PluginPluginOptions } from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <
  TContext extends PluginPluginContext = PluginPluginContext
>(
  options: PluginPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "plugin",
    config() {
      this.log(
        LogLevelLabel.TRACE,
        "Providing default configuration for the Powerlines plugin."
      );

      return {
        type: "library",
        entry: ["src/**/*.ts", "src/**/*.tsx"],
        output: {
          dts: false,
          format: ["cjs", "esm"]
        },
        build: {
          variant: "tsup",
          external: ["powerlines"],
          bundle: false,
          skipNodeModulesBundle: true,
          platform: "node"
        }
      };
    },
    async configResolved() {
      this.log(
        LogLevelLabel.TRACE,
        "The Powerlines plugin has resolved the final configuration."
      );

      if (options.alloy) {
        if (this.tsconfig.tsconfigJson.compilerOptions!.jsx !== "preserve") {
          this.tsconfig.tsconfigJson.compilerOptions!.jsx = "preserve";
        }

        await this.fs.write(
          this.tsconfig.tsconfigFilePath,
          StormJSON.stringify(this.tsconfig.tsconfigJson)
        );
      }
    },
    async build() {
      await build(
        await resolveOptions(
          defu(
            {
              config: false,
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
              esbuildPlugins: options.alloy
                ? [
                    eslintBabelPlugin({
                      filter: /\.tsx$/,
                      config: {
                        presets: [
                          [
                            typescriptBabelPreset,
                            {
                              allExtensions: true,
                              allowDeclareFields: true,
                              isTSX: true
                            }
                          ],
                          alloyBabelPreset
                        ]
                      },
                      excludeNodeModules: true
                    })
                  ]
                : []
            }
          )
        )
      );
    }
  };
};

export default plugin;
