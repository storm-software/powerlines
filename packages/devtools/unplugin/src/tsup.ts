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
  ResolvedEntryTypeDefinition,
  UnresolvedContext
} from "@powerlines/core";
import { AssetGlob, Entry } from "@storm-software/build-tools/types";
import { resolveOptions as resolveOptionsBase } from "@storm-software/tsup";
import { DEFAULT_BUILD_OPTIONS } from "@storm-software/tsup/constants";
import { toArray } from "@stryke/convert/to-array";
import { getUnique } from "@stryke/helpers/get-unique";
import { appendPath } from "@stryke/path/append";
import { relativePath } from "@stryke/path/file-path-fns";
import defu from "defu";
import type { Options } from "tsup";
import esbuild, { resolveEntry as resolveEsbuildEntry } from "./esbuild";

export const DEFAULT_OPTIONS: Partial<Options> = {
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
export function resolveEntry<TContext extends UnresolvedContext>(
  context: TContext,
  entryPoints: ResolvedEntryTypeDefinition[] | string[]
): Entry {
  return resolveEsbuildEntry(context, entryPoints) as Entry;
}

type TsupEsbuildOptionsHandler = NonNullable<Options["esbuildOptions"]>;
type TsupEsbuildOptionsArgs = Parameters<TsupEsbuildOptionsHandler>;
type TsupEsbuildOptions = TsupEsbuildOptionsArgs[0];

/**
 * Resolves the options for [tsup](https://github.com/egoist/tsup).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function resolveOptions<TContext extends UnresolvedContext>(
  context: TContext
): Parameters<typeof resolveOptionsBase>[0] {
  const result = defu(
    {
      entry: Object.fromEntries(
        Object.entries(resolveEntry(context, context.entry)).map(
          ([key, value]) => [key, appendPath(value, context.config.root)]
        )
      ),
      esbuildOptions: (options: TsupEsbuildOptions) => {
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
      },
      noExternal: context.builtins
    },
    {
      name: context.config.name,
      root: context.config.root,
      projectRoot: context.config.root,
      assets: context.config.output.copy
        ? (context.config.output.copy.assets as (string | AssetGlob)[])
        : undefined,
      resolveExtensions: context.config.resolve.extensions,
      outputPath: relativePath(
        appendPath(context.config.root, context.config.cwd),
        context.config.output.path
      ),
      tsconfig: context.tsconfig.tsconfigFilePath,
      dts: {
        compilerOptions: context.tsconfig.tsconfigJson.compilerOptions
      },
      format: context.config.output.format,
      mode: context.config.mode,
      minify: context.config.output.minify,
      metafile: context.config.mode === "development",
      sourcemap: context.config.output.sourceMap,
      silent:
        context.config.logLevel.general === "silent" ||
        context.config.mode === "production",
      verbose:
        context.config.logLevel.general === "trace" ||
        context.config.mode === "development",
      workspaceConfig: { workspaceRoot: context.config.cwd }
    },
    DEFAULT_OPTIONS
  );

  result.format = getUnique(toArray(result.format));
  return result as Parameters<typeof resolveOptionsBase>[0];
}

/**
 * A Tsup configuration function that integrates Powerlines into the build process.
 *
 * @see https://tsup.egoist.dev/#/config
 *
 * @example
 * ```ts
 * // tsup.config.ts
 * import withPowerlines from "@powerlines/unplugin/tsup";
 *
 * export default withPowerlines({
 *  entry: ["src/index.ts"],
 *  format: ["cjs", "esm"],
 *  dts: true,
 *  sourcemap: true,
 *  clean: true,
 * });
 *
 * ```
 *
 * @param options - The Tsup options to merge with the Powerlines configuration.
 * @returns The merged Tsup configuration options.
 */
export function withPlugin(options: Options): Options {
  return {
    ...options,
    esbuildPlugins: [...(options.esbuildPlugins ?? []), esbuild()]
  };
}

export default withPlugin;
