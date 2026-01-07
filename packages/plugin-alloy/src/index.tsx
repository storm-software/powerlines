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

import type { Children } from "@alloy-js/core";
import { renderAsync, traverseOutput } from "@alloy-js/core";
import alloy from "@alloy-js/rollup-plugin";
import { StormJSON } from "@stryke/json/storm-json";
import { Plugin } from "powerlines/types/plugin";
import { Output } from "./core/components/output";
import { MetaItem } from "./core/contexts/context";
import { AlloyPluginContext, AlloyPluginOptions, AlloyPluginResolvedConfig } from "./types/plugin";
import { findFileExtension } from "@stryke/path/file-path-fns";

/**
 * Alloy-js plugin for Powerlines.
 *
 * @param options - The Alloy-js plugin user configuration options.
 * @returns A Powerlines plugin that integrates Alloy-js transformations.
 */
export const plugin = <
  TContext extends AlloyPluginContext = AlloyPluginContext
>(
  options: AlloyPluginOptions = {}
) => {
  return [
    {
      name: "alloy:config",
      config() {
        return {
          alloy: {
            typescript: true,
            ...options
          },
          build: {
            inputOptions: {
              transform: {
                typescript: {
                  jsxPragma: "Alloy.createElement",
                  jsxPragmaFrag: "Alloy.Fragment"
                },
                jsx: {
                  runtime: "classic",
                  pragma: "Alloy.createElement",
                  pragmaFrag: "Alloy.Fragment",
                  importSource: "@alloy-js/core"
                }
              }
            },
            plugins: [alloy()],
            external: [
              "@alloy-js/core",
              "@alloy-js/typescript",
              "@alloy-js/json",
              "@alloy-js/markdown"
            ]
          }
        };
      },
      async configResolved() {
        if (
          this.tsconfig.tsconfigJson.compilerOptions?.jsx !== "preserve" ||
          this.tsconfig.tsconfigJson.compilerOptions?.jsxImportSource !==
            "@alloy-js/core"
        ) {
          this.tsconfig.tsconfigJson.compilerOptions ??= {};

          if (this.tsconfig.tsconfigJson.compilerOptions.jsx !== "preserve") {
            this.tsconfig.tsconfigJson.compilerOptions.jsx = "preserve";
          }

          if (
            this.tsconfig.tsconfigJson.compilerOptions.jsxImportSource !==
            "@alloy-js/core"
          ) {
            this.tsconfig.tsconfigJson.compilerOptions.jsxImportSource =
              "@alloy-js/core";
          }

          await this.fs.write(
            this.tsconfig.tsconfigFilePath,
            StormJSON.stringify(this.tsconfig.tsconfigJson)
          );
        }

        this.dependencies["@alloy-js/core"] = "^0.22.0";

        if (this.config.alloy?.typescript !== false) {
          this.dependencies["@alloy-js/typescript"] = "^0.22.0";
        }

        if (this.config.alloy?.json === true) {
          this.dependencies["@alloy-js/json"] = "^0.22.0";
        }

        if (this.config.alloy?.markdown === true) {
          this.dependencies["@alloy-js/markdown"] = "^0.22.0";
        }
      }
    },
    {
      name: "alloy:update-context",
      configResolved: {
        order: "pre",
        async handler() {
          async function render<TContext extends AlloyPluginContext<AlloyPluginResolvedConfig>>(this: TContext, children: Children) {
            const meta = {} as Record<string, MetaItem>;

            await traverseOutput(
              await renderAsync(
                <Output<TContext>
                  context={this}
                  meta={meta}
                  basePath={this.workspaceConfig.workspaceRoot}>
                  {children}
                </Output>
              ),
              {
                visitDirectory: directory => {
                  if (this.fs.existsSync(directory.path)) {
                    return;
                  }

                  this.fs.mkdirSync(directory.path);
                },
                visitFile: file => {
                  if ("contents" in file) {
                    const metadata = meta[file.path] ?? {};
                    if (metadata.kind === "builtin") {
                      if (!metadata.id) {
                        throw new Error(
                          `Built-in file "${file.path}" is missing its ID in the render metadata.`
                        );
                      }

                      this.emitBuiltinSync(
                        file.contents,
                        metadata.id,
                        {
                          skipFormat: metadata.skipFormat,
                          storage: metadata.storage,
                          extension: findFileExtension(file.path)
                        }
                      );
                    } else if (metadata.kind === "entry") {
                      this.emitEntrySync(file.contents, file.path, {
                        skipFormat: metadata.skipFormat,
                        storage: metadata.storage,
                        ...(metadata.typeDefinition ?? {})
                      });
                    } else {
                      this.emitSync(file.contents, file.path, metadata);
                    }
                  } else {
                    this.fs.copySync(file.sourcePath, file.path);
                  }
                }
              }
            );
          };

          this.render = render.bind(this);
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
