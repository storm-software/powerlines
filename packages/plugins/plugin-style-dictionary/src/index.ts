/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import type { GeneratorConfigObject } from "@power-plant/core";
import type { Options as PowerPlantStyleDictionaryOptions } from "@power-plant/style-dictionary";
import styleDictionaryGenerator from "@power-plant/style-dictionary";
import powerPlant from "@powerlines/plugin-power-plant";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import defu from "defu";
import type { Plugin } from "powerlines";
import type { DesignTokens } from "style-dictionary/types";
import { resolveStyleDictionaryHooks } from "./helpers/resolve-hooks";
import type {
  StyleDictionaryPluginContext,
  StyleDictionaryPluginOptions
} from "./types/plugin";

export * from "./types";

declare module "powerlines" {
  interface Config {
    styleDictionary?: StyleDictionaryPluginOptions;
  }
}

/**
 * A Powerlines plugin to integrate Style Dictionary for code generation via Power Plant.
 *
 * @param options - The plugin options.
 * @returns Powerlines plugin instances.
 */
export const plugin = <
  TContext extends StyleDictionaryPluginContext = StyleDictionaryPluginContext
>(
  options: StyleDictionaryPluginOptions = {}
): Plugin<TContext>[] => {
  const generatorConfig = {
    ...(styleDictionaryGenerator as GeneratorConfigObject<
      DesignTokens,
      PowerPlantStyleDictionaryOptions
    >)
  } as GeneratorConfigObject<DesignTokens, PowerPlantStyleDictionaryOptions>;

  return [
    powerPlant<DesignTokens, PowerPlantStyleDictionaryOptions, TContext>(
      generatorConfig
    ),
    {
      name: "style-dictionary",
      config() {
        return {
          styleDictionary: defu(options, {
            log: {
              verbosity:
                this.config.logLevel.general === LogLevelLabel.TRACE
                  ? "verbose"
                  : this.config.logLevel.general === LogLevelLabel.DEBUG
                    ? "default"
                    : "silent"
            },
            usesDtcg: true
          })
        };
      },
      async configResolved() {
        const {
          skipBuild: _skipBuild,
          tokens,
          customActions,
          customFileHeaders,
          customFilters,
          customFormats,
          customPreprocessors,
          customParsers,
          customTransforms,
          customTransformGroups,
          hooks: existingHooks,
          ...styleDictionaryOptions
        } = this.config.styleDictionary;

        const resolvedHooks = await resolveStyleDictionaryHooks(this, {
          customActions,
          customFileHeaders,
          customFilters,
          customFormats,
          customPreprocessors,
          customParsers,
          customTransforms,
          customTransformGroups
        });

        this.config.powerplant = {
          ...generatorConfig,
          input: tokens ?? {}
        };

        this.powerplant.options = {
          ...styleDictionaryOptions,
          hooks: defu(resolvedHooks, existingHooks)
        } as TContext["powerplant"]["options"];
      },
      prepare: {
        order: "pre",
        async handler() {
          if (this.config.styleDictionary.skipBuild) {
            const noopExecute: TContext["powerplant"]["execute"] = async () =>
              ({}) as any;
            this.powerplant.execute = noopExecute;
          }
        }
      }
    }
  ];
};

export default plugin;
