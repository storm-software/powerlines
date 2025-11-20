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

import type {
  MakeDirectoryOptions as FsMakeDirectoryOptions,
  WriteFileOptions as FsWriteFileOptions,
  Mode,
  PathLike,
  PathOrFileDescriptor,
  RmDirOptions,
  RmOptions,
  Stats,
  StatSyncOptions
} from "node:fs";

export type VirtualFileExtension = "js" | "ts" | "jsx" | "tsx";

// eslint-disable-next-line ts/naming-convention
export const __VFS_PATCH__ = "__VFS_PATCH__";

// eslint-disable-next-line ts/naming-convention
export const __VFS_REVERT__ = "__VFS_REVERT__";

export type OutputModeType = "fs" | "virtual";

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
   * The output mode of the file.
   */
  mode: string;

  /**
   * Additional metadata associated with the file.
   */
  properties: Record<string, string>;
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
   * - `chunk`: Indicates that the file is a code chunk, typically used in code-splitting scenarios.
   * - `prebuilt-chunk`: Indicates that the file is a prebuilt code chunk.
   * - `asset`: Indicates that the file is a static asset, such as an image or stylesheet.
   * - `normal`: Indicates that the file is a standard file without any special role.
   */
  type?: string;

  /**
   * The output mode of the file.
   */
  mode?: string;

  /**
   * Additional metadata associated with the file.
   */
  properties?: Record<string, string>;
}

export interface VirtualFile
  extends Required<VirtualFileData>,
    VirtualFileMetadata {
  /**
   * An additional name for the file.
   */
  path: string;

  /**
   * The timestamp of the virtual file.
   */
  timestamp: number;
}

export interface ResolveFSOptions {
  mode?: OutputModeType;
}

export type MakeDirectoryOptions = (Mode | FsMakeDirectoryOptions) &
  ResolveFSOptions;

export interface PowerlinesWriteFileOptions extends ResolveFSOptions {
  /**
   * Should the file skip formatting before being written?
   *
   * @defaultValue false
   */
  skipFormat?: boolean;
}

export type NodeWriteFileOptions = FsWriteFileOptions;

export type WriteFileOptions =
  | NodeWriteFileOptions
  | PowerlinesWriteFileOptions;

export type WriteFileData = string | NodeJS.ArrayBufferView | VirtualFileData;

export interface ResolvePathOptions extends ResolveFSOptions {
  /**
   * Should the resolved path include the file extension?
   *
   * @defaultValue true
   */
  withExtension?: boolean;

  /**
   * The paths to search for the file.
   */
  paths?: string[];

  /**
   * The type of the path to resolve.
   */
  pathType?: "file" | "directory";
}

export interface VirtualFileSystemInterface {
  /**
   * Patches the File System to include the virtual file system (VFS) contents.
   */
  [__VFS_PATCH__]: () => void;

  /**
   * Reverts the virtual file system (VFS) to its previous state.
   */
  [__VFS_REVERT__]: () => void;

  /**
   * The underlying file metadata.
   */
  metadata: Record<string, VirtualFileMetadata | undefined>;

  /**
   * A map of module ids to their file paths.
   */
  ids: Record<string, string>;

  /**
   * Check if a path or id corresponds to a virtual file **(does not actually exists on disk)**.
   *
   * @param pathOrId - The path or id to check.
   * @param options - Optional parameters for resolving the path.
   * @returns Whether the path or id corresponds to a virtual file **(does not actually exists on disk)**.
   */
  isVirtual: (pathOrId: string, options?: ResolvePathOptions) => boolean;

  /**
   * Check if a path or id corresponds to a file written to the file system **(actually exists on disk)**.
   *
   * @param pathOrId - The path or id to check.
   * @param options - Optional parameters for resolving the path.
   * @returns Whether the path or id corresponds to a file written to the file system **(actually exists on disk)**.
   */
  isPhysical: (pathOrId: string, options?: ResolvePathOptions) => boolean;

  /**
   * Checks if a file exists in the virtual file system (VFS).
   *
   * @param path - The path of the file to check.
   * @returns `true` if the file exists, otherwise `false`.
   */
  isFile: (path: string) => boolean;

