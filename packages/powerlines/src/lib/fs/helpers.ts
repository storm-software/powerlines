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

import { findFileDotExtensionSafe } from "@stryke/path/file-path-fns";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import fs, { PathOrFileDescriptor } from "node:fs";
import {
  NodeWriteFileOptions,
  PowerlinesWriteFileOptions,
  VirtualFileData,
  VirtualFileSystemInterface,
  WriteFileData,
  WriteFileOptions
} from "../../types/fs";

export function isBufferEncoding(
  options: WriteFileOptions
): options is BufferEncoding | null {
  return isSetString(options) || options === null;
}

export function isPowerlinesWriteFileOptions(
  options: WriteFileOptions
): options is PowerlinesWriteFileOptions {
  return (
    !isBufferEncoding(options) &&
    isSetObject(options) &&
    "mode" in options &&
    (options.mode === "fs" || options.mode === "virtual")
  );
}

export function isNodeWriteFileOptions(
  options: WriteFileOptions
): options is NodeWriteFileOptions {
  return (
    !isUndefined(options) &&
    isBufferEncoding(options) &&
    !isPowerlinesWriteFileOptions(options)
  );
}

export function isVirtualFileData(obj: WriteFileData): obj is VirtualFileData {
  return !!(isSetObject(obj) && "code" in obj && obj.code);
}

const FILE_PREFIX = "file://";

export function toFilePath(pathOrUrl: PathOrFileDescriptor): string {
  if (!pathOrUrl) {
    throw new Error("No Path or URL provided to Virtual File System");
  }
  let result = pathOrUrl.toString();
  if (result.startsWith(FILE_PREFIX)) {
    result = result.slice(FILE_PREFIX.length);
  }
  return result;
}

export const FS_METHODS = [
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

export const FS_PROMISE_METHODS = [
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

export function cloneFS(originalFS: typeof fs) {
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
export function patchFS(
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
 * Checks if a given file id is valid based on the specified prefix.
 *
 * @param id - The file ID to check.
 * @param prefix - The prefix to use for built-in files. Default is "powerlines".
 * @returns `true` if the file ID is valid, otherwise `false`.
 */
export function isValidId(id: string, prefix = "powerlines"): boolean {
  return id.replace(/^\\0/, "").startsWith(`${prefix.replace(/:$/, "")}`);
}

/**
 * Formats a file id by removing the file extension and prepending the runtime prefix.
 *
 * @param id - The file ID to format.
 * @param prefix - The prefix to use for built-in files. Default is "powerlines".
 * @returns The formatted file ID.
 */
export function normalizeId(id: string, prefix = "powerlines"): string {
  return `${prefix.replace(/:$/, "")}:${toFilePath(id)
    .replace(new RegExp(`^${prefix.replace(/:$/, "")}:`), "")
    .replace(/^\\0/, "")
    .replace(findFileDotExtensionSafe(toFilePath(id)), "")}`;
}

/**
 * Normalizes a given path by resolving it against the project root, workspace root, and built-ins path.
 *
 * @param path - The path to normalize.
 * @param builtinsPath - The path to built-in files.
 * @param prefix - The prefix to use for built-in files. Default is "powerlines".
 * @returns The normalized path.
 */
export function normalizePath(
  path: string,
  builtinsPath: string,
  prefix = "powerlines"
): string {
  return isValidId(toFilePath(path), prefix)
    ? normalizeId(toFilePath(path), prefix).replace(
        new RegExp(`^${prefix.replace(/:$/, "")}:`),
        builtinsPath
      )
    : toFilePath(path);
}
