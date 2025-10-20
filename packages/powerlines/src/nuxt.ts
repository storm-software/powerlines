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
import "@nuxt/schema";
import PowerlinesVite from "./vite";
import PowerlinesWebpack from "./webpack";

/**
 * A Nuxt plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://nuxt.com/docs/guide/directory-structure/modules
 *
 * @example
 * ```js
 * // nuxt.config.js
 * import Powerlines from 'powerlines/nuxt'
 *
 * default export {
 *  plugins: [Powerlines()],
 * }
 * ```
 */
export const nuxt = defineNuxtModule({
  meta: {
    name: "powerlines",
    configKey: "storm"
  },
  defaults: {},
  setup(options, _nuxt) {
    addVitePlugin(() => PowerlinesVite(options));
    addWebpackPlugin(() => PowerlinesWebpack(options));
  }
});

export default nuxt;
export { nuxt as "module.exports" };
