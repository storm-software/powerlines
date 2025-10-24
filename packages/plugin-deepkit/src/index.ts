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
import { Plugin } from "powerlines/types/plugin";
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
      handler() {
        this.config.transform.tsc ??=
          {} as TContext["config"]["transform"]["tsc"];
        this.config.transform.tsc.compilerOptions = {
          ...(this.config.transform.tsc.compilerOptions ?? {}),
          exclude: this.config.transform.deepkit.exclude ?? [],
          reflection:
            this.config.transform.deepkit.reflection ||
            this.tsconfig.tsconfigJson.compilerOptions?.reflection ||
            this.tsconfig.tsconfigJson.reflection ||
            "default",
          reflectionLevel:
            this.config.transform.deepkit.reflectionLevel ||
            this.tsconfig.tsconfigJson.compilerOptions?.reflectionLevel ||
            this.tsconfig.tsconfigJson.reflectionLevel ||
            "minimal"
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
