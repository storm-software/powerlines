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

import { isUndefined } from "@stryke/type-checks/is-undefined";
import type { BuildOptions, PluginBuild } from "esbuild";
import { createEsbuildPlugin } from "unplugin";
import { extractESBuildConfig } from "./lib/build/esbuild";
import { createUnpluginFactory } from "./lib/unplugin/factory";
import type { ESBuildResolvedBuildConfig } from "./types/build";

/**
 * An ESBuild plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://esbuild.github.io/plugins/
 *
 * @example
 * ```js
 * // esbuild.config.js
 * import powerlines from 'powerlines/esbuild'
 *
 * default export {
 *  plugins: [powerlines()],
 * }
 * ```
 */
export const esbuild = createEsbuildPlugin(
  createUnpluginFactory("esbuild", (api, plugin) => {
    return {
      ...plugin,
      esbuild: {
        config: options => {
          options ??= {} as ESBuildResolvedBuildConfig;

          const result = extractESBuildConfig(api.context);
          for (const key in result) {
            if (
              isUndefined(options[key as keyof BuildOptions]) &&
              !isUndefined(result[key as keyof ESBuildResolvedBuildConfig])
            ) {
              options[key as keyof BuildOptions] = result[
                key as keyof ESBuildResolvedBuildConfig
              ] as any;
            }
          }
        },
        setup: async (build: PluginBuild) => {
          const environment = await api.context.getEnvironment();

          return api.callHook(environment, "esbuild:setup", build);
        }
      }
    };
  })
);

export default esbuild;
export { esbuild as "module.exports" };
