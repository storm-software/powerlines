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

import { ExecutionContext, UnpluginOptions } from "@powerlines/core";
import { createFarmPlugin } from "unplugin";
import {
  createUnpluginFactory,
  UnpluginFactoryDecorator,
  UnpluginFactoryOptions
} from "./unplugin";

/**
 * Creates a Farm plugin factory that generates a plugin instance.
 *
 * @see https://farmjs.dev/plugins/writing-plugins
 *
 * @example
 * ```ts
 * // farm.config.ts
 * import { createFarmFactory } from "@powerlines/unplugin/farm";
 *
 * const powerlinesPlugin = createFarmFactory({ name: "example-app", ... });
 *
 * export default defineConfig({
 *   plugins: [powerlinesPlugin()],
 * });
 *
 * ```
 *
 * @param options - The options to create the plugin factory with.
 * @param decorate - A function to decorate the plugin options with additional properties or hooks. This can be used to add custom behavior to the plugin instance, such as additional hooks or configuration options. The function receives the generated plugin options and should return an object containing any additional properties or hooks to be merged into the final plugin options.
 * @returns A function that generates a Farm plugin instance when called. The generated plugin will invoke the Powerlines API hooks during the build process, allowing you to integrate Powerlines into your Farm build.
 */
export function createFarmFactory<TContext extends ExecutionContext>(
  options: Omit<UnpluginFactoryOptions, "variant"> = {},
  decorate: UnpluginFactoryDecorator<TContext> = options => options
) {
  return createUnpluginFactory({ ...options, variant: "farm" }, unplugin =>
    decorate(unplugin as UnpluginOptions<TContext>)
  );
}

/**
 * A Farm plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://farmjs.dev/plugins/writing-plugins
 *
 * @example
 * ```ts
 * // farm.config.ts
 * import powerlines from "@powerlines/unplugin/farm";
 * import { defineConfig } from "@farmfe/core";
 *
 * export default defineConfig({
 *  plugins: [powerlines({ name: "example-app", ... })],
 * });
 *
 * ```
 */
const farm = createFarmPlugin(createFarmFactory());

export default farm;
