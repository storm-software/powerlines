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

import type { VitePluginUserConfig } from "@powerlines/plugin-vite/types/plugin";
import type { AstroUserConfig } from "astro";
import vite from "./vite";

/**
 * An Astro plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://docs.astro.build/en/guides/integrations-guide/#creating-an-integration
 *
 * @example
 * ```js
 * // astro.config.mjs
 * import { defineConfig } from "astro/config";
 * import powerlines from "powerlines/astro";
 *
 * export default defineConfig({
 *   integrations: [powerlines({ name: "example-app", ... })]
 * });
 *
 * ```
 */
export const astro = (
  config: Partial<VitePluginUserConfig> = {}
): AstroUserConfig => ({
  vite: {
    plugins: [vite(config)] as NonNullable<AstroUserConfig["vite"]>["plugins"]
  }
});

export default astro;
export { astro as "module.exports" };
