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

import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import {
  createCombinePlugin,
  OptionsPlugin,
  UnpluginCombineInstance
} from "unplugin-combine";
import { Plugin } from "../types/plugin";
import { merge } from "./merge";

/**
 * Combines multiple plugins into a single plugin instance. This is useful for creating meta-plugins that encapsulate the functionality of multiple plugins, allowing users to easily include a set of related plugins with a single import.
 *
 * @param pluginOptions - The plugin options to combine, which can be a single plugin instance or an object containing plugin instances for different build tools.
 * @returns A single plugin instance that combines the functionality of the provided plugin options.
 */
export function combinePluginOptions(
  pluginOptions: UnpluginCombineInstance<any>
) {
  return {
    async rollup() {
      return (await pluginOptions.rollup()).reduce(
        (ret, plugin) => merge(ret, plugin) as Plugin<any>,
        {} as Plugin<any>
      );
    },
    async rolldown() {
      return (await pluginOptions.rolldown()).reduce(
        (ret, plugin) => merge(ret, plugin) as Plugin<any>,
        {} as Plugin<any>
      );
    },
    async vite() {
      return (await pluginOptions.vite()).reduce(
        (ret, plugin) => merge(ret, plugin) as Plugin<any>,
        {} as Plugin<any>
      );
    },
    async esbuild() {
      return pluginOptions.esbuild();
    },
    async webpack() {
      return pluginOptions.webpack();
    },
    async rspack() {
      return pluginOptions.rspack();
    },
    get raw() {
      return pluginOptions;
    }
  };
}

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
export function combinePlugins(options: CombinePluginsOptions) {
  const {
    plugins,
    name = `powerlines-${plugins
      .filter(p => isSetObject(p) && "name" in p && isSetString(p.name))
      .map(p =>
        (p as { name: string }).name
          .replace(/^powerlines[\-_:]?/, "")
          .replace(/[\-_:]?powerlines$/, "")
      )
      .join("-")}`
  } = options;

  return combinePluginOptions(
    createCombinePlugin(() => {
      return {
        name,
        plugins
      };
    })
  );
}
