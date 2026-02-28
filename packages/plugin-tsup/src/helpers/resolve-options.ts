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

import { Context, ResolvedEntryTypeDefinition } from "@powerlines/core/types";
import { resolveEntry as resolveEsbuildEntry } from "@powerlines/plugin-esbuild/helpers/resolve-options";
import { AssetGlob, Entry } from "@storm-software/build-tools/types";
import { resolveOptions as resolveOptionsBase } from "@storm-software/tsup";
import { DEFAULT_BUILD_OPTIONS } from "@storm-software/tsup/constants";
import { toArray } from "@stryke/convert/to-array";
import { getUnique } from "@stryke/helpers/get-unique";
import { appendPath } from "@stryke/path/append";
import defu from "defu";
import { Options } from "tsup";
import { TsupOptions, TsupPluginResolvedConfig } from "../types";

export const DEFAULT_TSUP_CONFIG: Partial<TsupOptions> = {
  ...DEFAULT_BUILD_OPTIONS,
  target: "esnext",
  config: false,
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
export function resolveEntry(
  context: Context,
  entryPoints: ResolvedEntryTypeDefinition[] | string[]
): Entry {
  return resolveEsbuildEntry(context, entryPoints) as Entry;
}

type TsupEsbuildOptionsHandler = NonNullable<Options["esbuildOptions"]>;
type TsupEsbuildOptionsArgs = Parameters<TsupEsbuildOptionsHandler>;
type TsupEsbuildOptions = TsupEsbuildOptionsArgs[0];
type TsupEsbuildContext = TsupEsbuildOptionsArgs[1];

interface TsupResolvedBuildConfig extends Options {
  esbuildOptions?: TsupEsbuildOptionsHandler;
  workspaceConfig?: {
    workspaceRoot: string;
  };
}

/**
 * Resolves the options for [tsup](https://github.com/egoist/tsup).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function resolveOptions(
  context: Context
): Parameters<typeof resolveOptionsBase>[0] {
  const result = defu(
    {
      entry: Object.fromEntries(
        Object.entries(resolveEntry(context, context.entry)).map(
          ([key, value]) => [key, appendPath(value, context.config.root)]
        )
      ),
      esbuildOptions: ((
        options: TsupEsbuildOptions,
        ctx: TsupEsbuildContext
      ) => {
        if ((context.config as TsupPluginResolvedConfig).tsup?.esbuildOptions) {
          (context.config as TsupPluginResolvedConfig).tsup?.esbuildOptions?.(
            options,
            ctx
          );
        }

        options.alias = {
          ...context.alias,
          ...context.builtins.reduce(
            (ret, id) => {
              const path = context.fs.paths[id];
              if (path) {
                ret[id] = path;
              }

              return ret;
            },
            {} as Record<string, string>
          ),
          ...options.alias
        };
      }) as TsupResolvedBuildConfig["esbuildOptions"],
      noExternal: context.builtins
    },
    (context.config as TsupPluginResolvedConfig).tsup
      ? (context.config as TsupPluginResolvedConfig).tsup
      : {},
    {
      name: context.config.name,
      root: context.config.root,
      projectRoot: context.config.root,
      assets: context.config.output.assets as (string | AssetGlob)[],
      resolveExtensions: context.config.resolve.extensions,
      outputPath: context.config.output.buildPath,
      tsconfig: context.tsconfig.tsconfigFilePath,
      dts:
        (context.config as TsupPluginResolvedConfig).tsup &&
        !(context.config as TsupPluginResolvedConfig).tsup?.experimentalDts
          ? {
              compilerOptions: context.tsconfig.tsconfigJson.compilerOptions
            }
          : undefined,
      format: context.config.output.format,
      mode: context.config.mode,
      treeshake: (context.config as TsupPluginResolvedConfig).tsup
        ? (context.config as TsupPluginResolvedConfig).tsup?.treeshake
        : undefined,
      minify: context.config.mode !== "development",
      metafile: context.config.mode === "development",
      sourcemap: context.config.mode === "development",
      silent:
        context.config.logLevel === null ||
        context.config.mode === "production",
      verbose:
        context.config.logLevel === null ||
        context.config.logLevel === "trace" ||
        context.config.mode === "development",
      workspaceConfig: { workspaceRoot: context.workspaceConfig.workspaceRoot }
    },
    DEFAULT_TSUP_CONFIG
  );

  result.format = getUnique(toArray(result.format));
  return result;
}
