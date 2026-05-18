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

import {
  ExecutionContext,
  UnpluginOptions,
  UnresolvedContext
} from "@powerlines/core";
import { isDevelopmentMode, isTestMode } from "@stryke/env/environment-checks";
import { appendPath } from "@stryke/path/append";
import { relativePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import { createVitePlugin } from "unplugin";
import { ESBuildOptions, UserConfig } from "vite";
import { resolveOptions as resolveEsbuildOptions } from "./esbuild";
import { resolveOptions as resolveRolldownOptions } from "./rolldown";
import {
  createUnpluginFactory,
  UnpluginFactoryDecorator,
  UnpluginFactoryOptions
} from "./unplugin";

export const DEFAULT_OPTIONS: Partial<UserConfig> = {
  resolve: {
    extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"]
  },
  json: {
    stringify: true
  },
  logLevel: "silent",
  clearScreen: true
};

/**
 * Resolves the options for [vite](https://vitejs.dev/).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function resolveOptions<TContext extends UnresolvedContext>(
  context: TContext
): UserConfig {
  return defu(
    {
      define: context.config.define,
      root: appendPath(context.config.root, context.config.cwd),
      platform: context.config.platform,
      mode:
        context.config.mode === "development" ? "development" : "production",
      cacheDir: joinPaths(context.cachePath, "vite"),
      build: {
        minify: context.config.output.minify,
        metafile: context.config.mode === "development",
        sourcemap: context.config.output.sourceMap,
        outDir: relativePath(
          appendPath(context.config.root, context.config.cwd),
          context.config.output.path
        ),
        tsconfig: appendPath(
          context.tsconfig.tsconfigFilePath,
          context.config.cwd
        ),
        tsconfigRaw: context.tsconfig.tsconfigJson
      },
      resolve: {
        alias: Object.entries(context.alias).reduce(
          (ret, [id, path]) => {
            if (!ret.find(e => e.find === id)) {
              ret.push({
                find: id,
                replacement: path
              });
            } else {
              context.warn(
                `Duplicate alias entry for '${id}' detected. The first entry will be used.`
              );
            }

            return ret;
          },
          [] as { find: string; replacement: string }[]
        ),
        dedupe: context.config.resolve.dedupe,
        mainFields: context.config.resolve.mainFields,
        conditions: context.config.resolve.conditions,
        extensions: context.config.resolve.extensions
      },
      esbuild: resolveEsbuildOptions(context) as ESBuildOptions,
      optimizeDeps: {
        extensions: context.config.resolve.extensions,
        rolldownOptions: resolveRolldownOptions(context),
        esbuildOptions: resolveEsbuildOptions(context)
      },
      logLevel:
        context.config.logLevel.general === "trace"
          ? "info"
          : context.config.logLevel.general === "debug"
            ? "warn"
            : "error",
      clearScreen: true,
      envDir: context.config.root
    } as UserConfig,
    DEFAULT_OPTIONS
  );
}

/**
 * Creates a Vite plugin factory that generates a plugin instance.
 *
 * @see https://vitejs.dev/guide/api-plugin.html#plugin-api
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { createViteFactory } from "@powerlines/unplugin/vite";
 *
 * const powerlinesPlugin = createViteFactory({ name: "example-app", ... });
 *
 * export default defineConfig({
 *   plugins: [powerlinesPlugin()],
 * });
 *
 * ```
 *
 * @param options - The options to create the plugin factory with.
 * @param decorate - A function to decorate the plugin options with additional properties or hooks. This can be used to add custom behavior to the plugin instance, such as additional hooks or configuration options. The function receives the generated plugin options and should return an object containing any additional properties or hooks to be merged into the final plugin options.
 * @returns A function that generates a Vite plugin instance when called. The generated plugin will invoke the Powerlines API hooks during the build process, allowing you to integrate Powerlines into your Vite build.
 */
export function createViteFactory<TContext extends ExecutionContext>(
  options: Omit<UnpluginFactoryOptions, "variant"> = {},
  decorate: UnpluginFactoryDecorator<TContext> = options => options
) {
  return createUnpluginFactory({ ...options, variant: "vite" }, unplugin =>
    decorate({
      ...(unplugin as UnpluginOptions<TContext>),
      vite: {
        sharedDuringBuild: true,

        async hotUpdate(opts) {
          const environment = await unplugin.context.getEnvironment();

          return unplugin.context.callHook(
            "vite:hotUpdate",
            { environment },
            opts
          );
        },
        async config(config, env) {
          unplugin.context.config.mode = isDevelopmentMode(env.mode)
            ? "development"
            : isTestMode(env.mode)
              ? "test"
              : "production";

          const environment = await unplugin.context.getEnvironment();
          const result = await unplugin.context.callHook(
            "vite:config",
            { environment },
            config,
            env
          );

          return defu(
            resolveOptions(unplugin.context),
            result?.build ?? {},
            config
          ) as Omit<UserConfig, "plugins">;
        },
        async configResolved(_config) {
          const environment = await unplugin.context.getEnvironment();

          await unplugin.context.callHook("configResolved", { environment });
        },
        async configureServer(server) {
          const environment = await unplugin.context.getEnvironment();

          return unplugin.context.callHook(
            "vite:configureServer",
            { environment },
            server
          );
        },
        async configurePreviewServer(server) {
          const environment = await unplugin.context.getEnvironment();

          return unplugin.context.callHook(
            "vite:configurePreviewServer",
            { environment },
            server
          );
        },
        async transformIndexHtml(html, ctx) {
          const environment = await unplugin.context.getEnvironment();

          return unplugin.context.callHook(
            "vite:transformIndexHtml",
            { environment },
            html,
            ctx
          );
        },
        async handleHotUpdate(ctx) {
          const environment = await unplugin.context.getEnvironment();

          return unplugin.context.callHook(
            "vite:handleHotUpdate",
            { environment },
            ctx
          );
        }
      }
    })
  );
}

/**
 * A Vite plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://vitejs.dev/guide/api-plugin.html#plugin-api
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import powerlines from "@powerlines/unplugin/vite";
 *
 * export default defineConfig({
 *   plugins: [powerlines({ name: "example-app", ... })],
 * });
 *
 * ```
 */
export const plugin = createVitePlugin(createViteFactory());

export default plugin;
