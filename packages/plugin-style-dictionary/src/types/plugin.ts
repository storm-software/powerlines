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

import { TypeDefinitionParameter } from "@stryke/types/configuration";
import { EnvironmentConfig, UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";
import StyleDictionary, { Config } from "style-dictionary";
import {
  Action,
  FileHeader,
  Filter,
  Format,
  Parser,
  PlatformConfig,
  Preprocessor,
  Transform
} from "style-dictionary/types";

type StyleDictionaryExtensionBuilder<T> = (
  extensionContext: StyleDictionaryPluginContext
) => Record<string, T>;

export type CustomActionsBuilder = StyleDictionaryExtensionBuilder<Action>;
export type CustomTransformsBuilder =
  StyleDictionaryExtensionBuilder<Transform>;
export type CustomFormatsBuilder = StyleDictionaryExtensionBuilder<Format>;
export type CustomTransformGroupsBuilder = StyleDictionaryExtensionBuilder<
  string[]
>;
export type CustomFileHeadersBuilder =
  StyleDictionaryExtensionBuilder<FileHeader>;
export type CustomFiltersBuilder = StyleDictionaryExtensionBuilder<Filter>;
export type CustomParsersBuilder = (
  extensionContext: StyleDictionaryPluginContext
) => Parser[];
export type CustomPreprocessorsBuilder =
  StyleDictionaryExtensionBuilder<Preprocessor>;

export type StyleDictionaryPluginOptions = Omit<Config, "platforms"> & {
  /**
   * Custom Style Dictionary actions to register.
   *
   * @remarks
   * This value can be a {@link TypeDefinitionParameter} pointing to a module export or an actual builder function.
   */
  customActions?: TypeDefinitionParameter | CustomActionsBuilder;

  /**
   * Custom Style Dictionary file headers to register.
   *
   * @remarks
   * This value can be a {@link TypeDefinitionParameter} pointing to a module export or an actual builder function.
   */
  customFileHeaders?: TypeDefinitionParameter | CustomFileHeadersBuilder;

  /**
   * Custom Style Dictionary filters to register.
   *
   * @remarks
   * This value can be a {@link TypeDefinitionParameter} pointing to a module export or an actual builder function.
   */
  customFilters?: TypeDefinitionParameter | CustomFiltersBuilder;

  /**
   * Custom Style Dictionary formats to register.
   *
   * @remarks
   * This value can be a {@link TypeDefinitionParameter} pointing to a module export or an actual builder function.
   */
  customFormats?: TypeDefinitionParameter | CustomFormatsBuilder;

  /**
   * Custom Style Dictionary preprocessors to register.
   *
   * @remarks
   * This value can be a {@link TypeDefinitionParameter} pointing to a module export or an actual builder function.
   */
  customPreprocessors?: TypeDefinitionParameter | CustomPreprocessorsBuilder;

  /**
   * Custom Style Dictionary parsers to register.
   *
   * @remarks
   * This value can be a {@link TypeDefinitionParameter} pointing to a module export or an actual builder function.
   */
  customParsers?: TypeDefinitionParameter | CustomParsersBuilder;

  /**
   * Custom Style Dictionary transform groups to register.
   *
   * @remarks
   * This value can be a {@link TypeDefinitionParameter} pointing to a module export or an actual builder function.
   */
  customTransformGroups?:
    | TypeDefinitionParameter
    | CustomTransformGroupsBuilder;

  /**
   * Custom Style Dictionary transforms to register.
   *
   * @remarks
   * This value can be a {@link TypeDefinitionParameter} pointing to a module export or an actual builder function.
   */
  customTransforms?: TypeDefinitionParameter | CustomTransformsBuilder;

  /**
   * An existing Style Dictionary instance to use.
   *
   * @remarks
   * If provided, this instance will be used instead of creating a new one.
   */
  instance?: StyleDictionary;
};

export type StyleDictionaryPluginEnvironmentConfig = EnvironmentConfig &
  PlatformConfig;

export type StyleDictionaryPluginUserConfig = UserConfig & {
  styleDictionary?: StyleDictionaryPluginOptions;
  environments?: Record<string, StyleDictionaryPluginEnvironmentConfig>;
};

export type StyleDictionaryPluginResolvedConfig = ResolvedConfig & {
  styleDictionary: StyleDictionaryPluginOptions;
  environments: Record<string, StyleDictionaryPluginEnvironmentConfig>;
};

export type StyleDictionaryPluginContext<
  TResolvedConfig extends StyleDictionaryPluginResolvedConfig =
    StyleDictionaryPluginResolvedConfig
> = PluginContext<TResolvedConfig> & {
  styleDictionary: StyleDictionary;
};
