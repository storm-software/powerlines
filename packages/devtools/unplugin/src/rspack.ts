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

import { Context, ExecutionContext, UnpluginOptions } from "@powerlines/core";
import { RspackOptionsNormalized } from "@rspack/core";
import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import { createRspackPlugin, RspackCompiler } from "unplugin";
import {
  createUnpluginFactory,
  UnpluginFactoryDecorator,
  UnpluginFactoryOptions
} from "./unplugin";

/**
 * Resolves the options for [rspack](https://rspack.rs/).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function resolveOptions(
  context: Context
): Partial<RspackOptionsNormalized> {
  return {
    output: {
      path: context.config.output.path
    },
    name: context.config.name,
    resolve: {
      alias: context.alias
    },
    external: context.config.resolve.external,
    noExternal: [
      ...(context.config.resolve.noExternal ?? []),
      ...(context.builtins ?? [])
    ],
    skipNodeModulesBundle: context.config.resolve.skipNodeModulesBundle,
    node:
      context.config.platform === "node"
        ? {
            __dirname: true,
            __filename: true,
            global: true
          }
        : false,
    mode:
      context.config.mode === "development"
        ? ("development" as const)
        : ("production" as const),
    recordsInputPath: joinPaths(
      context.cachePath,
      "rspack",
      ".rspack-records.json"
    ),
    recordsOutputPath: joinPaths(
      context.cachePath,
      "rspack",
      ".rspack-records.json"
    ),
    context: joinPaths(context.config.cwd, context.config.root),
    cache: context.config.mode === "development",
    devtool: context.config.output.sourceMap ? "source-map" : false,
    optimization: {
      minimize: context.config.output.minify
    }
  } as Partial<RspackOptionsNormalized>;
}

/**
 * Creates a Rspack plugin factory that generates a plugin instance.
 *
 * @see https://rspack.dev/concepts/plugins
 *
 * @example
 * ```ts
 * // rspack.config.ts
 * import { createRspackFactory } from "@powerlines/unplugin/rspack";
 *
 * const powerlinesPlugin = createRspackFactory({ name: "example-app", ... });
 *
 * export default defineConfig({
 *   plugins: [powerlinesPlugin()],
 * });
 *
 * ```
 *
 * @param options - The options to create the plugin factory with.
 * @param decorate - A function to decorate the plugin options with additional properties or hooks. This can be used to add custom behavior to the plugin instance, such as additional hooks or configuration options. The function receives the generated plugin options and should return an object containing any additional properties or hooks to be merged into the final plugin options.
 * @returns A function that generates a Rspack plugin instance when called. The generated plugin will invoke the Powerlines API hooks during the build process, allowing you to integrate Powerlines into your Rspack build.
 */
export function createRspackFactory<TContext extends ExecutionContext>(
  options: Omit<UnpluginFactoryOptions, "variant"> = {},
  decorate: UnpluginFactoryDecorator<TContext> = options => options
) {
  return createUnpluginFactory({ ...options, variant: "rspack" }, unplugin =>
    decorate({
      ...(unplugin as UnpluginOptions<TContext>),
      rspack(compiler: RspackCompiler) {
        compiler.hooks.beforeRun.tap("PowerlinesRspackPlugin", compiler => {
          compiler.options = defu(
            resolveOptions(unplugin.context),
            compiler.options
          ) as RspackOptionsNormalized;
        });
      }
    })
  );
}

/**
 * An Rspack plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://rspack.dev/concepts/plugins
 *
 * @example
 * ```ts
 * // rspack.config.ts
 *
 * import powerlines from "@powerlines/unplugin/rspack";
 *
 * export default {
 *  plugins: [powerlines({ name: "example-app", ... })],
 * }
 * ```
 */
export const plugin = createRspackPlugin(createRspackFactory());

export default plugin;
