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
import * as capnp from "@stryke/capnp";
import { bufferToString } from "@stryke/convert/buffer-to-string";
import { toArray } from "@stryke/convert/to-array";
import {
  readFileBuffer,
  readFileBufferSync,
  writeFileBuffer
} from "@stryke/fs/buffer";
import { existsSync } from "@stryke/fs/exists";
import {
  getResolutionCombinations,
  resolve,
  resolveSync
} from "@stryke/fs/resolve";
import { omit } from "@stryke/helpers/omit";
import { appendPath } from "@stryke/path/append";
import { toAbsolutePath } from "@stryke/path/correct-path";
import { findFilePath } from "@stryke/path/file-path-fns";
import { isAbsolutePath } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join-paths";
import { prettyBytes } from "@stryke/string-format/pretty-bytes";
import { isBuffer } from "@stryke/type-checks/is-buffer";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import { create, FlatCache } from "flat-cache";
import { Blob, Buffer } from "node:buffer";
import fs, { ObjectEncodingOptions, Stats, StatSyncOptions } from "node:fs";
import { format, resolveConfig } from "prettier";
import { IFS } from "unionfs";
import { FileSystem } from "../../../schemas/fs";
import { LogFn } from "../../types/config";
import { Context } from "../../types/context";
import {
  __VFS_PATCH__,
  __VFS_REVERT__,
  MakeDirectoryOptions,
  ResolveFSOptions,
  ResolveOptions,
  VirtualFileData,
  VirtualFileMetadata,
  VirtualFileSystemInterface,
  WriteFileData,
  WriteFileOptions
} from "../../types/fs";
import { extendLog } from "../logger";
import {
  isPowerlinesWriteFileOptions,
  isVirtualFileData,
  normalizeId,
  normalizePath,
  patchFS,
  toFilePath
} from "./helpers";
import { UnifiedFS } from "./unified-fs";

/**
 * Represents a virtual file system (VFS) that stores files and their associated metadata in virtual memory.
 *
 * @remarks
 * This class provides methods to manage virtual files, check their existence, retrieve their content, and manipulate the virtual file system. It allows for efficient file management and retrieval without relying on the actual file system.
 */
export class VirtualFileSystem implements VirtualFileSystemInterface {
  /**
   * A map of virtual file IDs to their associated metadata.
   */
  #metadata: Record<string, VirtualFileMetadata>;

  /**
   * A map of virtual file IDs to their underlying file paths.
   */
  #ids: Record<string, string>;

  /**
   * A map of underlying file paths to their virtual file IDs.
   */
  #paths: Record<string, string>;

  /**
   * A cache for module resolution results.
   */
  #resolverCache!: FlatCache;

  /**
   * The unified volume that combines the virtual file system with the real file system.
   *
   * @remarks
   * This volume allows for seamless access to both virtual and real files.
   */
  #unifiedFS: UnifiedFS;

  /**
   * Indicator specifying if the file system module is patched
   */
  #isPatched = false;

  /**
   * Indicator specifying if the virtual file system (VFS) is disposed
   */
  #isDisposed = false;

  /**
   * Function to revert require patch
   */
  #revert: (() => void) | undefined;

  /**
   * The context of the virtual file system.
   */
  #context: Context;

  /**
   * The file system's logging function.
   */
  #log: LogFn;

