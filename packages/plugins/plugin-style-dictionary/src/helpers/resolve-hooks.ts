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

import { isFunction } from "@stryke/type-checks/is-function";
import { resolve } from "powerlines/schema";
import type { Hooks } from "style-dictionary/types";
import { fileHeader } from "../style-dictionary/file-header";
import type {
  CustomActionsBuilder,
  CustomFileHeadersBuilder,
  CustomFiltersBuilder,
  CustomFormatsBuilder,
  CustomParsersBuilder,
  CustomPreprocessorsBuilder,
  CustomTransformGroupsBuilder,
  CustomTransformsBuilder,
  StyleDictionaryPluginContext,
  StyleDictionaryPluginOptions
} from "../types/plugin";

type CustomHookOptions = Pick<
  StyleDictionaryPluginOptions,
  | "customActions"
  | "customFileHeaders"
  | "customFilters"
  | "customFormats"
  | "customParsers"
  | "customPreprocessors"
  | "customTransforms"
  | "customTransformGroups"
>;

async function resolveBuilder<TBuilder>(
  context: StyleDictionaryPluginContext,
  input: StyleDictionaryPluginOptions[keyof CustomHookOptions]
): Promise<TBuilder> {
  if (isFunction(input)) {
    return input as TBuilder;
  }

  return resolve<TBuilder>(context, input!);
}

/**
 * Resolves Powerlines Style Dictionary custom hook builders into a Style
 * Dictionary {@link Hooks} config object for `@power-plant/style-dictionary`.
 */
export async function resolveStyleDictionaryHooks(
  context: StyleDictionaryPluginContext,
  options: CustomHookOptions
): Promise<Hooks> {
  const hooks: Hooks = {};
  const defaultFileHeader = fileHeader(context);

  hooks.fileHeaders = {
    [defaultFileHeader.name]: defaultFileHeader.fileHeader
  };

  if (options.customActions) {
    const builder = await resolveBuilder<CustomActionsBuilder>(
      context,
      options.customActions
    );
    const actions = isFunction(builder) ? builder(context) : builder;

    hooks.actions = {
      ...hooks.actions,
      ...Object.fromEntries(
        Object.entries(actions).map(([name, action]) => {
          const { name: _actionName, ...rest } = action;

          return [name, rest];
        })
      )
    };
  }

  if (options.customFileHeaders) {
    const builder = await resolveBuilder<CustomFileHeadersBuilder>(
      context,
      options.customFileHeaders
    );
    const fileHeaders = isFunction(builder) ? builder(context) : builder;

    hooks.fileHeaders = { ...hooks.fileHeaders, ...fileHeaders };
  }

  if (options.customFilters) {
    const builder = await resolveBuilder<CustomFiltersBuilder>(
      context,
      options.customFilters
    );
    const filters = isFunction(builder) ? builder(context) : builder;

    hooks.filters = {
      ...hooks.filters,
      ...Object.fromEntries(
        Object.entries(filters).map(([name, filter]) => [name, filter.filter])
      )
    };
  }

  if (options.customFormats) {
    const builder = await resolveBuilder<CustomFormatsBuilder>(
      context,
      options.customFormats
    );
    const formats = isFunction(builder) ? builder(context) : builder;

    hooks.formats = {
      ...hooks.formats,
      ...Object.fromEntries(
        Object.entries(formats).map(([name, format]) => [name, format.format])
      )
    };
  }

  if (options.customPreprocessors) {
    const builder = await resolveBuilder<CustomPreprocessorsBuilder>(
      context,
      options.customPreprocessors
    );
    const preprocessors = isFunction(builder) ? builder(context) : builder;

    hooks.preprocessors = {
      ...hooks.preprocessors,
      ...Object.fromEntries(
        Object.entries(preprocessors).map(([name, preprocessor]) => [
          name,
          preprocessor.preprocessor
        ])
      )
    };
  }

  if (options.customParsers) {
    const builder = await resolveBuilder<CustomParsersBuilder>(
      context,
      options.customParsers
    );
    const parsers = isFunction(builder) ? builder(context) : builder;

    hooks.parsers = {
      ...hooks.parsers,
      ...Object.fromEntries(
        parsers.map(({ name, ...parser }) => [name, parser])
      )
    };
  }

  if (options.customTransforms) {
    const builder = await resolveBuilder<CustomTransformsBuilder>(
      context,
      options.customTransforms
    );
    const transforms = isFunction(builder) ? builder(context) : builder;

    hooks.transforms = {
      ...hooks.transforms,
      ...Object.fromEntries(
        Object.entries(transforms).map(([name, transform]) => {
          const { name: _transformName, ...rest } = transform;

          return [name, rest];
        })
      )
    };
  }

  if (options.customTransformGroups) {
    const builder = await resolveBuilder<CustomTransformGroupsBuilder>(
      context,
      options.customTransformGroups
    );
    const transformGroups = isFunction(builder) ? builder(context) : builder;

    hooks.transformGroups = {
      ...hooks.transformGroups,
      ...transformGroups
    };
  }

  return hooks;
}
