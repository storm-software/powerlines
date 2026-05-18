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
import { createUnloaderPlugin } from "unplugin";
import {
  createUnpluginFactory,
  UnpluginFactoryDecorator,
  UnpluginFactoryOptions
} from "./unplugin";

/**
 * Creates a Unloader plugin factory that generates a plugin instance.
 *
 * @example
 * ```js
 * // unloader.config.js
 * import { createUnloaderFactory } from "@powerlines/unplugin/unloader";
 *
 * const powerlinesPlugin = createUnloaderFactory({ name: "example-app", ... });
 *
 * export default defineConfig({
 *   plugins: [powerlinesPlugin()],
 * });
 *
 * ```
 *
 * @param options - The options to create the plugin factory with.
 * @param decorate - A function to decorate the plugin options with additional properties or hooks. This can be used to add custom behavior to the plugin instance, such as additional hooks or configuration options. The function receives the generated plugin options and should return an object containing any additional properties or hooks to be merged into the final plugin options.
 * @returns A function that generates a Unloader plugin instance when called. The generated plugin will invoke the Powerlines API hooks during the build process, allowing you to integrate Powerlines into your Unloader build.
 */
export function createUnloaderFactory<TContext extends ExecutionContext>(
  options: Omit<UnpluginFactoryOptions, "variant"> = {},
  decorate: UnpluginFactoryDecorator<TContext> = options => options
) {
  return createUnpluginFactory({ ...options, variant: "unloader" }, unplugin =>
    decorate(unplugin as UnpluginOptions<TContext>)
  );
}

/**
 * An Unloader plugin that will invoke the Powerlines API hooks during processing.
 *
 * @example
 * ```js
 * // unloader.config.js
 * import powerlines from "@powerlines/unplugin/unloader";
 *
 * export default defineConfig({
 *   plugins: [powerlines({ name: "example-app", ... })],
 * });
 *
 * ```
 */
export const plugin = createUnloaderPlugin(createUnloaderFactory());

export default plugin;
