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

import type { Format } from "@storm-software/build-tools/types";
import { toArray } from "@stryke/convert/to-array";
import { omit } from "@stryke/helpers/omit";
import { appendPath } from "@stryke/path/append";
import { joinPaths } from "@stryke/path/join-paths";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import { Format as TsdownFormat } from "tsdown";
import {
  ESBuildBuildConfig,
  RolldownBuildConfig,
  TsdownBuildConfig,
  TsdownResolvedBuildConfig,
  TsupBuildConfig
} from "../../types/build";
import { Context } from "../../types/context";
import { getDependencyConfig } from "./helpers";

export const DEFAULT_TSDOWN_CONFIG: Partial<TsdownResolvedBuildConfig> = {
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
export function resolveTsdownFormat(
  formats?: Format | Format[]
): TsdownFormat[] {
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
export function resolveFromTsdownFormat(
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
export function extractTsdownConfig(
  context: Context
): TsdownResolvedBuildConfig {
  const { external, noExternal } = getDependencyConfig(context);

  return defu(
    {
      entry:
        context.entry.map(entry => entry?.file).filter(Boolean).length > 0
          ? Object.fromEntries(
              context.entry
                .filter(entry => entry?.file)
                .map(entry => [
                  entry.output ||
                    replaceExtension(
                      replacePath(entry.file, context.config.sourceRoot)
                    ),
                  entry.file
                ])
            )
          : [
              joinPaths(
                context.workspaceConfig.workspaceRoot,
                context.config.sourceRoot,
                "**/*.ts"
              ),
              joinPaths(
                context.workspaceConfig.workspaceRoot,
                context.config.sourceRoot,
                "**/*.tsx"
              )
            ],
      external,
      noExternal,
      alias: context.alias,
      resolve: {
        alias: context.alias
      },
      exports:
        context.config.build.variant === "tsdown" &&
        ((context.config.build as TsdownBuildConfig).exports ||
          (context.config.build as TsdownBuildConfig).override?.exports)
          ? {
              ...(isSetObject(
                (context.config.build as TsdownBuildConfig).override?.exports
              )
                ? (context.config.build as TsdownBuildConfig).override?.exports
                : isSetObject(
                      (context.config.build as TsdownBuildConfig).exports
                    )
                  ? (context.config.build as TsdownBuildConfig).exports
                  : {}),
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
            }
          : undefined
    },
    context.config.build.variant === "tsdown"
      ? context.config.build.override
      : {},
    context.config.build.variant === "rolldown"
      ? {
          inputOptions: context.config.build.override
        }
      : {},
    context.config.build.variant === "tsdown"
      ? (omit(context.config.build, [
          "override",
          "variant",
          "external",
          "noExternal"
        ]) as TsdownBuildConfig)
      : {},
    context.config.build.variant === "rolldown"
      ? {
          inputOptions: omit(context.config.build, [
            "override",
            "variant",
            "external",
            "noExternal"
          ]) as RolldownBuildConfig
        }
      : {},
    {
      name: context.config.name,
      cwd: appendPath(
        context.config.projectRoot,
        context.workspaceConfig.workspaceRoot
      ),
      define: context.config.build.define,
      inputOptions: {
        transform: {
          inject: context.config.build.inject
        }
      },
      platform: context.config.build.platform,
      dts: true,
      outDir: appendPath(
        context.config.output.buildPath,
        context.workspaceConfig.workspaceRoot
      ),
      tsconfig: appendPath(
        context.tsconfig.tsconfigFilePath,
        context.workspaceConfig.workspaceRoot
      ),
      format: resolveTsdownFormat(context.config.output.format).filter(Boolean),
      mode: context.config.mode,
      treeshake:
        context.config.build.variant === "tsdown"
          ? (context.config.build as TsdownBuildConfig)?.treeshake
          : context.config.build.variant === "rolldown"
            ? (context.config.build as RolldownBuildConfig)?.treeshake
            : context.config.build.variant === "tsup"
              ? (context.config.build as TsupBuildConfig)?.treeshake
              : context.config.build.variant === "esbuild"
                ? (context.config.build as ESBuildBuildConfig)?.treeShaking
                : undefined,
      minify: context.config.mode === "production",
      metafile: context.config.mode === "development",
      sourcemap: context.config.mode === "development",
      debug: context.config.mode === "development",
      silent:
        context.config.logLevel === null ||
        context.config.mode === "production",
      logLevel:
        context.config.logLevel === "trace" ? "debug" : context.config.logLevel,
      customLogger: {
        level:
          context.config.logLevel === "trace"
            ? "debug"
            : context.config.logLevel,
        info: (...msgs: any[]) =>
          isSetString(formatMessage(context, ...msgs).replace(/\s+/g, "")) &&
          context.debug(formatMessage(context, ...msgs)),
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
          context.debug(formatMessage(context, ...msgs))
      }
    } as TsdownResolvedBuildConfig,
    DEFAULT_TSDOWN_CONFIG
  );
}
