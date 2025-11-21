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

import { createRolldownPlugin } from "unplugin";
import { createUnpluginFactory } from "./lib/unplugin/factory";

/**
 * A Rolldown plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://rollupjs.org/guide/en/#plugins-overview
 *
 * @example
 * ```ts
 * // rollup.config.ts
 * import powerlines from "powerlines/rollup";
 *
 * export default defineConfig({
 *   plugins: [powerlines({ name: "example-app", ... })],
 * })
 * ```
 */
export const rolldown = createRolldownPlugin(createUnpluginFactory("rolldown"));

export default rolldown;
export { rolldown as "module.exports" };
