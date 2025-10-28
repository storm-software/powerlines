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

import type { AstroUserConfig } from "astro";
import type { ViteResolvedConfig } from "./types/resolved";
import PowerlinesVite from "./vite";

/**
 * An Astro plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://docs.astro.build/en/guides/integrations-guide/#creating-an-integration
 *
 * @example
 * ```js
 * // astro.config.js
 * import powerlines from 'powerlines/astro'
 *
 * default export {
 *  plugins: [powerlines()],
 * }
 * ```
 */
export const astro = (
  config: Partial<Omit<ViteResolvedConfig["userConfig"], "variant">>
): AstroUserConfig => ({
  vite: {
    plugins: [PowerlinesVite(config)] as NonNullable<
      AstroUserConfig["vite"]
    >["plugins"]
  }
});

export default astro;
export { astro as "module.exports" };
