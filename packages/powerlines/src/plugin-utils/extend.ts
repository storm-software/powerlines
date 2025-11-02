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

import defu from "defu";
import { PluginFactory } from "../types/config";
import { PluginContext } from "../types/context";
import { Plugin } from "../types/plugin";

/**
 * Adds additional helper functionality to a plugin via a plugin builder function.
 *
 * @param builder - The plugin builder function. This function receives the plugin options and returns a plugin object.
 * @returns An object representing the plugin.
 */
export function extendPlugin<TContext extends PluginContext = PluginContext>(
  builder: PluginFactory<TContext>
) {
  return async (
    options: Parameters<typeof builder>[0] &
      Partial<Omit<Plugin<TContext>, "name">>
  ) => {
    const result = await Promise.resolve(builder(options));

    return defu(options ?? {}, result) as Plugin<TContext>;
  };
}
