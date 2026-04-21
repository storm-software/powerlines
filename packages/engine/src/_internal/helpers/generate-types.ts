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

import type { Context } from "@powerlines/core";
import { format } from "@powerlines/core/lib/utilities/format";
import { toArray } from "@stryke/convert/to-array";
import { appendPath } from "@stryke/path/append";
import { findFileName } from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { prettyBytes } from "@stryke/string-format/pretty-bytes";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { DiagnosticCategory, Node, Project, SourceFile } from "ts-morph";
import { createProgram } from "../../typescript/ts-morph";

interface ModuleExportSpecifier {
  name: string;
  alias?: string;
  default?: boolean;
  type?: boolean;
}

interface ModuleReference {
  name?: string;
  specifiers?: ModuleExportSpecifier[];
  all?: boolean;
}

interface ImportModuleReference extends ModuleReference {
  name: string;
  ambient?: boolean;
}

interface ExportModuleReference extends ModuleReference {
  text: string;
  fullText: string;
  comment?: string;
}

interface ModuleDeclaration {
  name: string;
  text: string;
  sourceFile: SourceFile;
  comment?: string;
  exports: (ExportModuleReference | string)[];
  imports: ImportModuleReference[];
}

export interface TypegenContext {
  context: Context;
  emitted: Map<string, string>;
  modules: ModuleDeclaration[];
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
  ctx: TypegenContext,
  filePath: string,
  name: string,
  text: string
): Promise<ModuleDeclaration> {
  const imports: ImportModuleReference[] = [];
  const exports: (ExportModuleReference | string)[] = [];

  const comment = text
    .match(
      new RegExp(
        `\\/\\*\\*(?s:.)*?@module\\s+${
          ctx.context.config.framework
        }:${name}(?s:.)*?\\*\\/\\s+`
      )
    )
    ?.find(comment => isSetString(comment?.trim()));

  // Parse the emitted .d.ts content using an in-memory ts-morph project
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("module.d.ts", text);

  // Collect /// <reference types="..." /> directives as ambient dependencies
  for (const ref of sourceFile.getTypeReferenceDirectives()) {
    if (
      ref.getFileName() &&
      !ctx.context.builtins.some(builtin => ref.getFileName().endsWith(builtin))
    ) {
      imports.push({
        name: ref.getFileName(),
        ambient: true
      });
    }
  }

  for (const statement of sourceFile.getStatements()) {
    // --- Import declarations ---
    if (Node.isImportDeclaration(statement)) {
      const moduleSpec = statement.getModuleSpecifierValue();

      // Namespace import: import * as X from '...'
      if (statement.getNamespaceImport()) {
        imports.push({
          name: moduleSpec,
          specifiers: [
            {
              name: statement.getNamespaceImport()!.getText()
            }
          ],
          all: true
        });
      }

      // Named imports: import X from '...' or import { A, B as C } from '...'
      else if (
        statement.getNamedImports().length > 0 ||
        statement.getDefaultImport()
      ) {
        const specifiers: ModuleExportSpecifier[] = [];
        if (statement.getDefaultImport()) {
          specifiers.push({
            name: statement.getDefaultImport()!.getText(),
            default: true,
            type: statement.isTypeOnly()
          });
        }

        statement.getNamedImports().forEach(named => {
          specifiers.push({
            name: named.getName(),
            alias: named.getAliasNode()?.getText(),
            type: statement.isTypeOnly()
          });
        });

        imports.push({
          name: moduleSpec,
          specifiers
        });
      }
    }

    // --- Export declarations ---
    else if (Node.isExportDeclaration(statement)) {
      const moduleSpec = statement.getModuleSpecifierValue();
      if (moduleSpec) {
        // Resolve the module specifier
        let resolvedSpec = moduleSpec;
        if (!ctx.context.builtins.includes(moduleSpec)) {
          if (ctx.emitted.has(moduleSpec)) {
            resolvedSpec = ctx.emitted.get(moduleSpec)!;
          } else {
            const resolvedModule = await ctx.context.resolve(
              moduleSpec,
              filePath
            );
            if (isSetString(resolvedModule?.id)) {
              resolvedSpec = resolvedModule.id;
            }
          }
        }

        // Re-export from another module
        const namedExports = statement.getNamedExports();
        if (namedExports.length > 0) {
          exports.push({
            name: resolvedSpec,
            text: statement.getText(),
            fullText: statement.getFullText(),
            specifiers: namedExports.map(named => ({
              name: named.getName(),
              alias: named.getAliasNode()?.getText(),
              type: statement.isTypeOnly()
            })),
            comment: statement
              .getLeadingCommentRanges()
              .filter(
                c =>
                  isSetString(c.getText().trim()) &&
                  !c.getText().includes("@module")
              )
              .map(c => c.getText().trim())
              .join("\n")
              .trim()
          });
        } else {
          // export * from '...'
          exports.push({
            name: resolvedSpec,
            text: statement.getText(),
            fullText: statement.getFullText(),
            all: true,
            comment: statement
              .getLeadingCommentRanges()
              .filter(
                c =>
                  isSetString(c.getText().trim()) &&
                  !c.getText().includes("@module")
              )
              .map(c => c.getText().trim())
              .join("\n")
              .trim()
          });
        }
      } else {
        const specifiers = statement.getNamedExports().map(named => ({
          name: named.getName(),
          alias: named.getAliasNode()?.getText(),
          type: statement.isTypeOnly()
        }));
        if (specifiers.length > 0) {
          exports.push({
            text: statement.getText(),
            fullText: statement.getFullText(),
            specifiers,
            comment: statement
              .getLeadingCommentRanges()
              .filter(
                c =>
                  isSetString(c.getText().trim()) &&
                  !c.getText().includes("@module")
              )
              .map(c => c.getText().trim())
              .join("\n")
          });
        }
      }
    }

    // --- Export assignments (export default ...) ---
    else if (Node.isExportAssignment(statement)) {
      exports.push({
        text: statement.getText(),
        fullText: statement.getFullText(),
        comment: statement
          .getLeadingCommentRanges()
          .filter(
            c =>
              isSetString(c.getText().trim()) &&
              !c.getText().includes("@module")
          )
          .map(c => c.getText().trim())
          .join("\n")
      });
    }

    // --- Function declarations (export declare function ...) ---
    else if (
      Node.isFunctionDeclaration(statement) &&
      statement.isExported() &&
      statement.getNameNode()
    ) {
      exports.push({
        text: statement.getText(),
        fullText: statement.getFullText(),
        specifiers: [
          {
            name: statement.getNameNode()!.getText()
          }
        ],
        comment: statement
          .getLeadingCommentRanges()
          .filter(
            c =>
              isSetString(c.getText().trim()) &&
              !c.getText().includes("@module")
          )
          .map(c => c.getText().trim())
          .join("\n")
      });
    }

    // --- Variable statements (export declare const ...) ---
    else if (Node.isVariableStatement(statement) && statement.isExported()) {
      exports.push({
        text: statement.getText(),
        fullText: statement.getFullText(),
        specifiers: statement
          .getDeclarationList()
          .getDeclarations()
          .filter(
            decl => decl.getNameNode() && Node.isIdentifier(decl.getNameNode())
          )
          .map(decl => ({ name: decl.getNameNode().getText() })),
        comment: statement
          .getLeadingCommentRanges()
          .filter(
            c =>
              isSetString(c.getText().trim()) &&
              !c.getText().includes("@module")
          )
          .map(c => c.getText().trim())
          .join("\n")
      });
    }

    // --- Class declarations (export declare class ...) ---
    else if (Node.isClassDeclaration(statement) && statement.isExported()) {
      const nameNode = statement.getNameNode();
      exports.push({
        text: statement.getText(),
        fullText: statement.getFullText(),
        specifiers: nameNode ? [{ name: nameNode.getText() }] : undefined,
        comment: statement
          .getLeadingCommentRanges()
          .filter(
            c =>
              isSetString(c.getText().trim()) &&
              !c.getText().includes("@module")
          )
          .map(c => c.getText().trim())
          .join("\n")
      });
    }

    // --- Interface declarations (export declare interface ...) ---
    else if (Node.isInterfaceDeclaration(statement) && statement.isExported()) {
      const nameNode = statement.getNameNode();
      exports.push({
        text: statement.getText(),
        fullText: statement.getFullText(),
        specifiers: nameNode ? [{ name: nameNode.getText() }] : undefined,
        comment: statement
          .getLeadingCommentRanges()
          .filter(
            c =>
              isSetString(c.getText().trim()) &&
              !c.getText().includes("@module")
          )
          .map(c => c.getText().trim())
          .join("\n")
      });
    }

    // --- Type alias declarations (export declare type ...) ---
    else if (Node.isTypeAliasDeclaration(statement) && statement.isExported()) {
      const nameNode = statement.getNameNode();
      exports.push({
        text: statement.getText(),
        fullText: statement.getFullText(),
        specifiers: nameNode ? [{ name: nameNode.getText() }] : undefined,
        comment: statement
          .getLeadingCommentRanges()
          .filter(
            c =>
              isSetString(c.getText().trim()) &&
              !c.getText().includes("@module")
          )
          .map(c => c.getText().trim())
          .join("\n")
      });
    }

    // --- All other statements (declarations) ---
    else if (
      ctx.context.config.output.sourceMap ||
      !statement.getFullText().includes("//# sourceMappingURL=")
    ) {
      exports.push({
        text: statement.getText(),
        fullText: statement.getFullText(),
        comment: statement
          .getLeadingCommentRanges()
          .filter(
            c =>
              isSetString(c.getText().trim()) &&
              !c.getText().includes("@module")
          )
          .map(c => c.getText().trim())
          .join("\n")
      });
    }
  }

  return {
    name,
    text,
    sourceFile,
    comment,
    imports,
    exports
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
      outDir: replacePath(context.builtinsPath, context.config.cwd),
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
    `The TypeScript compiler emitted ${
      emittedFiles.length
    } files for built-in types.`
  );

  if (emittedFiles.length === 0) {
    context.warn(
      "The TypeScript compiler did not emit any files for built-in types. This may indicate an issue with the TypeScript configuration or the provided files."
    );
    return { code: "", directives: [] };
  }

  const ctx = {
    context,
    modules: [] as ModuleDeclaration[],
    emitted: new Map<string, string>()
  };

  await Promise.all(
    emittedFiles.map(async emittedFile => {
      const filePath = appendPath(emittedFile.filePath, context.config.cwd);
      if (
        !filePath.endsWith(".map") &&
        findFileName(filePath) !== "tsconfig.tsbuildinfo" &&
        isParentPath(filePath, context.builtinsPath)
      ) {
        const moduleName = replaceExtension(
          replacePath(
            replacePath(filePath, context.builtinsPath),
            replacePath(context.builtinsPath, context.config.cwd)
          ),
          "",
          {
            fullExtension: true
          }
        );
        if (context.builtins.includes(moduleName)) {
          ctx.emitted.set(filePath, moduleName);
          ctx.modules.push(
            await extractModuleDeclarations(
              ctx,
              filePath,
              moduleName,
              emittedFile.text
            )
          );
        }
      }
    })
  );

  const commonDeclarations = [] as ExportModuleReference[];
  for (const mod of ctx.modules) {
    for (const importRef of mod.imports.filter(importRef =>
      context.builtins.some(builtin => importRef.name.endsWith(`:${builtin}`))
    )) {
      const moduleRef = ctx.modules.find(moduleRef =>
        importRef.name.endsWith(`:${moduleRef.name}`)
      );
      if (moduleRef) {
        let declaration: ExportModuleReference | undefined;
        for (const decl of moduleRef.exports.filter(decl =>
          isSetObject(decl)
        )) {
          const specifiers = decl.specifiers?.filter(specifier =>
            importRef.specifiers?.some(
              s =>
                (specifier.alias ? specifier.alias : specifier.name) ===
                (s.alias ? s.alias : s.name)
            )
          );
          if (specifiers && specifiers.length > 0) {
            importRef.specifiers = importRef.specifiers?.filter(
              s =>
                !specifiers.some(
                  specifier =>
                    (specifier.alias ? specifier.alias : specifier.name) ===
                    (s.alias ? s.alias : s.name)
                )
            );
            if (
              importRef.specifiers &&
              importRef.specifiers.length === 0 &&
              !importRef.all &&
              !importRef.ambient
            ) {
              mod.imports = mod.imports.filter(
                imp => imp.name !== importRef.name
              );
            }

            declaration = decl;
            break;
          }
        }

        if (declaration) {
          for (const decl of moduleRef.exports.filter(
            decl =>
              isSetObject(decl) &&
              !decl.specifiers?.some(s =>
                declaration?.specifiers?.some(
                  specifier =>
                    (specifier.alias ? specifier.alias : specifier.name) ===
                    (s.alias ? s.alias : s.name)
                )
              )
          )) {
            const exportModuleRef = decl as ExportModuleReference;
            if (
              (exportModuleRef.specifiers?.some(s => s.alias || s.name) ||
                exportModuleRef.name) &&
              new RegExp(
                `(^|\\s|\\n|\\r\\n|\\(|\\)|<|>|{|}|\\[|\\]|\\!|\\?|\\.|,|\\*|&|:)(${
                  exportModuleRef.specifiers
                    ?.map(s => `${s.alias ? `${s.alias}|` : ""}${s.name}`)
                    .join("|") || exportModuleRef.name
                })($|\\s|\\n|\\r\\n|\\(|\\)|<|>|{|}|\\[|\\]|\\!|\\?|\\.|,|\\*|&|:|;)`
              ).test(declaration.text)
            ) {
              commonDeclarations.push(exportModuleRef);
            }
          }
          commonDeclarations.push(declaration);
        }
      }
    }
  }

  let code = "";
  const directives: string[] = [];

  for (const commonDeclaration of commonDeclarations) {
    code += formatTypes(
      `${
        commonDeclaration.comment?.trim()
          ? commonDeclaration.comment.trim()
          : ""
      }${commonDeclaration.comment?.trim() ? "\n" : ""}${formatTypes(
        commonDeclaration.text
          .replace(/\s*export\s*/, "")
          .replace(/\s*declare\s*interface\s*/, "interface ")
          .replace(/\s*declare\s*type\s*/, "type ")
      )}`
    );
    code += "\n\n";
  }

  for (const mod of ctx.modules) {
    code += mod.comment ? `${mod.comment.trim()}\n` : "";
    code += `declare module "${context.config.framework}:${mod.name}" { \n`;
    for (const importRef of mod.imports) {
      if (importRef.ambient) {
        code += directives.push(importRef.name);
      } else if (importRef.all) {
        code += `\timport * as ${findFileName(importRef.name)} from "${importRef.name}";\n`;
      } else if (importRef.specifiers) {
        const typeOnly = importRef.specifiers.every(s => s.type) ? " type" : "";
        const specifiers = importRef.specifiers
          .map(s => (s.alias ? `${s.name} as ${s.alias}` : s.name))
          .join(", ");
        code += `\timport${typeOnly} { ${specifiers} } from "${importRef.name}";\n`;
      }
    }

    if (mod.imports.length > 0) {
      code += "\n";
    }

    for (const exportRef of mod.exports.filter(
      e =>
        isString(e) ||
        !e.specifiers ||
        !commonDeclarations.some(
          commonDecl =>
            commonDecl.specifiers &&
            commonDecl.specifiers.some(specifier =>
              e.specifiers?.some(
                s =>
                  (s.alias ? s.alias : s.name) ===
                  (specifier.alias ? specifier.alias : specifier.name)
              )
            )
        )
    )) {
      if (isSetString(exportRef)) {
        code += `${exportRef}\n`;
      } else if (exportRef.name) {
        if (exportRef.all) {
          code += `${
            exportRef.comment?.trim() ? exportRef.comment.trim() : ""
          }${
            exportRef.comment?.trim() ? "\n" : ""
          }export * from "${exportRef.name}";\n`;
        } else if (exportRef.specifiers) {
          if (exportRef.comment?.trim()) {
            code += `${exportRef.comment.trim()}\n`;
          }

          code += `\texport${
            exportRef.specifiers.every(s => s.type) ? " type" : ""
          } { ${exportRef.specifiers
            .map(s => (s.alias ? `${s.name} as ${s.alias}` : s.name))
            .join(", ")} } from "${exportRef.name}";\n`;
        }
      } else {
        code += `${exportRef.comment?.trim() ? exportRef.comment.trim() : ""}${
          exportRef.comment?.trim() ? "\n" : ""
        }${formatTypes(
          exportRef.text
            .replace(/\s*export\s*declare\s*/, "export ")
            .replace(/\s*declare\s*/, " ")
        )}\n`;
      }
    }

    mod.exports
      .filter(
        e =>
          !isString(e) &&
          e.specifiers &&
          commonDeclarations.some(
            commonDeclaration =>
              commonDeclaration.specifiers &&
              commonDeclaration.specifiers.some(specifier =>
                e.specifiers?.some(
                  s =>
                    (s.alias ? s.alias : s.name) ===
                    (specifier.alias ? specifier.alias : specifier.name)
                )
              )
          )
      )
      .forEach((e, i, arr) => {
        if (i === 0) {
          code += "\nexport { ";
        } else {
          code += ", ";
        }

        code += `${
          (e as ExportModuleReference)?.specifiers
            ?.filter(s =>
              commonDeclarations.some(
                commonDeclaration =>
                  commonDeclaration.specifiers &&
                  commonDeclaration.specifiers.some(
                    specifier =>
                      (s.alias ? s.alias : s.name) ===
                      (specifier.alias ? specifier.alias : specifier.name)
                  )
              )
            )
            .map(s => (s.alias ? `${s.name} as ${s.alias}` : s.name))
            .join(", ") || ""
        }`;

        if (i === arr.length - 1) {
          code += ` };\n`;
        }
      });

    code += "}";
    code += "\n\n";
  }

  code = await format(context, context.typesPath, code);

  context.debug(
    `A TypeScript declaration file (size: ${prettyBytes(
      new Blob(toArray(code)).size
    )}) emitted for the built-in modules types.`
  );

  return { code, directives };
}
