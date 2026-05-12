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

import type { Diff, ObjectData } from "@donedeal0/superdiff";
import { getObjectDiff } from "@donedeal0/superdiff";
import { existsSync } from "@stryke/fs/exists";
import { readJsonFile, readJsonFileSync } from "@stryke/fs/json";
import { isPackageExists } from "@stryke/fs/package-fns";
import { StormJSON } from "@stryke/json/storm-json";
import { appendPath } from "@stryke/path/append";
import {
  findFileName,
  findFilePath,
  relativePath
} from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { titleCase } from "@stryke/string-format/title-case";
import { FilterPattern } from "@stryke/types/file";
import { TsConfigJson } from "@stryke/types/tsconfig";
import chalk from "chalk";
import defu from "defu";
import ts from "typescript";
import { ResolvedConfig } from "../../types/config";
import { EnvironmentContext } from "../../types/context";
import type { ParsedTypeScriptConfig, TSConfig } from "../../types/tsconfig";

export function getTsconfigDtsPath<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown
>(context: EnvironmentContext<TResolvedConfig, TSystemContext>): string {
  const dtsRelativePath = joinPaths(
    relativePath(
      joinPaths(context.config.cwd, context.config.root),
      findFilePath(context.typesPath)
    ),
    findFileName(context.typesPath)
  );

  return dtsRelativePath;
}

async function resolveTsconfigChanges<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown
>(
  context: EnvironmentContext<TResolvedConfig, TSystemContext>
): Promise<TsConfigJson> {
  const tsconfig = getParsedTypeScriptConfig(
    context.config.cwd,
    context.config.root,
    context.config.tsconfig,
    context.config.tsconfigRaw
  );

  const tsconfigFilePath = getTsconfigFilePath(
    context.config.cwd,
    context.config.root,
    context.config.tsconfig
  );

  const tsconfigJson = await readJsonFile<TsConfigJson>(tsconfigFilePath);
  tsconfigJson.compilerOptions ??= {};

  if (context.config.output.dts !== false) {
    const dtsRelativePath = getTsconfigDtsPath(context);

    if (
      !tsconfigJson.include?.some(filePattern =>
        isIncludeMatchFound(filePattern, [context.typesPath, dtsRelativePath])
      )
    ) {
      tsconfigJson.include ??= [];
      tsconfigJson.include.push(
        dtsRelativePath.startsWith("./")
          ? dtsRelativePath.slice(2)
          : dtsRelativePath
      );
    }
  }

  if (
    !tsconfig.options.lib?.some(lib =>
      [
        "lib.esnext.d.ts",
        "lib.es2021.d.ts",
        "lib.es2022.d.ts",
        "lib.es2023.d.ts"
      ].includes(lib.toLowerCase())
    )
  ) {
    tsconfigJson.compilerOptions.lib ??= [];
    tsconfigJson.compilerOptions.lib.push("esnext");
  }

  // if (tsconfig.options.module !== ts.ModuleKind.ESNext) {
  //   tsconfigJson.compilerOptions.module = "ESNext";
  // }

  // if (
  //   !tsconfig.options.target ||
  //   ![
  //     ts.ScriptTarget.ESNext,
  //     ts.ScriptTarget.ES2024,
  //     ts.ScriptTarget.ES2023,
  //     ts.ScriptTarget.ES2022,
  //     ts.ScriptTarget.ES2021
  //   ].includes(tsconfig.options.target)
  // ) {
  //   tsconfigJson.compilerOptions.target = "ESNext";
  // }

  // if (tsconfig.options.moduleResolution !== ts.ModuleResolutionKind.Bundler) {
  //   tsconfigJson.compilerOptions.moduleResolution = "Bundler";
  // }

  // if (tsconfig.options.moduleDetection !== ts.ModuleDetectionKind.Force) {
  //   tsconfigJson.compilerOptions.moduleDetection = "force";
  // }

  // if (tsconfig.options.allowSyntheticDefaultImports !== true) {
  //   tsconfigJson.compilerOptions.allowSyntheticDefaultImports = true;
  // }

  // if (tsconfig.options.noImplicitOverride !== true) {
  //   tsconfigJson.compilerOptions.noImplicitOverride = true;
  // }

  // if (tsconfig.options.noUncheckedIndexedAccess !== true) {
  //   tsconfigJson.compilerOptions.noUncheckedIndexedAccess = true;
  // }

  // if (tsconfig.options.skipLibCheck !== true) {
  //   tsconfigJson.compilerOptions.skipLibCheck = true;
  // }

  // if (tsconfig.options.resolveJsonModule !== true) {
  //   tsconfigJson.compilerOptions.resolveJsonModule = true;
  // }

  // if (tsconfig.options.verbatimModuleSyntax !== false) {
  //   tsconfigJson.compilerOptions.verbatimModuleSyntax = false;
  // }

  // if (tsconfig.options.allowJs !== true) {
  //   tsconfigJson.compilerOptions.allowJs = true;
  // }

  // if (tsconfig.options.declaration !== true) {
  //   tsconfigJson.compilerOptions.declaration = true;
  // }

  if (tsconfig.options.esModuleInterop !== true) {
    tsconfigJson.compilerOptions.esModuleInterop = true;
  }

  if (tsconfig.options.isolatedModules !== true) {
    tsconfigJson.compilerOptions.isolatedModules = true;
  }

  if (context.config.platform === "node") {
    if (
      !tsconfig.options.types?.some(
        type =>
          type.toLowerCase() === "node" || type.toLowerCase() === "@types/node"
      )
    ) {
      tsconfigJson.compilerOptions.types ??= [];
      tsconfigJson.compilerOptions.types.push("node");
    }
  }

  return tsconfigJson;
}

