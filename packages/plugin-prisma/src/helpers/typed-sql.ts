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
  inferDirectoryConfig,
  isValidJsIdentifier,
  PrismaConfigWithDatasource
} from "@prisma/internals";
import {
  IntrospectSqlInput,
  introspectSql as migrateIntrospectSql
} from "@prisma/migrate";
import {
  findFileExtension,
  findFileName,
  relativePath
} from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join";
import { PrismaPluginContext } from "../types/plugin";

async function readTypedSqlFiles(
  context: PrismaPluginContext,
  typedSqlDirPath: string
): Promise<IntrospectSqlInput[]> {
  const files = await context.fs.list(typedSqlDirPath);
  const results: IntrospectSqlInput[] = [];
  for (const fileName of files) {
    if (findFileExtension(fileName) !== ".sql") {
      continue;
    }

    if (
      !isValidJsIdentifier(findFileName(fileName, { withExtension: false }))
    ) {
      throw new Error(
        `${joinPaths(typedSqlDirPath, fileName)} can not be used as a typed sql query: name must be a valid JS identifier`
      );
    }
    if (findFileName(fileName).startsWith("$")) {
      throw new Error(
        `${joinPaths(typedSqlDirPath, fileName)} can not be used as a typed sql query: name must not start with $`
      );
    }

    results.push({
      name: findFileName(fileName, { withExtension: false }),
      source: (await context.fs.read(joinPaths(typedSqlDirPath, fileName)))!,
      fileName: joinPaths(typedSqlDirPath, fileName)
    });
  }

  return results;
}

export async function introspectSql(context: PrismaPluginContext) {
  const directoryConfig = inferDirectoryConfig(
    context.prisma.schema,
    context.prisma.config
  );
  const sqlFiles = await readTypedSqlFiles(
    context,
    directoryConfig.typedSqlDirPath
  );

  const introspectionResult = await migrateIntrospectSql(
    context.prisma.schema,
    context.prisma.config as PrismaConfigWithDatasource,
    context.config.root,
    sqlFiles
  );
  if (introspectionResult.ok) {
    return introspectionResult.queries;
  }

  const lines: string[] = [`Errors while reading sql files:\n`];
  for (const { fileName, message } of introspectionResult.errors) {
    lines.push(`In ${relativePath(process.cwd(), fileName)}:`);
    lines.push(message);
    lines.push("");
  }

  throw new Error(lines.join("\n"));
}
