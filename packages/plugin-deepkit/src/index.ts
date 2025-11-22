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
import { Plugin } from "powerlines/types/plugin";
import { ReflectionLevel } from "powerlines/types/tsconfig";
import {
  DeepkitPluginContext,
  DeepkitPluginOptions,
  DeepkitPluginUserConfig
} from "./types/plugin";

export * from "./types";

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
): Plugin<TContext> => {
  return {
    name: "deepkit",
    dependsOn: [tsc(options)],
    config() {
      return {
        transform: {
          deepkit: options ?? {}
        }
      } as Partial<DeepkitPluginUserConfig>;
    },
    configResolved: {
      order: "post",
      async handler() {
        const reflection =
          this.config.transform.deepkit.reflection ||
          this.tsconfig.tsconfigJson.compilerOptions?.reflection ||
          this.tsconfig.tsconfigJson.reflection ||
          "default";
        const reflectionLevel =
          this.config.transform.deepkit.reflectionLevel ||
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

          await this.fs.writeFile(
            this.tsconfig.tsconfigFilePath,
            StormJSON.stringify(this.tsconfig.tsconfigJson),
            { mode: "fs" }
          );
        }

        this.config.transform.tsc ??=
          {} as TContext["config"]["transform"]["tsc"];
        this.config.transform.tsc.compilerOptions = {
          ...(this.config.transform.tsc.compilerOptions ?? {}),
          exclude: this.config.transform.deepkit.exclude ?? [],
          reflection,
          reflectionLevel
        };

        this.config.transform.tsc.transformers ??= {
          before: [],
          after: []
        };

        this.config.transform.tsc.transformers.before!.push(
          createTransformer(this, this.config.transform.deepkit)
        );
        this.config.transform.tsc.transformers.after!.push(
          createDeclarationTransformer(this, this.config.transform.deepkit)
        );
      }
    }
  } as Plugin<TContext>;
};

export default plugin;
