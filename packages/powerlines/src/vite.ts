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

import { isDevelopmentMode, isTestMode } from "@stryke/env/environment-checks";
import defu from "defu";
import { createVitePlugin } from "unplugin";
import { extractViteConfig } from "./lib/build/vite";
import { createUnpluginFactory } from "./lib/unplugin/factory";

/**
 * A Vite plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://vitejs.dev/guide/api-plugin.html#plugin-api
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import Powerlines from 'powerlines/vite'
 *
 * export default defineConfig({
 *   plugins: [Powerlines()],
 * })
 * ```
 */
export const vite = createVitePlugin(
  createUnpluginFactory("vite", (api, plugin) => {
    return {
      ...plugin,
      vite: {
        sharedDuringBuild: true,

        async hotUpdate(options) {
          const environment = await api.context.getEnvironment();

          return api.callHook(environment, "vite:hotUpdate", options);
        },
        async config(config, env) {
          api.context.config.mode = isDevelopmentMode(env.mode)
            ? "development"
            : isTestMode(env.mode)
              ? "test"
              : "production";

          const environment = await api.context.getEnvironment();
          const result = await api.callHook(environment, "config");

          return defu(
            extractViteConfig(api.context),
            result?.build ?? {},
            config
          );
        },
        async configResolved(_config) {
          const environment = await api.context.getEnvironment();
          await api.callHook(environment, "configResolved");
        },
        async configureServer(server) {
          const environment = await api.context.getEnvironment();

          return api.callHook(environment, "vite:configureServer", server);
        },
        async configurePreviewServer(server) {
          const environment = await api.context.getEnvironment();

          return api.callHook(
            environment,
            "vite:configurePreviewServer",
            server
          );
        },
        async transformIndexHtml(html, ctx) {
          const environment = await api.context.getEnvironment();

          return api.callHook(
            environment,
            "vite:transformIndexHtml",
            html,
            ctx
          );
        },
        async handleHotUpdate(ctx) {
          const environment = await api.context.getEnvironment();

          return api.callHook(environment, "vite:handleHotUpdate", ctx);
        }
      }
    };
  })
);

export default vite;
export { vite as "module.exports" };
