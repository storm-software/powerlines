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

import { Context } from "@powerlines/core/types";
import { BabelPluginResolvedConfig } from "@powerlines/plugin-babel/types/plugin";
import alias from "@rollup/plugin-alias";
import {
  getBabelInputPlugin,
  RollupBabelInputPluginOptions
} from "@rollup/plugin-babel";
import inject from "@rollup/plugin-inject";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { toArray } from "@stryke/convert/to-array";
import { joinPaths } from "@stryke/path/join-paths";
import { isString } from "@stryke/type-checks/is-string";
import defu from "defu";
import { globSync } from "node:fs";
import type { RollupOptions } from "rollup";
import { Plugin } from "rollup";
import typescriptPlugin from "rollup-plugin-typescript2";
import { RollupPluginResolvedConfig } from "../types/plugin";

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
  const result = defu(
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
        (context.config as BabelPluginResolvedConfig).babel &&
          getBabelInputPlugin(
            defu((context.config as BabelPluginResolvedConfig).babel, {
              caller: {
                name: "powerlines",
                supportsStaticESM: true
              },
              cwd: context.config.root,
              babelrc: false,
              extensions: [".js", ".jsx", ".ts", ".tsx"],
              babelHelpers: "bundled",
              skipPreflightCheck: true,
              exclude: /node_modules/
            }) as RollupBabelInputPluginOptions
          ),
        resolve({
          moduleDirectories: ["node_modules"],
          preferBuiltins: true
        }),
        dtsBundlePlugin
      ].filter(Boolean) as Plugin[]
    },
    (context.config as RollupPluginResolvedConfig)?.rollup
      ? (context.config as RollupPluginResolvedConfig)?.rollup
      : {},
    {
      cache: !context.config.skipCache
        ? joinPaths(context.cachePath, "rollup")
        : false,
      logLevel: context.config.logLevel,
      output: [
        {
          dir: context.config.output.buildPath,
          format: "es",
          entryFileNames: "[name].js",
          preserveModules: true,
          sourcemap: context.config.mode === "development"
        },
        {
          dir: context.config.output.buildPath,
          format: "cjs",
          entryFileNames: "[name].cjs",
          preserveModules: true,
          sourcemap: context.config.mode === "development"
        }
      ]
    }
  ) as RollupOptions;

  return result;
}
