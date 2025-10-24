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

/* eslint-disable ts/no-unsafe-call */

import { LogLevelLabel } from "@storm-software/config-tools/types";
import { bufferToString } from "@stryke/convert/buffer-to-string";
import { toArray } from "@stryke/convert/to-array";
import { murmurhash } from "@stryke/hash/murmurhash";
import {
  findFileExtensionSafe,
  findFilePath
} from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { isAbsolutePath } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join-paths";
import { prettyBytes } from "@stryke/string-format/pretty-bytes";
import { isBuffer } from "@stryke/type-checks/is-buffer";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import defu from "defu";
import { Volume } from "memfs";
import { Blob, Buffer } from "node:buffer";
import fs, {
  ObjectEncodingOptions,
  PathLike,
  PathOrFileDescriptor,
  Stats,
  StatSyncOptions
} from "node:fs";
import { format, resolveConfig } from "prettier";
import { IFS, IUnionFs, Union } from "unionfs";
import { extendLog } from "../../lib/logger";
import { LogFn } from "../../types/config";
import { Context, SerializedVirtualFileSystem } from "../../types/context";
import {
  __VFS_CACHE__,
  __VFS_INIT__,
  __VFS_RESOLVER__,
  __VFS_REVERT__,
  __VFS_UNIFIED__,
  __VFS_VIRTUAL__,
  MakeDirectoryOptions,
  NodeWriteFileOptions,
  OutputModeType,
  PowerLinesWriteFileData,
  PowerlinesWriteFileOptions,
  ResolveFSOptions,
  ResolvePathOptions,
  VirtualFileSystemInterface,
  VirtualFileSystemMetadata,
  WriteFileData,
  WriteFileOptions
} from "../../types/vfs";

function isBufferEncoding(
  options: WriteFileOptions
): options is BufferEncoding | null {
  return isSetString(options) || options === null;
}

function isPowerlinesWriteFileOptions(
  options: WriteFileOptions
): options is PowerlinesWriteFileOptions {
  return (
    !isBufferEncoding(options) &&
    isSetObject(options) &&
    ("skipFormat" in options ||
      ("mode" in options &&
        (options.mode === "fs" || options.mode === "virtual")))
  );
}

function isNodeWriteFileOptions(
  options: WriteFileOptions
): options is NodeWriteFileOptions {
  return (
    !isUndefined(options) &&
    (isBufferEncoding(options) || !isPowerlinesWriteFileOptions(options))
  );
}

function isPowerLinesWriteFileData(
  data: WriteFileData
): data is PowerLinesWriteFileData {
  return !!(isSetObject(data) && "code" in data && data.code);
}

const FILE_PREFIX = "file://";

function toFilePath(pathOrUrl: PathOrFileDescriptor): string {
  if (!pathOrUrl) {
    throw new Error("No Path or URL provided to Virtual File System");
  }
  let result = pathOrUrl.toString();
  if (result.startsWith(FILE_PREFIX)) {
    result = result.slice(FILE_PREFIX.length);
  }
  return result;
}

const FS_METHODS = [
  "mkdir",
  "mkdirSync",
  "rmdir",
  "rmdirSync",
  "unlink",
  "unlinkSync",
  "existsSync",
  "realpathSync",
  "writeFileSync",
  "readFileSync",
  "readdirSync",
  "createWriteStream",
  "WriteStream",
  "createReadStream",
  "ReadStream"
];

const FS_PROMISE_METHODS = [
  "mkdir",
  "rm",
  "rmdir",
  "unlink",
  "writeFile",
  "readFile",
  "readdir",
  "stat",
  "lstat"
];

