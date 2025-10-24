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
import { copyFiles } from "@stryke/fs/copy-file";
import { StormJSON } from "@stryke/json/storm-json";
import { appendPath } from "@stryke/path/append";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join";
import { defu } from "defu";
import eslintBabelPlugin from "esbuild-plugin-babel";
import { extractTsupConfig, resolveTsupEntry } from "powerlines/lib/build/tsup";
import { Plugin } from "powerlines/types/plugin";
import {
  PluginPluginContext,
  PluginPluginOptions,
  PluginPluginUserConfig
} from "./types/plugin";

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
          projectDistPath: "dist",
          format: ["cjs", "esm"]
        },
        build: {
          external: ["powerlines"],
          bundle: false,
          skipNodeModulesBundle: true,
          platform: "node"
        }
      } as Partial<PluginPluginUserConfig>;
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

        await this.fs.writeFileToDisk(
          this.tsconfig.tsconfigFilePath,
          StormJSON.stringify(this.tsconfig.tsconfigJson)
        );
      }

      if (this.config.output.projectDistPath) {
        this.config.override.outputPath ??= joinPaths(
          this.config.projectRoot,
          this.config.output.projectDistPath
        );
      }
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
    },
    async buildFinish() {
      if (
        this.config.override.outputPath &&
        this.config.override.outputPath !== this.config.output.outputPath
      ) {
        this.log(
          LogLevelLabel.INFO,
          `Copying built files from override output path (${this.config.override.outputPath}) to final output path (${this.config.output.outputPath}).`
        );

        await copyFiles(
          appendPath(
            this.config.override.outputPath,
            this.workspaceConfig.workspaceRoot
          ),
          joinPaths(
            appendPath(
              this.config.output.outputPath,
              this.workspaceConfig.workspaceRoot
            ),
            "dist"
          )
        );
      }
    }
  };
};

export default plugin;
