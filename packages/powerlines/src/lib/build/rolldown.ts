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
  getBabelInputPlugin,
  RollupBabelInputPluginOptions
} from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { toArray } from "@stryke/convert/to-array";
import { joinPaths } from "@stryke/path/join-paths";
import { isFunction } from "@stryke/type-checks/is-function";
import { isString } from "@stryke/type-checks/is-string";
import defu from "defu";
import { globSync } from "node:fs";
import { aliasPlugin } from "rolldown/experimental";
import typescriptPlugin from "rollup-plugin-typescript2";
import {
  RolldownResolvedBuildConfig,
  ViteResolvedBuildConfig
} from "../../types/build";
import { Context } from "../../types/context";
import { dtsBundlePlugin } from "./rollup";

/**
 * Resolves the options for [rolldown](https://rolldown.rs).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function extractRolldownConfig(
  context: Context
): RolldownResolvedBuildConfig {
  return defu(
    {
      input: globSync(
        toArray(context.config.entry).map(entry =>
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
          context.config.override.external
            ? isFunction(context.config.override.external)
              ? context.config.override.external
              : (id: string) =>
                  toArray(
                    (
                      context.config
                        .override as Partial<RolldownResolvedBuildConfig>
                    ).external
                  ).includes(id)
            : context.config.build.variant === "vite" &&
                (context.config.override as ViteResolvedBuildConfig)?.build
                  ?.rollupOptions?.external
              ? isFunction(
                  (context.config.override as ViteResolvedBuildConfig)?.build
                    ?.rollupOptions?.external
                )
                ? (context.config.override as ViteResolvedBuildConfig)?.build
                    ?.rollupOptions?.external
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
                        (context.config.build as RolldownResolvedBuildConfig)
                          .external
                      ).includes(id)
                : context.config.build.variant === "vite" &&
                    (context.config.build as ViteResolvedBuildConfig).build
                      ?.rollupOptions?.external
                  ? isFunction(
                      (context.config.build as ViteResolvedBuildConfig).build
                        ?.rollupOptions?.external
                    )
                    ? (context.config.build as ViteResolvedBuildConfig).build
                        ?.rollupOptions?.external
                    : (id: string) =>
                        toArray(
                          (context.config.build as ViteResolvedBuildConfig)
                            ?.build?.rollupOptions?.external
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

        if (Array.from(context.fs.builtinIdMap.keys()).includes(source)) {
          return context.config.projectType !== "application";
        }

        return !context.config.build.skipNodeModulesBundle;
      },
      plugins: [
        typescriptPlugin({
          check: false,
          tsconfig: context.tsconfig.tsconfigFilePath
        }),
        aliasPlugin({
          entries: context.fs.builtinIdMap.keys().reduce(
            (ret, id) => {
              if (!ret.find(e => e.find === id)) {
                const path = context.fs.builtinIdMap.get(id);
                if (path) {
                  ret.push({ find: id, replacement: path });
                }
              }

              return ret;
            },
            [] as { find: string; replacement: string }[]
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
      ]
    },
    context.config.build.variant === "rolldown" ||
      context.config.build.variant === "rollup"
      ? context.config.override
      : {},
    context.config.build.variant === "vite"
      ? (context.config.override as ViteResolvedBuildConfig).build
          ?.rollupOptions
      : {},
    {
      resolve: {
        alias: Object.fromEntries(context.fs.builtinIdMap.entries())
      },
      platform: context.config.build.platform,
      tsconfig: context.tsconfig.tsconfigFilePath,
      cache: !context.config.skipCache
        ? joinPaths(context.cachePath, "rolldown")
        : false,
      output: {
        dir: context.config.output.outputPath
      },
      logLevel: context.config.logLevel
    },
    context.config.build.variant === "rolldown" ||
      context.config.build.variant === "rollup"
      ? context.config.build
      : {},
    context.config.build.variant === "vite"
      ? (context.config.build as ViteResolvedBuildConfig).build
      : {},
    {
      output: {
        sourcemap: context.config.mode === "development"
      },
      minify: context.config.mode === "production"
    },
    {
      jsx: "automatic",
      logLevel: "silent",
      keepNames: true,
      treeshake: true,
      output: [
        {
          format: "es",
          preserveModules: true
        },
        {
          format: "cjs",
          preserveModules: true
        }
      ]
    }
  ) as RolldownResolvedBuildConfig;
}
