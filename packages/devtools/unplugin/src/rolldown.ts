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

import type {
  Context,
  ExecutionContext,
  UnpluginOptions
} from "@powerlines/core";
import inject from "@rollup/plugin-inject";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { toArray } from "@stryke/convert/to-array";
import { appendPath } from "@stryke/path/append";
import { joinPaths } from "@stryke/path/join-paths";
import { isString } from "@stryke/type-checks/is-string";
import { defu } from "defu";
import { globSync } from "glob";
import type { InputOptions } from "rolldown";
import { RolldownOptions, RollupLog } from "rolldown";
import { viteAliasPlugin as alias } from "rolldown/experimental";
import typescriptPlugin from "rollup-plugin-typescript2";
import { createRolldownPlugin } from "unplugin";
import { dtsBundlePlugin } from "./rollup";
import {
  createUnpluginFactory,
  UnpluginFactoryDecorator,
  UnpluginFactoryOptions
} from "./unplugin";

export const DEFAULT_OPTIONS = {
  keepNames: true,
  treeshake: true,
  shimMissingExports: true,
  transform: {
    target: "esnext"
  }
};

/**
 * Resolves the options for [rolldown](https://rolldown.rs).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function resolveOptions(context: Context): RolldownOptions {
  return defu<RolldownOptions, any>(
    {
      input: globSync(
        toArray(context.entry).map(entry =>
          isString(entry) ? entry : entry.file
        )
      ).flat(),
      external: (source: string) => {
        if (
          context.config.resolve.external &&
          toArray(context.config.resolve.external).includes(source)
        ) {
          return true;
        }

        if (
          context.config.resolve.noExternal &&
          toArray(context.config.resolve.noExternal).includes(source)
        ) {
          return false;
        }

        if (context.builtins.includes(source)) {
          return context.config.projectType !== "application";
        }

        return !context.config.resolve.skipNodeModulesBundle;
      },
      plugins: [
        typescriptPlugin({
          check: false,
          tsconfig: context.tsconfig.tsconfigFilePath
        }),
        context.config.define &&
          Object.keys(context.config.define).length > 0 &&
          replace({
            sourceMap: context.config.mode === "development",
            preventAssignment: true,
            ...(context.config.define ?? {})
          }),
        context.config.inject &&
          Object.keys(context.config.inject).length > 0 &&
          inject({
            sourceMap: context.config.mode === "development",
            ...context.config.inject
          }),
        alias({
          entries: Object.entries(context.alias).reduce(
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
          )
        }),
        resolve({
          moduleDirectories: ["node_modules"],
          preferBuiltins: true
        }),
        dtsBundlePlugin
      ],
      resolve: {
        alias: context.alias,
        mainFields: context.config.resolve.mainFields,
        conditions: context.config.resolve.conditions,
        define: context.config.define,
        extensions: context.config.resolve.extensions
      },
      transform: {
        define: context.config.define,
        inject: context.config.inject,
        typescript: {
          target: context.tsconfig.tsconfigJson?.compilerOptions?.target
        }
      },
      platform: context.config.platform,
      tsconfig: appendPath(
        context.tsconfig.tsconfigFilePath,
        context.config.cwd
      ),
      cache: !context.config.skipCache
        ? joinPaths(context.cachePath, "rolldown")
        : false,
      logLevel:
        context.config.logLevel.general === "trace"
          ? "debug"
          : context.config.logLevel.general === "debug"
            ? "warn"
            : "error",
      onLog(level: "info" | "debug" | "warn", log: RollupLog) {
        if (log.message?.trim()) {
          if (level === "info") {
            context.logger.debug(log.message?.trim() ?? "");
          } else {
            context.logger.log(level, log.message?.trim() ?? "");
          }
        }
      },
      minify: context.config.output.minify,
      output: [
        {
          dir: context.config.output.path,
          format: "es",
          preserveModules: true,
          sourcemap: context.config.output.sourceMap
        },
        {
          dir: context.config.output.path,
          format: "cjs",
          preserveModules: true,
          sourcemap: context.config.output.sourceMap
        }
      ]
    },
    DEFAULT_OPTIONS
  );
}

/**
 * Creates a Rolldown plugin factory that generates a plugin instance.
 *
 * @see https://rolldown.rs/guide/en/#plugins-overview
 *
 * @example
 * ```ts
 * // rolldown.config.ts
 * import { createRolldownFactory } from "@powerlines/unplugin/rolldown";
 *
 * const powerlinesPlugin = createRolldownFactory({ name: "example-app", ... });
 *
 * export default defineConfig({
 *   plugins: [powerlinesPlugin()],
 * });
 *
 * ```
 *
 * @param options - The options to create the plugin factory with.
 * @param decorate - A function to decorate the plugin options with additional properties or hooks. This can be used to add custom behavior to the plugin instance, such as additional hooks or configuration options. The function receives the generated plugin options and should return an object containing any additional properties or hooks to be merged into the final plugin options.
 * @returns A function that generates a Rolldown plugin instance when called. The generated plugin will invoke the Powerlines API hooks during the build process, allowing you to integrate Powerlines into your Rolldown build.
 */
export function createRolldownFactory<TContext extends ExecutionContext>(
  options: Omit<UnpluginFactoryOptions, "variant"> = {},
  decorate: UnpluginFactoryDecorator<TContext> = options => options
) {
  return createUnpluginFactory({ ...options, variant: "rolldown" }, unplugin =>
    decorate({
      ...(unplugin as UnpluginOptions<TContext>),
      rolldown: {
        async options(options: InputOptions) {
          const environment = await unplugin.context.getEnvironment();

          return defu(
            resolveOptions(environment),
            options,
            unplugin.context.callHook(
              "rolldown:options",
              { environment },
              options
            ) ?? {}
          );
        }
      }
    })
  );
}

/**
 * A Rolldown plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://rolldown.rs/guide/en/#plugins-overview
 *
 * @example
 * ```ts
 * // rolldown.config.ts
 * import powerlines from "@powerlines/unplugin/rolldown";
 *
 * export default defineConfig({
 *   plugins: [powerlines({ name: "example-app", ... })],
 * })
 * ```
 */
const plugin = createRolldownPlugin(createRolldownFactory());

export default plugin;
