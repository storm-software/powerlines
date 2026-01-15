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

import alias from "@rollup/plugin-alias";
import {
  getBabelInputPlugin,
  RollupBabelInputPluginOptions
} from "@rollup/plugin-babel";
import inject from "@rollup/plugin-inject";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { toArray } from "@stryke/convert/to-array";
import { omit } from "@stryke/helpers/omit";
import { joinPaths } from "@stryke/path/join-paths";
import { isFunction } from "@stryke/type-checks/is-function";
import { isString } from "@stryke/type-checks/is-string";
import defu from "defu";
import { globSync } from "node:fs";
import { Plugin } from "rollup";
import typescriptPlugin from "rollup-plugin-typescript2";
import {
  RollupResolvedBuildConfig,
  ViteBuildConfig,
  ViteResolvedBuildConfig
} from "../../types/build";
import { Context } from "../../types/context";

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
export function extractRollupConfig(
  context: Context
): RollupResolvedBuildConfig {
  const result = defu(
    {
      input: globSync(
        toArray(context.entry).map(entry =>
          isString(entry) ? entry : entry.file
        )
      ).flat(),
      external: (
        source: string,
        importer: string | undefined,
        isResolved: boolean
      ) => {
        const externalFn =
          context.config.build.variant === "rollup" &&
          context.config.build.override.external
            ? isFunction(context.config.build.override.external)
              ? context.config.build.override.external
              : (id: string) =>
                  toArray(
                    (
                      context.config.build
                        .override as Partial<RollupResolvedBuildConfig>
                    ).external
                  ).includes(id)
            : context.config.build.variant === "vite" &&
                (context.config.build.override as ViteResolvedBuildConfig).build
                  ?.rollupOptions?.external
              ? isFunction(
                  (context.config.build.override as ViteResolvedBuildConfig)
                    .build?.rollupOptions?.external
                )
                ? (context.config.build.override as ViteResolvedBuildConfig)
                    .build?.rollupOptions?.external
                : (id: string) =>
                    toArray(
                      (context.config.build as ViteResolvedBuildConfig)?.build
                        ?.rollupOptions?.external
                    ).includes(id)
              : context.config.build.variant === "rollup" &&
                  context.config.build.external
                ? isFunction(context.config.build.external)
                  ? context.config.build.external
                  : (id: string) =>
                      toArray(
                        (context.config.build as RollupResolvedBuildConfig)
                          .external
                      ).includes(id)
                : context.config.build.variant === "vite" &&
                    (context.config.build as ViteBuildConfig).build
                      ?.rollupOptions?.external
                  ? isFunction(
                      (context.config.build as ViteBuildConfig).build
                        ?.rollupOptions?.external
                    )
                    ? (context.config.build as ViteBuildConfig).build
                        ?.rollupOptions?.external
                    : (id: string) =>
                        toArray(
                          (context.config.build as ViteBuildConfig)?.build
                            ?.rollupOptions?.external
                        ).includes(id)
                  : undefined;
        if (
          isFunction(externalFn) &&
          externalFn(source, importer, isResolved)
        ) {
          return true;
        }

        if (
          context.config.build.external &&
          toArray(context.config.build.external).includes(source)
        ) {
          return true;
        }

        if (
          context.config.build.noExternal &&
          toArray(context.config.build.noExternal).includes(source)
        ) {
          return false;
        }

        if (context.builtins.includes(source)) {
          return context.config.projectType !== "application";
        }

        return !context.config.build.skipNodeModulesBundle;
      },
      plugins: [
        typescriptPlugin({
          check: false,
          tsconfig: context.tsconfig.tsconfigFilePath
        }),
        context.config.build.define &&
          Object.keys(context.config.build.define).length > 0 &&
          replace({
            sourceMap: context.config.mode === "development",
            preventAssignment: true,
            ...(context.config.build.define ?? {})
          }),
        context.config.build.inject &&
          Object.keys(context.config.build.inject).length > 0 &&
          inject({
            sourceMap: context.config.mode === "development",
            ...context.config.build.inject
          }),
        alias({
          entries: context.builtins.reduce(
            (ret, id) => {
              if (!ret.find(e => e.find === id)) {
                const path = context.fs.paths[id];
                if (path) {
                  ret.push({ find: id, replacement: path });
                }
              }

              return ret;
            },
            (context.config.build.alias
              ? Array.isArray(context.config.build.alias)
                ? context.config.build.alias
                : Object.entries(context.config.build.alias).reduce(
                    (ret, [id, path]) => {
                      if (!ret.find(e => e.find === id)) {
                        ret.push({ find: id, replacement: path });
                      }

                      return ret;
                    },
                    [] as { find: string; replacement: string }[]
                  )
              : []) as { find: string; replacement: string }[]
          )
        }),
        getBabelInputPlugin(
          defu(context.config.transform.babel, {
            caller: {
              name: "powerlines",
              supportsStaticESM: true
            },
            cwd: context.config.projectRoot,
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
    context.config.build.variant === "rollup"
      ? context.config.build.override
      : {},
    context.config.build.variant === "vite"
      ? (context.config.build.override as ViteBuildConfig).build?.rollupOptions
      : {},
    context.config.build.variant === "rollup"
      ? omit(context.config.build, ["override", "variant"])
      : {},
    context.config.build.variant === "vite"
      ? (context.config.build as ViteBuildConfig).build?.rollupOptions
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
  ) as RollupResolvedBuildConfig;

  return result;
}
