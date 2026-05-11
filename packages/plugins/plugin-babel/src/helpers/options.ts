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
  PluginItem,
  PluginTarget,
  PresetItem,
  PresetTarget
} from "@babel/core";
import { Context } from "@powerlines/core";
import { isFunction } from "@stryke/type-checks/is-function";
import chalk from "chalk";
import {
  BabelTransformPluginOptions,
  BabelTransformPresetOptions,
  ResolvedBabelTransformPluginOptions,
  ResolvedBabelTransformPresetOptions
} from "../types/config";
import { getPluginName, isDuplicatePlugin, isDuplicatePreset } from "./filters";

export function resolvePluginFunction(
  context: Context,
  plugin:
    | any
    | PluginTarget
    | any[]
    | [PluginTarget, PluginItem]
    | [PluginTarget, PluginItem, string | undefined]
): BabelTransformPluginOptions {
  try {
    return Array.isArray(plugin) && plugin.length > 0 && plugin[0]
      ? isFunction(plugin[0])
        ? plugin[0](context)
        : plugin[0]
      : isFunction(plugin)
        ? plugin(context)
        : plugin;
  } catch {
    return plugin[0];
  }
}

export function resolvePresetFunction(
  context: Context,
  preset:
    | any
    | PresetTarget
    | any[]
    | [PresetTarget, PresetItem]
    | [PresetTarget, PresetItem, string | undefined]
): BabelTransformPresetOptions {
  try {
    return Array.isArray(preset) && preset.length > 0 && preset[0]
      ? isFunction(preset[0])
        ? preset[0](context)
        : preset[0]
      : isFunction(preset)
        ? preset(context)
        : preset;
  } catch {
    return preset[0];
  }
}

/**
 * Resolve the [Babel](https://babeljs.io/) plugin.
 *
 * @param context - The context for the transformation.
 * @param code - The code to be transformed.
 * @param id - The ID of the source file.
 * @param plugin - The Babel plugin to resolve.
 * @returns The resolved Babel plugin options, or undefined if the plugin is filtered out.
 */
export function resolveBabelPlugin(
  context: Context,
  code: string,
  id: string,
  plugin: BabelTransformPluginOptions
): ResolvedBabelTransformPluginOptions | undefined {
  if (Array.isArray(plugin) && plugin.length > 0 && plugin[0]) {
    if (
      plugin.length > 2 &&
      plugin[2] &&
      isFunction(plugin[2]) &&
      !plugin[2](code, id)
    ) {
      context.trace(
        `Skipping filtered Babel plugin ${chalk.bold.cyanBright(
          getPluginName(plugin) || "unnamed"
        )} for ${id}`
      );

      return undefined;
    }

    return (
      plugin.length > 2
        ? [resolvePluginFunction(context, plugin), plugin[1], plugin[2]]
        : [resolvePluginFunction(context, plugin), plugin[1], null]
    ) as ResolvedBabelTransformPluginOptions;
  }

  return [
    resolvePluginFunction(context, plugin),
    {},
    null
  ] as ResolvedBabelTransformPluginOptions;
}

/**
 * Resolve the [Babel](https://babeljs.io/) preset.
 *
 * @param context - The context for the transformation.
 * @param code - The code to be transformed.
 * @param id - The ID of the source file.
 * @param preset - The Babel preset to resolve.
 * @returns The resolved Babel preset options, or undefined if the preset is filtered out.
 */
export function resolveBabelPreset(
  context: Context,
  code: string,
  id: string,
  preset: BabelTransformPresetOptions
): ResolvedBabelTransformPresetOptions | undefined {
  if (Array.isArray(preset) && preset.length > 0 && preset[0]) {
    if (
      preset.length > 2 &&
      preset[2] &&
      isFunction(preset[2]) &&
      !preset[2](code, id)
    ) {
      context.trace(
        `Skipping filtered Babel preset ${chalk.bold.cyanBright(
          getPluginName(preset) || "unnamed"
        )} for ${id}`
      );

      return undefined;
    }

    return (
      preset.length > 2
        ? [resolvePresetFunction(context, preset), preset[1], preset[2]]
        : [resolvePresetFunction(context, preset), preset[1], null]
    ) as ResolvedBabelTransformPresetOptions;
  }

  return [
    resolvePresetFunction(context, preset),
    {},
    null
  ] as ResolvedBabelTransformPresetOptions;
}

/**
 * Get a list of unique Babel plugins, filtering out duplicates based on their names.
 *
 * @param plugins - The list of Babel plugins to filter for uniqueness.
 * @returns A list of unique Babel plugins.
 */
export function getUniquePlugins<
  T extends BabelTransformPluginOptions | ResolvedBabelTransformPluginOptions
>(plugins: T[]): T[] {
  return plugins.reduce((ret: T[], plugin: T) => {
    if (plugin && !isDuplicatePlugin(ret, plugin)) {
      ret.push(plugin);
    }

    return ret;
  }, []);
}

/**
 * Get a list of unique Babel presets, filtering out duplicates based on their names.
 *
 * @param presets - The list of Babel presets to filter for uniqueness.
 * @returns A list of unique Babel presets.
 */
export function getUniquePresets<
  T extends BabelTransformPresetOptions | ResolvedBabelTransformPresetOptions
>(presets: T[]): T[] {
  return presets.reduce((ret: T[], preset: T) => {
    if (preset && !isDuplicatePreset(ret, preset)) {
      ret.push(preset);
    }

    return ret;
  }, []);
}
