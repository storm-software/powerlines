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

import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join";
import { DirectoryJSON } from "memfs";
import { Volume } from "memfs/lib/node/volume";
import _fs, { PathOrFileDescriptor } from "node:fs";
import { IFS, Union } from "unionfs";
import { FileSystem } from "../../../schemas/fs";
import { Context } from "../../types/context";
import { OutputModeType, ResolveFSOptions } from "../../types/fs";
import { cloneFS, toFilePath } from "./helpers";

export interface FileSystemInterface extends IFS {
  mode: OutputModeType;
}

/**
 * A unified file system that combines multiple file systems into one.
 */
export class UnifiedFS extends Union implements IFS {
  /**
   * The internal map of virtual files.
   */
  #virtualFS: Volume = new Volume();

  /**
   * The physical file system.
   */
  #physicalFS: typeof _fs = cloneFS(_fs);

  /**
   * The context of the unified file system.
   */
  #context: Context;

  public static create(context: Context, fs: FileSystem): UnifiedFS {
    let result = new UnifiedFS(context, fs);

    result = result.use(result.#physicalFS);
    if (result.#context.config.output.mode !== "fs") {
      result = result.use(result.#virtualFS as any);
    }

    return result;
  }

  /**
   * Gets the virtual file system (VFS).
   */
  public get virtual() {
    return this.#virtualFS;
  }

  /**
   * Gets the physical file system (FS).
   */
  public get physical() {
    return this.#physicalFS;
  }

  /**
   * Creates a new instance of the VirtualFileSystem.
   *
   * @param context - The context of the virtual file system, typically containing options and logging functions.
   * @param fs - A buffer containing the serialized virtual file system data.
   */
  private constructor(context: Context, fs: FileSystem) {
    super();
    this.#context = context;

    if (!this.#physicalFS.existsSync(this.#context.dataPath)) {
      this.#physicalFS.mkdirSync(this.#context.dataPath, {
        recursive: true
      });
    }

    if (!this.#physicalFS.existsSync(this.#context.cachePath)) {
      this.#physicalFS.mkdirSync(this.#context.cachePath, {
        recursive: true
      });
    }

    if (
      !this.#physicalFS.existsSync(
        joinPaths(
          this.#context.workspaceConfig.workspaceRoot,
          this.#context.config.output.distPath
        )
      )
    ) {
      this.#physicalFS.mkdirSync(
        joinPaths(
          this.#context.workspaceConfig.workspaceRoot,
          this.#context.config.output.distPath
        ),
        {
          recursive: true
        }
      );
    }

    if (this.#context.config.output.mode !== "fs") {
      this.#virtualFS = Volume.fromJSON(
        fs._hasFiles() && fs.files.length > 0
          ? fs.files.values().reduce((ret, file) => {
              ret[file.path] = file.code;

              return ret;
            }, {} as DirectoryJSON)
          : {}
      );

      if (!this.#virtualFS.existsSync(this.#context.artifactsPath)) {
        this.#virtualFS.mkdirSync(this.#context.artifactsPath, {
          recursive: true
        });
      }

      if (!this.#virtualFS.existsSync(this.#context.builtinsPath)) {
        this.#virtualFS.mkdirSync(this.#context.builtinsPath, {
          recursive: true
        });
      }

      if (!this.#virtualFS.existsSync(this.#context.entryPath)) {
        this.#virtualFS.mkdirSync(this.#context.entryPath, {
          recursive: true
        });
      }

      if (!this.#virtualFS.existsSync(this.#context.dtsPath)) {
        this.#virtualFS.mkdirSync(this.#context.dtsPath, {
          recursive: true
        });
      }
    } else if (this.#context.config.projectType === "application") {
      if (!this.#physicalFS.existsSync(this.#context.artifactsPath)) {
        this.#physicalFS.mkdirSync(this.#context.artifactsPath, {
          recursive: true
        });
      }

      if (!this.#physicalFS.existsSync(this.#context.builtinsPath)) {
        this.#physicalFS.mkdirSync(this.#context.builtinsPath, {
          recursive: true
        });
      }

      if (!this.#physicalFS.existsSync(this.#context.entryPath)) {
        this.#physicalFS.mkdirSync(this.#context.entryPath, {
          recursive: true
        });
      }

      if (!this.#physicalFS.existsSync(this.#context.dtsPath)) {
        this.#physicalFS.mkdirSync(this.#context.dtsPath, {
          recursive: true
        });
      }
    }
  }

  /**
   * Select the file system module to use for the operation based on the path or URL.
   *
   * @param pathOrUrl - The path to perform the file system operation on.
   * @param options - Options for the operation, such as output mode.
   * @returns The file system module used for the operation.
   */
  public resolveFS(
    pathOrUrl: PathOrFileDescriptor,
    options: ResolveFSOptions = {}
  ): FileSystemInterface {
    const mode = this.resolveMode(pathOrUrl, options);
    if (mode === "virtual") {
      return {
        ...(this.#virtualFS as any),
        mode: "virtual"
      } as FileSystemInterface;
    } else if (mode === "fs") {
      return { ...this.#physicalFS, mode: "fs" } as FileSystemInterface;
    }

    return {
      ...this,
      mode: this.#context.config.output.mode
    } as FileSystemInterface;
  }

  /**
   * Select the file system module to use for the operation based on the path or URL.
   *
   * @param pathOrUrl - The path to perform the file system operation on.
   * @param options - Options for the operation, such as output mode.
   * @returns The file system module used for the operation.
   */
  public resolveMode(
    pathOrUrl: PathOrFileDescriptor,
    options: ResolveFSOptions = {}
  ): OutputModeType | undefined {
    if (
      options.mode === "virtual" &&
      this.#context.config.output.mode !== "fs" &&
      isParentPath(toFilePath(pathOrUrl), this.#context.artifactsPath)
    ) {
      return "virtual";
    } else if (
      options.mode === "fs" ||
      this.#context.config.output.mode === "fs" ||
      isParentPath(toFilePath(pathOrUrl), this.#context.dataPath) ||
      isParentPath(toFilePath(pathOrUrl), this.#context.cachePath) ||
      isParentPath(
        toFilePath(pathOrUrl),
        joinPaths(
          this.#context.workspaceConfig.workspaceRoot,
          this.#context.config.output.distPath
        )
      )
    ) {
      return "fs";
    }

    return undefined;
  }

  /**
   * Serializes the virtual file system (VFS) to a JSON object.
   *
   * @returns A JSON representation of the virtual file system.
   */
  public toJSON(): DirectoryJSON<string | null> {
    return this.#virtualFS.toJSON();
  }
}
