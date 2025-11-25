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

import { LogLevelLabel } from "@storm-software/config-tools/types";
import { flattenDiagnosticMessageText } from "typescript";
import { createProgram } from "../../lib/typescript/ts-morph";
import { Context } from "../../types/context";

/**
 * Formats the generated TypeScript types source code.
 *
 * @param code - The generated TypeScript code.
 * @returns The formatted TypeScript code.
 */
export function formatTypes(code: string): string {
  return code
    .replace(
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      /import\s*(?:type\s*)?\{?[\w,\s]*(?:\}\s*)?from\s*(?:'|")@?[a-zA-Z0-9-\\/.]*(?:'|");?/g,
      ""
    )
    .replaceAll("#private;", "")
    .replace(/__Ω/g, "");
}

/**
 * Emits TypeScript declaration types for the provided files using the given TypeScript configuration.
 *
 * @param context - The context containing options and environment paths.
 * @param files - The list of files to generate types for.
 * @returns A promise that resolves to the generated TypeScript declaration types.
 */
export async function emitTypes<TContext extends Context>(
  context: TContext,
  files: string[]
) {
  context.log(
    LogLevelLabel.TRACE,
    `Running the TypeScript compiler for ${
      files.length
    } generated runtime files.`
  );

  const program = createProgram(context, {
    skipAddingFilesFromTsConfig: true
  });

  program.addSourceFilesAtPaths(files);
  const result = program.emitToMemory({ emitOnlyDtsFiles: true });

  let builtinModules = "";
  for (const file of result.getFiles()) {
    if (!file.filePath.endsWith(".map")) {
      if (
        context.builtins.some(
          builtin =>
            builtin === file.filePath ||
            (context.fs.metadata[builtin]?.id &&
              context.fs.metadata[builtin]?.id === file.filePath)
        )
      ) {
        const module = await context.fs.resolve(file.filePath);

        builtinModules += `
  declare module "${module}" {
      ${file.text
        .trim()
        .replace(/^\s*export\s*declare\s*/gm, "export ")
        .replace(/^\s*declare\s*/gm, "")}
  }
  `;
      }
    }
  }

  const diagnosticMessages: string[] = [];
  result.getDiagnostics().forEach(diagnostic => {
    if (diagnostic.getSourceFile()?.getBaseName()) {
      diagnosticMessages.push(
        `${diagnostic.getSourceFile()?.getBaseName()} (${
          (diagnostic.getLineNumber() ?? 0) + 1
        }): ${flattenDiagnosticMessageText(
          diagnostic.getMessageText().toString(),
          "\n"
        )}`
      );
    } else {
      diagnosticMessages.push(
        flattenDiagnosticMessageText(
          diagnostic.getMessageText().toString(),
          "\n"
        )
      );
    }
  });

  const diagnosticMessage = diagnosticMessages.join("\n");
  if (diagnosticMessage) {
    throw new Error(
      `TypeScript compilation failed: \n\n${
        diagnosticMessage.length > 5000
          ? `${diagnosticMessage.slice(0, 5000)}...`
          : diagnosticMessage
      }`
    );
  }

  return formatTypes(builtinModules);
}