export async function initializeTsconfig<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown,
  TContext extends EnvironmentContext<TResolvedConfig, TSystemContext> =
    EnvironmentContext<TResolvedConfig, TSystemContext>
>(context: TContext): Promise<void> {
  context.debug(
    "Initializing TypeScript configuration (tsconfig.json) for the Powerlines project."
  );

  if (!isPackageExists("typescript")) {
    throw new Error(
      'The TypeScript package is not installed. Please install the package using the command: "npm install typescript --save-dev"'
    );
  }

  const tsconfigFilePath = getTsconfigFilePath(
    context.config.cwd,
    context.config.root,
    context.config.tsconfig
  );

  context.tsconfig.originalTsconfigJson =
    await readJsonFile<TsConfigJson>(tsconfigFilePath);

  context.tsconfig.tsconfigJson = await resolveTsconfigChanges<
    TResolvedConfig,
    TSystemContext
  >(context);

  context.debug(
    "Writing updated TypeScript configuration (tsconfig.json) file to disk."
  );

  await context.fs.write(
    tsconfigFilePath,
    StormJSON.stringify(context.tsconfig.tsconfigJson)
  );

  context.tsconfig = getParsedTypeScriptConfig(
    context.config.cwd,
    context.config.root,
    context.config.tsconfig,
    context.config.tsconfigRaw,
    context.tsconfig.originalTsconfigJson
  );
}

export async function resolveTsconfig<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown,
  TContext extends EnvironmentContext<TResolvedConfig, TSystemContext> =
    EnvironmentContext<TResolvedConfig, TSystemContext>
