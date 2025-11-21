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
import { resolvePackage } from "@stryke/fs/resolve";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { isFunction } from "@stryke/type-checks/is-function";
import { TsConfigJson } from "@stryke/types/tsconfig";
import defu from "defu";
import {
  CompilerHost,
  CompilerOptions,
  createCompilerHost as createCompilerHostWorker,
  createProgram as createProgramWorker,
  createSourceFile,
  CreateSourceFileOptions,
  Program,
  ScriptTarget,
  SourceFile,
  sys,
  System,
  WriteFileCallbackData
} from "typescript";
import { Context } from "../../types/context";
import { getDefaultCompilerOptions } from "./program";
import { getParsedTypeScriptConfig } from "./tsconfig";

export type ModuleImportResult =
  | { module: unknown; error: undefined }
  | { module: undefined; error: { stack?: string; message?: string } };

export interface TypeScriptSystem extends System {
  require: (baseDir: string, moduleName: string) => ModuleImportResult;
}

// function getDefaultCompilerOptions(): CompilerOptions {
//   return {
//     ...tsGetDefaultCompilerOptions(),
//     jsx: JsxEmit.React,
//     strict: true,
//     esModuleInterop: true,
//     module: ModuleKind.ESNext,
//     suppressOutputPathCheck: true,
//     skipLibCheck: true,
//     skipDefaultLibCheck: true,
//     moduleResolution: ModuleResolutionKind.Node10
//   };
// }

/**
 * Creates an in-memory System object which can be used in a TypeScript program, this
 * is what provides read/write aspects of the virtual fs
 */
export function createVirtualSystem(context: Context): System {
  return {
    args: [],
    createDirectory: path => {
      context.fs.mkdirSync(path);
    },
    // TODO: could make a real file tree
    directoryExists: (directoryName: string): boolean => {
      return context.fs.existsSync(directoryName);
    },
    exit: () => {
      throw new Error("Not implemented: exit");
    },
    fileExists: fileName => context.fs.existsSync(fileName),
    getCurrentDirectory: () => "/",
    getDirectories: () => [],
    getExecutingFilePath: () => {
      throw new Error("Not implemented: getExecutingFilePath");
    },
    readDirectory: (directoryName: string): string[] => {
      return context.fs.readdirSync(directoryName);
    },
    readFile: (fileName: string): string | undefined => {
      if (context.fs.existsSync(fileName)) {
        return context.fs.readFileSync(fileName);
      }

      return undefined;
    },
    resolvePath: path => context.fs.resolveSync(path) || path,
    newLine: "\n",
    useCaseSensitiveFileNames: true,
    write: () => {
      throw new Error("Not implemented: write");
    },
    writeFile: (fileName, contents) => {
      context.fs.writeFileSync(fileName, contents);
    },
    deleteFile: fileName => {
      context.fs.unlinkSync(fileName);
    }
  };
}

/**
 * Creates a TypeScript compiler host that uses the virtual file system (VFS) from the provided context to resolve paths.
 *
 * @param context - The context containing the virtual file system.
 * @param compilerOptions - The TypeScript compiler options.
 * @returns A TypeScript compiler host with VFS path resolution.
 */
export function createCompilerHost(
  context: Context,
  compilerOptions: CompilerOptions
): CompilerHost {
  const host = createCompilerHostWorker(compilerOptions);

  return {
    ...host,
    require(baseDir: string, moduleName: string) {
      const modulePath = context.fs.resolveSync(moduleName);
      if (modulePath) {
        return {
          module: context.fs.readFileSync(modulePath),
          modulePath,
          error: undefined
        };
      }

      if (isFunction((sys as TypeScriptSystem)?.require)) {
        return (sys as TypeScriptSystem).require(baseDir, moduleName);
      }

      return {
        module: {},
        error: new Error(
          `Failed to resolve module '${moduleName}' from '${
            baseDir
          }' during TypeScript compilation. This is likely due to a missing dependency or an incorrect module path.`
        )
      };
    },
    getCanonicalFileName(fileName: string): string {
      return (
        context.fs.resolveSync(fileName) || host.getCanonicalFileName(fileName)
      );
    },
    realpath(fileName: string) {
      return context.fs.resolveSync(fileName) || host.realpath?.(fileName);
    },
    fileExists(fileName: string): boolean {
      if (context.fs.existsSync(fileName)) {
        return true;
      }

      if (fileName.includes("tsconfig.json")) {
        return false;
      }

      return host.fileExists(fileName);
    },
    readFile(fileName: string): string | undefined {
      if (context.fs.existsSync(fileName)) {
        return context.fs.readFileSync(fileName);
      }

      return host.readFile(fileName);
    },
    writeFile(
      fileName: string,
      text: string,
      writeByteOrderMark: boolean,
      onError?: ((message: string) => void) | undefined,
      sourceFiles?: readonly SourceFile[] | undefined,
      data?: WriteFileCallbackData
    ): void {
      context.fs.existsSync(fileName)
        ? context.fs.writeFileSync(fileName, text)
        : host.writeFile(
            fileName,
            text,
            writeByteOrderMark,
            onError,
            sourceFiles,
            data
          );
    },
    getSourceFile(
      fileName: string,
      languageVersionOrOptions: ScriptTarget | CreateSourceFileOptions,
      onError?: (message: string) => void,
      shouldCreateNewSourceFile?: boolean
    ): SourceFile | undefined {
      const path = context.fs.resolveSync(fileName);
      if (path) {
        try {
          return createSourceFile(
            path,
            context.fs.readFileSync(path)!,
            languageVersionOrOptions ??
              compilerOptions.target ??
              getDefaultCompilerOptions().target!,
            false
          );
        } catch (error: unknown) {
          context.log(
            LogLevelLabel.ERROR,
            `Failed to create source file for '${fileName}': ${
              (error as Error).message
            }`
          );
          throw error;
        }
      }

      return host.getSourceFile(
        fileName,
        languageVersionOrOptions,
        onError,
        shouldCreateNewSourceFile
      );
    }
  } as CompilerHost;
}

export async function createProgram(
  context: Context,
  fileNames: string[],
  _options: Partial<CompilerOptions> = {}
): Promise<Program> {
  context.log(LogLevelLabel.TRACE, "Adding TypeScript library files.");

  const typescriptPath = await resolvePackage("typescript");
  if (!typescriptPath) {
    throw new Error(
      "Could not resolve TypeScript package location. Please ensure TypeScript is installed."
    );
  }

  const files = fileNames.reduce<string[]>(
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
        include: fileNames
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

  // const host = createCompilerHostWorker(resolvedTsconfig.options);
  const host = createCompilerHost(context, resolvedTsconfig.options);

  context.log(LogLevelLabel.TRACE, "Creating the TypeScript compiler program");

  return createProgramWorker(files, resolvedTsconfig.options, host);
}
