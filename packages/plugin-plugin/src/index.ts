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

import babel from "@powerlines/plugin-babel";
import tsup from "@powerlines/plugin-tsup";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { copyFiles } from "@stryke/fs/copy-file";
import { StormJSON } from "@stryke/json/storm-json";
import { appendPath } from "@stryke/path/append";
import { findFileExtension } from "@stryke/path/find";
import { joinPaths } from "@stryke/path/join";
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
    dependsOn: options.alloy ? [babel(), tsup()] : [tsup()],
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
        transform: options.alloy
          ? {
              babel: {
                presets: [
                  [
                    "@babel/preset-typescript",
                    {
                      allExtensions: true,
                      allowDeclareFields: true,
                      isTSX: true
                    },
                    (code: string, id: string) =>
                      findFileExtension(id) === "tsx"
                  ],
                  [
                    "@alloy-js/babel-preset",
                    {},
                    (code: string, id: string) =>
                      findFileExtension(id) === "jsx" ||
                      findFileExtension(id) === "tsx"
                  ]
                ]
              }
            }
          : undefined,
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
    build: {
      order: "post",
      async handler() {
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
    }
  };
};

export default plugin;
