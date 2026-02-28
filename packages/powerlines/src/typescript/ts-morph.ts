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

import { Context } from "@powerlines/core/types";
import defu from "defu";
import {
  CompilerOptions,
  FileSystemHost,
  InMemoryFileSystemHost,
  Project,
  ProjectOptions,
  RuntimeDirEntry
} from "ts-morph";

export class VirtualFileSystemHost
  extends InMemoryFileSystemHost
  implements FileSystemHost
{
  #context: Context;

  public constructor(context: Context) {
    super();

    this.#context = context;
  }

  public override deleteSync(path: string) {
    this.#context.fs.removeSync(path);
  }

  public override readDirSync(dirPath: string): RuntimeDirEntry[] {
    if (!this.#context.fs.isDirectorySync(dirPath)) {
      return [];
    }

    return this.#context.fs.listSync(dirPath).reduce((ret, entry) => {
      const fullPath = this.#context.fs.resolveSync(entry);
      if (fullPath) {
        ret.push({
          name: entry,
          isDirectory: this.#context.fs.isDirectorySync(fullPath),
          isFile: this.#context.fs.isFileSync(fullPath),
          isSymlink: false
        });
      }

      return ret;
    }, [] as RuntimeDirEntry[]);
  }

  public override async readFile(filePath: string) {
    if (!this.#context.fs.isFileSync(filePath)) {
      return "";
    }

    return (await this.#context.fs.read(filePath))!;
  }

  public override readFileSync(filePath: string) {
    if (!this.#context.fs.isFileSync(filePath)) {
      return "";
    }

    return this.#context.fs.readSync(filePath)!;
  }

  public override async writeFile(filePath: string, fileText: string) {
    return this.#context.fs.write(filePath, fileText);
  }

  public override writeFileSync(filePath: string, fileText: string) {
    this.#context.fs.writeSync(filePath, fileText);
  }

  public override async mkdir(dirPath: string) {
    await this.#context.fs.mkdir(dirPath);
  }

  public override mkdirSync(dirPath: string) {
    this.#context.fs.mkdirSync(dirPath);
  }

  public override async move(srcPath: string, destPath: string) {
    await this.#context.fs.move(srcPath, destPath);
  }

  public override moveSync(srcPath: string, destPath: string) {
    this.#context.fs.moveSync(srcPath, destPath);
  }

  public override async copy(srcPath: string, destPath: string) {
    await this.#context.fs.copy(srcPath, destPath);
  }

  public override copySync(srcPath: string, destPath: string) {
    this.#context.fs.copySync(srcPath, destPath);
  }

  public override async fileExists(filePath: string) {
    return this.#context.fs.isFile(filePath);
  }

  public override fileExistsSync(filePath: string) {
    return this.#context.fs.isFileSync(filePath);
  }

  public override async directoryExists(dirPath: string) {
    return this.#context.fs.isDirectory(dirPath);
  }

  public override directoryExistsSync(dirPath: string): boolean {
    return this.#context.fs.isDirectorySync(dirPath);
  }

  public override realpathSync(path: string) {
    return this.#context.fs.resolveSync(path) || path;
  }

  public override getCurrentDirectory() {
    return this.#context.workspaceConfig.workspaceRoot;
  }

  public override async glob(
    patterns: ReadonlyArray<string>
  ): Promise<string[]> {
    return this.#context.fs.glob(patterns as string[]);
  }

  public override globSync(patterns: ReadonlyArray<string>): string[] {
    return this.#context.fs.globSync(patterns as string[]);
  }
}

/**
 * Create a ts-morph {@link Project} instance used for type reflection and module manipulation during processing
 *
 * @param context - The Powerlines context
 * @returns A ts-morph {@link Project} instance
 */
export function createProgram(
  context: Context,
  override: Partial<ProjectOptions>
): Project {
  context.debug(
    `Creating ts-morph Project instance with configuration from: ${
      context.tsconfig.tsconfigFilePath
    }.`
  );

  const project = new Project(
    defu(override ?? {}, {
      skipAddingFilesFromTsConfig: false,
      tsConfigFilePath: context.tsconfig.tsconfigFilePath,
      fileSystem: new VirtualFileSystemHost(context),
      compilerOptions: defu(context.tsconfig.options ?? {}, {
        lib: ["lib.esnext.full.d.ts"]
      }) as CompilerOptions
    })
  );

  return project;
}
