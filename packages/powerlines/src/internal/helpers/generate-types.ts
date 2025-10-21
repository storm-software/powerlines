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

import { transformAsync } from "@babel/core";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { resolvePackage } from "@stryke/fs/resolve";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { TsConfigJson } from "@stryke/types/tsconfig";
import defu from "defu";
import {
  createCompilerHost,
  createProgram,
  flattenDiagnosticMessageText,
  getLineAndCharacterOfPosition,
  getPreEmitDiagnostics
} from "typescript";
import { getParsedTypeScriptConfig } from "../../lib/typescript/tsconfig";
import { getFileHeader } from "../../lib/utilities/file-header";
import { getSourceFile, getString } from "../../lib/utilities/source-file";
import { Context } from "../../types/context";
import { moduleResolverBabelPlugin } from "../babel/module-resolver-plugin";

/**
 * Prepares the TypeScript definitions for the Powerlines project.
 *
 * @remarks
 * This function calls the `prepare:types` hook and generates type declarations for the runtime artifacts if enabled.
 *
 * @param context - The context containing options and environment paths.
 * @returns A promise that resolves when the preparation is complete.
 */
export async function generateTypes<TContext extends Context>(
  context: TContext
) {
  context.log(
    LogLevelLabel.TRACE,
    `Preparing the TypeScript definitions for the Powerlines project.`
  );

  // await context.vfs.rm(context.runtimeDtsFilePath);

  context.log(
    LogLevelLabel.TRACE,
    "Transforming built-ins runtime modules files."
  );

  const builtinFiles = await Promise.all(
    (await context.fs.listBuiltinFiles())
      .filter(file => !context.fs.isMatchingBuiltinId("index", file.id))
      .map(async file => {
        const result = await transformAsync(file.contents, {
          highlightCode: true,
          code: true,
          ast: false,
          cloneInputAst: false,
          comments: true,
          sourceType: "module",
          configFile: false,
          babelrc: false,
          envName: context.config.mode,
          caller: {
            name: "powerlines"
          },
          ...context.config.transform.babel,
          filename: file.path,
          plugins: [
            ["@babel/plugin-syntax-typescript"],
            [moduleResolverBabelPlugin(context)]
          ]
        });
        if (!result?.code) {
          throw new Error(
            `Powerlines - Generate Types failed to compile ${file.id}`
          );
        }

        context.log(
          LogLevelLabel.TRACE,
          `Writing transformed built-in runtime file ${file.id}.`
        );

        await context.fs.writeBuiltinFile(file.id, file.path, result.code);
        return file.path;
      })
  );

  const typescriptPath = await resolvePackage("typescript");
  if (!typescriptPath) {
    throw new Error(
      "Could not resolve TypeScript package location. Please ensure TypeScript is installed."
    );
  }

  const files = builtinFiles.reduce<string[]>(
    (ret, fileName) => {
      const formatted = replacePath(
        fileName,
        context.workspaceConfig.workspaceRoot
      );
      if (!ret.includes(formatted)) {
        ret.push(formatted);
      }

      return ret;
    },
    [joinPaths(typescriptPath, "lib", "lib.esnext.full.d.ts")]
  );

  context.log(
    LogLevelLabel.TRACE,
    "Parsing TypeScript configuration for the Powerlines project."
  );

  const resolvedTsconfig = getParsedTypeScriptConfig(
    context.workspaceConfig.workspaceRoot,
    context.config.projectRoot,
    context.tsconfig.tsconfigFilePath,
    defu(
      {
        compilerOptions: {
          strict: false,
          noEmit: false,
          declaration: true,
          declarationMap: false,
          emitDeclarationOnly: true,
          skipLibCheck: true
        },
        exclude: ["node_modules", "dist"],
        include: files
      },
      context.config.tsconfigRaw ?? {}
    ) as TsConfigJson
  );
  resolvedTsconfig.options.configFilePath = joinPaths(
    context.workspaceConfig.workspaceRoot,
    context.tsconfig.tsconfigFilePath
  );
  resolvedTsconfig.options.pathsBasePath =
    context.workspaceConfig.workspaceRoot;
  resolvedTsconfig.options.suppressOutputPathCheck = true;

  context.log(LogLevelLabel.TRACE, "Creating the TypeScript compiler host");

  const program = createProgram(
    files,
    resolvedTsconfig.options,
    createCompilerHost(resolvedTsconfig.options)
  );

  context.log(
    LogLevelLabel.TRACE,
    `Running TypeScript compiler on ${builtinFiles.length} built-in runtime files.`
  );

  // const transformer = createImportTransformer(context);

  let builtinModules = "";
  const emitResult = program.emit(
    undefined,
    (fileName, text, _, __, sourceFiles, _data) => {
      const sourceFile = sourceFiles?.[0];
      if (sourceFile?.fileName && !fileName.endsWith(".map")) {
        if (context.fs.isBuiltinFile(sourceFile.fileName)) {
          builtinModules += `
declare module "${context.fs.resolveId(sourceFile.fileName)}" {
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

  context.log(
    LogLevelLabel.TRACE,
    `Generating TypeScript declaration file in ${context.config.output.dts}.`
  );

  const sourceFile = getSourceFile(
    String(context.config.output.dts),
    `/// <reference types="powerlines/shared" />${
      context.config.build.platform !== "neutral"
        ? `
/// <reference types="powerlines/${context.config.build.platform}" />`
        : ""
    }

${getFileHeader(context, { directive: null, prettierIgnore: false })}

${builtinModules}`
      .replace(
        // eslint-disable-next-line regexp/no-super-linear-backtracking
        /import\s*(?:type\s*)?\{?[\w,\s]*(?:\}\s*)?from\s*(?:'|")@?[a-zA-Z0-9-\\/.]*(?:'|");?/g,
        ""
      )
      .replaceAll("#private;", "")
      .replace(/__Ω/g, "")
  );

  // await hooks
  //   .callHook("prepare:types", context, sourceFile)
  //   .catch((error: Error) => {
  //     context.log(
  //       LogLevelLabel.ERROR,
  //       `An error occurred while preparing the TypeScript definitions for the Powerlines project: ${error.message} \n${error.stack ?? ""}`
  //     );

  //     throw new Error(
  //       "An error occurred while preparing the TypeScript definitions for the Powerlines project",
  //       { cause: error }
  //     );
  //   });

  await context.fs.writeFileToDisk(sourceFile.id, getString(sourceFile.code));

  // context.vfs[__VFS_REVERT__]();
}
