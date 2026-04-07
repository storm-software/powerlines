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
import { isSetString } from "@stryke/type-checks/is-set-string";
import { match } from "bundle-require";
import { DiagnosticCategory } from "ts-morph";
import { Context } from "../../types";
import { createProgram } from "../../typescript/ts-morph";
import { format } from "../../utils";

/**
 * Formats the generated TypeScript types source code.
 *
 * @param code - The generated TypeScript code.
 * @returns The formatted TypeScript code.
 */
export function formatTypes(code = ""): string {
  return code.replaceAll("#private;", "").replace(/__Ω/g, "");
}

/**
 * Formats a generated TypeScript module in the types source code.
 *
 * @param context - The Powerlines context.
 * @param id - The module ID for the generated TypeScript module.
 * @param code - The generated TypeScript module code.
 * @returns The formatted TypeScript module code.
 */
export async function formatTypesModule(
  context: Context,
  id: string,
  code: string
): Promise<{ code: string; directives: string[] }> {
  const moduleComment = code
    .match(
      new RegExp(
        `\\/\\*\\*(?s:.)*?@module\\s+${
          context.config.framework
        }:${id}(?s:.)*?\\*\\/\\s+`
      )
    )
    ?.find(comment => isSetString(comment?.trim()));

  const ast = await context.parse(code, {
    lang: "dts",
    astType: "ts"
  });

  return {
    code: `${
      moduleComment
        ? `
${moduleComment.trim()}`
        : ""
    }
declare module "${context.config.framework}:${id}" {
  ${ast.module.staticImports
    .filter(
      staticImport =>
        !match(
          staticImport.moduleRequest.value,
          context.config.resolve.external
        ) && !staticImport.moduleRequest.value.startsWith("node:")
    )
    .reduce((ret, staticImport) => {
      return ret.replaceAll(
        new RegExp(
          `^import.*from\\s+['"]${staticImport.moduleRequest.value}['"]\\s*;?$`,
          "gm"
        ),
        ""
      );
    }, code)
    .replace(moduleComment ?? "", "")
    .replaceAll(/^\s*export\s*declare\s*/gm, "export ")
    .replaceAll(/^\s*declare\s*/gm, "")
    .replaceAll(/^\s*export\s*\{\s*\}/gm, "")
    .replaceAll(/^\s*export\s*=\s*/gm, "export default ")
    .replaceAll(/^\s*export\s*\{/gm, "export {")
    .replaceAll(/^\s*export\s*default\s*\{/gm, "export default {")
    .replaceAll(/^\s*export\s*function\s*/gm, "export function ")
    .replaceAll(/^\s*export\s*class\s*/gm, "export class ")
    .replaceAll(/^\s*export\s*interface\s*/gm, "export interface ")
    .replaceAll(/^\s*export\s*type\s*/gm, "export type ")
    .replaceAll(/^\s*export\s*enum\s*/gm, "export enum ")
    .replaceAll(/^\s*export\s*namespace\s*/gm, "export namespace ")}${
    ast.module.staticExports.length === 0
      ? `
  export {};`
      : ""
  }
}
`,
    directives: ast.module.staticImports
      .filter(
        staticImport =>
          match(
            staticImport.moduleRequest.value,
            context.config.resolve.external
          ) || staticImport.moduleRequest.value.startsWith("node:")
      )
      .map(staticImport =>
        staticImport.moduleRequest.value.startsWith("node:")
          ? "node"
          : Object.keys(context.packageJson.dependencies ?? {}).find(
              dependency =>
                staticImport.moduleRequest.value.startsWith(dependency) ||
                staticImport.moduleRequest.value.startsWith(
                  dependency.replace(/^@types\//, "")
                )
            ) ||
            Object.keys(context.packageJson.devDependencies ?? {}).find(
              dependency =>
                staticImport.moduleRequest.value.startsWith(dependency) ||
                staticImport.moduleRequest.value.startsWith(
                  dependency.replace(/^@types\//, "")
                )
            ) ||
            Object.keys(context.packageJson.peerDependencies ?? {}).find(
              dependency =>
                staticImport.moduleRequest.value.startsWith(dependency) ||
                staticImport.moduleRequest.value.startsWith(
                  dependency.replace(/^@types\//, "")
                )
            ) ||
            staticImport.moduleRequest.value
      )
      .filter(Boolean)
      .map(dependency => dependency.replace(/^@types\//, ""))
  };
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
): Promise<{ code: string; directives: string[] }> {
  if (files.length === 0) {
    context.debug(
      "No files provided for TypeScript types generation. Typescript compilation for built-in modules will be skipped."
    );
    return { code: "", directives: [] };
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
  const emitResult = program.emitToMemory({ emitOnlyDtsFiles: true });

  const diagnostics = emitResult.getDiagnostics();
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

  const emittedFiles = emitResult.getFiles();
  context.debug(
    `The TypeScript compiler emitted ${emittedFiles.length} files for built-in types.`
  );

  if (emittedFiles.length === 0) {
    context.warn(
      "The TypeScript compiler did not emit any files for built-in types. This may indicate an issue with the TypeScript configuration or the provided files."
    );
    return { code: "", directives: [] };
  }

  let result = "";
  const directives: string[] = [];
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
      const moduleId = replaceExtension(
        replacePath(
          replacePath(filePath, context.builtinsPath),
          replacePath(
            context.builtinsPath,
            context.workspaceConfig.workspaceRoot
          )
        ),
        "",
        {
          fullExtension: true
        }
      );
      if (context.builtins.includes(moduleId)) {
        const formatted = await formatTypesModule(
          context,
          moduleId,
          emittedFile.text
        );
        result += formatted.code;
        directives.push(...formatted.directives);
      }
    }
  }

  result = await format(context, context.typesPath, formatTypes(result));

  context.debug(
    `A TypeScript declaration file (size: ${prettyBytes(
      new Blob(toArray(result)).size
    )}) emitted for the built-in modules types.`
  );

  return { code: result, directives };
}
