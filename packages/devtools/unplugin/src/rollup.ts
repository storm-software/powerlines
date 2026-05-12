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
import alias from "@rollup/plugin-alias";
import inject from "@rollup/plugin-inject";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { toArray } from "@stryke/convert/to-array";
import { isString } from "@stryke/type-checks/is-string";
import { defu } from "defu";
import { globSync } from "node:fs";
import type { InputOptions, RollupOptions } from "rollup";
import { Plugin } from "rollup";
import typescriptPlugin from "rollup-plugin-typescript2";
import { createRollupPlugin } from "unplugin";
import {
  createUnpluginFactory,
  UnpluginFactoryDecorator,
  UnpluginFactoryOptions
} from "./unplugin";

/**
 * A Rollup plugin to bundle TypeScript declaration files (.d.ts) alongside the JavaScript output files.
 *
 * @remarks
 * This plugin generates .d.ts files for each entry point in the bundle, ensuring that type definitions are available for consumers of the library.
 */
export const dtsBundlePlugin: Plugin = {
  name: "powerlines:dts-bundle",
  async generateBundle(_opts, bundle) {
    for (const [, file] of Object.entries(bundle)) {
      if (
        file.type === "asset" ||
        !file.isEntry ||
        file.facadeModuleId == null
      ) {
        continue;
      }

      // Replace various JavaScript file extensions (e.g., .js, .cjs, .mjs, .cjs.js, .mjs.js) with .d.ts for generating type definition file names.
      const dtsFileName = file.fileName.replace(
        /(?:\.cjs|\.mjs|\.esm\.js|\.cjs\.js|\.mjs\.js|\.js)$/,
        ".d.ts"
      );

      const relativeSourceDtsName = JSON.stringify(
        `./${file.facadeModuleId.replace(/\.[cm]?[jt]sx?$/, "")}`
      );

      this.emitFile({
        type: "asset",
        fileName: dtsFileName,
        source: file.exports.includes("default")
          ? `export * from ${relativeSourceDtsName};\nexport { default } from ${relativeSourceDtsName};\n`
          : `export * from ${relativeSourceDtsName};\n`
      });
    }
  }
};

/**
 * Resolves the options for [rollup](https://rollupjs.org).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function resolveOptions(context: Context): RollupOptions {
  return {
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
    ].filter(Boolean) as Plugin[],
    cache: !context.config.skipCache ? undefined : false,
    logLevel:
      context.config.logLevel.general === "trace"
        ? "debug"
        : context.config.logLevel.general === "debug"
          ? "warn"
          : "silent",
    output: [
      {
        dir: context.config.output.path,
        format: "es",
        entryFileNames: "[name].js",
        preserveModules: true,
        sourcemap: context.config.output.sourceMap
      },
      {
        dir: context.config.output.path,
        format: "cjs",
        entryFileNames: "[name].cjs",
        preserveModules: true,
        sourcemap: context.config.output.sourceMap
      }
    ]
  };
}

/**
 * Creates a Rollup plugin factory that generates a plugin instance.
 *
 * @see https://rollupjs.org/guide/en/#plugins-overview
 *
 * @example
 * ```ts
 * // rollup.config.ts
 * import { createRollupFactory } from "@powerlines/unplugin/rollup";
 *
 * const powerlinesPlugin = createRollupFactory({ name: "example-app", ... });
 *
 * export default defineConfig({
 *   plugins: [powerlinesPlugin()],
 * });
 *
 * ```
 *
 * @param options - The options to create the plugin factory with.
 * @param decorate - A function to decorate the plugin options with additional properties or hooks. This can be used to add custom behavior to the plugin instance, such as additional hooks or configuration options. The function receives the generated plugin options and should return an object containing any additional properties or hooks to be merged into the final plugin options.
 * @returns A function that generates a Rollup plugin instance when called. The generated plugin will invoke the Powerlines API hooks during the build process, allowing you to integrate Powerlines into your Rollup build.
 */
export function createRollupFactory<TContext extends ExecutionContext>(
  options: Omit<UnpluginFactoryOptions, "variant"> = {},
  decorate: UnpluginFactoryDecorator<TContext> = options => options
) {
  return createUnpluginFactory({ ...options, variant: "rollup" }, unplugin =>
    decorate({
      ...(unplugin as UnpluginOptions<TContext>),
      rollup: {
        async options(opts: InputOptions) {
          const environment = await unplugin.context.getEnvironment();

          return defu(
            resolveOptions(environment),
            opts,
            unplugin.context.callHook(
              "rollup:options",
              { environment },
              opts
            ) ?? {}
          );
        }
      }
    })
  );
}

/**
 * A Rollup plugin that will invoke the Powerlines API hooks during the build process.
 *
 * @see https://rollupjs.org/guide/en/#plugins-overview
 *
 * @example
 * ```ts
 * // rollup.config.ts
 *
 * import powerlines from "@powerlines/unplugin/rollup";
 *
 * export default defineConfig({
 *   plugins: [powerlines({ name: "example-app", ... })],
 * })
 * ```
 */
export const plugin = createRollupPlugin(createRollupFactory());

export { plugin as default };
