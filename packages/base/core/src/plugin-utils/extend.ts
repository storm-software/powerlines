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

import { toArray } from "@stryke/convert/to-array";
import { isFunction } from "@stryke/type-checks/is-function";
import {
  PartialPlugin,
  PartialPluginFactory,
  PluginFactory
} from "../types/config";
import { PluginContext } from "../types/context";
import { Plugin } from "../types/plugin";
import { merge } from "./merge";

/**
 * Adds additional helper functionality to a plugin via a plugin builder function.
 *
 * @param plugin - The base plugin object or factory function to extend.
 * @param extension - The plugin extension object or factory function. This function receives the plugin options and returns a plugin object.
 * @returns A function accepting the plugin options and returning the extended plugin.
 */
export function extend<
  TContext extends PluginContext = PluginContext,
  TPluginOptions = unknown,
  TExtensionOptions = unknown
>(
  plugin: PluginFactory<TContext, TPluginOptions>,
  extension: PartialPluginFactory<TContext, TExtensionOptions>
): PluginFactory<TContext, TPluginOptions & TExtensionOptions>;
export function extend<
  TContext extends PluginContext = PluginContext,
  TPluginOptions = unknown
>(
  plugin: PluginFactory<TContext, TPluginOptions>,
  extension: PartialPlugin<TContext>
): PluginFactory<TContext, TPluginOptions>;
export function extend<
  TContext extends PluginContext = PluginContext,
  TExtensionOptions = unknown
>(
  plugin: Plugin<TContext> | Plugin<TContext>[],
  extension: PartialPluginFactory<TContext, TExtensionOptions>
): PluginFactory<TContext, TExtensionOptions>;
export function extend<TContext extends PluginContext = PluginContext>(
  plugin: Plugin<TContext> | Plugin<TContext>[],
  extension: PartialPlugin<TContext>
): Plugin<TContext>[];
export function extend<TContext extends PluginContext = PluginContext>(
  plugin: Plugin<TContext> | Plugin<TContext>[] | PluginFactory<TContext, any>,
  extension: PartialPlugin<TContext> | PartialPluginFactory<TContext, any>
): PluginFactory<TContext, any> | Plugin<TContext>[] {
  if (isFunction(plugin)) {
    if (isFunction(extension)) {
      return async (options: any) => {
        const pluginResult = toArray(await Promise.resolve(plugin(options)));
        const extensionResult = toArray(
          await Promise.resolve(extension(options))
        );

        return pluginResult
          .map(p => extensionResult.map(e => merge(p, e) as Plugin<TContext>))
          .flat();
      };
    }

    return async (options: any) => {
      const result = toArray(await Promise.resolve(plugin(options)));

      return result.map(p => merge(p, extension) as Plugin<TContext>);
    };
  } else if (isFunction(extension)) {
    return async (options: any) => {
      const result = toArray(await Promise.resolve(extension(options)));

      return result
        .map(e => toArray(plugin).map(p => merge(p, e) as Plugin<TContext>))
        .flat();
    };
  }

  return toArray(plugin).map(p => merge(p, extension) as Plugin<TContext>);
}