  /**
   * Checks if a directory exists in the virtual file system (VFS).
   *
   * @param path - The path of the directory to check.
   * @returns `true` if the directory exists, otherwise `false`.
   */
  isDirectory: (path: string) => boolean;

  /**
   * Checks if a file exists in the virtual file system (VFS).
   *
   * @param pathOrId - The path or id of the file.
   * @returns `true` if the file exists, otherwise `false`.
   */
  existsSync: (pathOrId: string) => boolean;

  /**
   * Gets the metadata of a file in the virtual file system (VFS).
   *
   * @param pathOrId - The path or id of the file.
   * @returns The metadata of the file if it exists, otherwise undefined.
   */
  getMetadata: (pathOrId: PathLike) => VirtualFileMetadata | undefined;

  /**
   * Gets the stats of a file in the virtual file system (VFS).
   *
   * @param pathOrId - The path or id of the file.
   * @param options - Optional parameters for getting the stats.
   * @returns The stats of the file if it exists, otherwise undefined.
   */
  lstat: (
    pathOrId: string,
    options?: StatSyncOptions & {
      bigint?: false | undefined;
      throwIfNoEntry: false;
    }
  ) => Promise<Stats>;

  /**
   * Gets the stats of a file in the virtual file system (VFS).
   *
   * @param pathOrId - The path or id of the file.
   * @param options - Optional parameters for getting the stats.
   * @returns The stats of the file if it exists, otherwise undefined.
   */
  lstatSync: (
    pathOrId: string,
    options?: StatSyncOptions & {
      bigint?: false | undefined;
      throwIfNoEntry: false;
    }
  ) => Stats | undefined;

  /**
   * Gets the stats of a file in the virtual file system (VFS).
   *
   * @param pathOrId - The path or id of the file.
   * @returns The stats of the file if it exists, otherwise false.
   */
  stat: (
    pathOrId: string,
    options?: StatSyncOptions & {
      bigint?: false | undefined;
      throwIfNoEntry: false;
    }
  ) => Promise<Stats>;

  /**
   * Gets the stats of a file in the virtual file system (VFS).
   *
   * @param pathOrId - The path or id of the file.
   * @returns The stats of the file if it exists, otherwise false.
   */
  statSync: (
    pathOrId: string,
    options?: StatSyncOptions & {
      bigint?: false | undefined;
      throwIfNoEntry: false;
    }
  ) => Stats | undefined;

  /**
   * Lists files in a given path.
   *
   * @param path - The path to list files from.
   * @param options - Options for listing files, such as encoding and recursion.
   * @returns An array of file names in the specified path.
   */
  readdirSync: (
    path: string,
    options?:
      | {
          encoding: BufferEncoding | null;
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        }
      | BufferEncoding
  ) => string[];

  /**
   * Lists files in a given path.
   *
   * @param path - The path to list files from.
   * @param options - Options for listing files, such as encoding and recursion.
   * @returns An array of file names in the specified path.
   */
  readdir: (
    path: string,
    options?:
      | {
          encoding: BufferEncoding | null;
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        }
      | BufferEncoding
  ) => Promise<string[]>;

  /**
   * Removes a file or symbolic link in the virtual file system (VFS).
   *
   * @param path - The path to the file to remove.
   * @returns A promise that resolves when the file is removed.
   */
  unlinkSync: (path: PathLike, options?: ResolveFSOptions) => void;

  /**
   * Asynchronously removes a file or symbolic link in the virtual file system (VFS).
   *
   * @param path - The path to the file to remove.
   * @returns A promise that resolves when the file is removed.
   */
  unlink: (path: string, options?: ResolveFSOptions) => Promise<void>;

  /**
   * Removes a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   */
  rmdirSync: (path: PathLike, options?: RmDirOptions & ResolveFSOptions) => any;

  /**
   * Removes a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   * @returns A promise that resolves to the path of the created directory, or undefined if the directory could not be created.
   */
  rmdir: (
    path: PathLike,
    options?: RmDirOptions & ResolveFSOptions
  ) => Promise<void>;

