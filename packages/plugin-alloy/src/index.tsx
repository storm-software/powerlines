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

import rollupPlugin from "@alloy-js/rollup-plugin";
import { StormJSON } from "@stryke/json/storm-json";
import { Plugin } from "powerlines/types/plugin";
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
    {
      name: "alloy",
      config() {
        this.debug(
          "Updating configuration options to support Alloy-js builds."
        );

        return {
          alloy: {
            typescript: true,
            ...options
          },
          build: {
            inputOptions: {
              transform: {
                jsx: "preserve"
              }
            },
            plugins: [rollupPlugin()],
            external: [/^@alloy-js\//]
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
    }
  ] as Plugin<TContext>[];
};

export default plugin;
