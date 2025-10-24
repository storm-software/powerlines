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

import { AssetGlob, Entry } from "@storm-software/build-tools/types";
import { DEFAULT_BUILD_OPTIONS } from "@storm-software/tsup/constants";
import defu from "defu";
import {
  ESBuildBuildConfig,
  TsupBuildConfig,
  TsupResolvedBuildConfig
} from "../../types/build";
import { Context } from "../../types/context";
import { ResolvedEntryTypeDefinition } from "../../types/resolved";
import { resolveESBuildEntry } from "./esbuild";

export const DEFAULT_TSUP_CONFIG: Partial<TsupBuildConfig> = {
  ...DEFAULT_BUILD_OPTIONS,
  platform: "neutral",
  target: "esnext",
  config: false,
  clean: false,
  minify: true,
  sourcemap: false,
  cjsInterop: true,
  bundle: true,
  dts: true,
  shims: true,
  silent: true,
  treeshake: true,
  keepNames: true,
  splitting: true,
  banner: {}
};

/**
 * Resolves the entry options for [tsup](https://github.com/egoist/tsup).
 *
 * @param context - The build context.
 * @param entryPoints - The entry points to resolve.
 * @returns The resolved entry options.
 */
export function resolveTsupEntry(
  context: Context,
  entryPoints: ResolvedEntryTypeDefinition[] | string[]
): Entry {
  return resolveESBuildEntry(context, entryPoints) as Entry;
}

/**
 * Resolves the options for [tsup](https://github.com/egoist/tsup).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function extractTsupConfig(context: Context): TsupResolvedBuildConfig {
  return defu(
    {
      alias: context.builtins.reduce(
        (ret, id) => {
          const path = context.fs.ids[id];
          if (path) {
            ret[id] = path;
          }

          return ret;
        },
        {} as Record<string, string>
      ),
      noExternal: context.builtins
    },
    context.config.build.variant === "tsup" ? context.config.override : {},
    {
      name: context.config.name,
      assets: context.config.output.assets as (string | AssetGlob)[],
      external: context.config.build.external,
      noExternal: context.config.build.noExternal,
      skipNodeModulesBundle: context.config.build.skipNodeModulesBundle,
      outputPath: context.config.output.outputPath,
      projectRoot: context.config.projectRoot,
      tsconfig: context.tsconfig.tsconfigFilePath,
      tsconfigRaw: context.tsconfig.tsconfigJson,
      format: context.config.output.format,
      mode: context.config.mode,
      platform: context.config.build.platform,
      treeshake:
        context.config.build.variant === "tsup"
          ? (context.config.build as TsupBuildConfig)?.treeshake
          : context.config.build.variant === "tsup"
            ? (context.config.build as ESBuildBuildConfig)?.treeShaking
            : undefined
    },
    context.config.build.variant === "tsup" ? context.config.build : {},
    {
      minify: context.config.mode !== "development",
      metafile: context.config.mode === "development",
      sourcemap: context.config.mode === "development",
      dts: context.config.projectType !== "application",
      silent:
        context.config.logLevel === "silent" ||
        context.config.mode === "production",
      verbose:
        context.config.logLevel === "all" ||
        context.config.logLevel === "trace" ||
        context.config.mode === "development"
    },
    DEFAULT_TSUP_CONFIG
  );
}
