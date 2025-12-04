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
import { parseTypeDefinition } from "@stryke/convert/parse-type-definition";
import { toArray } from "@stryke/convert/to-array";
import { omit } from "@stryke/helpers/omit";
import { appendPath } from "@stryke/path/append";
import { replacePath } from "@stryke/path/replace";
import defu from "defu";
import { Format as TsdownFormat } from "tsdown";
import {
  ESBuildBuildConfig,
  TsdownBuildConfig,
  TsdownResolvedBuildConfig,
  TsupBuildConfig
} from "../../types/build";
import { Context } from "../../types/context";

export const DEFAULT_TSDOWN_CONFIG: Partial<TsdownResolvedBuildConfig> = {
  platform: "neutral",
  target: "esnext",
  minify: true,
  sourcemap: false,
  cjsDefault: true,
  dts: true,
  shims: true,
  silent: true,
  treeshake: true,
  fixedExtension: true,
  nodeProtocol: false
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

const formatMessage = (context: Context, message: string) =>
  message.replace(new RegExp(`\\[${context.config.name}\\]`, "g"), "").trim();

/**
 * Resolves the options for [tsdown](https://github.com/rolldown/tsdown).
 *
 * @param context - The build context.
 * @returns The resolved options.
 */
export function extractTsdownConfig(
  context: Context
): TsdownResolvedBuildConfig {
  return defu(
    {
      entry: toArray(context.config.entry)
        .map(entry => {
          const typeDef = parseTypeDefinition(entry);

          return typeDef?.file;
        })
        .filter(Boolean) as string[],
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
    context.config.build.variant === "tsdown"
      ? context.config.build.override
      : {},
    context.config.build.variant === "tsdown"
      ? omit(context.config.build, ["override", "variant"])
      : {},
    {
      name: context.config.name,
      cwd: appendPath(
        context.config.projectRoot,
        context.workspaceConfig.workspaceRoot
      ),
      outDir: replacePath(
        appendPath(
          context.config.output.buildPath,
          context.workspaceConfig.workspaceRoot
        ),
        appendPath(
          context.config.projectRoot,
          context.workspaceConfig.workspaceRoot
        )
      ),
      tsconfig: appendPath(
        context.tsconfig.tsconfigFilePath,
        context.workspaceConfig.workspaceRoot
      ),
      format: context.config.output.format,
      mode: context.config.mode,
      treeshake:
        context.config.build.variant === "tsdown"
          ? (context.config.build as TsdownBuildConfig)?.treeshake
          : context.config.build.variant === "tsup"
            ? (context.config.build as TsupBuildConfig)?.treeshake
            : context.config.build.variant === "esbuild"
              ? (context.config.build as ESBuildBuildConfig)?.treeShaking
              : undefined,
      minify: context.config.mode !== "development",
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
        info: (message: string) =>
          formatMessage(context, message).replace(/\s+/g, "").length > 5 &&
          context.info(formatMessage(context, message)),
        warn: (message: string) =>
          formatMessage(context, message).replace(/\s+/g, "").length > 5 &&
          context.warn(formatMessage(context, message)),
        warnOnce: (message: string) =>
          formatMessage(context, message).replace(/\s+/g, "").length > 5 &&
          context.warn(formatMessage(context, message)),
        error: (message: string) =>
          formatMessage(context, message).replace(/\s+/g, "").length > 5 &&
          context.error(formatMessage(context, message)),
        success: (message: string) =>
          formatMessage(context, message).replace(/\s+/g, "").length > 5 &&
          context.info(formatMessage(context, message))
      }
    } as TsdownResolvedBuildConfig,
    DEFAULT_TSDOWN_CONFIG
  );
}
