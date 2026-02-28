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

import {
  createDeclarationTransformer,
  createTransformer
} from "@powerlines/deepkit/transformer";
import tsc from "@powerlines/plugin-tsc";
import { StormJSON } from "@stryke/json/storm-json";
import { Plugin, ReflectionLevel } from "powerlines";
import { DeepkitPluginContext, DeepkitPluginOptions } from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  export interface UserConfig {
    deepkit?: DeepkitPluginOptions;
  }
}

/**
 * Deepkit plugin for Powerlines.
 *
 * @param options - The Deepkit plugin user configuration options.
 * @returns A Powerlines plugin that integrates Deepkit transformations.
 */
export const plugin = <
  TContext extends DeepkitPluginContext = DeepkitPluginContext
>(
  options: DeepkitPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    tsc(options),
    {
      name: "deepkit",
      config() {
        return {
          deepkit: options ?? {},
          resolve: {
            external: [
              "@powerlines/deepkit/vendor/type-compiler",
              "@powerlines/deepkit/vendor/type-spec",
              "@powerlines/deepkit/vendor/type",
              "@powerlines/deepkit/vendor/core"
            ]
          }
        };
      },
      configResolved: {
        order: "post",
        async handler() {
          const reflection =
            this.config.deepkit.reflection ||
            this.tsconfig.tsconfigJson.compilerOptions?.reflection ||
            this.tsconfig.tsconfigJson.reflection ||
            "default";
          const reflectionLevel =
            this.config.deepkit.reflectionLevel ||
            this.tsconfig.tsconfigJson.compilerOptions?.reflectionLevel ||
            this.tsconfig.tsconfigJson.reflectionLevel ||
            "minimal";

          if (
            !this.tsconfig.tsconfigJson.reflection ||
            !this.tsconfig.tsconfigJson.reflectionLevel
          ) {
            this.tsconfig.tsconfigJson.reflection ??= reflection;
            this.tsconfig.tsconfigJson.reflectionLevel ??=
              reflectionLevel as ReflectionLevel;

            await this.fs.write(
              this.tsconfig.tsconfigFilePath,
              StormJSON.stringify(this.tsconfig.tsconfigJson)
            );
          }

          this.config.tsc ??= {} as TContext["config"]["tsc"];
          this.config.tsc.compilerOptions = {
            ...(this.config.tsc.compilerOptions ?? {}),
            exclude: this.config.deepkit.exclude ?? [],
            reflection,
            reflectionLevel,
            configFilePath: this.tsconfig.tsconfigFilePath
          };

          this.config.tsc.transformers ??= {
            before: [],
            after: []
          };

          this.config.tsc.transformers.before!.push(
            createTransformer(this, this.config.deepkit)
          );
          this.config.tsc.transformers.after!.push(
            createDeclarationTransformer(this, this.config.deepkit)
          );
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
