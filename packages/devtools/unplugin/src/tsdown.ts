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

import type { Context, CopyConfig, ResolveConfig } from "@powerlines/core";
import type { GetDependencyConfigResult } from "@powerlines/core/plugin-utils";
import { getDependencyConfig as _getDependencyConfig } from "@powerlines/core/plugin-utils";
import type { Format } from "@storm-software/build-tools/types";
import { toArray } from "@stryke/convert/to-array";
import { appendPath } from "@stryke/path/append";
import { relativePath } from "@stryke/path/file-path-fns";
import { globToRegex } from "@stryke/path/glob-to-regex";
import { joinPaths } from "@stryke/path/join-paths";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import { ModuleFormat } from "rolldown";
import { UserConfig as BuildOptions, Format as TsdownFormat } from "tsdown";
import type { UserConfig } from "tsdown/config";
import rolldown from "./rolldown";

/**
 * Get the {@link ResolveConfig.external | external} and {@link ResolveConfig.noExternal | noExternal} dependencies for the build configuration.
 *
 * @param context - The build context.
 * @returns The dependency configuration.
 */
export function getDependencyConfig(
  context: Context
): GetDependencyConfigResult {
  const { external, noExternal } = _getDependencyConfig(context);

  return {
    external:
      !external || external.length === 0
        ? undefined
        : external.map(ext =>
            isSetString(ext) && ext.includes("*") ? globToRegex(ext) : ext
          ),
    noExternal:
      !noExternal || noExternal.length === 0
        ? undefined
        : noExternal.map(noExt =>
            isSetString(noExt) && noExt.includes("*")
              ? globToRegex(noExt)
              : noExt
          )
  };
}

export const DEFAULT_OPTIONS: Partial<BuildOptions> = {
  platform: "neutral",
  target: "esnext",
  fixedExtension: true,
  nodeProtocol: true,
  clean: false
} as const;

/**
 * Resolves the entry options for [tsdown](https://github.com/rolldown/tsdown).
 *
 * @param formats - The formats to resolve.
 * @returns The resolved entry options.
 */
export function resolveFormat(formats?: Format | Format[]): TsdownFormat[] {
  return toArray(formats).map(format => {
    switch (format) {
      case "cjs":
        return "cjs";
      case "iife":
        return "iife";
      case "esm":
      default:
        return "esm";
    }
  });
}

/**
 * Resolves the entry options for [tsdown](https://github.com/rolldown/tsdown).
 *
 * @param formats - The formats to resolve.
 * @returns The resolved entry options.
 */
export function resolveFromFormat(
  formats?: TsdownFormat | TsdownFormat[]
): Format[] {
  return toArray(formats).map(format => {
    switch (format) {
      case "cjs":
      case "commonjs":
        return "cjs";
      case "iife":
        return "iife";
      case "esm":
      case "es":
      case "module":
      case "umd":
      default:
        return "esm";
    }
  });
}

const formatMessage = (context: Context, ...msgs: any[]) =>
  msgs
    .filter(Boolean)
    .join(" ")
    .trim()
    .replace(new RegExp(`\\[${context.config.name}\\]`, "g"), "")
    .replaceAll(/^\s+/g, "")
    .replaceAll(/\s+$/g, "")
    .trim();

