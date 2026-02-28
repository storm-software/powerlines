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
import { resolveOptions as resolveEsbuildOptions } from "@powerlines/plugin-esbuild/helpers/resolve-options";
import { resolveOptions as resolveRolldownOptions } from "@powerlines/plugin-rolldown/helpers/resolve-options";
import { resolveOptions as resolveRollupOptions } from "@powerlines/plugin-rollup/helpers/resolve-options";
import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import { ESBuildOptions } from "vite";
import { VitePluginResolvedConfig } from "../types";
import { ViteOptions } from "../types/build";

export const DEFAULT_VITE_CONFIG: Partial<ViteOptions> = {
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
export function resolveOptions(context: Context): ViteOptions {
  return defu(
    {
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
      }
    },
    (context.config as VitePluginResolvedConfig).vite
      ? defu(
          (context.config as VitePluginResolvedConfig).vite,
          {
            optimizeDeps:
              (context.config as VitePluginResolvedConfig).vite?.optimizeDeps ??
              {}
          },
          {
            optimizeDeps: {
              extensions: context.config.resolve.extensions
            }
          }
        )
      : {},
    {
      define: context.config.define,
      rootDir: context.fs.existsSync(joinPaths(context.config.root, "src"))
        ? joinPaths(context.config.root, "src")
        : context.config.root,
      platform: context.config.platform,
      mode:
        context.config.mode === "development" ? "development" : "production",
      cacheDir: joinPaths(context.cachePath, "vite"),
      build: {
        minify: context.config.mode !== "development",
        metafile: context.config.mode === "development",
        sourcemap: context.config.mode === "development",
        outDir: context.config.output.buildPath,
        tsconfig: context.tsconfig.tsconfigFilePath,
        tsconfigRaw: context.tsconfig.tsconfigJson
      },
      esbuild: resolveEsbuildOptions(context) as ESBuildOptions,
      optimizeDeps: {
        rolldownOptions: resolveRolldownOptions(context),
        rollupOptions: resolveRollupOptions(context),
        esbuildOptions: resolveEsbuildOptions(context)
      },
      logLevel: context.config.logLevel ?? undefined,
      envDir: context.config.root
    } as ViteOptions,
    DEFAULT_VITE_CONFIG
  ) as ViteOptions;
}
