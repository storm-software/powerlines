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

import type { ResolveOptions as BaseResolveOptions } from "@stryke/fs/resolve";
import { MaybePromise } from "@stryke/types/base";
import { AssetGlob } from "@stryke/types/file";

export type VirtualFileExtension = "js" | "ts" | "jsx" | "tsx";

// eslint-disable-next-line ts/naming-convention
export const __VFS_PATCH__ = "__VFS_PATCH__";

// eslint-disable-next-line ts/naming-convention
export const __VFS_REVERT__ = "__VFS_REVERT__";

export type StoragePreset = "fs" | "virtual";

/**
 * Interface defining the methods and properties for a storage adapter.
 */
export interface StorageAdapter {
  /**
   * A name identifying the storage adapter type.
   */
  name: string;

  /**
   * Checks if a key exists in the storage.
   *
   * @param key - The key to check for existence.
   * @returns A promise that resolves to `true` if the key exists, otherwise `false`.
   */
  exists: (key: string) => Promise<boolean>;

  /**
   * Synchronously checks if a key exists in the storage.
   *
   * @param key - The key to check for existence.
   * @returns Returns `true` if the key exists, otherwise `false`.
   */
  existsSync: (key: string) => boolean;

  /**
   * Read a value associated with a key from the storage.
   *
   * @param key - The key to read the value for.
   * @returns A promise that resolves to the value if found, otherwise `null`.
   */
  get: (key: string) => Promise<string | null>;

  /**
   * Synchronously reads the value associated with a key from the storage.
   *
   * @param key - The key to read the value for.
   * @returns The value if found, otherwise `null`.
   */
  getSync: (key: string) => string | null;

  /**
   * Writes a value to the storage for the given key.
   *
   * @param key - The key to associate the value with.
   * @param value - The value to store.
   */
  set: (key: string, value: string) => Promise<void>;

  /**
   * Synchronously writes a value to the storage for the given key.
   *
   * @param key - The key to associate the value with.
   * @param value - The value to store.
   */
  setSync: (key: string, value: string) => void;

  /**
   * Removes a value from the storage.
   *
   * @param key - The key whose value should be removed.
   */
  remove: (key: string) => Promise<void>;

  /**
   * Synchronously removes a value from the storage.
   *
   * @param key - The key whose value should be removed.
   */
  removeSync: (key: string) => void;

  /**
   * Creates a directory at the specified path.
   *
   * @param dirPath - The path of the directory to create.
   */
  mkdir: (dirPath: string) => Promise<void>;

  /**
   * Synchronously creates a directory at the specified path.
   *
   * @param dirPath - The path of the directory to create.
   */
  mkdirSync: (dirPath: string) => void;

  /**
   * Remove all entries from the storage that match the provided base path.
   *
   * @param base - The base path or prefix to clear entries from.
   */
  clear: (base?: string) => Promise<void>;

  /**
   * Synchronously remove all entries from the storage that match the provided base path.
   *
   * @param base - The base path or prefix to clear entries from.
   */
  clearSync: (base?: string) => void;

  /**
   * Lists all keys under the provided base path.
   *
   * @param base - The base path or prefix to list keys from.
   * @returns A promise resolving to the list of keys.
   */
  list: (base?: string) => Promise<string[]>;

  /**
   * Synchronously lists all keys under the provided base path.
   *
   * @param base - The base path or prefix to list keys from.
   * @returns The list of keys.
   */
  listSync: (base?: string) => string[];

  /**
   * Checks if the given key is a directory.
   *
   * @param key - The key to check.
   * @returns A promise that resolves to `true` if the key is a directory, otherwise `false`.
   */
  isDirectory: (key: string) => Promise<boolean>;

  /**
   * Synchronously checks if the given key is a directory.
   *
   * @param key - The key to check.
   * @returns `true` if the key is a directory, otherwise `false`.
   */
  isDirectorySync: (key: string) => boolean;

  /**
   * Checks if the given key is a file.
   *
   * @param key - The key to check.
   * @returns A promise that resolves to `true` if the key is a file, otherwise `false`.
   */
  isFile: (key: string) => Promise<boolean>;

  /**
   * Synchronously checks if the given key is a file.
   *
   * @param key - The key to check.
   * @returns `true` if the key is a file, otherwise `false`.
   */
  isFileSync: (key: string) => boolean;

  /**
   * Releases any resources held by the storage adapter.
   */
  dispose: () => MaybePromise<void>;
}

/**
 * A mapping of file paths to storage adapter names and their corresponding {@link StorageAdapter} instances.
 */
export type StoragePort = Record<string, StorageAdapter>;

export interface VirtualFileMetadata {
  /**
   * The identifier for the file data.
   */
  id: string;

  /**
   * The timestamp of the virtual file.
   */
  timestamp: number;

