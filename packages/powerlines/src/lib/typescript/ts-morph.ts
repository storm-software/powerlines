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

import { joinPaths } from "@stryke/path/join";
import {
  FileSystemHost,
  InMemoryFileSystemHost,
  Project,
  RuntimeDirEntry
} from "ts-morph";
import { Context } from "../../types/context";
import { VirtualFileSystemInterface } from "../../types/fs";

class VirtualFileSystemHost
  extends InMemoryFileSystemHost
  implements FileSystemHost
{
  #fs: VirtualFileSystemInterface;

  public constructor(fs: VirtualFileSystemInterface) {
    super();
    this.#fs = fs;
  }

  public override deleteSync(path: string) {
    this.#fs.rmSync(path);
  }

  public override readDirSync(dirPath: string): RuntimeDirEntry[] {
    return this.#fs.readdirSync(dirPath).reduce((ret, entry) => {
      const fullPath = this.#fs.resolve(joinPaths(dirPath, entry));
      if (fullPath) {
        ret.push({
          name: entry,
          isDirectory: this.#fs.isDirectory(fullPath),
          isFile: this.#fs.isFile(fullPath),
          isSymlink: false
        });
      }

      return ret;
    }, [] as RuntimeDirEntry[]);
  }

  public override async readFile(filePath: string) {
    if (!this.#fs.existsSync(filePath)) {
      throw new Error(
        `File not found: '${filePath}'. Please check the path and try again.`
      );
    }

    return (await this.#fs.readFile(filePath))!;
  }

  public override readFileSync(filePath: string) {
    if (!this.#fs.existsSync(filePath)) {
      throw new Error(
        `File not found: '${filePath}'. Please check the path and try again.`
      );
    }

    return this.#fs.readFileSync(filePath)!;
  }

  public override async writeFile(filePath: string, fileText: string) {
    return this.#fs.writeFile(filePath, fileText);
  }

  public override writeFileSync(filePath: string, fileText: string) {
    this.#fs.writeFileSync(filePath, fileText);
  }

  public override async mkdir(dirPath: string) {
    await this.#fs.mkdir(dirPath);
  }

  public override mkdirSync(dirPath: string) {
    this.#fs.mkdirSync(dirPath);
  }

  public override async move(srcPath: string, destPath: string) {
    await this.#fs.move(srcPath, destPath);
  }

  public override moveSync(srcPath: string, destPath: string) {
    this.#fs.moveSync(srcPath, destPath);
  }

  public override async copy(srcPath: string, destPath: string) {
    await this.#fs.copy(srcPath, destPath);
  }

  public override copySync(srcPath: string, destPath: string) {
    this.#fs.copySync(srcPath, destPath);
  }

  public override async fileExists(filePath: string) {
    return this.#fs.isFile(filePath);
  }

  public override fileExistsSync(filePath: string) {
    return this.#fs.isFile(filePath);
  }

  public override async directoryExists(dirPath: string) {
    return this.#fs.isDirectory(dirPath);
  }

  public override directoryExistsSync(dirPath: string): boolean {
    return this.#fs.isDirectory(dirPath);
  }

  public override realpathSync(path: string) {
    return this.#fs.resolve(path) || path;
  }

  public override getCurrentDirectory() {
    return "/";
  }

  public override async glob(
    patterns: ReadonlyArray<string>
  ): Promise<string[]> {
    return this.#fs.glob(patterns as string[]);
  }

  public override globSync(patterns: ReadonlyArray<string>): string[] {
    return this.#fs.globSync(patterns as string[]);
  }
}

/**
 * Create a ts-morph {@link Project} instance used for type reflection and module manipulation during processing
 *
 * @returns A ts-morph {@link Project} instance
 */
export function createProgram(context: Context): Project {
  return new Project({
    compilerOptions: {
      ...context.tsconfig.options
    },
    tsConfigFilePath: context.tsconfig.tsconfigFilePath,
    fileSystem: new VirtualFileSystemHost(context.fs)
  });
}
