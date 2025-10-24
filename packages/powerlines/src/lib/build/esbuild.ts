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

import { findFileExtensionSafe } from "@stryke/path/file-path-fns";
import { replacePath } from "@stryke/path/replace";
import { isString } from "@stryke/type-checks/is-string";
import defu from "defu";
import { Format, LogLevel, Platform } from "esbuild";
import {
  ESBuildBuildConfig,
  ESBuildResolvedBuildConfig,
  TsupBuildConfig
} from "../../types/build";
import { Context } from "../../types/context";
import type { ResolvedEntryTypeDefinition } from "../../types/resolved";
import { resolveEntryInputFile, resolveEntryOutput } from "../entry";

// const resolverPlugin = (
//   context: Context,
//   options: Pick<
//     BuildResolvedConfig,
//     "external" | "noExternal" | "skipNodeModulesBundle"
//   > = {}
// ): Plugin => {
//   return {
//     name: "powerlines:resolver",
//     setup(build) {
//       const skipNodeModulesBundle =
//         options.skipNodeModulesBundle ??
//         context.config.build.skipNodeModulesBundle;
//       const external = options.external ?? context.config.build.external ?? [];
//       const noExternal =
//         options.noExternal ?? context.config.build.noExternal ?? [];
//       const resolvePatterns = skipNodeModulesBundle
//         ? tsconfigPathsToRegExp(context.tsconfig.options.paths ?? [])
//         : [];

//       const handle = async (args: OnResolveArgs) => {
//         const result = await handleResolveId(
//           context,
//           {
//             id: args.path,
//             importer: args.importer,
//             options: {
//               isEntry: false
//             }
//           },
//           {
//             skipNodeModulesBundle,
//             external,
//             noExternal,
//             resolvePatterns
//           }
//         );
//         if (!result) {
//           return;
//         }

//         return {
//           path: result?.id,
//           external: result?.external
//         };
//       };

//       build.onResolve({ filter: /.*/ }, handle);
//       build.onResolve({ filter: /^storm:/ }, handle);
//     }
//   };
// };

export const DEFAULT_ESBUILD_CONFIG: Partial<ESBuildResolvedBuildConfig> = {
  target: "esnext",
  platform: "neutral" as Platform,
  format: "esm" as Format,
  write: true,
  minify: true,
  sourcemap: false,
  bundle: true,
  treeShaking: true,
  keepNames: true,
  splitting: true,
  logLevel: "silent" as LogLevel
};

/**
 * Resolves the entry options for esbuild.
 *
 * @param context - The build context.
 * @param entryPoints - The entry points to resolve.
 * @returns The resolved entry options.
 */
export function resolveESBuildEntry(
  context: Context,
  entryPoints: ResolvedEntryTypeDefinition[] | string[] = []
): ESBuildResolvedBuildConfig["entryPoints"] {
  return entryPoints.reduce(
    (ret, entry) => {
      if (isString(entry)) {
        ret[
          replacePath(
            entry,
            context.config.sourceRoot || context.config.projectRoot
          ).replace(`.${findFileExtensionSafe(entry)}`, "")
        ] = replacePath(
          entry,
          context.config.sourceRoot || context.config.projectRoot
        );
      } else {
        ret[entry.output || resolveEntryOutput(context, entry.input || entry)] =
          resolveEntryInputFile(context, entry.input || entry);
      }

      return ret;
    },
    {} as Record<string, string>
  );
}

/**
 * Resolves the esbuild options.
 *
 * @param context - The build context.
 * @returns The resolved esbuild options.
 */
export function extractESBuildConfig(
  context: Context
): ESBuildResolvedBuildConfig {
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
      )
    },
    context.config.build.variant === "esbuild" ? context.config.override : {},
    {
      format: (Array.isArray(context.config.output.format)
        ? context.config.output.format[0]
        : context.config.output.format) as Format,
      platform: context.config.build.platform,
      treeShaking:
        Boolean((context.config.build as TsupBuildConfig)?.treeshake) ||
        (context.config.build as ESBuildBuildConfig)?.treeShaking,
      outdir: context.config.output.outputPath,
      tsconfig: context.tsconfig.tsconfigFilePath,
      tsconfigRaw: context.tsconfig.tsconfigJson
    },
    context.config.build.variant === "esbuild" ? context.config.build : {},
    {
      minify: context.config.mode !== "development",
      metafile: context.config.mode === "development",
      sourcemap: context.config.mode === "development"
    },
    DEFAULT_ESBUILD_CONFIG
  );
}
