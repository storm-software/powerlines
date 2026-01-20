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

import { toArray } from "@stryke/convert/to-array";
import { appendPath } from "@stryke/path/append";
import { findFileName } from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { prettyBytes } from "@stryke/string-format/pretty-bytes";
import { DiagnosticCategory } from "ts-morph";
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
export async function emitBuiltinTypes<TContext extends Context>(
  context: TContext,
  files: string[]
) {
  if (files.length === 0) {
    context.debug(
      "No files provided for TypeScript types generation. Typescript compilation for built-in modules will be skipped."
    );
    return "";
  }

  context.debug(
    `Running the TypeScript compiler for ${
      files.length
    } generated built-in module files.`
  );

  const program = createProgram(context, {
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      declaration: true,
      declarationMap: false,
      emitDeclarationOnly: true,
      sourceMap: false,
      outDir: replacePath(
        context.builtinsPath,
        context.workspaceConfig.workspaceRoot
      ),
      composite: false,
      incremental: false,
      tsBuildInfoFile: undefined
    }
  });

  program.addSourceFilesAtPaths(files);
  const result = program.emitToMemory({ emitOnlyDtsFiles: true });

  const diagnostics = result.getDiagnostics();
  if (diagnostics && diagnostics.length > 0) {
    if (diagnostics.some(d => d.getCategory() === DiagnosticCategory.Error)) {
      throw new Error(
        `The Typescript emit process failed while generating built-in types: \n ${diagnostics
          .filter(d => d.getCategory() === DiagnosticCategory.Error)
          .map(
            d =>
              `-${d.getSourceFile() ? `${d.getSourceFile()?.getFilePath()}:` : ""} ${String(
                d.getMessageText()
              )} (at ${d.getStart()}:${d.getLength()})`
          )
          .join("\n")}`
      );
    } else if (
      diagnostics.some(d => d.getCategory() === DiagnosticCategory.Warning)
    ) {
      context.warn(
        `The Typescript emit process completed with warnings while generating built-in types: \n ${diagnostics
          .filter(d => d.getCategory() === DiagnosticCategory.Warning)
          .map(
            d =>
              `-${d.getSourceFile() ? `${d.getSourceFile()?.getFilePath()}:` : ""} ${String(
                d.getMessageText()
              )} (at ${d.getStart()}:${d.getLength()})`
          )
          .join("\n")}`
      );
    } else {
      context.debug(
        `The Typescript emit process completed with diagnostic messages while generating built-in types: \n ${diagnostics
          .map(
            d =>
              `-${d.getSourceFile() ? `${d.getSourceFile()?.getFilePath()}:` : ""} ${String(
                d.getMessageText()
              )} (at ${d.getStart()}:${d.getLength()})`
          )
          .join("\n")}`
      );
    }
  }

  const emittedFiles = result.getFiles();
  context.debug(
    `The TypeScript compiler emitted ${emittedFiles.length} files for built-in types.`
  );

  let builtinModules = "";
  for (const emittedFile of emittedFiles) {
    context.trace(
      `Processing emitted type declaration file: ${emittedFile.filePath}`
    );

    const filePath = appendPath(
      emittedFile.filePath,
      context.workspaceConfig.workspaceRoot
    );

    if (
      !filePath.endsWith(".map") &&
      findFileName(filePath) !== "tsconfig.tsbuildinfo" &&
      isParentPath(filePath, context.builtinsPath)
    ) {
      builtinModules += `
declare module "${
        context.config.output?.builtinPrefix ||
        context.config?.framework ||
        "powerlines"
      }:${replaceExtension(replacePath(filePath, context.builtinsPath))}" {
    ${emittedFile.text
      .trim()
      .replace(/^\s*export\s*declare\s*/gm, "export ")
      .replace(/^\s*declare\s*/gm, "")}
}
`;
    }
  }

  builtinModules = formatTypes(builtinModules);
  context.debug(
    `A TypeScript declaration file (size: ${prettyBytes(
      new Blob(toArray(builtinModules)).size
    )}) emitted for the built-in modules types.`
  );

  return builtinModules;
}
