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

import { Context, ExecutionContext } from "@powerlines/core";
import { joinPaths } from "@stryke/path/join-paths";
import { DeepPartial } from "@stryke/types/base";
import defu from "defu";
import { createWebpackPlugin, WebpackCompiler } from "unplugin";
import { WebpackOptionsNormalized } from "webpack";
import { UnpluginOptions } from "./types";
import {
  createUnpluginFactory,
  UnpluginFactoryDecorator,
  UnpluginFactoryOptions
} from "./unplugin";

/**
 * Resolves the options for [webpack](https://webpack.js.org/).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function resolveOptions(
  context: Context
): DeepPartial<WebpackOptionsNormalized> {
  return {
    output: {
      path: context.config.output.path
    },
    name: context.config.name,
    resolve: {
      alias: context.alias
    },
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
    cache: {
      type: "filesystem" as const,
      cacheDirectory: joinPaths(context.cachePath, "webpack", "cache")
    },
    recordsInputPath: joinPaths(
      context.cachePath,
      "webpack",
      ".webpack-records.json"
    ),
    recordsOutputPath: joinPaths(
      context.cachePath,
      "webpack",
      ".webpack-records.json"
    ),
    context: joinPaths(context.config.cwd, context.config.root),
    devtool: context.config.output.sourceMap ? "source-map" : false,
    optimization: {
      minimize: context.config.output.minify
    }
  };
}

/**
 * Creates a Webpack plugin factory that generates a plugin instance.
 *
 * @see https://webpack.js.org/api/plugins/
 *
 * @example
 * ```ts
 * // webpack.config.ts
 * import { createWebpackFactory } from "@powerlines/unplugin/webpack";
 *
 * const powerlinesPlugin = createWebpackFactory({ name: "example-app", ... });
 *
 * export default defineConfig({
 *   plugins: [powerlinesPlugin()],
 * });
 *
 * ```
 *
 * @param options - The options to create the plugin factory with.
 * @param decorate - A function to decorate the plugin options with additional properties or hooks. This can be used to add custom behavior to the plugin instance, such as additional hooks or configuration options. The function receives the generated plugin options and should return an object containing any additional properties or hooks to be merged into the final plugin options.
 * @returns A function that generates a Webpack plugin instance when called. The generated plugin will invoke the Powerlines API hooks during the build process, allowing you to integrate Powerlines into your Webpack build.
 */
export function createWebpackFactory<TContext extends ExecutionContext>(
  options: Omit<UnpluginFactoryOptions, "variant"> = {},
  decorate: UnpluginFactoryDecorator<TContext> = options => options
) {
  return createUnpluginFactory({ ...options, variant: "webpack" }, unplugin =>
    decorate({
      ...(unplugin as UnpluginOptions<TContext>),
      webpack(compiler: WebpackCompiler) {
        compiler.hooks.beforeRun.tap("PowerlinesWebpackPlugin", compiler => {
          compiler.options = defu(
            resolveOptions(unplugin.context),
            compiler.options
          ) as WebpackOptionsNormalized;
        });
      }
    })
  );
}

/**
 * An Webpack plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://webpack.js.org/contribute/writing-a-plugin/#basic-plugin-architecture
 *
 * @example
 * ```js
 * // webpack.config.js
 * import powerlines from "@powerlines/unplugin/webpack";
 *
 * export default {
 *  plugins: [powerlines({ name: "example-app", ... })],
 * }
 * ```
 */
export const plugin = createWebpackPlugin(createWebpackFactory());

export default plugin;
