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

import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from "@nuxt/kit";
import { name, version } from "../package.json";
import { UserConfig } from "./types";
import vite from "./vite";
import webpack from "./webpack";

/**
 * A Nuxt plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://nuxt.com/docs/guide/directory-structure/modules
 *
 * @example
 * ```ts
 * // nuxt.config.ts
 * import { defineNuxtConfig } from "@nuxt/kit";
 *
 * export default defineNuxtConfig({
 *  modules: [
 *    [
 *      "powerlines/nuxt",
 *      { name: "example-app", ... }
 *    ],
 *  ],
 * });
 *
 * ```
 */
export const nuxt = defineNuxtModule<UserConfig>({
  meta: {
    name,
    version,
    configKey: "powerlines",
    compatibility: {
      builder: {
        vite: "^6.0.0"
      }
    }
  },
  defaults: {},
  setup(options) {
    addVitePlugin(() => vite(options));
    addWebpackPlugin(() => webpack(options));
  }
});

export default nuxt;
export { nuxt as "module.exports" };
