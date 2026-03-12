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
  createCombinePlugin,
  OptionsPlugin,
  UnpluginCombineInstance
} from "unplugin-combine";

export interface CombinePluginsOptions {
  name?: string;
  plugins: OptionsPlugin[];
}

/**
 * Combines multiple plugins into a single plugin. This is useful for creating meta-plugins that encapsulate the functionality of multiple plugins, allowing users to easily include a set of related plugins with a single import.
 *
 * @param options - The options for combining plugins, including the name and the plugins to combine.
 * @returns A single plugin that combines the functionality of the provided plugins.
 */
export function combinePlugins(
  options: CombinePluginsOptions
): UnpluginCombineInstance<any> {
  const { name = "powerlines-combined ", plugins } = options;

  return createCombinePlugin(() => {
    return {
      name,
      plugins
    };
  });
}
