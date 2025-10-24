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

import { listFiles } from "@stryke/fs/list-files";
import { readFile } from "@stryke/fs/read-file";
import { resolvePackage } from "@stryke/fs/resolve";
import { findFileName } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import { minimatch } from "minimatch";
import ts, { CompilerOptions } from "typescript";
import { Context } from "../../types/context";

export const SourcesMap = Map<string, string>;
// eslint-disable-next-line ts/no-redeclare
export type SourcesMap = InstanceType<typeof SourcesMap>;

export async function loadLibFiles(): Promise<SourcesMap> {
  const libLocation = await resolvePackage("typescript");
  if (!libLocation) {
    throw new Error("Could not resolve TypeScript package location.");
  }

  const libFiles = await listFiles(
    joinPaths(libLocation, "lib", "**", "lib.*.d.ts")
  );
  if (libFiles.length === 0) {
    throw new Error("No TypeScript library files found.");
  }

  const lib: SourcesMap = new Map();
  for (const file of libFiles) {
    lib.set(
      `/node_modules/typescript/lib/${findFileName(file)}`,
      await readFile(file)
    );
  }

  return lib;
}

/** The default compiler options if TypeScript could ever change the compiler options */
export function getDefaultCompilerOptions(): CompilerOptions {
  return {
    ...ts.getDefaultCompilerOptions(),
    jsx: ts.JsxEmit.React,
    strict: true,
    esModuleInterop: true,
    module: ts.ModuleKind.ESNext,
    suppressOutputPathCheck: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.Node10
  };
}

/**
 * Creates a TypeScript program from in-memory, virtual source files.
 *
 * @param rootNames - An array of root file names to include in the program.
 * @param context - The context containing options and environment paths.
 * @param compilerOptions - Optional TypeScript compiler options. Defaults to the standard TypeScript options
 * @returns A TypeScript program instance that can be used for type checking, emitting, etc.
 * @throws If the provided library files are not in the expected format or if the TypeScript package cannot be resolved.
 */
export async function createVirtualProgram(
  rootNames: readonly string[],
  context: Context,
  compilerOptions: ts.CompilerOptions = {}
): Promise<ts.Program> {
  const options = defu(compilerOptions, getDefaultCompilerOptions());

  const host = {
    name: "storm-vfs",
    root: context.workspaceConfig.workspaceRoot,
    ...ts.sys,
    realpath: (path: string) => {
      if (context.fs.existsSync(path)) {
        return context.fs.resolve(path);
      }

      return ts.sys.realpath?.(path) ?? path;
    },
    getCurrentDirectory(): string {
      return context.workspaceConfig.workspaceRoot;
    },
    getCanonicalFileName(fileName: string): string {
      return fileName;
    },
    getDefaultLibFileName(_options: ts.CompilerOptions): string {
      return ts.getDefaultLibFileName(options);
    },
    getDefaultLibLocation(): string {
      return "/";
    },
    getNewLine(): string {
      return "\n";
    },
    useCaseSensitiveFileNames(): boolean {
      return true;
    },
    fileExists(fileName: string): boolean {
      return context.fs.existsSync(fileName);
    },
    readFile(fileName: string): string | undefined {
      if (context.fs.existsSync(fileName)) {
        return context.fs.readFileSync(fileName);
      }

      return undefined;
    },
    readDirectory: (
      path: string,
      extensions: readonly string[] = [],
      exclude: readonly string[] = [],
      include: readonly string[] = []
    ) => {
      let results = [] as string[];
      if (context.fs.existsSync(path)) {
        results = context.fs.readdirSync(path, {
          encoding: "utf8",
          recursive: true
        });

        if (extensions.length > 0) {
          results = results.filter(file =>
            extensions.some(ext =>
              file.endsWith(ext.startsWith(".") ? ext : `.${ext}`)
            )
          );
        }

        if (exclude.length > 0) {
          results = results.filter(
            file => !exclude.some(pattern => minimatch(file, pattern))
          );
        }

        if (include.length > 0) {
          results = results.filter(file =>
            include.some(pattern => minimatch(file, pattern))
          );
        }
      }

      return results;
    },
    writeFile(fileName: string, data: string): void {
      context.fs.writeFileSync(fileName, data);
    },
    resolvePath: (fileName: string): string => {
      if (context.fs.existsSync(fileName)) {
        return context.fs.resolve(fileName) as string;
      }

      return ts.sys.resolvePath(fileName);
    },
    getSourceFile(
      fileName: string,
      languageVersionOrOptions: ts.ScriptTarget | ts.CreateSourceFileOptions,
      _?: (message: string) => void,
      shouldCreateNewSourceFile?: boolean
    ): ts.SourceFile | undefined {
      if (context.fs.existsSync(fileName)) {
        return ts.createSourceFile(
          fileName,
          context.fs.readFileSync(fileName)!,
          languageVersionOrOptions ??
            compilerOptions.target ??
            getDefaultCompilerOptions().target!,
          false
        );
      } else if (shouldCreateNewSourceFile) {
        const sourceFile = ts.createSourceFile(
          fileName,
          "",
          languageVersionOrOptions ??
            compilerOptions.target ??
            getDefaultCompilerOptions().target!,
          false
        );
        context.fs.writeFileSync(fileName, sourceFile.text);
        return sourceFile;
      }

      return undefined;
    }
  } as ts.CompilerHost;

  return ts.createProgram(rootNames, options, host);
}

interface VirtualCompilerHostReturn {
  compilerHost: ts.CompilerHost;
  updateFile: (sourceFile: ts.SourceFile) => boolean;
  deleteFile: (sourceFile: ts.SourceFile) => boolean;
}

/**
 * Creates an in-memory CompilerHost -which is essentially an extra wrapper to System
 * which works with TypeScript objects - returns both a compiler host, and a way to add new SourceFile
 * instances to the in-memory file system.
 */
export function createVirtualCompilerHost(
  sys: ts.System,
  compilerOptions: ts.CompilerOptions
) {
  const sourceFiles = new Map<string, ts.SourceFile>();
  const save = (sourceFile: ts.SourceFile) => {
    sourceFiles.set(sourceFile.fileName, sourceFile);
    return sourceFile;
  };

  const vHost: VirtualCompilerHostReturn = {
    compilerHost: {
      ...sys,
      getCanonicalFileName: fileName => fileName,
      getDefaultLibFileName: () =>
        `/${ts.getDefaultLibFileName(compilerOptions)}`, // '/lib.d.ts',
      // getDefaultLibLocation: () => '/',
      getNewLine: () => sys.newLine,
      getSourceFile: (fileName, languageVersionOrOptions) => {
        return (
          sourceFiles.get(fileName) ??
          save(
            ts.createSourceFile(
              fileName,
              sys.readFile(fileName)!,
              languageVersionOrOptions ?? compilerOptions.target,
              false
            )
          )
        );
      },
      useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames
    },
    updateFile: sourceFile => {
      const alreadyExists = sourceFiles.has(sourceFile.fileName);
      sys.writeFile(sourceFile.fileName, sourceFile.text);
      sourceFiles.set(sourceFile.fileName, sourceFile);
      return alreadyExists;
    },
    deleteFile: sourceFile => {
      const alreadyExists = sourceFiles.has(sourceFile.fileName);
      sourceFiles.delete(sourceFile.fileName);
      sys.deleteFile!(sourceFile.fileName);
      return alreadyExists;
    }
  };

  return vHost;
}