function cloneFS(originalFS: typeof fs) {
  const clonedFS: typeof fs = {
    ...originalFS,
    promises: {
      ...(originalFS.promises ?? {})
    }
  };

  for (const method of FS_METHODS) {
    if ((originalFS as any)[method]) {
      (clonedFS as any)[method] = (originalFS as any)[method];
    }
  }

  originalFS.promises ??= {} as (typeof fs)["promises"];
  for (const method of FS_PROMISE_METHODS) {
    if ((originalFS.promises as any)[method]) {
      clonedFS.promises ??= {} as (typeof fs)["promises"];
      (clonedFS.promises as any)[method] = (originalFS.promises as any)[method];
      (clonedFS as any)[method] = (originalFS.promises as any)[method];
    }
  }

  for (const prop in clonedFS) {
    if (isFunction((clonedFS as any)[prop])) {
      (clonedFS as any)[prop] = (clonedFS as any)[prop].bind(originalFS);
      if (isFunction((clonedFS.promises as any)[prop])) {
        (clonedFS.promises as any)[prop] = (clonedFS.promises as any)[
          prop
        ].bind(originalFS);
      }
    }
  }

  for (const prop in clonedFS.promises) {
    if (isFunction((clonedFS.promises as any)[prop])) {
      (clonedFS.promises as any)[prop] = (clonedFS.promises as any)[prop].bind(
        originalFS
      );
    }
  }

  return clonedFS;
}

/**
 * Patches the original file system module to use the virtual file system (VFS) methods.
 *
 * @param originalFS - The original file system module to patch.
 * @param vfs - The virtual file system interface to use for file operations.
 * @returns A function to restore the original file system methods.
 */