  /**
   * Removes a file or directory in the virtual file system (VFS).
   *
   * @param path - The path to the file or directory to remove.
   * @param options - Options for removing the file or directory.
   * @returns A promise that resolves when the file or directory is removed.
   */
  rm: (path: PathLike, options?: RmOptions & ResolveFSOptions) => Promise<void>;

  /**
   * Synchronously removes a file or directory in the virtual file system (VFS).
   *
   * @param path - The path to the file or directory to remove.
   * @param options - Options for removing the file or directory.
   */
  rmSync: (path: PathLike, options?: RmOptions & ResolveFSOptions) => void;

  /**
   * Creates a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   * @returns A promise that resolves to the path of the created directory, or undefined if the directory could not be created.
   */
  mkdirSync: (
    path: PathLike,
    options?: MakeDirectoryOptions
  ) => string | undefined;

  /**
   * Creates a directory in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   * @param options - Options for creating the directory.
   * @returns A promise that resolves to the path of the created directory, or undefined if the directory could not be created.
   */
  mkdir: (
    path: PathLike,
    options?: MakeDirectoryOptions
  ) => Promise<string | undefined>;

  /**
   * Reads a file from the virtual file system (VFS).
   *
   * @param pathOrId - The path or id of the file.
   * @returns The contents of the file if it exists, otherwise undefined.
   */
  readFile: (pathOrId: string) => Promise<string | undefined>;

  /**
   * Reads a file from the virtual file system (VFS).
   *
   * @param pathOrId - The path or id of the file.
   */
  readFileSync: (pathOrId: string) => string | undefined;

  /**
   * Writes a file to the virtual file system (VFS).
   *
   * @param path - The path to the file.
   * @param data - The contents of the file.
   * @param options - Optional parameters for writing the file.
   * @returns A promise that resolves when the file is written.
   */
  writeFile: (
    path: PathOrFileDescriptor,
    data?: WriteFileData,
    options?: WriteFileOptions
  ) => Promise<void>;

  /**
   * Writes a file to the virtual file system (VFS).
   *
   * @param path - The path to the file.
   * @param data - The contents of the file.
   * @param options - Optional parameters for writing the file.
   */
  writeFileSync: (
    path: PathOrFileDescriptor,
    data?: WriteFileData,
    options?: WriteFileOptions
  ) => void;

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
  copy: (srcPath: string, destPath: string) => Promise<void>;

  /**
   * Synchronously copies a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to copy
   * @param destPath - The destination path to copy to
   */
  copySync: (srcPath: string, destPath: string) => void;

  /**
   * Glob files in the virtual file system (VFS) based on the provided pattern(s).
   *
   * @param pattern - A pattern (or multiple patterns) to use to determine the file paths to return
   * @returns An array of file paths matching the provided pattern(s)
   */
  glob: (pattern: string | string[]) => Promise<string[]>;

  /**
   * Synchronously glob files in the virtual file system (VFS) based on the provided pattern(s).
   *
   * @param pattern - A pattern (or multiple patterns) to use to determine the file paths to return
   * @returns An array of file paths matching the provided pattern(s)
   */
  globSync: (pattern: string | string[]) => string[];

  /**
   * Resolves a path or id to a file path in the virtual file system.
   *
   * @param pathOrId - The path or id of the file to resolve.
   * @param options - Optional parameters for resolving the path.
   * @returns The resolved path of the file if it exists, otherwise false.
   */
  resolve: (pathOrId: string, options?: ResolvePathOptions) => string | false;

  /**
   * Formats a path to match the virtual file system (VFS) structure.
   *
   * @param path - The path to format.
   * @returns The formatted path.
   */
  formatPath: (path: string) => string;

  /**
   * Resolves a path or id to a file path in the virtual file system.
   *
   * @param pathOrId - The path or id of the file to resolve.
   * @returns The resolved path of the file if it exists, otherwise false.
   */
  realpathSync: (pathOrId: string) => string;

  /**
   * Disposes of the virtual file system (VFS), writes any virtual file changes to disk, and releases any associated resources.
   */
  dispose: () => Promise<void>;
}