>(context: TContext): Promise<void> {
  const updateTsconfigJson = await readJsonFile<TsConfigJson>(
    context.tsconfig.tsconfigFilePath
  );
  if (
    updateTsconfigJson?.compilerOptions?.types &&
    Array.isArray(updateTsconfigJson.compilerOptions.types) &&
    !updateTsconfigJson.compilerOptions.types.length
  ) {
    // If the types array is empty, we can safely remove it
    delete updateTsconfigJson.compilerOptions.types;
  }

  const result = getObjectDiff(
    context.tsconfig.originalTsconfigJson as NonNullable<ObjectData>,
    updateTsconfigJson as ObjectData,
    {
      ignoreArrayOrder: true,
      showOnly: {
        statuses: ["added", "deleted", "updated"],
        granularity: "deep"
      }
    }
  );

  const changes = [] as {
    field: string;
    status: "added" | "deleted" | "updated";
    previous: string;
    current: string;
  }[];
  const getChanges = (difference: Diff, property?: string) => {
    if (
      difference.status === "added" ||
      difference.status === "deleted" ||
      difference.status === "updated"
    ) {
      if (difference.diff) {
        for (const diff of difference.diff) {
          getChanges(
            diff,
            property
              ? `${property}.${difference.property}`
              : difference.property
          );
        }
      } else {
        changes.push({
          field: property
            ? `${property}.${difference.property}`
            : difference.property,
          status: difference.status,
          previous:
            difference.status === "added"
              ? "---"
              : StormJSON.stringify(difference.previousValue),
          current:
            difference.status === "deleted"
              ? "---"
              : StormJSON.stringify(difference.currentValue)
        });
      }
    }
  };

  for (const diff of result.diff) {
    getChanges(diff);
  }

  if (changes.length > 0) {
    context.warn(
      `Updating the following configuration values in "${context.tsconfig.tsconfigFilePath}" file:

    ${changes
      .map(
        (change, i) => `${chalk.bold.whiteBright(
          `${i + 1}. ${titleCase(change.status)} the ${change.field} field: `
        )}
    ${chalk.red(` - Previous: ${change.previous} `)}
    ${chalk.green(` - Updated: ${change.current} `)}
  `
      )
      .join("\n")}
    `
    );
  }

  await context.fs.write(
    context.tsconfig.tsconfigFilePath,
    StormJSON.stringify(updateTsconfigJson)
  );

  context.tsconfig = getParsedTypeScriptConfig(
    context.config.cwd,
    context.config.root,
    context.config.tsconfig
  );
  if (!context.tsconfig) {
    throw new Error("Failed to parse the TypeScript configuration file.");
  }
}

/**
 * Get the path to the tsconfig.json file.
 *
 * @param cwd - The root directory of the workspace.
 * @param root - The root directory of the project.
 * @param tsconfig - The path to the tsconfig.json file.
 * @returns The absolute path to the tsconfig.json file.
 * @throws If the tsconfig.json file does not exist.
 */
export function getTsconfigFilePath(
  cwd: string,
  root: string,
  tsconfig?: string
): string {
  let tsconfigFilePath: string | undefined;
  if (tsconfig) {
    tsconfigFilePath = tryTsconfigFilePath(cwd, root, tsconfig);
  } else {
    tsconfigFilePath = tryTsconfigFilePath(cwd, root, "tsconfig.app.json");
    if (!tsconfigFilePath) {
      tsconfigFilePath = tryTsconfigFilePath(cwd, root, "tsconfig.lib.json");
      if (!tsconfigFilePath) {
        tsconfigFilePath = tryTsconfigFilePath(cwd, root, "tsconfig.json");
      }
    }
  }

  if (!tsconfigFilePath) {
    throw new Error(
      `Cannot find the \`tsconfig.json\` configuration file for the project at ${
        root
      }.`
    );
  }

  return tsconfigFilePath;
}

/**
 * Get the path to the tsconfig.json file.
 *
 * @param cwd - The root directory of the workspace.
 * @param root - The root directory of the project.
 * @param tsconfig - The path to the tsconfig.json file.
 * @returns The absolute path to the tsconfig.json file.
 * @throws If the tsconfig.json file does not exist.
 */
export function tryTsconfigFilePath(
  cwd: string,
  root: string,
  tsconfig: string
): string | undefined {
  let tsconfigFilePath = tsconfig;
  if (!existsSync(tsconfigFilePath)) {
    tsconfigFilePath = appendPath(tsconfig, root);
    if (!existsSync(tsconfigFilePath)) {
      tsconfigFilePath = appendPath(tsconfig, appendPath(root, cwd));
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
