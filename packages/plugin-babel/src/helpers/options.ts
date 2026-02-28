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

import { PluginOptions, PluginTarget } from "@babel/core";
import { Context } from "@powerlines/core/types";
import { isFunction } from "@stryke/type-checks/is-function";
import chalk from "chalk";
import {
  BabelTransformPluginOptions,
  ResolvedBabelTransformPluginOptions
} from "../types/config";
import { getPluginName } from "./filters";

export function resolvePluginFunction(
  context: Context,
  plugin:
    | any
    | PluginTarget
    | any[]
    | [PluginTarget, PluginOptions]
    | [PluginTarget, PluginOptions, string | undefined]
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

    return plugin.length > 2
      ? [resolvePluginFunction(context, plugin), plugin[1], plugin[2]]
      : [resolvePluginFunction(context, plugin), plugin[1], null];
  }

  return [resolvePluginFunction(context, plugin), {}, null];
}
