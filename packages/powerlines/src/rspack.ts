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

import { createRspackPlugin } from "unplugin";
import { createUnpluginFactory } from "./lib/unplugin/factory";

/**
 * An Rspack plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://rspack.dev/concepts/plugins
 *
 * @example
 * ```js
 * // rspack.config.js
 * import powerlines from 'powerlines/rspack'
 *
 * default export {
 *  plugins: [powerlines()],
 * }
 * ```
 */
export const rspack = createRspackPlugin(createUnpluginFactory("rspack"));

export default rspack;
export { rspack as "module.exports" };