  /**
   * The type of the file.
   *
   * @remarks
   * This string represents the purpose/function of the file in the virtual file system. A potential list of variants includes:
   * - `builtin`: Indicates that the file is a built-in module provided by the system.
   * - `entry`: Indicates that the file is an entry point for execution.
   * - `normal`: Indicates that the file is a standard file without any special role.
   */
  type: string;

  /**
   * Additional metadata associated with the file.
   */
  properties: Record<string, string | undefined>;
}

export interface VirtualFileData {
  /**
   * The identifier for the file data.
   */
  id?: string;

  /**
   * The contents of the virtual file.
   */
  code: string;

  /**
   * The type of the file.
   *
   * @remarks
   * This string represents the purpose/function of the file in the virtual file system. A potential list of variants includes:
   * - `builtin`: Indicates that the file is a built-in module provided by the system.
   * - `entry`: Indicates that the file is an entry point for execution.
   * - `normal`: Indicates that the file is a standard file without any special role.
   */
  type?: string;

  /**
   * Additional metadata associated with the file.
   */
  properties?: Record<string, string | undefined>;
}

export interface VirtualFile
  extends Required<VirtualFileData>, VirtualFileMetadata {
  /**
   * An additional name for the file.
   */
  path: string;

  /**
   * The timestamp of the virtual file.
   */
  timestamp: number;
}

export interface WriteOptions {
  /**
   * Should the file skip formatting before being written?
   *
   * @defaultValue false
   */
  skipFormat?: boolean;

  /**
   * Additional metadata for the file.
   */
  meta?: Partial<VirtualFileMetadata>;
}

export type WriteData = string | NodeJS.ArrayBufferView | VirtualFileData;

export interface ResolveOptions extends BaseResolveOptions {
  /**
   * If true, the module is being resolved as an entry point.
   */
  isEntry?: boolean;

  /**
   * If true, the resolver will skip alias resolution when resolving modules.
   */
  skipAlias?: boolean;

  /**
   * If true, the resolver will skip using the cache when resolving modules.
   */
  skipCache?: boolean;

  /**
   * An array of external modules or patterns to exclude from resolution.
   */
  external?: (string | RegExp)[];

  /**
   * An array of modules or patterns to include in the resolution, even if they are marked as external.
   */
  noExternal?: (string | RegExp)[];

  /**
   * An array of patterns to match when resolving modules.
   */
  skipNodeModulesBundle?: boolean;
}

export interface VirtualFileSystemInterface {
  /**
   * The underlying file metadata.
   */
  metadata: Readonly<Record<string, VirtualFileMetadata>>;

  /**
   * A map of file paths to their module ids.
   */
  ids: Readonly<Record<string, string>>;

  /**
   * A map of module ids to their file paths.
   */
  paths: Readonly<Record<string, string>>;

  /**
   * Checks if a file exists in the virtual file system (VFS).
   *
   * @param path - The path or id of the file.
   * @returns `true` if the file exists, otherwise `false`.
   */
  exists: (path: string) => Promise<boolean>;

  /**
   * Synchronously Checks if a file exists in the virtual file system (VFS).
   *
   * @param path - The path or id of the file.
   * @returns `true` if the file exists, otherwise `false`.
   */
  existsSync: (path: string) => boolean;

  /**
   * Checks if a file is virtual in the virtual file system (VFS).
   *
   * @param path - The path or id of the file.
   * @returns `true` if the file is virtual, otherwise `false`.
   */
  isVirtual: (path: string) => boolean;

  /**
   * Checks if the given key is a directory.
   *
   * @param key - The key to check.
   * @returns A promise that resolves to `true` if the key is a directory, otherwise `false`.
   */
  isDirectory: (key: string) => Promise<boolean>;

  /**
   * Synchronously checks if the given key is a directory.
   *
   * @param key - The key to check.
   * @returns `true` if the key is a directory, otherwise `false`.
   */
  isDirectorySync: (key: string) => boolean;

  /**
   * Checks if the given key is a file.
   *
   * @param key - The key to check.
   * @returns A promise that resolves to `true` if the key is a file, otherwise `false`.
   */
  isFile: (key: string) => Promise<boolean>;

  /**
   * Synchronously checks if the given key is a file.
   *
   * @param key - The key to check.
   * @returns `true` if the key is a file, otherwise `false`.
   */
  isFileSync: (key: string) => boolean;

  /**
   * Gets the metadata of a file in the virtual file system (VFS).
   *
   * @param path - The path or id of the file.
   * @returns The metadata of the file if it exists, otherwise undefined.
   */
  getMetadata: (path: string) => VirtualFileMetadata | undefined;

  /**
   * Lists files in a given path.
   *
   * @param path - The path to list files from.
   * @returns An array of file names in the specified path.
   */
  listSync: (path: string) => string[];

