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
import { dtsBundlePlugin } from "@powerlines/plugin-rollup/helpers/resolve-options";
import { RollupPluginResolvedConfig } from "@powerlines/plugin-rollup/types/plugin";
import {
  getBabelInputPlugin,
  RollupBabelInputPluginOptions
} from "@rollup/plugin-babel";
import inject from "@rollup/plugin-inject";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { toArray } from "@stryke/convert/to-array";
import { appendPath } from "@stryke/path/append";
import { joinPaths } from "@stryke/path/join-paths";
import { isString } from "@stryke/type-checks/is-string";
import defu from "defu";
import { globSync } from "node:fs";
import { RolldownOptions, RollupLog } from "rolldown";
import { viteAliasPlugin as alias } from "rolldown/experimental";
import typescriptPlugin from "rollup-plugin-typescript2";
import { RolldownPluginResolvedConfig } from "../types/plugin";

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
      ]
    },
    (context.config as RolldownPluginResolvedConfig)?.rolldown
      ? (context.config as RolldownPluginResolvedConfig)?.rolldown
      : {},
    (context.config as RollupPluginResolvedConfig)?.rollup
      ? (context.config as RollupPluginResolvedConfig)?.rollup
      : {},
    {
      resolve: {
        alias: context.alias,
        mainFields: context.config.resolve.mainFields,
        conditions: context.config.resolve.conditions,
        define: context.config.define,
        extensions: context.config.resolve.extensions
      },
      transform: {
        define: context.config.define,
        inject: context.config.inject
      },
      platform: context.config.platform,
      tsconfig: appendPath(
        context.tsconfig.tsconfigFilePath,
        context.workspaceConfig.workspaceRoot
      ),
      cache: !context.config.skipCache
        ? joinPaths(context.cachePath, "rolldown")
        : false,
      logLevel: context.config.logLevel,
      onLog(level: "info" | "debug" | "warn", log: RollupLog) {
        if (log.message?.trim()) {
          context.log(
            level === "info" ? "debug" : level,
            log.message?.trim() ?? ""
          );
        }
      },
      minify: context.config.mode === "production",
      output: [
        {
          dir: context.config.output.buildPath,
          format: "es",
          preserveModules: true,
          sourcemap: context.config.mode === "development"
        },
        {
          dir: context.config.output.buildPath,
          format: "cjs",
          preserveModules: true,
          sourcemap: context.config.mode === "development"
        }
      ]
    },
    {
      keepNames: true,
      treeshake: true,
      shimMissingExports: true,
      transform: {
        target: "esnext"
      }
    }
  );
}
