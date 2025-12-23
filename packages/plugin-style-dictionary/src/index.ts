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

import { LogLevelLabel } from "@storm-software/config-tools/types";
import { isFunction } from "@stryke/type-checks/is-function";
import defu from "defu";
import { resolve } from "powerlines/lib/utilities/resolve";
import { Plugin } from "powerlines/types/plugin";
import StyleDictionary from "style-dictionary";
import {
  CustomActionsBuilder,
  CustomFileHeadersBuilder,
  CustomFiltersBuilder,
  CustomParsersBuilder,
  CustomPreprocessorsBuilder,
  CustomTransformGroupsBuilder,
  CustomTransformsBuilder,
  StyleDictionaryPluginContext,
  StyleDictionaryPluginOptions,
  StyleDictionaryPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate style-dictionary for code generation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends StyleDictionaryPluginContext = StyleDictionaryPluginContext
>(
  options: StyleDictionaryPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "style-dictionary",
    config() {
      return {
        styleDictionary: defu(options, {
          log: {
            verbosity:
              this.config.logLevel === LogLevelLabel.DEBUG ||
              this.config.logLevel === LogLevelLabel.TRACE
                ? "verbose"
                : this.config.logLevel === null
                  ? "silent"
                  : undefined
          }
        })
      } as Partial<StyleDictionaryPluginUserConfig>;
    },
    async configResolved() {
      this.styleDictionary =
        this.config.styleDictionary.instance ??
        new StyleDictionary(this.config.styleDictionary);

      if (this.config.styleDictionary.customActions) {
        let builder!: CustomActionsBuilder;
        if (isFunction(this.config.styleDictionary.customActions)) {
          builder = this.config.styleDictionary.customActions;
        } else {
          builder = await resolve<CustomActionsBuilder>(
            this,
            this.config.styleDictionary.customActions
          );
        }

        Object.entries(isFunction(builder) ? builder(this) : builder).forEach(
          ([name, action]) => {
            this.styleDictionary.registerAction({
              ...action,
              name
            });
          }
        );
      }

      if (this.config.styleDictionary.customFileHeaders) {
        let builder!: CustomFileHeadersBuilder;
        if (isFunction(this.config.styleDictionary.customFileHeaders)) {
          builder = this.config.styleDictionary.customFileHeaders;
        } else {
          builder = await resolve<CustomFileHeadersBuilder>(
            this,
            this.config.styleDictionary.customFileHeaders
          );
        }

        Object.entries(isFunction(builder) ? builder(this) : builder).forEach(
          ([name, fileHeader]) => {
            this.styleDictionary.registerFileHeader({
              name,
              fileHeader
            });
          }
        );
      }

      if (this.config.styleDictionary.customFilters) {
        let builder!: CustomFiltersBuilder;
        if (isFunction(this.config.styleDictionary.customFilters)) {
          builder = this.config.styleDictionary.customFilters;
        } else {
          builder = await resolve<CustomFiltersBuilder>(
            this,
            this.config.styleDictionary.customFilters
          );
        }

        Object.entries(isFunction(builder) ? builder(this) : builder).forEach(
          ([name, filter]) => {
            this.styleDictionary.registerFilter({
              ...filter,
              name
            });
          }
        );
      }

      if (this.config.styleDictionary.customPreprocessors) {
        let builder!: CustomPreprocessorsBuilder;
        if (isFunction(this.config.styleDictionary.customPreprocessors)) {
          builder = this.config.styleDictionary.customPreprocessors;
        } else {
          builder = await resolve<CustomPreprocessorsBuilder>(
            this,
            this.config.styleDictionary.customPreprocessors
          );
        }

        Object.entries(isFunction(builder) ? builder(this) : builder).forEach(
          ([name, preprocessor]) => {
            this.styleDictionary.registerPreprocessor({
              ...preprocessor,
              name
            });
          }
        );
      }

      if (this.config.styleDictionary.customParsers) {
        let builder!: CustomParsersBuilder;
        if (isFunction(this.config.styleDictionary.customParsers)) {
          builder = this.config.styleDictionary.customParsers;
        } else {
          builder = await resolve<CustomParsersBuilder>(
            this,
            this.config.styleDictionary.customParsers
          );
        }

        Object.entries(isFunction(builder) ? builder(this) : builder).forEach(
          ([name, parser]) => {
            this.styleDictionary.registerParser({
              ...parser,
              name
            });
          }
        );
      }

      if (this.config.styleDictionary.customTransforms) {
        let builder!: CustomTransformsBuilder;
        if (isFunction(this.config.styleDictionary.customTransforms)) {
          builder = this.config.styleDictionary.customTransforms;
        } else {
          builder = await resolve<CustomTransformsBuilder>(
            this,
            this.config.styleDictionary.customTransforms
          );
        }

        Object.entries(isFunction(builder) ? builder(this) : builder).forEach(
          ([name, transform]) => {
            this.styleDictionary.registerTransform({
              ...transform,
              name
            });
          }
        );
      }

      if (this.config.styleDictionary.customTransformGroups) {
        let builder!: CustomTransformGroupsBuilder;
        if (isFunction(this.config.styleDictionary.customTransformGroups)) {
          builder = this.config.styleDictionary.customTransformGroups;
        } else {
          builder = await resolve<CustomTransformGroupsBuilder>(
            this,
            this.config.styleDictionary.customTransformGroups
          );
        }

        Object.entries(isFunction(builder) ? builder(this) : builder).forEach(
          ([name, transformGroup]) => {
            this.styleDictionary.registerTransformGroup({
              name,
              transforms: transformGroup
            });
          }
        );
      }
    },
    async prepare() {
      await this.styleDictionary.buildAllPlatforms({
        cache: !this.config.skipCache
      });
    }
  };
};

export default plugin;
