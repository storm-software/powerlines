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

import { existsSync } from "@stryke/fs/exists";
import { readJsonFileSync } from "@stryke/fs/json";
import { appendPath } from "@stryke/path/append";
import { joinPaths } from "@stryke/path/join-paths";
import { FilterPattern } from "@stryke/types/file";
import { TsConfigJson } from "@stryke/types/tsconfig";
import defu from "defu";
import ts from "typescript";
import { ParsedTypeScriptConfig, TSConfig } from "../../types/tsconfig";

/**
 * Get the path to the tsconfig.json file.
 *
 * @param workspaceRoot - The root directory of the workspace.
 * @param projectRoot - The root directory of the project.
 * @param tsconfig - The path to the tsconfig.json file.
 * @returns The absolute path to the tsconfig.json file.
 * @throws If the tsconfig.json file does not exist.
 */
export function getTsconfigFilePath(
  workspaceRoot: string,
  projectRoot: string,
  tsconfig?: string
): string {
  let tsconfigFilePath: string | undefined;
  if (tsconfig) {
    tsconfigFilePath = tryTsconfigFilePath(
      workspaceRoot,
      projectRoot,
      tsconfig
    );
  } else {
    tsconfigFilePath = tryTsconfigFilePath(
      workspaceRoot,
      projectRoot,
      "tsconfig.app.json"
    );
    if (!tsconfigFilePath) {
      tsconfigFilePath = tryTsconfigFilePath(
        workspaceRoot,
        projectRoot,
        "tsconfig.lib.json"
      );
      if (!tsconfigFilePath) {
        tsconfigFilePath = tryTsconfigFilePath(
          workspaceRoot,
          projectRoot,
          "tsconfig.json"
        );
      }
    }
  }

  if (!tsconfigFilePath) {
    throw new Error(
      `Cannot find the \`tsconfig.json\` configuration file for the project at ${
        projectRoot
      }.`
    );
  }

  return tsconfigFilePath;
}

/**
 * Get the path to the tsconfig.json file.
 *
 * @param workspaceRoot - The root directory of the workspace.
 * @param projectRoot - The root directory of the project.
 * @param tsconfig - The path to the tsconfig.json file.
 * @returns The absolute path to the tsconfig.json file.
 * @throws If the tsconfig.json file does not exist.
 */
export function tryTsconfigFilePath(
  workspaceRoot: string,
  projectRoot: string,
  tsconfig: string
): string | undefined {
  let tsconfigFilePath = tsconfig;
  if (!existsSync(tsconfigFilePath)) {
    tsconfigFilePath = appendPath(tsconfig, projectRoot);
    if (!existsSync(tsconfigFilePath)) {
      tsconfigFilePath = appendPath(
        tsconfig,
        appendPath(projectRoot, workspaceRoot)
      );
      if (!existsSync(tsconfigFilePath)) {
        return undefined;
      }
    }
  }

  return tsconfigFilePath;
}

/**
 * Check if the TypeScript configuration type matches any of the provided types.
 *
 * @param tsconfigType - The type from the TypeScript configuration.
 * @param types - An array of type names to check against.
 * @returns True if the TypeScript configuration type matches any of the provided types, false otherwise.
 */
export function findMatch(
  tsconfigType: string | RegExp | null,
  types: (string | RegExp | null)[],
  extensions: string[] = [".ts", ".tsx", ".d.ts"]
): string | RegExp | null | undefined {
  return types.find(
    type =>
      tsconfigType?.toString().toLowerCase() ===
        type?.toString().toLowerCase() ||
      tsconfigType?.toString().toLowerCase() ===
        `./${type?.toString().toLowerCase()}` ||
      `./${tsconfigType?.toString().toLowerCase()}` ===
        type?.toString().toLowerCase() ||
      extensions.some(
        ext =>
          `${tsconfigType?.toString().toLowerCase()}${ext}` ===
            type?.toString().toLowerCase() ||
          `${tsconfigType?.toString().toLowerCase()}${ext}` ===
            `./${type?.toString().toLowerCase()}` ||
          `${type?.toString().toLowerCase()}${ext}` ===
            `./${tsconfigType?.toString().toLowerCase()}` ||
          tsconfigType?.toString().toLowerCase() ===
            `${type?.toString().toLowerCase()}${ext}` ||
          tsconfigType?.toString().toLowerCase() ===
            `./${type?.toString().toLowerCase()}${ext}` ||
          type?.toString().toLowerCase() ===
            `./${tsconfigType?.toString().toLowerCase()}${ext}`
      )
  );
}

