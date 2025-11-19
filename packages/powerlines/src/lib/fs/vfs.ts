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
import { murmurhash } from "@stryke/hash/murmurhash";
import {
  findFileDotExtensionSafe,
  findFilePath
} from "@stryke/path/file-path-fns";
import { isAbsolutePath } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join-paths";
import { prettyBytes } from "@stryke/string-format/pretty-bytes";
import { isBuffer } from "@stryke/type-checks/is-buffer";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import { Blob, Buffer } from "node:buffer";
import fs, {
  ObjectEncodingOptions,
  PathLike,
  PathOrFileDescriptor,
  Stats,
  StatSyncOptions
} from "node:fs";
import { format, resolveConfig } from "prettier";
import { IFS } from "unionfs";
import { FileSystemData } from "../../../schemas/fs";
import { LogFn } from "../../types/config";
import { Context } from "../../types/context";
import {
  __VFS_PATCH__,
  __VFS_REVERT__,
  MakeDirectoryOptions,
  ResolveFSOptions,
  ResolvePathOptions,
  VirtualFileMetadata,
  VirtualFileSystemInterface,
  WriteFileData,
  WriteFileOptions
} from "../../types/vfs";
import { extendLog } from "../logger";
import {
  isNodeWriteFileOptions,
  isPowerLinesWriteFileData,
  isPowerlinesWriteFileOptions,
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
   * A map of virtual file paths to their underlying file content.
   */
  #cachedResolver: Map<string, string | false> = new Map<
    string,
    string | false
  >();

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
  #existsSync(path: PathLike): boolean {
    const formattedPath = this.formatPath(path);

    return (
      this.#unifiedFS.virtual.existsSync(formattedPath) ||
      this.#unifiedFS.physical.existsSync(formattedPath) ||
      this.#unifiedFS.resolveFS(path).existsSync(formattedPath)
    );
  }

  /**
   * Builds a regular expression from a string pattern for path matching.
   *
   * @param strPattern - The string pattern to convert.
   * @returns A regular expression for matching paths.
   */
  #buildRegex(strPattern: string): RegExp {
    const token = "::GLOBSTAR::";

    return new RegExp(
      `^${this.formatPath(strPattern)
        .replace(/\*\*/g, token)
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, "[^/]*")
        .replace(/\?/g, "[^/]")
        .replace(new RegExp(token, "g"), ".*")}$`
    );
  }

  /**
   * Formats a file id by removing the file extension and prepending the runtime prefix.
   *
   * @param id - The file ID to format.
   * @returns The formatted file ID.
   */
  #formatId(id: PathOrFileDescriptor): string {
    const formattedId = toFilePath(id);

    return `${this.#context.config.output.builtinPrefix}:${formattedId
      .replace(new RegExp(`^${this.#context.config.output.builtinPrefix}:`), "")
      .replace(/^\\0/, "")
      .replace(findFileDotExtensionSafe(formattedId), "")}`;
  }

  /**
   * Resolves an id parameter to a corresponding virtual file path in the virtual file system (VFS).
   *
   * @param id - The id to resolve.
   * @returns The resolved file id if it exists, otherwise undefined.
   */
  #resolveId(id: string): string | false {
    if (this.#ids[this.#formatId(id)]) {
      return this.#ids[this.#formatId(id)] || false;
    }

    return false;
  }

  /**
   * Resolves a path parameter to a corresponding virtual file path in the virtual file system (VFS).
   *
   * @param path - The path to resolve.
   * @param options - Optional parameters for resolving the path.
   * @returns The resolved file path if it exists, otherwise undefined.
   */
  #resolvePath(path: string, options: ResolvePathOptions = {}): string | false {
    if (isAbsolutePath(path)) {
      if (this.#existsSync(path)) {
        return path;
      }

      const result = this.#checkVariants(path);
      if (result) {
        return result;
      }
    }

    for (const parentPath of this.#resolveParentPaths(path, options.paths)) {
      const request = joinPaths(parentPath, path);
      if (this.#existsSync(request)) {
        return request;
      }

      const result = this.#checkVariants(request);
      if (result) {
        return result;
      }
    }

    return false;
  }

  /**
   * Resolves parent paths for a given request.
   *
   * @param request - The request path to resolve parent paths for.
   * @param parents - An optional array of parent paths to consider.
   * @returns An array of resolved parent paths.
   */
  #resolveParentPaths(request: string, parents: string[] = []) {
    let paths = [
      this.#context.workspaceConfig.workspaceRoot,
      joinPaths(
        this.#context.workspaceConfig.workspaceRoot,
        this.#context.config.projectRoot
      )
    ];

    if (this.#context.tsconfig.options.paths) {
      paths = this.#context.tsconfig.options.paths
        ? Object.keys(this.#context.tsconfig.options.paths)
            .filter(tsconfigPath =>
              request.startsWith(tsconfigPath.replaceAll("*", ""))
            )
            .map(
              tsconfigPath =>
                this.#context.tsconfig.options.paths?.[tsconfigPath]
            )
            .flat()
            .reduce((ret, path) => {
              if (
                path &&
                !ret.includes(
                  joinPaths(this.#context.workspaceConfig.workspaceRoot, path)
                )
              ) {
                ret.push(
                  joinPaths(this.#context.workspaceConfig.workspaceRoot, path)
                );
              }

              return ret;
            }, paths)
        : paths;
    }

    return paths.reduce(
      (ret, path) => {
        if (!ret.includes(path)) {
          ret.push(path);
        }

        return ret;
      },
      parents.filter(Boolean).map(p => this.formatPath(p))
    );
  }

  /**
   * Clears the resolver cache for a given path.
   *
   * @param path - The path to clear the resolver cache for.
   */
  #clearResolverCache(path: fs.PathLike) {
    this.#cachedResolver
      .keys()
      .filter(key => key.startsWith(toFilePath(path)))
      .forEach(key => this.#cachedResolver.delete(key));
  }

  /**
   * Check if the file exists with different variants (index, extensions).
   *
   * @param request - The request path to check.
   * @param parentPath - An optional parent path to prepend to the request.
   * @returns The file path if it exists, otherwise false.
   */
  #checkVariants(request: string, parentPath?: string): string | false {
    const path = parentPath ? joinPaths(parentPath, request) : request;

    let file = this.#checkExtensions(path);
    if (file) {
      return file;
    }

    file = this.#checkIndex(path);
    if (file) {
      return file;
    }

    return false;
  }

  /**
   * Check if the index file exists in the given request path.
   *
   * @param request - The request path to check.
   * @returns The index file path if it exists, otherwise false.
   */
  #checkIndex(request: string): string | false {
    let file: string | false = joinPaths(request, "index");
    if (this.#existsSync(file)) {
      return file;
    }

    file = this.#checkExtensions(file);
    if (file) {
      return file;
    }

    return false;
  }

  /**
   * Check if the file exists with different extensions.
   *
   * @param request - The request path to check.
   * @returns The file path if it exists with any of the checked extensions, otherwise false.
   */
  #checkExtensions(request: string): string | false {
    let file = `${request}.ts`;
    if (this.#existsSync(file)) {
      return file;
    }

    file = `${request}.mts`;
    if (this.#existsSync(file)) {
      return file;
    }

    file = `${request}.cts`;
    if (this.#existsSync(file)) {
      return file;
    }

    file = `${request}.tsx`;
    if (this.#existsSync(file)) {
      return file;
    }

    file = `${request}.js`;
    if (this.#existsSync(file)) {
      return file;
    }

    file = `${request}.mjs`;
    if (this.#existsSync(file)) {
      return file;
    }

    file = `${request}.cjs`;
    if (this.#existsSync(file)) {
      return file;
    }

    file = `${request}.jsx`;
    if (this.#existsSync(file)) {
      return file;
    }

    file = `${request}.json`;
    if (this.#existsSync(file)) {
      return file;
    }

    file = `${request}.d.ts`;
    if (this.#existsSync(file)) {
      return file;
    }

    return false;
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
      existsSync(joinPaths(context.cachePath, "fs.bin"))
    ) {
      const buffer = await readFileBuffer(
        joinPaths(context.cachePath, "fs.bin")
      );

      const message = new capnp.Message(buffer, false);

      return new VirtualFileSystem(context, message.getRoot(FileSystemData));
    }

    const message = new capnp.Message();

    return new VirtualFileSystem(context, message.initRoot(FileSystemData));
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
      existsSync(joinPaths(context.cachePath, "fs.bin"))
    ) {
      const buffer = readFileBufferSync(joinPaths(context.cachePath, "fs.bin"));

      const message = new capnp.Message(buffer, false);

      return new VirtualFileSystem(context, message.getRoot(FileSystemData));
    }

    const message = new capnp.Message();

    return new VirtualFileSystem(context, message.initRoot(FileSystemData));
  }

  /**
   * A map of file ids to their metadata.
   */
  public get metadata(): Record<string, VirtualFileMetadata> {
    return this.#metadata;
  }

  /**
   * A map of module ids to their file paths.
   */
  public get ids(): Record<string, string> {
    return this.#ids;
  }

  /**
   * A map of virtual file paths to their IDs.
   */
  public get paths(): Record<string, string> {
    return this.#paths;
  }

  /**
   * Creates a new instance of the {@link VirtualFileSystem}.
   *
   * @param context - The context of the virtual file system, typically containing options and logging functions.
   * @param data - A buffer containing the serialized virtual file system data.
   */
  private constructor(context: Context, data: FileSystemData) {
    this.#context = context;
    this.#unifiedFS = UnifiedFS.create(context, data);

    this.#metadata = {} as Record<string, VirtualFileMetadata>;
    if (data._hasMetadata()) {
      this.#metadata = data.metadata.values().reduce(
        (ret, data) => {
          ret[data.id] = {
            id: data.id,
            variant: data.variant,
            mode: data.mode,
            properties: data._hasProperties()
              ? data.properties.values().reduce(
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

    if (data._hasIds()) {
      this.#ids = data.ids.values().reduce(
        (ret, data) => {
          ret[data.id] ??= data.path;
          ret[data.path] ??= data.path;

          return ret;
        },
        {} as Record<string, string>
      );
      this.#paths = data.ids.values().reduce(
        (ret, data) => {
          ret[data.path] ??= data.id;

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
   * @param options - Optional parameters for resolving the path.
   * @returns Whether the path or id corresponds to a virtual file **(does not actually exists on disk)**.
   */
  public isVirtual(
    pathOrId: string,
    options: ResolvePathOptions = {}
  ): boolean {
    if (!pathOrId) {
      return false;
    }

    const resolvedPath = this.resolve(pathOrId, {
      ...options,
      type: "file"
    });
    if (!resolvedPath) {
      return false;
    }

    return this.metadata[resolvedPath]?.mode === "virtual";
  }

  /**
   * Check if a path or id corresponds to a file written to the file system **(actually exists on disk)**.
   *
   * @param pathOrId - The path or id to check.
   * @param options - Optional parameters for resolving the path.
   * @returns Whether the path or id corresponds to a file written to the file system **(actually exists on disk)**.
   */
  public isPhysical(
    pathOrId: string,
    options: ResolvePathOptions = {}
  ): boolean {
    if (!pathOrId) {
      return false;
    }

    const resolvedPath = this.resolve(pathOrId, {
      ...options,
      type: "file"
    });
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
  public unlinkSync(path: fs.PathLike, options?: ResolveFSOptions) {
    const formattedPath = toFilePath(path);
    if (!this.isFile(formattedPath)) {
      return;
    }

    this.#log(
      LogLevelLabel.TRACE,
      `Synchronously removing file: ${formattedPath}`
    );

    this.#unifiedFS.resolveFS(path, options).unlinkSync(formattedPath);
    if (this.paths[formattedPath] && this.metadata[this.paths[formattedPath]]) {
      delete this.metadata[this.paths[formattedPath]];
    }

    this.#clearResolverCache(formattedPath);
  }

  /**
   * Removes a file in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   */
  public async unlink(
    path: fs.PathLike,
    options?: ResolveFSOptions
  ): Promise<void> {
    const formattedPath = toFilePath(path);
    if (!this.isFile(formattedPath)) {
      return;
    }

    this.#log(LogLevelLabel.TRACE, `Removing file: ${formattedPath}`);

    if (isFunction(this.#unifiedFS.resolveFS(path, options).promises.unlink)) {
      await this.#unifiedFS
        .resolveFS(path, options)
        .promises.unlink(formattedPath);

      if (
        this.paths[formattedPath] &&
        this.metadata[this.paths[formattedPath]]
      ) {
        delete this.metadata[this.paths[formattedPath]];
      }

      this.#clearResolverCache(formattedPath);
    } else {
      this.unlinkSync(formattedPath, options);
    }
  }

  /**
   * Removes a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   */
  public rmdirSync(
    path: fs.PathLike,
    options: fs.RmDirOptions & ResolveFSOptions = {}
  ) {
    const formattedPath = toFilePath(path);
    if (!this.isDirectory(formattedPath)) {
      return;
    }

    this.#log(
      LogLevelLabel.TRACE,
      `Synchronously removing directory: ${formattedPath}`
    );

    this.#unifiedFS.resolveFS(path, options).rmdirSync(
      formattedPath,
      defu(options, {
        recursive: true
      })
    );

    this.#clearResolverCache(formattedPath);
  }

  /**
   * Removes a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   * @returns A promise that resolves to the path of the created directory, or undefined if the directory could not be created.
   */
  public async rmdir(
    path: fs.PathLike,
    options: fs.RmDirOptions & ResolveFSOptions = {}
  ): Promise<void> {
    const formattedPath = toFilePath(path);
    if (!this.isDirectory(formattedPath)) {
      return;
    }

    this.#log(LogLevelLabel.TRACE, `Removing directory: ${formattedPath}`);

    if (isFunction(this.#unifiedFS.resolveFS(path, options).promises.rm)) {
      await this.#unifiedFS.resolveFS(path, options).promises.rm(
        formattedPath,
        defu(options, {
          force: true,
          recursive: true
        })
      );

      this.#clearResolverCache(formattedPath);
    } else {
      this.rmdirSync(
        formattedPath,
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
    path: fs.PathLike,
    options: fs.RmOptions & ResolveFSOptions = {}
  ): Promise<void> {
    this.#log(LogLevelLabel.TRACE, `Removing: ${toFilePath(path)}`);

    if (this.isDirectory(path)) {
      return this.rmdir(path, options);
    }

    return this.unlink(path, options);
  }

  /**
   * Synchronously removes a file or directory in the virtual file system (VFS).
   *
   * @param path - The path to the file or directory to remove.
   * @param options - Options for removing the file or directory.
   */
  public rmSync(
    path: fs.PathLike,
    options: fs.RmOptions & ResolveFSOptions = {}
  ) {
    this.#log(LogLevelLabel.TRACE, `Removing: ${toFilePath(path)}`);

    if (this.isDirectory(path)) {
      return this.rmdirSync(path, options);
    }

    return this.unlinkSync(path, options);
  }

  /**
   * Creates a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   * @returns A promise that resolves to the path of the created directory, or undefined if the directory could not be created.
   */
  public mkdirSync(
    path: fs.PathLike,
    options: MakeDirectoryOptions = {}
  ): string | undefined {
    const filePath = toFilePath(path);

    this.#clearResolverCache(filePath);
    return this.#unifiedFS.resolveFS(filePath, options).mkdirSync(
      filePath,
      defu(options ?? {}, {
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
    path: fs.PathLike,
    options: MakeDirectoryOptions = {}
  ): Promise<string | undefined> {
    let result: string | undefined;

    const filePath = toFilePath(path);

    if (
      isFunction(this.#unifiedFS.resolveFS(filePath, options).promises.mkdir)
    ) {
      result = await this.#unifiedFS
        .resolveFS(filePath, options)
        .promises.mkdir(
          filePath,
          defu(options ?? {}, {
            recursive: true
          })
        );
    } else {
      result = this.#unifiedFS.resolveFS(filePath, options).mkdirSync(
        filePath,
        defu(options ?? {}, {
          recursive: true
        })
      );
    }

    this.#clearResolverCache(filePath);
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
      const normalized = this.formatPath(pattern);

      // No glob characters: treat as a single file path
      if (!/[*?[\]{}]/.test(normalized) && !normalized.includes("**")) {
        const resolved = this.resolve(normalized, { type: "file" });
        if (resolved && !results.includes(resolved)) {
          results.push(resolved);
        }
        continue;
      }

      // Make absolute pattern for matching
      const absPattern = isAbsolutePath(normalized)
        ? normalized
        : this.formatPath(
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
          const full = this.formatPath(joinPaths(dir, entry));
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
              const resolved = this.resolve(full, { type: "file" });
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
      const normalized = this.formatPath(pattern);

      // No glob characters: treat as a single file path
      if (!/[*?[\]{}]/.test(normalized) && !normalized.includes("**")) {
        const resolved = this.resolve(normalized, { type: "file" });
        if (resolved && !results.includes(resolved)) {
          results.push(resolved);
        }
        continue;
      }

      // Make absolute pattern for matching
      const absPattern = isAbsolutePath(normalized)
        ? normalized
        : this.formatPath(
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
          const full = this.formatPath(joinPaths(dir, entry));
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
              const resolved = this.resolve(full, { type: "file" });
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
    pathOrId: PathLike,
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
    pathOrId: PathLike,
    options:
      | (ObjectEncodingOptions & {
          flag?: string | undefined;
        })
      | BufferEncoding = "utf8"
  ): Promise<string | undefined> {
    if (!pathOrId) {
      return undefined;
    }

    const filePath = this.resolve(toFilePath(pathOrId), {
      type: "file"
    });
    if (filePath) {
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

      const content = isBuffer(result) ? bufferToString(result) : result;

      return content;
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
    pathOrId: PathLike,
    options:
      | (fs.ObjectEncodingOptions & {
          flag?: string | undefined;
        })
      | BufferEncoding
      | null = "utf8"
  ): string | undefined {
    if (!pathOrId) {
      return undefined;
    }

    const filePath = this.resolve(toFilePath(pathOrId), {
      type: "file"
    });
    if (filePath) {
      const result = this.#unifiedFS
        .resolveFS(filePath)
        .readFileSync(filePath, options);
      const content = isBuffer(result) ? bufferToString(result) : result;

      return content;
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
    path: PathOrFileDescriptor,
    data: WriteFileData = "",
    options: WriteFileOptions = "utf8"
  ): Promise<void> {
    const formattedPath = this.formatPath(path);
    if (!this.isDirectory(findFilePath(formattedPath))) {
      await this.mkdir(
        findFilePath(formattedPath),
        isPowerlinesWriteFileOptions(options) ? options : undefined
      );
    }

    let code = isPowerLinesWriteFileData(data) ? data.code : data;
    if (
      (!isPowerlinesWriteFileOptions(options) || !options.skipFormat) &&
      isSetString(code)
    ) {
      const resolvedConfig = await resolveConfig(formattedPath);
      if (resolvedConfig) {
        code = await format(code, {
          absolutePath: formattedPath,
          ...resolvedConfig
        });
      }
    }

    const outputMode = this.#unifiedFS.resolveMode(
      formattedPath,
      isPowerlinesWriteFileOptions(options) ? options : undefined
    );

    this.#log(
      LogLevelLabel.TRACE,
      `Writing ${formattedPath} file to the ${
        outputMode === "fs" ? "" : "virtual "
      }file system (size: ${prettyBytes(new Blob(toArray(code)).size)})`
    );

    this.metadata[formattedPath] = {
      mode: outputMode,
      variant: "normal",
      ...(isPowerLinesWriteFileData(data) ? data : {})
    } as VirtualFileMetadata;
    this.#clearResolverCache(formattedPath);

    const ifs: IFS = this.#unifiedFS.resolveFS(
      formattedPath,
      isPowerlinesWriteFileOptions(options) ? options : undefined
    );

    if (isFunction(ifs.promises.writeFile)) {
      return ifs.promises.writeFile(
        formattedPath,
        code,
        isNodeWriteFileOptions(options) ? options : "utf8"
      );
    }

    return ifs.writeFileSync(
      formattedPath,
      code,
      isNodeWriteFileOptions(options) ? options : "utf8"
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
    path: PathOrFileDescriptor,
    data: WriteFileData = "",
    options: WriteFileOptions = "utf8"
  ): void {
    const formattedPath = this.formatPath(path);
    if (!this.isDirectory(findFilePath(formattedPath))) {
      this.mkdirSync(
        findFilePath(formattedPath),
        isPowerlinesWriteFileOptions(options) ? options : undefined
      );
    }

    const code = isPowerLinesWriteFileData(data) ? data.code : data;
    const outputMode = this.#unifiedFS.resolveMode(
      formattedPath,
      isPowerlinesWriteFileOptions(options) ? options : undefined
    );

    this.#log(
      LogLevelLabel.TRACE,
      `Writing ${formattedPath} file to the ${
        outputMode === "fs" ? "" : "virtual "
      }file system (size: ${prettyBytes(new Blob(toArray(code)).size)})`
    );

    this.metadata[formattedPath] = {
      mode: outputMode,
      variant: "normal",
      ...(isPowerLinesWriteFileData(data) ? data : {})
    } as VirtualFileMetadata;
    this.#clearResolverCache(formattedPath);

    const writeStream = this.#unifiedFS
      .resolveFS(
        formattedPath,
        isPowerlinesWriteFileOptions(options) ? options : undefined
      )
      .createWriteStream(formattedPath);
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
  public existsSync(pathOrId: PathLike): boolean {
    return this.resolve(pathOrId) !== false;
  }

  /**
   * Retrieves the metadata of a file in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the file to retrieve metadata for.
   * @returns The metadata of the file, or undefined if the file does not exist.
   */
  public getMetadata(pathOrId: PathLike): VirtualFileMetadata | undefined {
    const resolved = this.resolve(pathOrId);
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
  public isFile(pathOrId: PathLike): boolean {
    const resolved = this.resolve(pathOrId);

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
  public isDirectory(pathOrId: PathLike): boolean {
    const resolved = this.resolve(pathOrId);

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
    pathOrId: PathLike,
    options?: fs.StatOptions & {
      bigint?: false | undefined;
    }
  ): Promise<Stats> {
    return this.#unifiedFS
      .resolveFS(pathOrId)
      .promises.stat(
        this.resolve(toFilePath(pathOrId)) || toFilePath(pathOrId),
        options
      );
  }

  /**
   * Synchronously retrieves the status of a file in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the file to retrieve status for.
   * @returns The file's status information, or false if the file does not exist.
   */
  public statSync(pathOrId: PathLike): Stats {
    return this.#unifiedFS
      .resolveFS(pathOrId)
      .statSync(this.resolve(toFilePath(pathOrId)) || toFilePath(pathOrId));
  }

  /**
   * Retrieves the status of a symbolic link in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the symbolic link to retrieve status for.
   * @returns A promise that resolves to the symbolic link's status information, or false if the link does not exist.
   */
  public async lstat(
    pathOrId: PathLike,
    options?: fs.StatOptions & {
      bigint?: false | undefined;
    }
  ): Promise<Stats> {
    return this.#unifiedFS
      .resolveFS(pathOrId)
      .promises.lstat(
        this.resolve(toFilePath(pathOrId)) || toFilePath(pathOrId),
        options
      );
  }

  /**
   * Synchronously retrieves the status of a symbolic link in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID of the symbolic link to retrieve status for.
   * @returns The symbolic link's status information, or false if the link does not exist.
   */
  public lstatSync(
    pathOrId: PathLike,
    options?: StatSyncOptions & {
      bigint?: false | undefined;
      throwIfNoEntry: false;
    }
  ): Stats | undefined {
    return this.#unifiedFS
      .resolveFS(pathOrId)
      .lstatSync(
        this.resolve(toFilePath(pathOrId)) || toFilePath(pathOrId),
        options
      );
  }

  /**
   * Resolves a path or ID to its real path in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID to resolve.
   * @returns The resolved real path if it exists, otherwise undefined.
   */
  public realpathSync(pathOrId: PathLike): string {
    const filePath = this.resolve(toFilePath(pathOrId));
    if (!filePath) {
      throw new Error(`File not found: ${toFilePath(pathOrId)}`);
    }

    return filePath;
  }

  /**
   * Resolves a path or ID parameter to a corresponding virtual file path in the virtual file system (VFS).
   *
   * @param pathOrId - The path or ID to resolve.
   * @param options - Optional parameters for resolving the path, such as whether to include the file extension.
   * @returns The resolved file path if it exists, otherwise undefined.
   */
  public resolve(
    pathOrId: PathLike,
    options: ResolvePathOptions = {}
  ): string | false {
    const formattedPathOrId = toFilePath(pathOrId);

    const resolverKey = `${formattedPathOrId}${
      options.withExtension ? "-ext" : ""
    }${options.paths ? `-${murmurhash(options.paths)}` : ""}${
      options.type ? `-${options.type}` : ""
    }`;
    if (this.#cachedResolver.has(resolverKey)) {
      return this.#cachedResolver.get(resolverKey)!;
    }

    let result = this.#resolveId(formattedPathOrId);
    if (!result) {
      result = this.#resolvePath(formattedPathOrId, options);
    }

    if (!result) {
      result = false;
    }

    if (result && options.withExtension === false) {
      return result.replace(/\.[m|c]?[t|j]sx?$/, "");
    }

    this.#cachedResolver.set(resolverKey, result);

    return result;
  }

  /**
   * Converts a relative path to an absolute path based on the workspace and project root.
   *
   * @param path - The relative path to convert.
   * @returns The absolute path.
   */
  public formatPath(path: PathOrFileDescriptor): string {
    const formattedPath = toFilePath(path);
    if (
      isAbsolutePath(formattedPath) ||
      formattedPath.startsWith(this.#context.workspaceConfig.workspaceRoot)
    ) {
      return formattedPath;
    } else if (formattedPath.startsWith(this.#context.config.projectRoot)) {
      return joinPaths(
        this.#context.workspaceConfig.workspaceRoot,
        formattedPath
      );
    }

    return formattedPath;
  }

  /**
   * Disposes of the virtual file system (VFS) by saving its state to disk.
   */
  public async dispose() {
    if (!this.#isDisposed) {
      this.#isDisposed = true;

      this.#log(LogLevelLabel.DEBUG, "Disposing virtual file system...");
      await this.unlink(joinPaths(this.#context.cachePath, "fs.bin"));

      const message = new capnp.Message();
      const data = message.initRoot(FileSystemData);

      const virtualFS = this.#unifiedFS.toJSON();
      const files = data._initFiles(Object.keys(virtualFS).length);
      Object.entries(virtualFS)
        .filter(([_, content]) => content)
        .forEach(([path, content], index) => {
          const fileData = files.get(index);
          fileData.path = path;
          fileData.content = content!;
        });

      const ids = data._initIds(Object.keys(this.ids).length);
      Object.entries(this.ids).forEach(([id, path], index) => {
        const fileId = ids.get(index);
        fileId.id = id;
        fileId.path = path;
      });

      const metadata = data._initMetadata(Object.keys(this.metadata).length);
      Object.entries(this.metadata).forEach(([id, value], index) => {
        const fileMetadata = metadata.get(index);
        fileMetadata.id = id;
        fileMetadata.mode = value.mode;
        fileMetadata.variant = value.variant;
        if (value.properties) {
          const props = fileMetadata._initProperties(
            Object.keys(value.properties).length
          );
          Object.entries(value.properties).forEach(([key, val], propIndex) => {
            const propData = props.get(propIndex);
            propData.key = key;
            propData.value = val;
          });
        }
      });

      await writeFileBuffer(
        joinPaths(this.#context.cachePath, "fs.bin"),
        message.toArrayBuffer()
      );
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
