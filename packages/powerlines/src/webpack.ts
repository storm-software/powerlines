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

import { createWebpackPlugin } from "unplugin";
import { createUnpluginFactory } from "./lib/unplugin/factory";

/**
 * An Webpack plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://webpack.js.org/contribute/writing-a-plugin/#basic-plugin-architecture
 *
 * @example
 * ```js
 * // webpack.config.js
 * import Powerlines from 'powerlines/webpack'
 *
 * export default {
 *  plugins: [Powerlines()],
 * }
 * ```
 */
export const webpack = createWebpackPlugin(createUnpluginFactory("webpack"));

export default webpack;
export { webpack as "module.exports" };