function patchFS(
  originalFS: typeof fs,
  vfs: VirtualFileSystemInterface
): () => void {
  const clonedFS = cloneFS(originalFS);

  (originalFS as any).mkdirSync = (file: PathOrFileDescriptor, options?: any) =>
    (vfs.mkdirSync as any)(toFilePath(file), options);
  (originalFS as any).mkdir = (
    file: PathOrFileDescriptor,
    options?: any,
    callback?: any
  ) => (vfs.mkdir as any)(toFilePath(file), options, callback);
  (originalFS.promises as any).mkdir = async (
    file: PathOrFileDescriptor,
    options?: any
  ) => (vfs.mkdir as any)(toFilePath(file), options);

  // originalFS.rmdirSync = vfs.rmdirSync.bind(vfs);
  originalFS.unlinkSync = (file: PathOrFileDescriptor) =>
    (vfs.unlinkSync as any)(toFilePath(file));
  // originalFS.rmdir = vfs.rmdir.bind(vfs);
  // originalFS.promises.rmdir = vfs.rmdir.bind(vfs);
  // Wrap promise methods to accept PathLike and forward string to VFS implementation
  originalFS.promises.rm = (async (file: PathOrFileDescriptor, options?: any) =>
    vfs.rm(toFilePath(file), options)) as unknown as (
    file: PathOrFileDescriptor,
    options?: any
  ) => Promise<void>;
  originalFS.promises.unlink = (async (file: PathOrFileDescriptor) =>
    vfs.unlink(toFilePath(file))) as unknown as (
    file: PathOrFileDescriptor
  ) => Promise<void>;

  originalFS.existsSync = (file: PathOrFileDescriptor) =>
    vfs.existsSync(toFilePath(file));
  Object.defineProperty(originalFS, "realpathSync", {
    value: (file: PathOrFileDescriptor, options?: fs.EncodingOption) =>
      (vfs.realpathSync as any)(toFilePath(file), options)
  });

  originalFS.writeFileSync = (
    file: PathOrFileDescriptor,
    data: any,
    options?: any
  ) => (vfs.writeFileSync as any)(toFilePath(file), data, options);
  originalFS.promises.writeFile = (async (
    file: PathOrFileDescriptor,
    data: any,
    options?: any
  ) =>
    (vfs.writeFile as any)(
      toFilePath(file as any),
      data,
      options
    )) as unknown as typeof originalFS.promises.writeFile;
  originalFS.readFileSync = (file: PathOrFileDescriptor, options?: any) =>
    (vfs.readFileSync as any)(toFilePath(file), options);
  originalFS.promises.readFile = ((file: PathOrFileDescriptor, options?: any) =>
    (vfs.readFile as any)(
      toFilePath(file),
      options
    )) as unknown as typeof originalFS.promises.readFile;

  originalFS.readdirSync = (file: PathOrFileDescriptor, options?: any) =>
    (vfs.readdirSync as any)(toFilePath(file), options);
  originalFS.promises.readdir = (file: PathOrFileDescriptor, options?: any) =>
    (vfs.readdir as any)(toFilePath(file), options);

  Object.defineProperty(originalFS, "statSync", {
    value: (file: PathOrFileDescriptor, options?: any) =>
      (vfs.statSync as any)(toFilePath(file), options)
  });
  (originalFS as any).stat = (file: PathOrFileDescriptor, options?: any) =>
    (vfs.statSync as any)(toFilePath(file), options);
  originalFS.promises.stat = (file: PathOrFileDescriptor, options?: any) =>
    (vfs.stat as any)(toFilePath(file), options);

  Object.defineProperty(originalFS, "lstatSync", {
    value: (file: PathOrFileDescriptor, options?: any) =>
      (vfs.lstatSync as any)(toFilePath(file), options)
  });
  (originalFS as any).lstat = (file: PathOrFileDescriptor, options?: any) =>
    (vfs.lstatSync as any)(toFilePath(file), options);
  originalFS.promises.lstat = (file: PathOrFileDescriptor, options?: any) =>
    (vfs.lstat as any)(toFilePath(file), options);

  return () => {
    originalFS.mkdirSync = clonedFS.mkdirSync;
    originalFS.mkdir = clonedFS.mkdir;
    originalFS.promises.mkdir = clonedFS.promises.mkdir;

    // originalFS.rmdirSync = clonedFS.rmdirSync;
    originalFS.unlinkSync = clonedFS.unlinkSync;
    // originalFS.rmdir = clonedFS.rmdir;
    // originalFS.promises.rmdir = clonedFS.promises.rmdir;
    originalFS.promises.rm = clonedFS.promises.rm;
    originalFS.promises.unlink = clonedFS.promises.unlink;

    originalFS.existsSync = clonedFS.existsSync;
    originalFS.realpathSync = clonedFS.realpathSync;

    originalFS.writeFileSync = clonedFS.writeFileSync;
    originalFS.promises.writeFile = clonedFS.promises.writeFile;
    originalFS.readFileSync = clonedFS.readFileSync;
    originalFS.promises.readFile = clonedFS.promises.readFile;

    originalFS.readdirSync = clonedFS.readdirSync;
    originalFS.promises.readdir = clonedFS.promises.readdir;

    Object.defineProperty(originalFS, "statSync", {
      value: clonedFS.statSync
    });
    (originalFS as any).stat = clonedFS.stat;
    originalFS.promises.stat = clonedFS.promises.stat;

    Object.defineProperty(originalFS, "lstatSync", {
      value: clonedFS.lstatSync
    });
    (originalFS as any).lstat = clonedFS.lstat;
    originalFS.promises.lstat = clonedFS.promises.lstat;
  };
}

/**
 * Represents a virtual file system (VFS) that stores files and their associated metadata in virtual memory.
 *
 * @remarks
 * This class provides methods to manage virtual files, check their existence, retrieve their content, and manipulate the virtual file system. It allows for efficient file management and retrieval without relying on the actual file system.
 */
export class VirtualFileSystem implements VirtualFileSystemInterface {
  /**
   * The internal map of virtual files.
   */
  #meta: Record<string, Partial<VirtualFileSystemMetadata>> = {};

  /**
   * A map of unique identifiers to their virtual file paths.
   */
  #ids: Record<string, string> = {};

  /**
   * A map of virtual file paths to their underlying file content.
   */
  #cachedFS: Map<string, string> = new Map<string, string>();

