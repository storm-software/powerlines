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
import { DiagnosticCategory, Node, Project } from "ts-morph";
import { Context } from "../../types";
import { createProgram } from "../../typescript/ts-morph";
import { format } from "../../utils";

interface ModuleReference {
  id: string;
  external: boolean;
}

interface Mapping {
  source: string;
  line: number;
  column: number;
}

interface ModuleDeclaration {
  content: string;
  mappings: Map<string, Mapping>;
  ambient: ModuleReference[];
}

/**
 * Formats the generated TypeScript types source code.
 *
 * @param code - The generated TypeScript code.
 * @returns The formatted TypeScript code.
 */
export function formatTypes(code = ""): string {
  return code.replaceAll("#private;", "").replace(/__Ω/g, "");
}

async function extractModuleDeclarations(
  context: Context,
  filePath: string,
  id: string,
  code: string,
  fileToModuleMap: Map<string, string>
): Promise<ModuleDeclaration> {
  const mappings = new Map<string, Mapping>();
  const ambient: ModuleReference[] = [];

  // Parse the emitted .d.ts content using an in-memory ts-morph project
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("module.d.ts", code);

  // Collect /// <reference types="..." /> directives as ambient dependencies
  for (const ref of sourceFile.getTypeReferenceDirectives()) {
    ambient.push({ id: ref.getFileName(), external: true });
  }

  const importLines: string[] = [];
  const reExportLines: string[] = [];
  const declarationLines: string[] = [];

  for (const statement of sourceFile.getStatements()) {
    // --- Import declarations ---
    if (Node.isImportDeclaration(statement)) {
      const moduleSpec = statement.getModuleSpecifierValue();
      const defaultImport = statement.getDefaultImport();
      const namedImports = statement.getNamedImports();
      const namespaceImport = statement.getNamespaceImport();

      // Side-effect import (no import clause) → ambient dependency
      if (!defaultImport && namedImports.length === 0 && !namespaceImport) {
        ambient.push({
          id: moduleSpec,
          external: !context.fs.isResolvableId(moduleSpec, filePath)
        });
        continue;
      }

      // Resolve the module specifier for the output
      let resolvedSpec = moduleSpec;
      if (context.fs.isResolvableId(moduleSpec, filePath)) {
        const resolved = await context.resolve(moduleSpec, filePath);
        if (resolved) {
          const mapped = fileToModuleMap.get(resolved.id);
          if (mapped) {
            resolvedSpec = mapped;
          } else {
            context.trace(
              `Could not resolve relative import '${moduleSpec}' from '${filePath}' to a builtin module. Keeping as-is.`
            );
          }
        }
      }

      // Namespace import: import * as X from '...'
      if (namespaceImport) {
        importLines.push(
          `\timport * as ${namespaceImport.getText()} from '${resolvedSpec}';`
        );
      } else {
        const specifiers: string[] = [];

        if (defaultImport) {
          specifiers.push(`default as ${defaultImport.getText()}`);
        }

        for (const named of namedImports) {
          const alias = named.getAliasNode()?.getText();
          specifiers.push(
            alias ? `${named.getName()} as ${alias}` : named.getName()
          );
        }

        if (specifiers.length > 0) {
          const typeOnly = statement.isTypeOnly() ? " type" : "";
          importLines.push(
            `\timport${typeOnly} { ${specifiers.join(", ")} } from '${resolvedSpec}';`
          );
        }
      }

      continue;
    }

    // --- Export declarations ---
    if (Node.isExportDeclaration(statement)) {
      const moduleSpec = statement.getModuleSpecifierValue();

      if (moduleSpec) {
        // Resolve the module specifier
        let resolvedSpec = moduleSpec;
        if (context.fs.isResolvableId(moduleSpec, filePath)) {
          const resolved = await context.resolve(moduleSpec, filePath);
          if (resolved) {
            const mapped = fileToModuleMap.get(resolved.id);
            if (mapped) {
              resolvedSpec = mapped;
            } else {
              context.trace(
                `Could not resolve relative import '${moduleSpec}' from '${filePath}' to a builtin module. Keeping as-is.`
              );
            }
          }
        }

        // Re-export from another module
        const namedExports = statement.getNamedExports();
        if (namedExports.length > 0) {
          const specifiers = namedExports.map(named => {
            const alias = named.getAliasNode()?.getText();

            return alias ? `${named.getName()} as ${alias}` : named.getName();
          });
          const typeOnly = statement.isTypeOnly() ? " type" : "";
          reExportLines.push(
            `\texport${typeOnly} { ${specifiers.join(", ")} } from '${resolvedSpec}';`
          );
        } else {
          // export * from '...'
          reExportLines.push(`\texport * from '${resolvedSpec}';`);
        }
      } else {
        // Local export { foo, bar } — keep as-is
        declarationLines.push(`\t${statement.getText()}`);
      }

      continue;
    }

    // --- Export assignments (export default ...) ---
    if (Node.isExportAssignment(statement)) {
      declarationLines.push(`\t${statement.getText()}`);
      continue;
    }

    // --- All other statements (declarations) ---
    const text = statement.getText();
    if (text.includes("//# sourceMappingURL=")) {
      continue;
    }

    declarationLines.push(
      formatTypes(text.replace(/^(export\s+)?declare\s+/, "$1"))
        .split("\n")
        .map(line => `\t${line}`)
        .join("\n")
    );
  }

  const moduleComment = code
    .match(
      new RegExp(
        `\\/\\*\\*(?s:.)*?@module\\s+${
          context.config.framework
        }:${id}(?s:.)*?\\*\\/\\s+`
      )
    )
    ?.find(comment => isSetString(comment?.trim()));

  let content = `${moduleComment ? `${moduleComment.trim()}\n` : ""}declare module "${context.config.framework}:${id}" {`;
  for (const line of importLines) {
    content += `\n${line}`;
  }

  for (const line of reExportLines) {
    content += `\n${line}`;
  }

  for (const line of declarationLines) {
    content += `\n${line}`;
  }

  content += "\n}";
  return { content, mappings, ambient };
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

  // First pass: build a mapping from emitted file paths to builtin module IDs
  // so that relative imports between builtins can be resolved correctly
  const fileToModuleMap = new Map<string, string>();
  const emittedBuiltinFiles: { filePath: string; text: string }[] = [];

  for (const emittedFile of emittedFiles) {
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
        fileToModuleMap.set(filePath, moduleId);
        emittedBuiltinFiles.push({ filePath, text: emittedFile.text });
      }
    }
  }

  const builtins = await context.getBuiltins();

  // Build a content map of all emitted .d.ts files for ambient module resolution
  const emittedContentMap = new Map<string, string>();
  for (const emittedFile of emittedFiles) {
    const filePath = appendPath(
      emittedFile.filePath,
      context.workspaceConfig.workspaceRoot
    );
    if (
      !filePath.endsWith(".map") &&
      findFileName(filePath) !== "tsconfig.tsbuildinfo"
    ) {
      emittedContentMap.set(filePath, emittedFile.text);
    }
  }

  // Second pass: process each builtin module and generate declare module blocks
  let code = "";
  const directives: string[] = [];
  const ambientModules = new Set<string>();
  let isFirst = true;

  for (const entry of emittedBuiltinFiles) {
    context.trace(
      `Processing emitted type declaration file: ${entry.filePath}`
    );

    const moduleId = fileToModuleMap.get(entry.filePath)!;
    const moduleDecl = await extractModuleDeclarations(
      context,
      entry.filePath,
      moduleId,
      entry.text,
      fileToModuleMap
    );

    if (!isFirst) {
      code += "\n\n";
    }
    isFirst = false;
    code += moduleDecl.content;

    for (const dep of moduleDecl.ambient) {
      if (dep.external) {
        const directive = dep.id;
        if (!directives.includes(directive)) {
          directives.push(directive);
        }
      } else if (builtins.some(builtin => builtin.id === dep.id)) {
        ambientModules.add(
          builtins.find(builtin => builtin.id === dep.id)!.path
        );
      } else if (
        builtins.some(
          builtin => replaceExtension(builtin.path) === replaceExtension(dep.id)
        )
      ) {
        ambientModules.add(dep.id);
      } else {
        const resolved = await context.resolve(dep.id, entry.filePath);
        if (resolved) {
          for (const name of [
            resolved.id,
            `${resolved.id}.d.ts`,
            `${resolved.id}.d.mts`,
            `${resolved.id}.d.cts`,
            replaceExtension(resolved.id, ".d.ts"),
            replaceExtension(resolved.id, ".d.mts"),
            replaceExtension(resolved.id, ".d.cts"),
            `${resolved.id}/index.d.ts`
          ]) {
            if (emittedContentMap.has(name)) {
              ambientModules.add(name);
              break;
            }
          }
        }
      }
    }
  }

  // Inject non-external ambient module declarations wholesale
  for (const ambientFile of ambientModules) {
    const dts = emittedContentMap.get(ambientFile);
    if (dts) {
      const cleaned = dts.replace(/\/\/# sourceMappingURL=.*$/m, "").trim();
      if (cleaned) {
        code += `\n\n${formatTypes(cleaned)}`;
      }
    }
  }

  code = await format(context, context.typesPath, code);

  context.debug(
    `A TypeScript declaration file (size: ${prettyBytes(
      new Blob(toArray(code)).size
    )}) emitted for the built-in modules types.`
  );

  return { code, directives };
}