/**
 * Resolves the options for [tsdown](https://github.com/rolldown/tsdown).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function resolveOptions(context: Context): BuildOptions {
  const { external, noExternal } = getDependencyConfig(context);

  return defu(
    {
      name: context.config.name,
      cwd: appendPath(context.config.root, context.config.cwd),
      entry:
        context.entry.filter(entry => entry?.file).length > 0
          ? Object.fromEntries(
              context.entry
                .filter(entry => entry?.file)
                .map(entry => [
                  entry.output ||
                    replaceExtension(
                      replacePath(
                        replacePath(
                          entry.file,
                          joinPaths(context.config.root, "src")
                        ),
                        context.entryPath
                      )
                    ),
                  entry.file
                ])
            )
          : [
              joinPaths(
                context.config.cwd,
                context.config.root,
                "src",
                "**/*.ts"
              ),
              joinPaths(
                context.config.cwd,
                context.config.root,
                "src",
                "**/*.tsx"
              )
            ],
      exports: {
        customExports: (exports: Record<string, any>) => {
          const result = Object.fromEntries(
            Object.entries(exports).map(([key, value]) => {
              if (isSetString(value)) {
                return [key, value];
              }

              const currentExport = {} as Record<string, any>;
              if (isSetString(value.require)) {
                currentExport.require = {
                  types: replaceExtension(value.require, ".d.cts", {
                    fullExtension: true
                  }),
                  default: value.require
                };
              }

              if (isSetString(value.import)) {
                currentExport.import = {
                  types: replaceExtension(value.import, ".d.mts", {
                    fullExtension: true
                  }),
                  default: value.import
                };
              }

              if (!isSetObject(value.default)) {
                if (isSetObject(currentExport.import)) {
                  currentExport.default = currentExport.import;
                } else if (isSetObject(currentExport.require)) {
                  currentExport.default = currentExport.require;
                }
              }

              return [key, currentExport];
            })
          );

          return Object.keys(result)
            .sort()
            .reduce(
              (ret, key) => {
                ret[key] = result[key];
                return ret;
              },
              {} as Record<string, any>
            );
        }
      },
      define: context.config.define,
      inputOptions: {
        transform: {
          define: context.config.define,
          inject: context.config.inject,
          typescript: {
            target: context.tsconfig.tsconfigJson?.compilerOptions?.target
          }
        }
      },
      deps: {
        neverBundle: external,
        alwaysBundle: context.config.resolve.skipNodeModulesBundle
          ? undefined
          : noExternal,
        onlyBundle: context.config.resolve.skipNodeModulesBundle
          ? noExternal
          : undefined,
        skipNodeModulesBundle: context.config.resolve.skipNodeModulesBundle
      },
      alias: context.alias,
      resolve: {
        alias: context.alias
      },
      platform: context.config.platform,
      dts: context.config.output.dts,
      outDir: relativePath(
        appendPath(context.config.root, context.config.cwd),
        context.config.output.path
      ),
      tsconfig: appendPath(
        context.tsconfig.tsconfigFilePath,
        context.config.cwd
      ),
      format: resolveFormat(context.config.output.format).filter(Boolean),
      mode: context.config.mode,
      minify: context.config.output.minify,
      metafile: context.config.mode === "development",
      sourcemap: context.config.output.sourceMap,
      debug: context.config.mode === "development",
      silent:
        context.config.logLevel.general === "silent" ||
        context.config.mode === "production",
      logLevel: context.config.logLevel.general === "trace" ? "debug" : "error",
      customLogger: {
        level: context.config.logLevel.general === "trace" ? "debug" : "error",
        info: (...msgs: any[]) =>
          isSetString(formatMessage(context, ...msgs).replace(/\s+/g, "")) &&
          context.trace(formatMessage(context, ...msgs)),
        warn: (...msgs: any[]) =>
          isSetString(formatMessage(context, ...msgs).replace(/\s+/g, "")) &&
          context.warn(formatMessage(context, ...msgs)),
        warnOnce: (...msgs: any[]) =>
          isSetString(formatMessage(context, ...msgs).replace(/\s+/g, "")) &&
          context.warn(formatMessage(context, ...msgs)),
        error: (...msgs: any[]) =>
          isSetString(formatMessage(context, ...msgs).replace(/\s+/g, "")) &&
          context.error(formatMessage(context, ...msgs)),
        success: (...msgs: any[]) =>
          isSetString(formatMessage(context, ...msgs).replace(/\s+/g, "")) &&
          context.trace(formatMessage(context, ...msgs))
      }
    },
    DEFAULT_OPTIONS
  ) as BuildOptions;
}

/**
 * A Tsdown configuration function that integrates Powerlines into the build process.
 *
 * @see https://github.com/rolldown/tsdown
 *
 * @example
 * ```ts
 * // tsdown.config.ts
 * import withPowerlines from "@powerlines/unplugin/tsdown";
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
 * @param options - The Tsdown options to merge with the Powerlines configuration.
 * @returns The merged Tsdown configuration options.
 */
export function plugin(options: UserConfig = {}): UserConfig {
  return {
    ...options,
    entry: options.entry,
    plugins: [
      rolldown({
        framework: "powerlines",
        ...options,
        output: {
          path: options.outDir,
          format: resolveFromFormat(
            options.format as ModuleFormat | ModuleFormat[]
          ),
          copy: {
            path: options.outDir!,
            assets: toArray(options.copy)
              .map(copy => {
                if (!copy) {
                  return undefined;
                }
                if (isSetString(copy)) {
                  return copy;
                }
                if (isFunction(copy)) {
                  // eslint-disable-next-line no-console
                  console.warn(
                    "Function-based copy options are not supported in Powerlines."
                  );
                  return undefined;
                }
                return {
                  input: copy.from,
                  output: copy.to
                };
              })
              .filter(Boolean) as CopyConfig["assets"]
          }
        },
        resolve: {
          external: options.external
            ? (toArray(options.external)
                .map(external => {
                  if (isFunction(external)) {
                    // eslint-disable-next-line no-console
                    console.warn(
                      "Function-based external options are not supported in Powerlines."
                    );
                    return undefined;
                  }
                  return external;
                })
                .filter(Boolean) as ResolveConfig["external"])
            : undefined,
          noExternal: options.noExternal
            ? (toArray(options.noExternal)
                .map(noExternal => {
                  if (isFunction(noExternal)) {
                    // eslint-disable-next-line no-console
                    console.warn(
                      "Function-based noExternal options are not supported in Powerlines."
                    );
                    return undefined;
                  }
                  return noExternal;
                })
                .filter(Boolean) as ResolveConfig["noExternal"])
            : undefined
        },
        tsconfig: isSetString(options.tsconfig) ? options.tsconfig : undefined
      })
    ]
  };
}

export default plugin;
