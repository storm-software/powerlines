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
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { readJsonFile } from "@stryke/fs/json";
import { isPackageExists } from "@stryke/fs/package-fns";
import { StormJSON } from "@stryke/json/storm-json";
import { appendPath } from "@stryke/path/append";
import {
  findFileExtension,
  findFileName,
  findFilePath,
  relativePath
} from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { titleCase } from "@stryke/string-format/title-case";
import { TsConfigJson } from "@stryke/types/tsconfig";
import chalk from "chalk";
import ts from "typescript";
import {
  getParsedTypeScriptConfig,
  getTsconfigFilePath,
  isIncludeMatchFound
} from "../../lib/typescript/tsconfig";
import { writeFile } from "../../lib/utilities/write-file";
import type { EnvironmentContext } from "../../types/context";
import { ResolvedConfig } from "../../types/resolved";

async function resolveTsconfigChanges<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>(context: EnvironmentContext<TResolvedConfig>): Promise<TsConfigJson> {
  const tsconfig = getParsedTypeScriptConfig(
    context.workspaceConfig.workspaceRoot,
    context.config.projectRoot,
    context.config.tsconfig,
    context.config.tsconfigRaw
  );

  const tsconfigFilePath = getTsconfigFilePath(
    context.workspaceConfig.workspaceRoot,
    context.config.projectRoot,
    context.config.tsconfig
  );

  const tsconfigJson = await readJsonFile<TsConfigJson>(tsconfigFilePath);
  tsconfigJson.compilerOptions ??= {};

  if (context.config.output.dts !== false) {
    context.config.output.dts = context.config.output.dts
      ? isParentPath(
          context.config.output.dts,
          context.workspaceConfig.workspaceRoot
        )
        ? context.config.output.dts
        : appendPath(
            context.config.output.dts,
            context.workspaceConfig.workspaceRoot
          )
      : appendPath(
          context.config.projectRoot,
          context.workspaceConfig.workspaceRoot
        );
    if (
      findFileExtension(context.config.output.dts) !== "d.ts" &&
      findFileExtension(context.config.output.dts) !== "d.cts" &&
      findFileExtension(context.config.output.dts) !== "d.mts"
    ) {
      context.config.output.dts = joinPaths(
        context.config.output.dts,
        "powerlines.d.ts"
      );
    }

    const dtsRelativePath = joinPaths(
      relativePath(
        joinPaths(
          context.workspaceConfig.workspaceRoot,
          context.config.projectRoot
        ),
        findFilePath(context.config.output.dts)
      ),
      findFileName(context.config.output.dts)
    );

    if (
      !tsconfigJson.include?.some(filePattern =>
        isIncludeMatchFound(filePattern, [
          String(context.config.output.dts),
          dtsRelativePath,
          "storm.d.ts"
        ])
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

  if (tsconfig.options.module !== ts.ModuleKind.ESNext) {
    tsconfigJson.compilerOptions.module = "ESNext";
  }

  if (
    !tsconfig.options.target ||
    ![
      ts.ScriptTarget.ESNext,
      ts.ScriptTarget.ES2024,
      ts.ScriptTarget.ES2023,
      ts.ScriptTarget.ES2022,
      ts.ScriptTarget.ES2021
    ].includes(tsconfig.options.target)
  ) {
    tsconfigJson.compilerOptions.target = "ESNext";
  }

  if (tsconfig.options.moduleResolution !== ts.ModuleResolutionKind.Bundler) {
    tsconfigJson.compilerOptions.moduleResolution = "Bundler";
  }

  if (tsconfig.options.moduleDetection !== ts.ModuleDetectionKind.Force) {
    tsconfigJson.compilerOptions.moduleDetection = "force";
  }

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

  if (context.config.build.platform === "node") {
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
  TContext extends
    EnvironmentContext<TResolvedConfig> = EnvironmentContext<TResolvedConfig>
>(context: TContext): Promise<void> {
  context.log(
    LogLevelLabel.TRACE,
    "Initializing TypeScript configuration (tsconfig.json) for the Powerlines project."
  );

  if (!isPackageExists("typescript")) {
    throw new Error(
      'The TypeScript package is not installed. Please install the package using the command: "npm install typescript --save-dev"'
    );
  }

  const tsconfigFilePath = getTsconfigFilePath(
    context.workspaceConfig.workspaceRoot,
    context.config.projectRoot,
    context.config.tsconfig
  );

  context.tsconfig.originalTsconfigJson =
    await readJsonFile<TsConfigJson>(tsconfigFilePath);

  context.tsconfig.tsconfigJson =
    await resolveTsconfigChanges<TResolvedConfig>(context);

  context.log(
    LogLevelLabel.TRACE,
    "Writing updated TypeScript configuration (tsconfig.json) file to disk."
  );

  await context.fs.writeFile(
    tsconfigFilePath,
    StormJSON.stringify(context.tsconfig.tsconfigJson),
    {
      mode: "fs"
    }
  );

  context.tsconfig = getParsedTypeScriptConfig(
    context.workspaceConfig.workspaceRoot,
    context.config.projectRoot,
    context.config.tsconfig,
    context.config.tsconfigRaw,
    context.tsconfig.originalTsconfigJson
  );
}

export async function resolveTsconfig<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TContext extends
    EnvironmentContext<TResolvedConfig> = EnvironmentContext<TResolvedConfig>
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
    context.log(
      LogLevelLabel.WARN,
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

  await writeFile(
    context.log,
    context.tsconfig.tsconfigFilePath,
    StormJSON.stringify(updateTsconfigJson)
  );

  context.tsconfig = getParsedTypeScriptConfig(
    context.workspaceConfig.workspaceRoot,
    context.config.projectRoot,
    context.config.tsconfig
  );
  if (!context.tsconfig) {
    throw new Error("Failed to parse the TypeScript configuration file.");
  }

  context.tsconfig.tsconfigJson.compilerOptions ??= {};
  context.tsconfig.tsconfigJson.compilerOptions.strict = false;
}
