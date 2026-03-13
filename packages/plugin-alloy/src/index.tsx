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
import babel from "@powerlines/plugin-babel";
import { StormJSON } from "@stryke/json/storm-json";
import { findFileExtension } from "@stryke/path/file-path-fns";
import type { Plugin } from "powerlines";
import type { AlloyPluginContext, AlloyPluginOptions } from "./types/plugin";

declare module "powerlines" {
  interface Config {
    alloy?: AlloyPluginOptions;
  }
}

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
          babel: {
            presets: [
              [
                alloyBabelPreset,
                {},
                (_: string, id: string) =>
                  findFileExtension(id) === "tsx" ||
                  findFileExtension(id) === "jsx"
              ]
            ]
          },
          resolve: {
            external: [/^@alloy-js\//]
          }
        };
      },
      async configResolved() {
        this.debug("Ensuring TypeScript configuration is set up for Alloy-js.");

        if (this.tsconfig.tsconfigJson.compilerOptions?.jsx !== "preserve") {
          this.tsconfig.tsconfigJson.compilerOptions ??= {};
          this.tsconfig.tsconfigJson.compilerOptions.jsx = "preserve";

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
