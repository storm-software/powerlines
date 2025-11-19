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

import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import { ESBuildOptions } from "vite";
import { ViteResolvedBuildConfig } from "../../types/build";
import { Context } from "../../types/context";
import { extractESBuildConfig } from "./esbuild";

export const DEFAULT_VITE_CONFIG: Partial<ViteResolvedBuildConfig> = {
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
export function extractViteConfig(context: Context): ViteResolvedBuildConfig {
  return defu(
    {
      resolve: {
        alias: context.builtins.reduce(
          (ret, id) => {
            if (!ret.find(e => e.find === id)) {
              const path = context.fs.ids[id];
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
        ),
        dedupe: context.config.build.dedupe,
        mainFields: context.config.build.mainFields,
        conditions: context.config.build.conditions,
        extensions: context.config.build.extensions
      }
    },
    context.config.build.variant === "vite"
      ? context.config.build.override
      : {},
    {
      define: context.config.build.define,
      rootDir: context.config.sourceRoot,
      platform: context.config.build.platform,
      mode:
        context.config.mode === "development" ? "development" : "production",
      cacheDir: joinPaths(context.cachePath, "vite"),
      build: {
        outDir: context.config.output.distPath,
        tsconfig: context.tsconfig.tsconfigFilePath,
        tsconfigRaw: context.tsconfig.tsconfigJson
      },
      esbuild: extractESBuildConfig(context) as ESBuildOptions,
      logLevel: context.config.logLevel ?? undefined,
      envDir: context.config.projectRoot
    },
    context.config.build.variant === "vite" ? context.config.build : {},
    {
      build: {
        minify: context.config.mode !== "development",
        metafile: context.config.mode === "development",
        sourcemap: context.config.mode === "development"
      }
    },
    DEFAULT_VITE_CONFIG
  ) as ViteResolvedBuildConfig;
}
