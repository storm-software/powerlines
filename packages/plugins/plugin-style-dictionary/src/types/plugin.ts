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

import type { Options as PowerPlantStyleDictionaryOptions } from "@power-plant/style-dictionary";
import type {
  PowerPlantPluginContext,
  PowerPlantPluginResolvedConfig
} from "@powerlines/plugin-power-plant/types/plugin";
import { FileReferenceInput } from "@stryke/types/configuration";
import type { EnvironmentConfig, ResolvedConfig, UserConfig } from "powerlines";
import type { DesignTokens } from "style-dictionary/types";
import type {
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

export type StyleDictionaryPluginOptions = PowerPlantStyleDictionaryOptions & {
  /**
   * Design tokens passed to the Style Dictionary generator.
   *
   * @remarks
   * When omitted, tokens are loaded from `source` / `include` paths in the
   * Style Dictionary config.
   */
  tokens?: DesignTokens;

  /**
   * Whether to skip the Style Dictionary build process.
   *
   * @remarks
   * If set to `true`, the Style Dictionary build step will be skipped (ran during the "prepare" command), allowing for manual control over when the build occurs.
   *
   * @defaultValue false
   */
  skipBuild?: boolean;

  /**
   * Custom Style Dictionary actions to register.
   *
   * @remarks
   * This value can be a {@link FileReferenceInput} pointing to a module export or an actual builder function.
   */
  customActions?: FileReferenceInput | CustomActionsBuilder;

  /**
   * Custom Style Dictionary file headers to register.
   *
   * @remarks
   * This value can be a {@link FileReferenceInput} pointing to a module export or an actual builder function.
   */
  customFileHeaders?: FileReferenceInput | CustomFileHeadersBuilder;

  /**
   * Custom Style Dictionary filters to register.
   *
   * @remarks
   * This value can be a {@link FileReferenceInput} pointing to a module export or an actual builder function.
   */
  customFilters?: FileReferenceInput | CustomFiltersBuilder;

  /**
   * Custom Style Dictionary formats to register.
   *
   * @remarks
   * This value can be a {@link FileReferenceInput} pointing to a module export or an actual builder function.
   */
  customFormats?: FileReferenceInput | CustomFormatsBuilder;

  /**
   * Custom Style Dictionary preprocessors to register.
   *
   * @remarks
   * This value can be a {@link FileReferenceInput} pointing to a module export or an actual builder function.
   */
  customPreprocessors?: FileReferenceInput | CustomPreprocessorsBuilder;

  /**
   * Custom Style Dictionary parsers to register.
   *
   * @remarks
   * This value can be a {@link FileReferenceInput} pointing to a module export or an actual builder function.
   */
  customParsers?: FileReferenceInput | CustomParsersBuilder;

  /**
   * Custom Style Dictionary transform groups to register.
   *
   * @remarks
   * This value can be a {@link FileReferenceInput} pointing to a module export or an actual builder function.
   */
  customTransformGroups?: FileReferenceInput | CustomTransformGroupsBuilder;

  /**
   * Custom Style Dictionary transforms to register.
   *
   * @remarks
   * This value can be a {@link FileReferenceInput} pointing to a module export or an actual builder function.
   */
  customTransforms?: FileReferenceInput | CustomTransformsBuilder;
};

export type StyleDictionaryPluginEnvironmentConfig = EnvironmentConfig &
  PlatformConfig;

export type StyleDictionaryPluginUserConfig = UserConfig & {
  styleDictionary?: StyleDictionaryPluginOptions;
  environments?: Record<string, StyleDictionaryPluginEnvironmentConfig>;
};

export type StyleDictionaryPluginResolvedConfig = ResolvedConfig &
  PowerPlantPluginResolvedConfig<DesignTokens, PowerPlantStyleDictionaryOptions> & {
    styleDictionary: StyleDictionaryPluginOptions;
    environments: Record<string, StyleDictionaryPluginEnvironmentConfig>;
  };

export type StyleDictionaryPluginContext<
  TResolvedConfig extends StyleDictionaryPluginResolvedConfig =
    StyleDictionaryPluginResolvedConfig
> = PowerPlantPluginContext<
  DesignTokens,
  PowerPlantStyleDictionaryOptions,
  TResolvedConfig
>;