  /**
   * A map of virtual file paths to their underlying file content.
   */
  #cachedResolver: Map<string, string | false> = new Map<
    string,
    string | false
  >();

  /**
   * The internal map of virtual files.
   */
  #virtualFS: Volume = new Volume();

  /**
   * The physical file system.
   */
  #fs: typeof fs = cloneFS(fs);

  /**
   * The unified volume that combines the virtual file system with the real file system.
   *
   * @remarks
   * This volume allows for seamless access to both virtual and real files.
   */
  #unifiedFS = new Union();

  /**
   * Indicator specifying if the file system module is patched
   */
  #isPatched = false;

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
      this.#virtualFS.existsSync(formattedPath) ||
      this.#fs.existsSync(formattedPath) ||
      this.resolveFS(path).existsSync(formattedPath)
    );
  }

  /**
   * Exposes the internal VFS map for advanced usage.
   */
  public get [__VFS_CACHE__](): Map<string, string> {
    return this.#cachedFS;
  }

  /**
   * Exposes the internal VFS resolver cache for advanced usage.
   */
  public get [__VFS_RESOLVER__](): Map<string, string | false> {
    return this.#cachedResolver;
  }

  /**
   * Exposes the internal VFS map for advanced usage.
   */
  public get [__VFS_VIRTUAL__](): Volume {
    return this.#virtualFS;
  }

  /**
   * Exposes the internal UFS map for advanced usage.
   */
  public get [__VFS_UNIFIED__](): IUnionFs {
    return this.#unifiedFS;
  }

  /**
   * A proxy to access the underlying file metadata.
   */
  public get meta(): Record<string, VirtualFileSystemMetadata | undefined> {
    return new Proxy(this.#meta, {
      get: (
        target: Record<string, Partial<VirtualFileSystemMetadata>>,
        prop: string
      ): VirtualFileSystemMetadata | undefined => {
        if (target[prop]) {
          return {
            id: prop,
            mode: this.#virtualFS.existsSync(prop)
              ? "virtual"
              : this.#fs.existsSync(prop)
                ? "fs"
                : this.#context.config.output.mode,
            details: {},
            variant: "normal",
            ...target[prop]
          };
        }

        return undefined;
      },
      set: (
        target: Record<string, Partial<VirtualFileSystemMetadata>>,
        prop: string,
        value: VirtualFileSystemMetadata
      ) => {
        target[prop] = value;
        this.#ids[value.id || prop] = prop;

        return true;
      },
      deleteProperty: (
        target: Record<string, Partial<VirtualFileSystemMetadata>>,
        prop: string
      ) => {
        delete this.#ids[target[prop]?.id || prop];
        delete target[prop];

        return true;
      }
    }) as Record<string, VirtualFileSystemMetadata | undefined>;
  }

  /**
   * A map of module ids to their file paths.
   */
  public get ids(): Record<string, string> {
    return this.#ids;
  }

  /**
   * Creates a new instance of the VirtualFileSystem.
   *
   * @param context - The context of the virtual file system, typically containing options and logging functions.
   * @param serialized - A map of files/file contents to populate in cache
   */
  constructor(
    context: Context,
    serialized: Partial<SerializedVirtualFileSystem> = {}
  ) {
    this.#context = context;
    this.#cachedFS = new Map();

    this.#meta = Object.fromEntries(
      Object.entries(serialized.virtualFilesMeta ?? {})
    );
    this.#ids = Object.fromEntries(
      Object.entries(this.#meta).map(([path, data]) => [data.id || path, path])
    );

    if (!this.#fs.existsSync(this.#context.dataPath)) {
      this.#fs.mkdirSync(this.#context.dataPath, {
        recursive: true
      });
    }

    if (!this.#fs.existsSync(this.#context.cachePath)) {
      this.#fs.mkdirSync(this.#context.cachePath, {
        recursive: true
      });
    }

    if (
      !this.#fs.existsSync(
        joinPaths(
          this.#context.workspaceConfig.workspaceRoot,
          this.#context.config.output.outputPath
        )
      )
    ) {
      this.#fs.mkdirSync(
        joinPaths(
          this.#context.workspaceConfig.workspaceRoot,
          this.#context.config.output.outputPath
        ),
        {
          recursive: true
        }
      );
    }

    this.#unifiedFS = this.#unifiedFS.use(this.#fs);

    if (this.#context.config.output.mode !== "fs") {
      if (
        serialized?.virtualFiles &&
        Object.keys(serialized.virtualFiles).length > 0
      ) {
        this.#virtualFS = Volume.fromJSON(serialized.virtualFiles);
      }

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

      this.#unifiedFS = this.#unifiedFS.use(this.#virtualFS as any);
    } else if (this.#context.config.projectType === "application") {
      if (!this.#fs.existsSync(this.#context.artifactsPath)) {
        this.#fs.mkdirSync(this.#context.artifactsPath, {
          recursive: true
        });
      }

      if (!this.#fs.existsSync(this.#context.builtinsPath)) {
        this.#fs.mkdirSync(this.#context.builtinsPath, {
          recursive: true
        });
      }

      if (!this.#fs.existsSync(this.#context.entryPath)) {
        this.#fs.mkdirSync(this.#context.entryPath, {
          recursive: true
        });
      }

      if (!this.#fs.existsSync(this.#context.dtsPath)) {
        this.#fs.mkdirSync(this.#context.dtsPath, {
          recursive: true
        });
      }
    }

    this.#log = extendLog(this.#context.log, "virtual-file-system");
  }

  public [__VFS_INIT__]() {
    if (!this.#isPatched && this.#context.config.output.mode !== "fs") {
      this.#revert = patchFS(fs, this);
      this.#isPatched = true;
    }
  }

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

    return this.meta[resolvedPath]?.mode === "virtual";
  }

  /**
   * Check if a path or id corresponds to a file written to the file system **(actually exists on disk)**.
   *
   * @param pathOrId - The path or id to check.
   * @param options - Optional parameters for resolving the path.
   * @returns Whether the path or id corresponds to a file written to the file system **(actually exists on disk)**.
   */
  public isFs(pathOrId: string, options: ResolvePathOptions = {}): boolean {
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

    return this.meta[resolvedPath]?.mode === "fs";
  }

  /**
   * Check if a path exists within one of the directories specified in the tsconfig.json's `path` field.
   *
   * @see https://www.typescriptlang.org/tsconfig#paths
   *
   * @param pathOrId - The path or ID to check.
   * @returns Whether the path or ID corresponds to a virtual file.
   */
  public isTsconfigPath(pathOrId: string): boolean {
    return (
      !!this.#context.tsconfig.options.paths &&
      Object.keys(this.#context.tsconfig.options.paths).some(path =>
        pathOrId.startsWith(path.replaceAll("*", ""))
      )
    );
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
    return this.resolveFS(path).readdirSync(toFilePath(path), options);
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

    this.resolveFS(path, options).unlinkSync(formattedPath);

    this.#cachedFS.delete(formattedPath);
    this.clearResolverCache(formattedPath);
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

    if (isFunction(this.resolveFS(path, options).promises.unlink)) {
      await this.resolveFS(path, options).promises.unlink(formattedPath);

      this.#cachedFS.delete(formattedPath);
      this.clearResolverCache(formattedPath);
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

    this.resolveFS(path, options).rmdirSync(
      formattedPath,
      defu(options, {
        recursive: true
      })
    );

    this.#cachedFS.delete(formattedPath);
    this.clearResolverCache(formattedPath);
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

    if (isFunction(this.resolveFS(path, options).promises.rm)) {
      await this.resolveFS(path, options).promises.rm(
        formattedPath,
        defu(options, {
          force: true,
          recursive: true
        })
      );

      this.#cachedFS.delete(formattedPath);
      this.clearResolverCache(formattedPath);
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

    this.clearResolverCache(filePath);
    return this.resolveFS(filePath, options).mkdirSync(
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

    if (isFunction(this.resolveFS(filePath, options).promises.mkdir)) {
      result = await this.resolveFS(filePath, options).promises.mkdir(
        filePath,
        defu(options ?? {}, {
          recursive: true
        })
      );
    } else {
      result = this.resolveFS(filePath, options).mkdirSync(
        filePath,
        defu(options ?? {}, {
          recursive: true
        })
      );
    }

    this.clearResolverCache(filePath);
    return result;
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
    return this.resolveFS(pathOrId).promises.readdir(
      toFilePath(pathOrId),
      options
    );
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
      if (this.#cachedFS.has(filePath)) {
        return this.#cachedFS.get(filePath);
      }

      let result: string | Buffer;
      if (isFunction(this.resolveFS(filePath).promises.readFile)) {
        result = (
          await this.resolveFS(filePath).promises.readFile(filePath, options)
        )?.toString("utf8");
      } else {
        result = this.resolveFS(filePath).readFileSync(filePath, options);
      }

      const content = isBuffer(result) ? bufferToString(result) : result;
      this.#cachedFS.set(filePath, content);

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
      if (this.#cachedFS.has(filePath)) {
        return this.#cachedFS.get(filePath);
      }

      const result = this.resolveFS(filePath).readFileSync(filePath, options);

      const content = isBuffer(result) ? bufferToString(result) : result;
      this.#cachedFS.set(filePath, content);

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

    const outputMode = this.resolveOutputMode(
      formattedPath,
      isPowerlinesWriteFileOptions(options) ? options : undefined
    );

    this.#log(
      LogLevelLabel.TRACE,
      `Writing ${formattedPath} file to the ${
        outputMode === "fs" ? "" : "virtual "
      }file system (size: ${prettyBytes(new Blob(toArray(code)).size)})`
    );

    this.meta[formattedPath] = {
      path: formattedPath,
      code,
      mode: outputMode,
      variant: "normal",
      ...(isPowerLinesWriteFileData(data) ? data : {})
    } as VirtualFileSystemMetadata;
    this.clearResolverCache(formattedPath);

    const ifs: IFS = this.resolveFS(
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
    const outputMode = this.resolveOutputMode(
      formattedPath,
      isPowerlinesWriteFileOptions(options) ? options : undefined
    );

    this.#log(
      LogLevelLabel.TRACE,
      `Writing ${formattedPath} file to the ${
        outputMode === "fs" ? "" : "virtual "
      }file system (size: ${prettyBytes(new Blob(toArray(code)).size)})`
    );

    this.meta[formattedPath] = {
      path: formattedPath,
      code,
      mode: outputMode,
      variant: "normal",
      ...(isPowerLinesWriteFileData(data) ? data : {})
    } as VirtualFileSystemMetadata;
    this.clearResolverCache(formattedPath);

    const writeStream = this.resolveFS(
      formattedPath,
      isPowerlinesWriteFileOptions(options) ? options : undefined
    ).createWriteStream(formattedPath);
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
      ((this.#virtualFS.existsSync(resolved) &&
        this.#virtualFS.lstatSync(resolved).isFile()) ||
        (this.#fs.existsSync(resolved) &&
          this.#fs.lstatSync(resolved).isFile()) ||
        (this.resolveFS(resolved).existsSync(resolved) &&
          this.resolveFS(resolved).lstatSync(resolved).isFile()))
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
      ((this.#virtualFS.existsSync(resolved) &&
        this.#virtualFS.lstatSync(resolved).isDirectory()) ||
        (this.#fs.existsSync(resolved) &&
          this.#fs.lstatSync(resolved).isDirectory()) ||
        (this.resolveFS(resolved).existsSync(resolved) &&
          this.resolveFS(resolved).lstatSync(resolved).isDirectory()))
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
    return this.resolveFS(pathOrId).promises.stat(
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
    return this.resolveFS(pathOrId).statSync(
      this.resolve(toFilePath(pathOrId)) || toFilePath(pathOrId)
    );
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
    return this.resolveFS(pathOrId).promises.lstat(
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
    return this.resolveFS(pathOrId).lstatSync(
      this.resolve(toFilePath(pathOrId)) || toFilePath(pathOrId),
      options
    );
  }

  /**
   * Resolves a path based on TypeScript's `tsconfig.json` paths.
   *
   * @see https://www.typescriptlang.org/tsconfig#paths
   *
   * @param path - The path to check.
   * @returns The resolved file path if it exists, otherwise undefined.
   */
  public resolveTsconfigPath(path: string): string | false {
    if (this.#context.tsconfig.options.paths) {
      for (const tsconfigPathKey of Object.keys(
        this.#context.tsconfig.options.paths
      ).filter(tsconfigPath =>
        path.startsWith(tsconfigPath.replaceAll("*", ""))
      )) {
        const resolvedPath = this.#context.tsconfig.options.paths[
          tsconfigPathKey
        ]?.find(
          tsconfigPath =>
            this.resolvePath(
              joinPaths(
                this.#context.workspaceConfig.workspaceRoot,
                tsconfigPath.replaceAll("*", ""),
                path.replace(tsconfigPathKey.replaceAll("*", ""), "")
              )
            ) || this.formatPath(tsconfigPath) === this.formatPath(path)
        );
        if (resolvedPath) {
          return this.formatPath(resolvedPath) === this.formatPath(path)
            ? this.formatPath(resolvedPath)
            : this.resolvePath(
                joinPaths(
                  this.#context.workspaceConfig.workspaceRoot,
                  resolvedPath.replaceAll("*", ""),
                  path.replace(tsconfigPathKey.replaceAll("*", ""), "")
                )
              );
        }
      }
    }

    return false;
  }

  /**
   * Resolves a path based on TypeScript's `tsconfig.json` paths.
   *
   * @see https://www.typescriptlang.org/tsconfig#paths
   *
   * @param path - The path to check.
   * @returns The resolved file path if it exists, otherwise undefined.
   */
  public resolveTsconfigPathPackage(path: string): string | false {
    if (this.#context.tsconfig.options.paths) {
      const tsconfigPathKeys = Object.keys(
        this.#context.tsconfig.options.paths
      ).filter(tsconfigPath =>
        path.startsWith(tsconfigPath.replaceAll("*", ""))
      );
      if (tsconfigPathKeys.length > 0 && tsconfigPathKeys[0]) {
        return tsconfigPathKeys[0].replace(/\/\*$/, "");
      }
    }

    return false;
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

    let result = this.resolveId(formattedPathOrId);
    if (!result) {
      result = this.resolvePath(formattedPathOrId, options);
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
   * Retrieves the partial metadata for all files in the virtual file system (VFS).
   *
   * @returns A record containing the partial metadata for all files.
   */
  public getPartialMeta(): Record<string, Partial<VirtualFileSystemMetadata>> {
    return Object.fromEntries(
      Object.entries(this.#meta).filter(([_, data]) => isSetObject(data))
    );
  }

  /**
   * Converts a relative path to an absolute path based on the workspace and project root.
   *
   * @param path - The relative path to convert.
   * @returns The absolute path.
   */
  private formatPath(path: PathOrFileDescriptor): string {
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
   * Formats a file id by removing the file extension and prepending the runtime prefix.
   *
   * @param id - The file ID to format.
   * @returns The formatted file ID.
   */
  private formatId(id: PathOrFileDescriptor): string {
    const formattedId = toFilePath(id);

    return `${this.#context.config.output.builtinPrefix}:${formattedId
      .replace(new RegExp(`^${this.#context.config.output.builtinPrefix}:`), "")
      .replace(/^\\0/, "")
      .replace(findFileExtensionSafe(formattedId), "")}`;
  }

  /**
   * Resolves an id parameter to a corresponding virtual file path in the virtual file system (VFS).
   *
   * @param id - The id to resolve.
   * @returns The resolved file id if it exists, otherwise undefined.
   */
  private resolveId(id: string): string | false {
    if (this.#ids[this.formatId(id)]) {
      return this.#ids[this.formatId(id)] || false;
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
  private resolvePath(
    path: string,
    options: ResolvePathOptions = {}
  ): string | false {
    if (isAbsolutePath(path)) {
      if (this.#existsSync(path)) {
        return path;
      }

      const result = this.checkVariants(path);
      if (result) {
        return result;
      }
    }

    for (const parentPath of this.resolveParentPaths(path, options.paths)) {
      const request = joinPaths(parentPath, path);
      if (this.#existsSync(request)) {
        return request;
      }

      const result = this.checkVariants(request);
      if (result) {
        return result;
      }
    }

    return false;
  }

  private resolveParentPaths(request: string, parents: string[] = []) {
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
   * Select the file system module to use for the operation based on the path or URL.
   *
   * @param pathOrUrl - The path to perform the file system operation on.
   * @param options - Options for the operation, such as output mode.
   * @returns The file system module used for the operation.
   */
  private resolveFS(
    pathOrUrl: fs.PathOrFileDescriptor,
    options: ResolveFSOptions = {}
  ): IFS {
    const mode = this.resolveOutputMode(pathOrUrl, options);
    if (mode === "virtual") {
      return this.#virtualFS as any;
    } else if (mode === "fs") {
      return this.#fs;
    }

    return this.#unifiedFS;
  }

  /**
   * Select the file system module to use for the operation based on the path or URL.
   *
   * @param pathOrUrl - The path to perform the file system operation on.
   * @param options - Options for the operation, such as output mode.
   * @returns The file system module used for the operation.
   */
  private resolveOutputMode(
    pathOrUrl: fs.PathOrFileDescriptor,
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
          this.#context.config.output.outputPath
        )
      )
    ) {
      return "fs";
    }

    return undefined;
  }

  /**
   * Clears the resolver cache for a given path.
   *
   * @param path - The path to clear the resolver cache for.
   */
  private clearResolverCache(path: fs.PathLike) {
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
  private checkVariants(request: string, parentPath?: string): string | false {
    const path = parentPath ? joinPaths(parentPath, request) : request;

    let file = this.checkExtensions(path);
    if (file) {
      return file;
    }

    file = this.checkIndex(path);
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
  private checkIndex(request: string): string | false {
    let file: string | false = joinPaths(request, "index");
    if (this.#existsSync(file)) {
      return file;
    }

    file = this.checkExtensions(file);
    if (file) {
      return file;
    }

    return false;
  }

  /**
   * Check if the file exists with different extensions.
   *
   * @param request - The request path to check.
   * @param vfs - The file system module to use for checking file existence.
   * @returns The file path if it exists with any of the checked extensions, otherwise false.
   */
  private checkExtensions(request: string): string | false {
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
}

/**
 * Creates a new virtual file system (VFS) using a Map to store {@link Vinyl} instances.
 *
 * @returns A virtual file-system containing a map where the keys are file paths and the values are {@link Vinyl} instances.
 */
export function createVfs(context: Context): VirtualFileSystem {
  const vfs = new VirtualFileSystem(context);

  return vfs;
}

/**
 * Creates a new virtual file system (VFS) using a Map to store {@link Vinyl} instances.
 *
 * @returns A virtual file-system containing a map where the keys are file paths and the values are {@link Vinyl} instances.
 */
export function restoreVfs(
  context: Context,
  serialized: SerializedVirtualFileSystem
): VirtualFileSystem {
  const vfs = new VirtualFileSystem(context, serialized);

  return vfs;
}
