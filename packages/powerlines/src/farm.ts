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

import { createFarmPlugin } from "unplugin";
import { createUnpluginFactory } from "./unplugin";

/**
 * A Farm plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://farmjs.dev/plugins/writing-plugins
 *
 * @example
 * ```ts
 * // farm.config.ts
 * import powerlines from "powerlines/farm";
 * import { defineConfig } from "@farmfe/core";
 *
 * export default defineConfig({
 *  plugins: [powerlines({ name: "example-app", ... })],
 * });
 *
 * ```
 */
export const farm = createFarmPlugin(createUnpluginFactory("farm"));

export default farm;
export { farm as "module.exports" };
