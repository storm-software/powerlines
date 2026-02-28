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

import { toArray } from "@stryke/convert/to-array";
import { existsSync } from "@stryke/fs/exists";
import { listFiles } from "@stryke/fs/list-files";
import { findFileExtensionSafe } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import defu from "defu";
import type { Plugin } from "powerlines";
import { replacePathTokens } from "powerlines/plugin-utils";
import satori from "satori";
import { SatoriComponentModule } from "./types/module";
import {
  SatoriPluginContext,
  SatoriPluginOptions,
  SatoriPluginUserConfig
} from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  export interface UserConfig {
    satori?: SatoriPluginOptions;
  }
}

/**
 * A Powerlines plugin to use Untyped for code generation based on user-defined schemas.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends SatoriPluginContext = SatoriPluginContext
>(
  options: SatoriPluginOptions
): Plugin<TContext> => {
  return {
    name: "satori",
    config() {
      return {
        satori: {
          defaultOptions: {},
          width: 1200,
          height: 630,
          fonts: [],
          ...options
        }
      } as Partial<SatoriPluginUserConfig>;
    },
    async configResolved() {
      if (!this.config.satori.path) {
        throw new Error(
          "The Powerlines Satori plugin requires a \`path\` option to be specified."
        );
      }

      this.config.satori.inputs = (
        await Promise.all(
          toArray(this.config.satori.path).map(async path => {
            if (path.includes("*")) {
              return listFiles(replacePathTokens(this, path));
            }

            return replacePathTokens(this, path);
          })
        )
      )
        .flat()
        .filter(
          path =>
            path &&
            ["jsx", "tsx"].includes(findFileExtensionSafe(path)) &&
            existsSync(path)
        );
    },
    async prepare() {
      await Promise.all(
        this.config.satori.inputs.map(async input => {
          try {
            const mod =
              await this.resolver.import<SatoriComponentModule>(input);
            if (mod && mod.default) {
              const result = await satori(
                mod.default,
                defu(mod.options ?? {}, this.config.satori.defaultOptions)
              );
              if (result) {
                await this.fs.write(
                  this.config.satori.outputPath
                    ? joinPaths(
                        this.config.satori.outputPath,
                        replacePath(
                          input,
                          joinPaths(
                            this.workspaceConfig.workspaceRoot,
                            this.config.root
                          )
                        )
                      )
                    : input.replace(findFileExtensionSafe(input), "svg"),
                  result
                );
              }
            }
          } catch (error) {
            this.debug(
              `Failed to load Satori schema from ${input}: ${(error as Error).message}`
            );
          }
        })
      );
    }
  };
};

export default plugin;