  /**
   * Lists files in a given path.
   *
   * @param path - The path to list files from.
   * @returns An array of file names in the specified path.
   */
  list: (path: string) => Promise<string[]>;

  /**
   * Removes a file or symbolic link in the virtual file system (VFS).
   *
   * @param path - The path to the file to remove.
   * @returns A promise that resolves when the file is removed.
   */
  removeSync: (path: string) => void;

  /**
   * Asynchronously removes a file or symbolic link in the virtual file system (VFS).
   *
   * @param path - The path to the file to remove.
   * @returns A promise that resolves when the file is removed.
   */
  remove: (path: string) => Promise<void>;

  /**
   * Reads a file from the virtual file system (VFS).
   *
   * @param path - The path or id of the file.
   * @returns The contents of the file if it exists, otherwise undefined.
   */
  read: (path: string) => Promise<string | undefined>;

  /**
   * Reads a file from the virtual file system (VFS).
   *
   * @param path - The path or id of the file.
   */
  readSync: (path: string) => string | undefined;

  /**
   * Writes a file to the virtual file system (VFS).
   *
   * @param path - The path to the file.
   * @param data - The contents of the file.
   * @param options - Options for writing the file.
   * @returns A promise that resolves when the file is written.
   */
  write: (path: string, data: string, options?: WriteOptions) => Promise<void>;

  /**
   * Writes a file to the virtual file system (VFS).
   *
   * @param path - The path to the file.
   * @param data - The contents of the file.
   * @param options - Options for writing the file.
   */
  writeSync: (path: string, data: string, options?: WriteOptions) => void;

  /**
   * Creates a directory at the specified path.
   *
   * @param dirPath - The path of the directory to create.
   */
  mkdir: (dirPath: string) => Promise<void>;

  /**
   * Synchronously creates a directory at the specified path.
   *
   * @param dirPath - The path of the directory to create.
   */
  mkdirSync: (dirPath: string) => void;

  /**
   * Moves a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to move
   * @param destPath - The destination path to move to
   */
  move: (srcPath: string, destPath: string) => Promise<void>;

  /**
   * Synchronously moves a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to move
   * @param destPath - The destination path to move to
   */
  moveSync: (srcPath: string, destPath: string) => void;

  /**
   * Copies a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to copy
   * @param destPath - The destination path to copy to
   */
  copy: (
    srcPath: string | URL | Omit<AssetGlob, "output">,
    destPath: string | URL
  ) => Promise<void>;

  /**
   * Synchronously copies a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to copy
   * @param destPath - The destination path to copy to
   */
  copySync: (
    srcPath: string | URL | Omit<AssetGlob, "output">,
    destPath: string | URL
  ) => void;

  /**
   * Glob files in the virtual file system (VFS) based on the provided pattern(s).
   *
   * @param pattern - A pattern (or multiple patterns) to use to determine the file paths to return
   * @returns An array of file paths matching the provided pattern(s)
   */
  glob: (
    patterns:
      | string
      | Omit<AssetGlob, "output">
      | (string | Omit<AssetGlob, "output">)[]
  ) => Promise<string[]>;

  /**
   * Synchronously glob files in the virtual file system (VFS) based on the provided pattern(s).
   *
   * @param pattern - A pattern (or multiple patterns) to use to determine the file paths to return
   * @returns An array of file paths matching the provided pattern(s)
   */
  globSync: (
    patterns:
      | string
      | Omit<AssetGlob, "output">
      | (string | Omit<AssetGlob, "output">)[]
  ) => string[];

  /**
   * A helper function to resolve modules using the Jiti resolver
   *
   * @remarks
   * This function can be used to resolve modules relative to the project root directory.
   *
   * @example
   * ```ts
   * const resolvedPath = await context.resolve("some-module", "/path/to/importer");
   * ```
   *
   * @param id - The module to resolve.
   * @param importer - An optional path to the importer module.
   * @param options - Additional resolution options.
   * @returns A promise that resolves to the resolved module path.
   */
  resolve: (
    id: string,
    importer?: string,
    options?: ResolveOptions
  ) => Promise<string | undefined>;

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
  resolveSync: (
    id: string,
    importer?: string,
    options?: ResolveOptions
  ) => string | undefined;

  /**
   * Resolves a given module ID using the configured aliases.
   *
   * @remarks
   * This function can be used to map module IDs to different paths based on the alias configuration.
   *
   * @param id - The module ID to resolve.
   * @returns The resolved module ID - after applying any configured aliases (this will be the same as the input ID if no aliases match).
   */
  resolveAlias: (id: string) => string;

  /**
   * Disposes of the virtual file system (VFS), writes any virtual file changes to disk, and releases any associated resources.
   */
  dispose: () => Promise<void>;
}
