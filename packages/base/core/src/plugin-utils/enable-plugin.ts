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
import { Plugin } from "../types";
import { PluginContext } from "../types/context";

/**
 * Utility function to conditionally enable plugins based on a boolean value or a function that returns a boolean. This is useful for scenarios where you want to enable certain plugins only in specific environments (e.g., development vs production) or based on certain conditions (e.g., presence of environment variables).
 *
 * @example
 * ```ts
 * const somePlugin = <TContext extends PluginContext = PluginContext>(options: { enableThirdPlugin: boolean }) => {
 *  return [
 *    ...enable<TContext>(anotherPlugin, () => process.env.NODE_ENV === "development"),
 *    ...enable<TContext>(yetAnotherPlugin, process.env.ENABLE_YET_ANOTHER_PLUGIN === "true"),
 *    ...enable<TContext>(thirdPlugin, options.enableThirdPlugin),
 *    {
 *      name: "some-plugin",
 *      ...
 *    }
 *  ];
 * };
 * ```
 *
 * @param plugin - A single plugin or an array of plugins to conditionally enable.
 * @param condition - A boolean value or a function that returns a boolean. If it's a function, it will be executed to determine whether to enable the plugin(s). If it's a boolean, it will be used directly.
 * @returns An array of plugins that should be enabled based on the provided condition. If the condition is false, an empty array will be returned.
 */
export function enable<TContext extends PluginContext = PluginContext>(
  plugin: Plugin<TContext> | Plugin<TContext>[],
  condition: boolean | (() => boolean) = true
): Plugin<TContext>[] {
  return (isFunction(condition) && condition()) ||
    (!isFunction(condition) && condition)
    ? toArray(plugin).filter(Boolean)
    : [];
}
