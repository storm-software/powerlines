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

import alloyPreset from "@alloy-js/babel-preset";
import type { Children } from "@alloy-js/core";
import { renderAsync, traverseOutput } from "@alloy-js/core";
import babel from "@powerlines/plugin-babel";
import { StormJSON } from "@stryke/json/storm-json";
import {
  findFileExtension,
  findFileExtensionSafe
} from "@stryke/path/file-path-fns";
import { Plugin } from "powerlines/types/plugin";
import { Output } from "./core/components/output";
import { MetaItem } from "./core/contexts/context";
import { unctx } from "./internal/unctx";
import { AlloyPluginContext, AlloyPluginOptions } from "./types/plugin";

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
    babel(),
    {
      name: "alloy:config",
      config() {
        this.debug(
          "Updating configuration options to support Alloy-js builds."
        );

        return {
          alloy: {
            typescript: true,
            ...options
          },
          transform: {
            babel: {
              presets: [
                [
                  alloyPreset({
                    addSourceInfo: this.config.mode === "development"
                  }),
                  {},
                  (_: string, id: string) =>
                    /^(?:m|c)?tsx?$/.test(
                      findFileExtensionSafe(id, {
                        fullExtension: true
                      })
                    )
                ]
              ]
            }
          },
          build: {
            inputOptions: {
              transform: {
                jsx: "preserve"
              }
            },
            external: [/^@?powerlines\//, /^@alloy-js\//]
          }
        };
      },
      async configResolved() {
        this.debug("Ensuring TypeScript configuration is set up for Alloy-js.");
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
      }
    },
    {
      name: "alloy:attach-render",
      configResolved: {
        order: "pre",
        async handler() {
          this.debug("Attaching the `render` method to the context object.");

          this.render = async (children: Children) => {
            const meta = {} as Record<string, MetaItem>;

            await unctx.callAsync({ value: this, meta }, async () => {
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

                        this.emitBuiltinSync(file.contents, metadata.id, {
                          skipFormat: metadata.skipFormat,
                          storage: metadata.storage,
                          extension: findFileExtension(file.path)
                        });
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
            });
          };
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
