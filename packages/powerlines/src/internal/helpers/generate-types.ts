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
import {
  createCompilerHost,
  createProgram,
  flattenDiagnosticMessageText,
  getLineAndCharacterOfPosition,
  getPreEmitDiagnostics
} from "typescript";
import { Context } from "../../types/context";
import { ParsedTypeScriptConfig } from "../../types/tsconfig";

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
 * @param tsconfig - The TypeScript configuration to use for the compilation.
 * @param files - The list of files to generate types for.
 * @returns A promise that resolves to the generated TypeScript declaration types.
 */
export async function emitTypes<TContext extends Context>(
  context: TContext,
  tsconfig: ParsedTypeScriptConfig,
  files: string[]
) {
  context.log(LogLevelLabel.TRACE, "Creating the TypeScript compiler host");

  const program = createProgram(
    files,
    tsconfig.options,
    createCompilerHost(tsconfig.options)
  );

  // const transformer = createImportTransformer(context);

  context.log(
    LogLevelLabel.TRACE,
    `Running the TypeScript compiler for ${context.builtins.length} built-in runtime files.`
  );

  let builtinModules = "";
  const emitResult = program.emit(
    undefined,
    (fileName, text, _, __, sourceFiles, _data) => {
      const sourceFile = sourceFiles?.[0];
      if (sourceFile?.fileName && !fileName.endsWith(".map")) {
        if (
          context.builtins.some(
            file =>
              file === sourceFile.fileName ||
              (context.fs.meta[file]?.id &&
                context.fs.meta[file]?.id === sourceFile.fileName)
          )
        ) {
          builtinModules += `
declare module "${context.fs.resolve(sourceFile.fileName)}" {
    ${text
      .trim()
      .replace(/^\s*export\s*declare\s*/gm, "export ")
      .replace(/^\s*declare\s*/gm, "")}
}
`;
        }
      }
    },
    undefined,
    true
  );

  const diagnostics = getPreEmitDiagnostics(program).concat(
    emitResult.diagnostics
  );
  const diagnosticMessages: string[] = [];

  diagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      const { line, character } = getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!
      );
      const message = flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      diagnosticMessages.push(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      const message = flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      diagnosticMessages.push(message);
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
