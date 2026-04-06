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
import { isParentPath } from "@stryke/path";
import { appendPath } from "@stryke/path/append";
import { replacePath } from "@stryke/path/replace";
import { prettyBytes } from "@stryke/string-format/pretty-bytes";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { match } from "bundle-require";
import { createBundle } from "dts-buddy";
import { Context } from "../../types";
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
  const ast = await context.parse(code, {
    lang: "dts",
    astType: "ts"
  });

  return {
    code: `declare module "${context.config.framework}:${id}" {
  ${ast.module.staticImports
    .filter(
      staticImport =>
        !match(
          staticImport.moduleRequest.value,
          context.config.resolve.external
        ) && !staticImport.moduleRequest.value.startsWith("node:")
    )
    .map(staticImport => {
      return `import type { ${staticImport.entries
        .map(
          entry =>
            `${entry.importName.name}${entry.localName.value ? ` as ${entry.localName.value}` : ""}`
        )
        .join(", ")} } from "${staticImport.moduleRequest.value}"; `;
    })
    .join("\n")}

  ${ast.module.staticImports
    .filter(
      staticImport =>
        !match(
          staticImport.moduleRequest.value,
          context.config.resolve.external
        ) && !staticImport.moduleRequest.value.startsWith("node:")
    )
    .reduce((ret, staticImport) => {
      return `import type { ${staticImport.entries
        .map(
          entry =>
            `${entry.importName.name}${entry.localName.value ? ` as ${entry.localName.value}` : ""}`
        )
        .join(
          ", "
        )} } from "${staticImport.moduleRequest.value}";${ret.replaceAll(
        new RegExp(
          `^import.*from\\s+['"]${staticImport.moduleRequest.value}['"]\\s*;?$`,
          "gm"
        ),
        ""
      )}`;
    }, code)
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
      .map(staticImport => staticImport.moduleRequest.value)
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

  let result = await createBundle({
    context,
    project: context.tsconfig.tsconfigFilePath,
    output: context.typesPath,
    include: files.map(file =>
      appendPath(file, context.workspaceConfig.workspaceRoot)
    ),
    modules: (await context.getBuiltins()).reduce(
      (ret, file) => {
        ret[`${context.config.framework}:${file.id}`] = file.path;
        return ret;
      },
      {} as Record<string, string>
    ),
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

  result = formatTypes(result);
  for (const file of files
    .map(file => appendPath(file, context.workspaceConfig.workspaceRoot))
    .filter(file => isParentPath(file, context.builtinsPath))) {
    const content = await context.fs.read(file);
    if (isSetString(content)) {
      const moduleComment = content
        .match(
          new RegExp(
            `\\/\\*\\*(?s:.)*?@module\\s+${
              context.config.framework
            }:(?:${context.builtins.join("|")})(?s:.)*?\\*\\/\\s+`
          )
        )
        ?.find(comment => isSetString(comment?.trim()));

      if (moduleComment) {
        context.debug(
          `Adding module-level comment for the built-in module types declaration for file: ${file}`
        );

        const metadata = context.fs.getMetadata(file);
        if (metadata?.id) {
          result = result.replace(
            `declare module "${context.config.framework}:${metadata.id}" {`,
            `${moduleComment.trim()}
declare module "${context.config.framework}:${metadata.id}" {`
          );
        }
      }
    }
  }

  result = await format(context, context.typesPath, result);

  context.debug(
    `A TypeScript declaration file (size: ${prettyBytes(
      new Blob(toArray(result)).size
    )}) emitted for the built-in modules types.`
  );

  return { code: result, directives: [] };
}
