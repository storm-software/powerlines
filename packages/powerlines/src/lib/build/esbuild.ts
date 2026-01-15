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

import { omit } from "@stryke/helpers/omit";
import { joinPaths } from "@stryke/path/join-paths";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { camelCase } from "@stryke/string-format/camel-case";
import { isString } from "@stryke/type-checks/is-string";
import defu from "defu";
import { BuildOptions, Format, LogLevel, Platform } from "esbuild";
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
          replaceExtension(
            replacePath(
              entry,
              context.config.sourceRoot || context.config.projectRoot
            )
          )
        ] = replacePath(
          entry,
          context.config.sourceRoot || context.config.projectRoot
        );
      } else {
        ret[entry.output || resolveEntryOutput(context, entry.input ?? entry)] =
          resolveEntryInputFile(context, entry.input ?? entry);
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
export function extractESBuildConfig(context: Context): BuildOptions {
  const inject =
    context.config.build.override.inject ?? context.config.build.inject;
  if (inject && Object.keys(inject).length > 0) {
    context.fs.writeSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        context.artifactsPath,
        "inject-shim.js"
      ),
      Object.entries(inject)
        .map(([key, value]) => {
          if (value) {
            if (Array.isArray(value)) {
              if (camelCase(key) !== key) {
                if (value.length === 1) {
                  return `
import ${camelCase(key)} from "${value[0]}";
export { ${camelCase(key)} as "${key}" }`;
                } else if (value.length > 1) {
                  return `
import ${value[1] === "*" ? `* as ${camelCase(key)}` : `{ ${value[1]} as ${camelCase(key)} }`} from "${value[0]}";
export { ${camelCase(key)} as "${key}" }`;
                }
              } else if (value.length === 1) {
                return `
import ${key} from "${value[0]}";
export { ${key} };`;
              } else if (value.length > 1) {
                return `
import ${value[1] === "*" ? `* as ${key}` : `{ ${value[1]} as ${key} }`} from "${value[0]}";
export { ${key} };`;
              }
            } else if (camelCase(key) !== key) {
              return `
import ${camelCase(key)} from "${value[0]}";
export { ${camelCase(key)} as "${key}" }`;
            } else {
              return `
import ${key} from "${value}";
export { ${key} };`;
            }
          }

          return "";
        })
        .join("\n")
    );
  }

  return defu(
    {
      alias: context.builtins.reduce(
        (ret, id) => {
          if (!ret[id]) {
            const path = context.fs.paths[id];
            if (path) {
              ret[id] = path;
            }
          }

          return ret;
        },
        context.config.build.alias
          ? Array.isArray(context.config.build.alias)
            ? context.config.build.alias.reduce(
                (ret, alias) => {
                  if (!ret[alias.find.toString()]) {
                    ret[alias.find.toString()] = alias.replacement;
                  }

                  return ret;
                },
                {} as Record<string, string>
              )
            : context.config.build.alias
          : {}
      ),
      inject:
        inject && Object.keys(inject).length > 0
          ? [
              joinPaths(
                context.workspaceConfig.workspaceRoot,
                context.config.projectRoot,
                context.artifactsPath,
                "inject-shim.js"
              )
            ]
          : undefined
    },
    context.config.build.variant === "esbuild"
      ? (omit(context.config.build.override, [
          "alias",
          "inject",
          "external",
          "noExternal",
          "skipNodeModulesBundle",
          "extensions"
        ]) as BuildOptions)
      : {},
    context.config.build.variant === "esbuild"
      ? (omit(context.config.build, [
          "alias",
          "inject",
          "external",
          "noExternal",
          "skipNodeModulesBundle",
          "extensions",
          "variant",
          "override"
        ]) as BuildOptions)
      : {},
    {
      mainFields: context.config.build.mainFields,
      conditions: context.config.build.conditions,
      define: context.config.build.define,
      resolveExtensions: context.config.build.extensions,
      packages: context.config.build.skipNodeModulesBundle
        ? "external"
        : context.config.build.variant === "esbuild"
          ? (context.config.build as ESBuildBuildConfig).packages
          : undefined,
      format: (Array.isArray(context.config.output.format)
        ? context.config.output.format[0]
        : context.config.output.format) as Format,
      platform: context.config.build.platform,
      treeShaking:
        Boolean((context.config.build as TsupBuildConfig)?.treeshake) ||
        (context.config.build as ESBuildBuildConfig)?.treeShaking,
      outdir: context.config.output.buildPath,
      tsconfig: context.tsconfig.tsconfigFilePath,
      minify: context.config.mode !== "development",
      metafile: context.config.mode === "development",
      sourcemap: context.config.mode === "development"
    },
    DEFAULT_ESBUILD_CONFIG
  ) as BuildOptions;
}