/**
 * Check if the TypeScript configuration type matches any of the provided types.
 *
 * @param tsconfigType - The type from the TypeScript configuration.
 * @param types - An array of type names to check against.
 * @returns True if the TypeScript configuration type matches any of the provided types, false otherwise.
 */
export function findIncludeMatch(
  tsconfigType: string | RegExp | null,
  types: (string | RegExp | null)[]
): string | RegExp | null | undefined {
  return findMatch(tsconfigType, types, [
    ".ts",
    ".tsx",
    ".d.ts",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".mts",
    ".cts",
    "/*.ts",
    "/*.tsx",
    "/*.d.ts",
    "/*.js",
    "/*.jsx",
    "/*.mjs",
    "/*.cjs",
    "/*.mts",
    "/*.cts",
    "/**/*.ts",
    "/**/*.tsx",
    "/**/*.d.ts",
    "/**/*.js",
    "/**/*.jsx",
    "/**/*.mjs",
    "/**/*.cjs",
    "/**/*.mts",
    "/**/*.cts"
  ]);
}

/**
 * Check if the TypeScript configuration type matches any of the provided types.
 *
 * @param tsconfigType - The type from the TypeScript configuration.
 * @param types - An array of type names to check against.
 * @returns True if the TypeScript configuration type matches any of the provided types, false otherwise.
 */
export function isMatchFound(
  tsconfigType: string | RegExp | null,
  types: (string | RegExp | null)[]
): boolean {
  return findMatch(tsconfigType, types) !== undefined;
}

/**
 * Check if the TypeScript configuration type matches any of the provided types.
 *
 * @param tsconfigType - The type from the TypeScript configuration.
 * @param types - An array of type names to check against.
 * @returns True if the TypeScript configuration type matches any of the provided types, false otherwise.
 */
export function isIncludeMatchFound(
  tsconfigType: FilterPattern,
  types: FilterPattern[]
): boolean {
  return (
    findIncludeMatch(
      tsconfigType as string | RegExp | null,
      types as (string | RegExp | null)[]
    ) !== undefined
  );
}

/**
 * Get the parsed TypeScript configuration.
 *
 * @param workspaceRoot - The root directory of the workspace.
 * @param projectRoot - The root directory of the project.
 * @param tsconfig - The path to the tsconfig.json file.
 * @param tsconfigRaw - The raw tsconfig.json content.
 * @param originalTsconfigJson - The original tsconfig.json content.
 * @param host - The TypeScript parse config host.
 * @returns The resolved TypeScript configuration.
 */
export function getParsedTypeScriptConfig(
  workspaceRoot: string,
  projectRoot: string,
  tsconfig?: string,
  tsconfigRaw: TSConfig = {},
  originalTsconfigJson?: TSConfig,
  host: ts.ParseConfigHost = ts.sys
): ParsedTypeScriptConfig {
  const tsconfigFilePath = getTsconfigFilePath(
    workspaceRoot,
    projectRoot,
    tsconfig
  );
  const tsconfigJson = readJsonFileSync<TSConfig>(tsconfigFilePath);
  if (!tsconfigJson) {
    throw new Error(
      `Cannot find the \`tsconfig.json\` configuration file at ${joinPaths(
        projectRoot,
        tsconfig ?? "tsconfig.json"
      )}`
    );
  }

  const parsedCommandLine = ts.parseJsonConfigFileContent(
    defu(tsconfigRaw ?? {}, tsconfigJson),
    host,
    appendPath(projectRoot, workspaceRoot)
  );
  if (parsedCommandLine.errors.length > 0) {
    const errorMessage = `Cannot parse the TypeScript compiler options. Please investigate the following issues:
${parsedCommandLine.errors
  .map(
    error =>
      `- ${
        (error.category !== undefined && error.code
          ? `[${error.category}-${error.code}]: `
          : "") + error.messageText.toString()
      }`
  )
  .join("\n")}
      `;

    throw new Error(errorMessage);
  }

  return {
    ...parsedCommandLine,
    originalTsconfigJson: (originalTsconfigJson ??
      tsconfigJson) as TsConfigJson,
    tsconfigJson,
    tsconfigFilePath
  };
}