  /**
   * Checks if a path exists in the virtual file system (VFS).
   *
   * @param path - The path to check.
   * @returns `true` if the path exists, otherwise `false`.
   */
  #existsSync(path: string): boolean {
    return (
      this.#unifiedFS.virtual.existsSync(this.#normalizePath(path)) ||
      this.#unifiedFS.physical.existsSync(this.#normalizePath(path)) ||
      this.#unifiedFS.resolveFS(path).existsSync(this.#normalizePath(path))
    );
  }

  /**
   * Normalizes a given module id by resolving it against the built-ins path.
   *
   * @param id - The module id to normalize.
   * @returns The normalized module id.
   */
  #normalizeId(id: string): string {
    return normalizeId(id, this.#context.config.output.builtinPrefix);
  }

  /**
   * Normalizes a given path by resolving it against the project root, workspace root, and built-ins path.
   *
   * @param path - The path to normalize.
   * @returns The normalized path.
   */
  #normalizePath(path: string): string {
    return normalizePath(
      path,
      this.#context.builtinsPath,
      this.#context.config.output.builtinPrefix
    );
  }

  /**
   * Builds a regular expression from a string pattern for path matching.
   *
   * @param path - The string pattern to convert.
   * @returns A regular expression for matching paths.
   */
  #buildRegex(path: string): RegExp {
    const token = "::GLOBSTAR::";

    return new RegExp(
      `^${this.#normalizePath(path)
        .replace(/\*\*/g, token)
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, "[^/]*")
        .replace(/\?/g, "[^/]")
        .replace(new RegExp(token, "g"), ".*")}$`
    );
  }

  /**
   * Creates a virtual file system (VFS) that is backed up to a Cap'n Proto message buffer.
   *
   * @param context - The context of the virtual file system, typically containing options and logging functions.
   * @returns A promise that resolves to a new virtual file system instance.
   */
  public static async create(context: Context): Promise<VirtualFileSystem> {
    if (
      !context.config.skipCache &&
      existsSync(joinPaths(context.dataPath, "fs.bin"))
    ) {
      const buffer = await readFileBuffer(
        joinPaths(context.dataPath, "fs.bin")
      );

      const message = new capnp.Message(buffer, false);

      return new VirtualFileSystem(context, message.getRoot(FileSystem));
    }

    const message = new capnp.Message();

    return new VirtualFileSystem(context, message.initRoot(FileSystem));
  }

  /**
   * Synchronously creates a virtual file system (VFS) that is backed up to a Cap'n Proto message buffer.
   *
   * @param context - The context of the virtual file system, typically containing options and logging functions.
   * @returns A new virtual file system instance.
   */
  public static createSync(context: Context): VirtualFileSystem {
    if (
      !context.config.skipCache &&
      existsSync(joinPaths(context.dataPath, "fs.bin"))
    ) {
      const buffer = readFileBufferSync(joinPaths(context.dataPath, "fs.bin"));

      const message = new capnp.Message(buffer, false);

      return new VirtualFileSystem(context, message.getRoot(FileSystem));
    }

    const message = new capnp.Message();

    return new VirtualFileSystem(context, message.initRoot(FileSystem));
  }

  /**
   * A map of file ids to their metadata.
   */
  public get metadata(): Readonly<Record<string, VirtualFileMetadata>> {
    return new Proxy(this.#metadata, {
      get: (target, prop: string) => {
        return target[this.#normalizeId(prop)];
      }
    });
  }

  /**
   * A map of file paths to their module ids.
   */
  public get ids(): Readonly<Record<string, string>> {
    return new Proxy(this.#paths, {
      get: (target, prop: string) => {
        return target[this.#normalizePath(prop)];
      }
    });
  }

  /**
   * A map of module ids to their file paths.
   */
  public get paths(): Readonly<Record<string, string>> {
    return new Proxy(this.#paths, {
      get: (target, prop: string) => {
        return target[this.#normalizeId(prop)];
      }
    });
  }

  protected get resolverCache(): FlatCache {
    if (!this.#resolverCache) {
      this.#resolverCache = create({
        cacheId: "module-resolution",
        cacheDir: this.#context.cachePath,
        ttl: 60 * 60 * 1000,
        lruSize: 5000,
        persistInterval: 100
      });
    }

    return this.#resolverCache;
  }

  /**
   * Creates a new instance of the {@link VirtualFileSystem}.
   *
   * @param context - The context of the virtual file system, typically containing options and logging functions.
   * @param fs - A buffer containing the serialized virtual file system data.
   */
  private constructor(context: Context, fs: FileSystem) {
    this.#context = context;
    this.#unifiedFS = UnifiedFS.create(context, fs);

    this.#metadata = {} as Record<string, VirtualFileMetadata>;
    if (fs._hasMetadata()) {
      this.#metadata = fs.metadata.values().reduce(
        (ret, metadata) => {
          ret[metadata.id] = {
            id: metadata.id,
            type: metadata.type,
            mode: metadata.mode,
            timestamp: metadata.timestamp || Date.now(),
            properties: metadata._hasProperties()
              ? metadata.properties.values().reduce(
                  (ret, item) => {
                    ret[item.key] = item.value;
                    return ret;
                  },
                  {} as Record<string, string>
                )
              : {}
          };

          return ret;
        },
        {} as Record<string, VirtualFileMetadata>
      );
    }

    this.#ids = {} as Record<string, string>;
    this.#paths = {} as Record<string, string>;

    if (fs._hasIds()) {
      this.#ids = fs.ids.values().reduce(
        (ret, identifier) => {
          ret[identifier.path] ??= identifier.id;

          return ret;
        },
        {} as Record<string, string>
      );
      this.#paths = fs.ids.values().reduce(
        (ret, identifier) => {
          ret[identifier.id] ??= identifier.path;
          return ret;
        },
        {} as Record<string, string>
      );
    }

    this.#log = extendLog(this.#context.log, "file-system");
  }

  /**
   * Check if a path or id corresponds to a virtual file **(does not actually exists on disk)**.
   *
   * @param pathOrId - The path or id to check.
   * @returns Whether the path or id corresponds to a virtual file **(does not actually exists on disk)**.
   */
  public isVirtual(
    pathOrId: string,
    importer?: string,
    options: ResolveOptions = {}
  ): boolean {
    if (!pathOrId) {
      return false;
    }

    const resolvedPath = this.resolveSync(pathOrId, importer, options);
    if (!resolvedPath) {
      return false;
    }

    return this.metadata[resolvedPath]?.mode === "virtual";
  }

  /**
   * Check if a path or id corresponds to a file written to the file system **(actually exists on disk)**.
   *
   * @param pathOrId - The path or id to check.
   * @returns Whether the path or id corresponds to a file written to the file system **(actually exists on disk)**.
   */
  public isPhysical(
    pathOrId: string,
    importer?: string,
    options: ResolveOptions = {}
  ): boolean {
    if (!pathOrId) {
      return false;
    }

    const resolvedPath = this.resolveSync(pathOrId, importer, options);
    if (!resolvedPath) {
      return false;
    }

    return this.metadata[resolvedPath]?.mode === "fs";
  }

  /**
   * Lists files in a given path.
   *
   * @param path - The path to list files from.
   * @param options - Options for listing files, such as encoding and recursion.
   * @returns An array of file names in the specified path.
   */
  public readdirSync(
    path: fs.PathLike,
    options:
      | {
          encoding: BufferEncoding | null;
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        }
      | BufferEncoding = "utf8"
  ): string[] {
    return this.#unifiedFS
      .resolveFS(path)
      .readdirSync(toFilePath(path), options);
  }

  /**
   * Removes a file in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   */
  public unlinkSync(path: string, options?: ResolveFSOptions) {
    if (!this.isFile(this.#normalizePath(path))) {
      return;
    }

    this.#log(
      LogLevelLabel.TRACE,
      `Synchronously removing file: ${this.#normalizePath(path)}`
    );

    this.#unifiedFS
      .resolveFS(path, options)
      .unlinkSync(this.#normalizePath(path));
    if (
      this.#ids[this.#normalizePath(path)] &&
      this.#metadata[this.#ids[this.#normalizePath(path)]!]
    ) {
      delete this.#metadata[this.#ids[this.#normalizePath(path)]!];
      delete this.#ids[this.#normalizePath(path)];
      delete this.#paths[this.#normalizeId(path)];

      this.#resolverCache.delete(this.#normalizePath(path));
    }
  }

  /**
   * Removes a file in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   */
  public async unlink(path: string, options?: ResolveFSOptions): Promise<void> {
    if (!this.isFile(this.#normalizePath(path))) {
      return;
    }

    this.#log(
      LogLevelLabel.TRACE,
      `Removing file: ${this.#normalizePath(path)}`
    );
    if (isFunction(this.#unifiedFS.resolveFS(path, options).promises.unlink)) {
      await this.#unifiedFS
        .resolveFS(path, options)
        .promises.unlink(this.#normalizePath(path));
      if (
        this.#ids[this.#normalizePath(path)] &&
        this.#metadata[this.#ids[this.#normalizePath(path)]!]
      ) {
        delete this.#metadata[this.#ids[this.#normalizePath(path)]!];
      }
    } else {
      this.unlinkSync(this.#normalizePath(path), options);
    }
  }

  /**
   * Removes a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   */
  public rmdirSync(
    path: string,
    options: fs.RmDirOptions & ResolveFSOptions = {}
  ) {
    if (!this.isDirectory(this.#normalizePath(path))) {
      return;
    }

    this.#log(
      LogLevelLabel.TRACE,
      `Synchronously removing directory: ${this.#normalizePath(path)}`
    );

    this.#unifiedFS.resolveFS(path, options).rmdirSync(
      this.#normalizePath(path),
      defu(options, {
        recursive: true
      })
    );
  }

  /**
   * Removes a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   * @returns A promise that resolves to the path of the created directory, or undefined if the directory could not be created.
   */
  public async rmdir(
    path: string,
    options: fs.RmDirOptions & ResolveFSOptions = {}
  ): Promise<void> {
    if (!this.isDirectory(this.#normalizePath(path))) {
      return;
    }

    this.#log(
      LogLevelLabel.TRACE,
      `Removing directory: ${this.#normalizePath(path)}`
    );

    if (isFunction(this.#unifiedFS.resolveFS(path, options).promises.rm)) {
      await this.#unifiedFS.resolveFS(path, options).promises.rm(
        this.#normalizePath(path),
        defu(options, {
          force: true,
          recursive: true
        })
      );
    } else {
      this.rmdirSync(
        this.#normalizePath(path),
        defu(options ?? {}, {
          force: true,
          recursive: true
        })
      );
    }
  }

  /**
   * Removes a file in the virtual file system (VFS).
   *
   * @param path - The path to the file to remove.
   * @param options - Options for removing the file.
   * @returns A promise that resolves when the file is removed.
   */
  public async rm(
    path: string,
    options: fs.RmOptions & ResolveFSOptions = {}
  ): Promise<void> {
    this.#log(LogLevelLabel.TRACE, `Removing: ${this.#normalizePath(path)}`);

    if (this.isDirectory(this.#normalizePath(path))) {
      return this.rmdir(this.#normalizePath(path), options);
    }

    return this.unlink(this.#normalizePath(path), options);
  }

  /**
   * Synchronously removes a file or directory in the virtual file system (VFS).
   *
   * @param path - The path to the file or directory to remove.
   * @param options - Options for removing the file or directory.
   */
  public rmSync(path: string, options: fs.RmOptions & ResolveFSOptions = {}) {
    this.#log(LogLevelLabel.TRACE, `Removing: ${this.#normalizePath(path)}`);

    if (this.isDirectory(this.#normalizePath(path))) {
      return this.rmdirSync(this.#normalizePath(path), options);
    }

    return this.unlinkSync(this.#normalizePath(path), options);
  }

  /**
   * Creates a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   * @returns A promise that resolves to the path of the created directory, or undefined if the directory could not be created.
   */
  public mkdirSync(
    path: string,
    options: MakeDirectoryOptions = {}
  ): string | undefined {
    return this.#unifiedFS
      .resolveFS(this.#normalizePath(path), options)
      .mkdirSync(
        this.#normalizePath(path),
        defu(omit(options, ["mode"]), {
          recursive: true
        })
      );
  }

  /**
   * Creates a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   * @returns A promise that resolves to the path of the created directory, or undefined if the directory could not be created.
   */
  public async mkdir(
    path: string,
    options: MakeDirectoryOptions = {}
  ): Promise<string | undefined> {
    let result: string | undefined;
    if (
      isFunction(
        this.#unifiedFS.resolveFS(this.#normalizePath(path), options).promises
          .mkdir
      )
    ) {
      result = await this.#unifiedFS
        .resolveFS(this.#normalizePath(path), options)
        .promises.mkdir(
          this.#normalizePath(path),
          defu(omit(options, ["mode"]), {
            recursive: true
          })
        );
    } else {
      result = this.#unifiedFS
        .resolveFS(this.#normalizePath(path), options)
        .mkdirSync(
          this.#normalizePath(path),
          defu(omit(options, ["mode"]), {
            recursive: true
          })
        );
    }

    return result;
  }

  /**
   * Glob files in the virtual file system (VFS) based on the provided pattern(s).
   *
   * @param patterns - A pattern (or multiple patterns) to use to determine the file paths to return
   * @returns An array of file paths matching the provided pattern(s)
   */
  public async glob(patterns: string | string[]): Promise<string[]> {
    const results: string[] = [];
    for (const pattern of toArray(patterns)) {
      const normalized = this.#normalizePath(pattern);

      // No glob characters: treat as a single file path
      if (!/[*?[\]{}]/.test(normalized) && !normalized.includes("**")) {
        const resolved = this.resolveSync(normalized);
        if (resolved && !results.includes(resolved)) {
          results.push(resolved);
        }
        continue;
      }

      // Make absolute pattern for matching
      const absPattern = isAbsolutePath(normalized)
        ? normalized
        : this.#normalizePath(
            joinPaths(this.#context.workspaceConfig.workspaceRoot, normalized)
          );

      // Determine the base directory to start walking from (up to the first glob segment)
      const firstGlobIdx = absPattern.search(/[*?[\]{}]/);
      const baseDir =
        firstGlobIdx === -1
          ? findFilePath(absPattern)
          : absPattern.slice(
              0,
              Math.max(0, absPattern.lastIndexOf("/", firstGlobIdx))
            );

      const stack: string[] = [
        baseDir && isAbsolutePath(baseDir)
          ? baseDir
          : this.#context.workspaceConfig.workspaceRoot
      ];

      while (stack.length) {
        const dir = stack.pop()!;
        let entries: string[] = [];

        try {
          entries = await this.readdir(dir);
        } catch {
          continue;
        }

        for (const entry of entries) {
          const full = this.#normalizePath(joinPaths(dir, entry));
          let stats: Stats | undefined;

          try {
            stats = this.#unifiedFS.lstatSync(full);
          } catch {
            stats = undefined;
          }
          if (!stats) continue;

          if (stats.isDirectory()) {
            stack.push(full);
          } else if (stats.isFile()) {
            if (this.#buildRegex(absPattern).test(full)) {
              const resolved = this.resolveSync(full);
              if (resolved && !results.includes(resolved)) {
                results.push(resolved);
              }
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Synchronously glob files in the virtual file system (VFS) based on the provided pattern(s).
   *
   * @param patterns - A pattern (or multiple patterns) to use to determine the file paths to return
   * @returns An array of file paths matching the provided pattern(s)
   */
  public globSync(patterns: string | string[]): string[] {
    const results: string[] = [];
    for (const pattern of toArray(patterns)) {
      const normalized = this.#normalizePath(pattern);

      // No glob characters: treat as a single file path
      if (!/[*?[\]{}]/.test(normalized) && !normalized.includes("**")) {
        const resolved = this.resolveSync(normalized);
        if (resolved && !results.includes(resolved)) {
          results.push(resolved);
        }
        continue;
      }

      // Make absolute pattern for matching
      const absPattern = isAbsolutePath(normalized)
        ? normalized
        : this.#normalizePath(
            joinPaths(this.#context.workspaceConfig.workspaceRoot, normalized)
          );

      // Determine the base directory to start walking from (up to the first glob segment)
      const firstGlobIdx = absPattern.search(/[*?[\]{}]/);
      const baseDir =
        firstGlobIdx === -1
          ? findFilePath(absPattern)
          : absPattern.slice(
              0,
              Math.max(0, absPattern.lastIndexOf("/", firstGlobIdx))
            );

      const stack: string[] = [
        baseDir && isAbsolutePath(baseDir)
          ? baseDir
          : this.#context.workspaceConfig.workspaceRoot
      ];

      while (stack.length) {
        const dir = stack.pop()!;
        let entries: string[] = [];

        try {
          entries = this.readdirSync(dir);
        } catch {
          continue;
        }

        for (const entry of entries) {
          const full = this.#normalizePath(joinPaths(dir, entry));
          let stats: Stats | undefined;

          try {
            stats = this.#unifiedFS.lstatSync(full);
          } catch {
            stats = undefined;
          }
          if (!stats) continue;

          if (stats.isDirectory()) {
            stack.push(full);
          } else if (stats.isFile()) {
            if (this.#buildRegex(absPattern).test(full)) {
              const resolved = this.resolveSync(full);
              if (resolved && !results.includes(resolved)) {
                results.push(resolved);
              }
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Moves a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to move
   * @param destPath - The destination path to move to
   */
  public async move(srcPath: string, destPath: string) {
    const content = await this.readFile(srcPath);
    await this.writeFile(destPath, content);
    await this.rm(srcPath);
  }

  /**
   * Synchronously moves a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to move
   * @param destPath - The destination path to move to
   */
  public moveSync(srcPath: string, destPath: string) {
    const content = this.readFileSync(srcPath);
    this.writeFileSync(destPath, content);
    this.rmSync(srcPath);
  }

  /**
   * Copies a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to copy
   * @param destPath - The destination path to copy to
   */
  public async copy(srcPath: string, destPath: string) {
    const content = await this.readFile(srcPath);
    await this.writeFile(destPath, content);
  }

  /**
   * Synchronously copies a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to copy
   * @param destPath - The destination path to copy to
   */
  public copySync(srcPath: string, destPath: string) {
    const content = this.readFileSync(srcPath);
    this.writeFileSync(destPath, content);
  }

  /**
   * Lists files in a given path.
   *
   * @param pathOrId - The path to list files from.
   * @param options - Options for listing files, such as encoding and recursion.
   * @returns An array of file names in the specified path.
   */
  public async readdir(
    pathOrId: string,
    options:
      | {
          encoding: BufferEncoding | null;
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        }
      | BufferEncoding = "utf8"
  ): Promise<string[]> {
    return this.#unifiedFS
      .resolveFS(pathOrId)
      .promises.readdir(toFilePath(pathOrId), options);
  }

  /**
   * Asynchronously reads a file from the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the file to read.
   * @returns A promise that resolves to the contents of the file as a string, or undefined if the file does not exist.
   */
  public async readFile(
    pathOrId: string,
    options:
      | (ObjectEncodingOptions & {
          flag?: string | undefined;
        })
      | BufferEncoding = "utf8"
  ): Promise<string | undefined> {
    const filePath = await this.resolve(pathOrId);
    if (filePath && this.isFile(filePath)) {
      let result: string | Buffer;
      if (isFunction(this.#unifiedFS.resolveFS(filePath).promises.readFile)) {
        result = (
          await this.#unifiedFS
            .resolveFS(filePath)
            .promises.readFile(filePath, options)
        )?.toString("utf8");
      } else {
        result = this.#unifiedFS
          .resolveFS(filePath)
          .readFileSync(filePath, options);
      }

      return isBuffer(result) ? bufferToString(result) : result;
    }

    return undefined;
  }

  /**
   * Synchronously reads a file from the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the file to read.
   * @returns The contents of the file as a string, or undefined if the file does not exist.
   */
  public readFileSync(
    pathOrId: string,
    options:
      | (fs.ObjectEncodingOptions & {
          flag?: string | undefined;
        })
      | BufferEncoding
      | null = "utf8"
  ): string | undefined {
    const filePath = this.resolveSync(pathOrId);
    if (filePath && this.isFile(filePath)) {
      const result = this.#unifiedFS
        .resolveFS(filePath)
        .readFileSync(filePath, options);

      return isBuffer(result) ? bufferToString(result) : result;
    }

    return undefined;
  }

  /**
   * Writes a file to the virtual file system (VFS).
   *
   * @param path - The path to the file.
   * @param data - The contents of the file.
   * @param options - Optional parameters for writing the file.
   * @returns A promise that resolves when the file is written.
   */
  public async writeFile(
    path: string,
    data: WriteFileData = "",
    options: WriteFileOptions = "utf8"
  ): Promise<void> {
    if (!this.isDirectory(findFilePath(this.#normalizePath(path)))) {
      await this.mkdir(
        findFilePath(this.#normalizePath(path)),
        isPowerlinesWriteFileOptions(options) ? options : undefined
      );
    }

    const metadata = (isVirtualFileData(data) ? data : {}) as VirtualFileData;
    metadata.id = this.#normalizeId(path);

    let code = isVirtualFileData(data) ? metadata.code : data;
    if (
      (!isPowerlinesWriteFileOptions(options) || !options.skipFormat) &&
      isSetString(code)
    ) {
      const resolvedConfig = await resolveConfig(this.#normalizePath(path));
      if (resolvedConfig) {
        code = await format(code, {
          absolutePath: this.#normalizePath(path),
          ...resolvedConfig
        });
      }
    }

    const outputMode = this.#unifiedFS.resolveMode(
      this.#normalizePath(path),
      isPowerlinesWriteFileOptions(options) ? options : undefined
    );

    this.#log(
      LogLevelLabel.TRACE,
      `Writing ${this.#normalizePath(path)} file to the ${
        outputMode === "fs" ? "" : "virtual "
      }file system (size: ${prettyBytes(new Blob(toArray(code)).size)})`
    );

    this.#metadata[metadata.id] = {
      mode: outputMode,
      variant: "normal",
      timestamp: Date.now(),
      ...metadata
    } as VirtualFileMetadata;
    this.#paths[metadata.id] = this.#normalizePath(path);
    this.#ids[this.#normalizePath(path)] = metadata.id;

    const ifs: IFS = this.#unifiedFS.resolveFS(
      this.#normalizePath(path),
      isPowerlinesWriteFileOptions(options) ? options : undefined
    );

    if (isFunction(ifs.promises.writeFile)) {
      return ifs.promises.writeFile(
        this.#normalizePath(path),
        code,
        isSetObject(options) ? omit(options, ["mode"]) : "utf8"
      );
    }

    return ifs.writeFileSync(
      this.#normalizePath(path),
      code,
      isSetObject(options) ? omit(options, ["mode"]) : "utf8"
    );
  }

  /**
   * Synchronously writes a file to the virtual file system (VFS).
   *
   * @param path - The file to write.
   * @param data - The contents of the file.
   * @param options - Optional parameters for writing the file.
   */
  public writeFileSync(
    path: string,
    data: WriteFileData = "",
    options: WriteFileOptions = "utf8"
  ): void {
    if (!this.isDirectory(findFilePath(this.#normalizePath(path)))) {
      this.mkdirSync(
        findFilePath(this.#normalizePath(path)),
        isPowerlinesWriteFileOptions(options) ? options : undefined
      );
    }

    const metadata = (isVirtualFileData(data) ? data : {}) as VirtualFileData;
    metadata.id = this.#normalizeId(path);

    const code = isVirtualFileData(data) ? metadata.code : data;
    const outputMode = this.#unifiedFS.resolveMode(
      this.#normalizePath(path),
      isPowerlinesWriteFileOptions(options) ? options : undefined
    );

    this.#log(
      LogLevelLabel.TRACE,
      `Writing ${this.#normalizePath(path)} file to the ${
        outputMode === "fs" ? "" : "virtual "
      }file system (size: ${prettyBytes(new Blob(toArray(code)).size)})`
    );

    this.#metadata[metadata.id] = {
      mode: outputMode,
      variant: "normal",
      timestamp: Date.now(),
      ...metadata
    } as VirtualFileMetadata;
    this.#paths[metadata.id] = this.#normalizePath(path);
    this.#ids[this.#normalizePath(path)] = metadata.id;

    const writeStream = this.#unifiedFS
      .resolveFS(
        this.#normalizePath(path),
        isPowerlinesWriteFileOptions(options) ? options : undefined
      )
      .createWriteStream(this.#normalizePath(path));
    try {
      writeStream.write(code);
    } finally {
      writeStream.close();
    }
  }

  /**
   * Synchronously checks if a file exists in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the file to check.
   * @returns `true` if the file exists, otherwise `false`.
   */
  public existsSync(pathOrId: string): boolean {
    return !!this.resolveSync(pathOrId);
  }

  /**
   * Retrieves the metadata of a file in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the file to retrieve metadata for.
   * @returns The metadata of the file, or undefined if the file does not exist.
   */
  public getMetadata(pathOrId: string): VirtualFileMetadata | undefined {
    const resolved = this.resolveSync(pathOrId);
    if (resolved && this.metadata[resolved]) {
      return this.metadata[resolved];
    }

    return undefined;
  }

  /**
   * Checks if a file exists in the virtual file system (VFS).
   *
   * @remarks
   * This is a base method used by {@link existsSync} - it does not try to resolve the path prior to checking if it exists or not.
   *
   * @param pathOrId - The path of the file to check.
   * @returns `true` if the file exists, otherwise `false`.
   */
  public isFile(pathOrId: string): boolean {
    const resolved = this.resolveSync(pathOrId);

    return !!(
      resolved &&
      ((this.#unifiedFS.virtual.existsSync(resolved) &&
        this.#unifiedFS.virtual.lstatSync(resolved).isFile()) ||
        (this.#unifiedFS.physical.existsSync(resolved) &&
          this.#unifiedFS.physical.lstatSync(resolved).isFile()) ||
        (this.#unifiedFS.resolveFS(resolved).existsSync(resolved) &&
          this.#unifiedFS.resolveFS(resolved).lstatSync(resolved).isFile()))
    );
  }

  /**
   * Checks if a directory exists in the virtual file system (VFS).
   *
   * @param pathOrId - The path of the directory to check.
   * @returns `true` if the directory exists, otherwise `false`.
   */
  public isDirectory(pathOrId: string): boolean {
    const resolved = this.resolveSync(pathOrId);

    return !!(
      resolved &&
      ((this.#unifiedFS.virtual.existsSync(resolved) &&
        this.#unifiedFS.virtual.lstatSync(resolved).isDirectory()) ||
        (this.#unifiedFS.physical.existsSync(resolved) &&
          this.#unifiedFS.physical.lstatSync(resolved).isDirectory()) ||
        (this.#unifiedFS.resolveFS(resolved).existsSync(resolved) &&
          this.#unifiedFS
            .resolveFS(resolved)
            .lstatSync(resolved)
            .isDirectory()))
    );
  }

  /**
   * Retrieves the status of a file in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the file to retrieve status for.
   * @returns A promise that resolves to the file's status information, or false if the file does not exist.
   */
  public async stat(
    pathOrId: string,
    options?: fs.StatOptions & {
      bigint?: false | undefined;
    }
  ): Promise<Stats> {
    return this.#unifiedFS
      .resolveFS(pathOrId)
      .promises.stat((await this.resolve(pathOrId)) || pathOrId, options);
  }

  /**
   * Synchronously retrieves the status of a file in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the file to retrieve status for.
   * @returns The file's status information, or false if the file does not exist.
   */
  public statSync(pathOrId: string): Stats {
    return this.#unifiedFS
      .resolveFS(pathOrId)
      .statSync(this.resolveSync(pathOrId) || pathOrId);
  }

  /**
   * Retrieves the status of a symbolic link in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the symbolic link to retrieve status for.
   * @returns A promise that resolves to the symbolic link's status information, or false if the link does not exist.
   */
  public async lstat(
    pathOrId: string,
    options?: fs.StatOptions & {
      bigint?: false | undefined;
    }
  ): Promise<Stats> {
    return this.#unifiedFS
      .resolveFS(pathOrId)
      .promises.lstat((await this.resolve(pathOrId)) || pathOrId, options);
  }

  /**
   * Synchronously retrieves the status of a symbolic link in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the symbolic link to retrieve status for.
   * @returns The symbolic link's status information, or false if the link does not exist.
   */
  public lstatSync(
    pathOrId: string,
    options?: StatSyncOptions & {
      bigint?: false | undefined;
      throwIfNoEntry: false;
    }
  ): Stats | undefined {
    return this.#unifiedFS
      .resolveFS(pathOrId)
      .lstatSync(this.resolveSync(pathOrId) || pathOrId, options);
  }

  /**
   * Resolves a path or ID to its real path in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID to resolve.
   * @returns The resolved real path if it exists, otherwise undefined.
   */
  public realpathSync(pathOrId: string): string {
    const filePath = this.resolveSync(pathOrId);
    if (!filePath) {
      throw new Error(`File not found: ${pathOrId}`);
    }

    return filePath;
  }

  /**
   * A helper function to resolve modules in the virtual file system (VFS).
   *
   * @remarks
   * This function can be used to resolve modules relative to the project root directory.
   *
   * @example
   * ```ts
   * const resolved = await context.resolvePath("some-module", "/path/to/importer");
   * ```
   *
   * @param id - The module to resolve.
   * @param importer - An optional path to the importer module.
   * @param options - Additional resolution options.
   * @returns A promise that resolves to the resolved module path.
   */
  public async resolve(
    id: string,
    importer?: string,
    options: ResolveOptions = {}
  ): Promise<string | undefined> {
    let result = this.resolverCache.get<string | undefined>(
      this.#normalizeId(id)
    );
    if (result) {
      return result;
    }

    result = this.paths[this.#normalizeId(id)];
    if (!result) {
      const paths = options.paths ?? [];
      if (importer && !paths.includes(importer)) {
        paths.push(importer);
      }

      paths.push(this.#context.workspaceConfig.workspaceRoot);
      paths.push(
        appendPath(
          this.#context.config.projectRoot,
          this.#context.workspaceConfig.workspaceRoot
        )
      );
      paths.push(
        appendPath(
          this.#context.config.sourceRoot,
          this.#context.workspaceConfig.workspaceRoot
        )
      );
      paths.push(
        ...(
          Object.keys(this.#context.tsconfig.options.paths ?? {})
            .filter(tsconfigPath =>
              id.startsWith(tsconfigPath.replace(/\*$/, ""))
            )
            .map(
              tsconfigPath =>
                this.#context.tsconfig.options.paths?.[tsconfigPath]
            )
            .flat()
            .filter(Boolean) as string[]
        ).map(tsconfigPath =>
          appendPath(tsconfigPath, this.#context.workspaceConfig.workspaceRoot)
        )
      );

      for (const combination of getResolutionCombinations(id, { paths })) {
        if (this.#existsSync(combination)) {
          result = combination;
        }
      }

      try {
        result = await resolve(id, { paths });
      } catch {
        // Do nothing
      }
    }

    if (result) {
      result = toAbsolutePath(
        appendPath(result, this.#context.config.projectRoot),
        this.#context.workspaceConfig.workspaceRoot
      );

      this.resolverCache.set(this.#normalizeId(id), result);
    }

    return result;
  }

  /**
   * A synchronous helper function to resolve modules using the Jiti resolver
   *
   * @remarks
   * This function can be used to resolve modules relative to the project root directory.
   *
   * @example
   * ```ts
   * const resolvedPath = context.resolveSync("some-module", "/path/to/importer");
   * ```
   *
   * @param id - The module to resolve.
   * @param importer - An optional path to the importer module.
   * @param options - Additional resolution options.
   * @returns The resolved module path.
   */
  public resolveSync(
    id: string,
    importer?: string,
    options: ResolveOptions = {}
  ): string | undefined {
    let result = this.resolverCache.get<string | undefined>(
      this.#normalizeId(id)
    );
    if (result) {
      return result;
    }

    result = this.paths[this.#normalizeId(id)];
    if (!result) {
      const paths = options.paths ?? [];
      if (importer && !paths.includes(importer)) {
        paths.push(importer);
      }

      paths.push(this.#context.workspaceConfig.workspaceRoot);
      paths.push(
        joinPaths(
          this.#context.workspaceConfig.workspaceRoot,
          this.#context.config.projectRoot
        )
      );
      paths.push(
        joinPaths(
          this.#context.workspaceConfig.workspaceRoot,
          this.#context.config.sourceRoot
        )
      );
      paths.push(
        ...(
          Object.keys(this.#context.tsconfig?.options?.paths ?? {})
            .filter(tsconfigPath =>
              id.startsWith(tsconfigPath.replace(/\*$/, ""))
            )
            .map(
              tsconfigPath =>
                this.#context.tsconfig?.options?.paths?.[tsconfigPath]
            )
            .flat()
            .filter(Boolean) as string[]
        ).map(tsconfigPath =>
          appendPath(tsconfigPath, this.#context.workspaceConfig.workspaceRoot)
        )
      );

      for (const combination of getResolutionCombinations(id, { paths })) {
        if (this.#existsSync(combination)) {
          result = combination;
        }
      }

      try {
        result = resolveSync(id, { paths });
      } catch {
        // Do nothing
      }
    }

    if (result) {
      result = toAbsolutePath(
        appendPath(result, this.#context.config.projectRoot),
        this.#context.workspaceConfig.workspaceRoot
      );

      this.resolverCache.set(this.#normalizeId(id), result);
    }

    return result;
  }

  /**
   * Disposes of the virtual file system (VFS) by saving its state to disk.
   */
  public async dispose() {
    if (!this.#isDisposed) {
      this.#isDisposed = true;

      this.#log(LogLevelLabel.DEBUG, "Disposing virtual file system...");
      await this.unlink(joinPaths(this.#context.dataPath, "fs.bin"));

      const message = new capnp.Message();
      const fs = message.initRoot(FileSystem);

      const virtualFiles = Object.entries(this.#unifiedFS.toJSON()).filter(
        ([, code]) => code
      );

      const files = fs._initFiles(virtualFiles.length);
      virtualFiles
        .filter(([, code]) => code)
        .forEach(([path, code], index) => {
          const fd = files.get(index);
          fd.path = path;
          fd.code = code || "";
        });

      const ids = fs._initIds(Object.keys(this.ids).length);
      Object.entries(this.ids)
        .filter(([, path]) => path)
        .forEach(([id, path], index) => {
          const fileId = ids.get(index);
          fileId.id = id;
          fileId.path = path;
        });

      const metadata = fs._initMetadata(Object.keys(this.metadata).length);
      Object.entries(this.metadata)
        .filter(([, value]) => value)
        .forEach(([id, value], index) => {
          const fileMetadata = metadata.get(index);
          fileMetadata.id = id;
          fileMetadata.mode = value.mode;
          fileMetadata.type = value.type;
          fileMetadata.timestamp = value.timestamp ?? BigInt(Date.now());

          if (value.properties) {
            const props = fileMetadata._initProperties(
              Object.keys(value.properties).length
            );
            Object.entries(value.properties).forEach(([key, val], index) => {
              const prop = props.get(index);
              prop.key = key;
              prop.value = val;
            });
          }
        });

      await writeFileBuffer(
        joinPaths(this.#context.dataPath, "fs.bin"),
        message.toArrayBuffer()
      );

      this.#resolverCache.save(true);

      this.#log(LogLevelLabel.DEBUG, "Virtual file system disposed.");
    }
  }

  /**
   * Initializes the virtual file system (VFS) by patching the file system module if necessary.
   */
  public [__VFS_PATCH__]() {
    if (!this.#isPatched && this.#context.config.output.mode !== "fs") {
      this.#revert = patchFS(fs, this);
      this.#isPatched = true;
    }
  }

  /**
   * Reverts the file system module to its original state if it was previously patched.
   */
  public [__VFS_REVERT__]() {
    if (this.#isPatched && this.#context.config.output.mode !== "fs") {
      if (!this.#revert) {
        throw new Error(
          "Attempting to revert File System patch prior to calling `__init__` function"
        );
      }

      this.#revert?.();
      this.#isPatched = false;
    }
  }

  async [Symbol.asyncDispose]() {
    return this.dispose();
  }
}
