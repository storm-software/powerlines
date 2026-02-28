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

import { resolveOptions } from "@powerlines/plugin-rolldown/helpers/resolve-options";
import {
  RolldownPluginContext,
  RolldownPluginUserConfig
} from "@powerlines/plugin-rolldown/types/plugin";
import { defu } from "defu";
import type { InputOptions } from "rolldown";
import { createRolldownPlugin } from "unplugin";
import { createUnpluginFactory } from "./unplugin";

export { default as plugin } from "@powerlines/plugin-rolldown";

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
export const rolldown = createRolldownPlugin<Partial<RolldownPluginUserConfig>>(
  createUnpluginFactory<RolldownPluginContext>("rolldown", (api, plugin) => {
    return {
      ...plugin,
      rolldown: {
        async options(options: InputOptions) {
          const merged = defu(await api.context.getEnvironment(), this);

          return defu(
            resolveOptions(merged),
            options,
            api.callHook(
              "rolldown:options",
              { environment: merged },
              options
            ) ?? {}
          );
        }
      }
    };
  })
);

export { rolldown as "module.exports" };

export default rolldown;
