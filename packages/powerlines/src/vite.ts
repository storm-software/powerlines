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
import { ViteResolvedBuildConfig } from "./types";

/**
 * A Vite plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://vitejs.dev/guide/api-plugin.html#plugin-api
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import powerlines from "powerlines/vite";
 *
 * export default defineConfig({
 *   plugins: [powerlines({ name: "example-app", ... })],
 * });
 *
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

          return api.callHook("vite:hotUpdate", { environment }, options);
        },
        async config(config, env) {
          api.context.config.mode = isDevelopmentMode(env.mode)
            ? "development"
            : isTestMode(env.mode)
              ? "test"
              : "production";

          const environment = await api.context.getEnvironment();
          const result = await api.callHook(
            "vite:config",
            { environment },
            config,
            env
          );

          return defu(
            extractViteConfig(api.context),
            // Need to use `any` here to avoid excessive type complexity
            result?.build ?? {},
            config
          ) as Omit<ViteResolvedBuildConfig, "plugins">;
        },
        async configResolved(_config) {
          const environment = await api.context.getEnvironment();

          await api.callHook("configResolved", { environment });
        },
        async configureServer(server) {
          const environment = await api.context.getEnvironment();

          return api.callHook("vite:configureServer", { environment }, server);
        },
        async configurePreviewServer(server) {
          const environment = await api.context.getEnvironment();

          return api.callHook(
            "vite:configurePreviewServer",
            { environment },
            server
          );
        },
        async transformIndexHtml(html, ctx) {
          const environment = await api.context.getEnvironment();

          return api.callHook(
            "vite:transformIndexHtml",
            { environment },
            html,
            ctx
          );
        },
        async handleHotUpdate(ctx) {
          const environment = await api.context.getEnvironment();

          return api.callHook("vite:handleHotUpdate", { environment }, ctx);
        }
      }
    };
  })
);

export default vite;
export { vite as "module.exports" };
