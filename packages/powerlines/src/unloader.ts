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

import { createUnloaderPlugin } from "unplugin";
import { createUnpluginFactory } from "./lib/unplugin/factory";

/**
 * An Unloader plugin that will invoke the Powerlines API hooks during processing.
 *
 * @example
 * ```ts
 * // unloader.config.js
 * import Powerlines from 'powerlines/unloader'
 *
 * export default defineConfig({
 *   plugins: [Powerlines()],
 * })
 * ```
 */
export const unloader = createUnloaderPlugin(createUnpluginFactory("unloader"));

export default unloader;
export { unloader as "module.exports" };
