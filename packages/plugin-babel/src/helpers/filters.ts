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

import { isFunction } from "@stryke/type-checks/is-function";
import { isObject } from "@stryke/type-checks/is-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { Context } from "powerlines/types";
import {
  BabelTransformPlugin,
  BabelTransformPluginFilter,
  BabelTransformPluginOptions,
  ResolvedBabelTransformPluginOptions
} from "powerlines/types/babel";

export function getPluginName(
  plugin: BabelTransformPluginOptions
): string | undefined {
  return isSetString(plugin)
    ? plugin
    : Array.isArray(plugin) && plugin.length > 0
      ? getPluginName(plugin[0])
      : (plugin as BabelTransformPlugin).$$name ||
          (plugin as BabelTransformPlugin).name
        ? (plugin as BabelTransformPlugin).$$name ||
          (plugin as BabelTransformPlugin).name
        : undefined;
}

/**
 * Check if a Babel plugin is a duplicate of another plugin in the list.
 *
 * @param plugins - The list of existing Babel plugins.
 * @param plugin - The Babel plugin to check for duplicates.
 * @returns True if the plugin is a duplicate, false otherwise.
 */
export function isDuplicatePlugin(
  plugins: (ResolvedBabelTransformPluginOptions | undefined)[],
  plugin: BabelTransformPluginOptions
): boolean {
  return !!(
    getPluginName(plugin) &&
    plugins.some(
      existing =>
        Array.isArray(existing) &&
        getPluginName(existing[0]) === getPluginName(plugin)
    )
  );
}

/**
 * Filters a Babel plugin by its runtime ID.
 *
 * @param context - The context in which the filter is applied.
 * @param runtimeId - The runtime ID to filter by.
 * @returns A filter function that checks if a plugin's ID matches the runtime ID.
 */
export function filterPluginByRuntimeId<TContext extends Context = Context>(
  context: TContext,
  runtimeId: string
): BabelTransformPluginFilter {
  return (code: string, id: string): boolean =>
    !context.fs.isMatchingBuiltinId(runtimeId, id);
}

/**
 * Adds a filter to a Babel plugin or a list of Babel plugins.
 *
 * @param context - The context in which the plugin is being added.
 * @param plugins - The Babel plugins to add the filter to.
 * @param filter - The filter function to apply to the plugins.
 * @param name - The name of the plugin to add the filter to.
 * @returns The updated list of Babel plugins with the filter applied.
 */
export function addPluginFilter(
  context: Context,
  plugins: BabelTransformPluginOptions[],
  filter: BabelTransformPluginFilter | null | undefined,
  name: string
): BabelTransformPluginOptions[];

/**
 * Adds a filter to a Babel plugin or a list of Babel plugins.
 *
 * @param context - The context in which the plugin is being added.
 * @param plugin - The Babel plugin to add the filter to.
 * @param filter - The filter function to apply to the plugin.
 * @returns The updated Babel plugin with the filter applied.
 */
export function addPluginFilter(
  context: Context,
  plugin: BabelTransformPlugin | BabelTransformPluginOptions,
  filter: NonNullable<BabelTransformPluginFilter>
): BabelTransformPluginOptions;

/**
 * Adds a filter to a Babel plugin or a list of Babel plugins.
 *
 * @param context - The context in which the plugin is being added.
 * @param pluginOrPlugins - The Babel plugin or plugins to add the filter to.
 * @param filter - The filter function to apply to the plugins.
 * @param name - The name of the plugin to add the filter to.
 * @returns The updated list of Babel plugins with the filter applied.
 */
export function addPluginFilter<
  T extends
    | BabelTransformPlugin
    | BabelTransformPluginOptions
    | BabelTransformPluginOptions[]
>(
  context: Context,
  pluginOrPlugins: T,
  filter: NonNullable<BabelTransformPluginFilter>,
  name?: string
): T extends BabelTransformPluginOptions[]
  ? BabelTransformPluginOptions[]
  : BabelTransformPluginOptions {
  if (
    !Array.isArray(pluginOrPlugins) ||
    (!pluginOrPlugins.some(plugin => Array.isArray(plugin)) &&
      pluginOrPlugins.length < 4 &&
      pluginOrPlugins.length > 0 &&
      (isSetString(pluginOrPlugins[0]) ||
        isFunction(pluginOrPlugins[0]) ||
        (pluginOrPlugins.length > 1 && isObject(pluginOrPlugins[1])) ||
        (pluginOrPlugins.length > 2 && isObject(pluginOrPlugins[2]))))
  ) {
    return Array.isArray(pluginOrPlugins)
      ? [
          pluginOrPlugins[0],
          pluginOrPlugins.length > 1 ? pluginOrPlugins[1] : {},
          {
            filter: (code, id) =>
              filter(code, id) &&
              (pluginOrPlugins.length < 2 ||
                !isFunction(pluginOrPlugins[2]) ||
                pluginOrPlugins[2]?.(code, id))
          }
        ]
      : [
          pluginOrPlugins,
          {},
          {
            filter
          }
        ];
  }

  if (!name) {
    throw new Error(
      "No name was provided to \`addPluginFilter\`, could not find babel plugin without it."
    );
  }

  const foundIndex = pluginOrPlugins.findIndex(
    plugin => getPluginName(plugin)?.toLowerCase() === name.toLowerCase()
  );
  if (foundIndex > -1) {
    pluginOrPlugins[foundIndex] = addPluginFilter(
      context,
      pluginOrPlugins[foundIndex],
      filter,
      name
    );
  }

  return pluginOrPlugins;
}
