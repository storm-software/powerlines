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
export function extend<TContext extends PluginContext = PluginContext>(
  plugin: Plugin<TContext> | PluginFactory<TContext>,
  extension: PartialPlugin<TContext> | PartialPluginFactory<TContext>
): typeof plugin extends PluginFactory<TContext>
  ? PluginFactory<
      TContext,
      (typeof extension extends PluginFactory<TContext>
        ? Parameters<typeof extension>[0]
        : never) &
        Parameters<typeof plugin>[0]
    >
  : typeof plugin extends PluginFactory<TContext>
    ? PluginFactory<TContext>
    : Plugin<TContext> {
  if (isFunction(plugin)) {
    if (isFunction(extension)) {
      return async (
        options: Parameters<typeof plugin>[0] & Parameters<typeof extension>[0]
      ) => {
        const pluginResult = await Promise.resolve(plugin(options));
        const extensionResult = await Promise.resolve(extension(options));

        return merge(extensionResult, pluginResult) as Plugin<TContext>;
      };
    }

    return async (options: Parameters<typeof plugin>[0]) => {
      const result = await Promise.resolve(plugin(options));

      return merge(extension, result) as Plugin<TContext>;
    };
  } else if (isFunction(extension)) {
    return async (options: Parameters<typeof extension>[0]) => {
      const result = await Promise.resolve(extension(options));

      return merge(plugin, result);
    };
  }

  return merge(plugin, extension) as Plugin<TContext>;
}
