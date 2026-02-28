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

import { resolveEntryOutput } from "@powerlines/core/lib/entry";
import type {
  Context,
  ResolvedEntryTypeDefinition
} from "@powerlines/core/types";
import { joinPaths } from "@stryke/path/join-paths";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { camelCase } from "@stryke/string-format/camel-case";
import { isString } from "@stryke/type-checks/is-string";
import defu from "defu";
import { BuildOptions, Format, LogLevel, Platform } from "esbuild";
import { EsbuildPluginContext } from "../types/plugin";

export const DEFAULT_ESBUILD_CONFIG: Partial<BuildOptions> = {
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
export function resolveEntry(
  context: Context,
  entryPoints: ResolvedEntryTypeDefinition[] | string[] = []
): BuildOptions["entryPoints"] {
  return entryPoints.reduce(
    (ret, entry) => {
      if (isString(entry)) {
        ret[replaceExtension(replacePath(entry, context.config.root))] =
          replacePath(entry, context.config.root);
      } else {
        ret[entry.output || resolveEntryOutput(context, entry)] = entry.file;
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
export function resolveOptions(context: Context): BuildOptions {
  if (context.config.inject && Object.keys(context.config.inject).length > 0) {
    context.fs.writeSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.root,
        context.artifactsPath,
        "inject-shim.js"
      ),
      Object.entries(context.config.inject)
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
      alias: context.alias,
      inject:
        context.config.inject && Object.keys(context.config.inject).length > 0
          ? [
              joinPaths(
                context.workspaceConfig.workspaceRoot,
                context.config.root,
                context.artifactsPath,
                "inject-shim.js"
              )
            ]
          : undefined
    },
    (context as EsbuildPluginContext).config?.esbuild
      ? (context as EsbuildPluginContext).config.esbuild
      : {},
    {
      mainFields: context.config.resolve.mainFields,
      conditions: context.config.resolve.conditions,
      define: context.config.define,
      resolveExtensions: context.config.resolve.extensions,
      packages: context.config.resolve.skipNodeModulesBundle
        ? "external"
        : (context as EsbuildPluginContext).config?.esbuild
          ? ((context as EsbuildPluginContext).config?.esbuild as BuildOptions)
              .packages
          : undefined,
      format: (Array.isArray(context.config.output.format)
        ? context.config.output.format[0]
        : context.config.output.format) as Format,
      platform: context.config.platform,
      outdir: context.config.output.buildPath,
      tsconfig: context.tsconfig.tsconfigFilePath,
      minify: context.config.mode !== "development",
      metafile: context.config.mode === "development",
      sourcemap: context.config.mode === "development"
    },
    DEFAULT_ESBUILD_CONFIG
  ) as BuildOptions;
}
