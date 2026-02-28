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

import { exists, existsSync } from "@stryke/fs/exists";
import { createDirectory, createDirectorySync } from "@stryke/fs/helpers";
import { isDirectory, isFile } from "@stryke/fs/is-file";
import { listFiles, listFilesSync } from "@stryke/fs/list-files";
import { readFile, readFileSync } from "@stryke/fs/read-file";
import { writeFile, writeFileSync } from "@stryke/fs/write-file";
import { unlinkSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { BaseStorageAdapter, StorageAdapterOptions } from "./base";
import { ignoreNotfound } from "./helpers";

export type SetSyncOptions = Parameters<typeof writeFileSync>[2];
export type SetOptions = Parameters<typeof writeFile>[2];

/**
 * File system storage adapter implementation.
 */
export class FileSystemStorageAdapter extends BaseStorageAdapter {
  /**
   * A name identifying the storage adapter type.
   */
  public name = "file-system";

  /**
   * The storage preset for the adapter.
   *
   * @remarks
   * This can be used as an alternate way to identify the type of storage being used.
   */
  public override readonly preset = "fs";

  /**
   * Constructor for the FileSystemStorageAdapter.
   *
   * @param options - Configuration options for the storage adapter.
   */
  public constructor(options?: StorageAdapterOptions) {
    super(options);
  }

  /**
   * Synchronously checks if a key exists in the storage.
   *
   * @param key - The key to check for existence.
   * @returns Returns `true` if the key exists, otherwise `false`.
   */
  public existsSync(key: string): boolean {
    return existsSync(this.resolve(key));
  }

  /**
   * Asynchronously checks if a key exists in the storage.
   *
   * @param key - The key to check for existence.
   * @returns A promise that resolves to `true` if the key exists, otherwise `false`.
   */
  public override async exists(key: string): Promise<boolean> {
    return exists(this.resolve(key));
  }

  /**
   * Synchronously retrieves the value associated with a given key.
   *
   * @param key - The key whose value is to be retrieved.
   * @returns The value associated with the key, or `null` if the key does not exist.
   */
  public getSync(key: string): string | null {
    return readFileSync(this.resolve(key));
  }

  /**
   * Asynchronously retrieves the value associated with a given key.
   *
   * @param key - The key whose value is to be retrieved.
   * @returns A promise that resolves to the value associated with the key, or `null` if the key does not exist.
   */
  public override async get(key: string): Promise<string | null> {
    return readFile(this.resolve(key));
  }

  /**
   * Synchronously sets the value for a given key.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set.
   */
  public setSync(key: string, value: string) {
    if (!this.options.isReadOnly) {
      return writeFileSync(this.resolve(key), value);
    }
  }

  /**
   * Asynchronously sets the value for a given key.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set.
   */
  public override async set(key: string, value: string): Promise<void> {
    if (!this.options.isReadOnly) {
      return writeFile(this.resolve(key), value);
    }
  }

  /**
   * Synchronously removes a key from the storage.
   *
   * @param key - The key to remove.
   */
  public removeSync(key: string) {
    if (!this.options.isReadOnly) {
      try {
        return unlinkSync(this.resolve(key));
      } catch (err) {
        return ignoreNotfound(err);
      }
    }
  }

  /**
   * Asynchronously removes a key from the storage.
   *
   * @param key - The key to remove.
   */
  public override async remove(key: string): Promise<void> {
    if (!this.options.isReadOnly) {
      return unlink(this.resolve(key)).catch(ignoreNotfound);
    }
  }

  /**
   * Synchronously creates a directory at the specified path.
   *
   * @param dirPath - The path of the directory to create.
   */
  public override mkdirSync(dirPath: string) {
    createDirectorySync(this.resolve(dirPath));
  }

  /**
   * Creates a directory at the specified path.
   *
   * @param dirPath - The path of the directory to create.
   */
  public override async mkdir(dirPath: string): Promise<void> {
    await createDirectory(this.resolve(dirPath));
  }

  /**
   * Lists all keys under a given base path synchronously.
   *
   * @param base - The base path to list keys from.
   * @returns An array of keys under the specified base path.
   */
  public listSync(base?: string): string[] {
    try {
      return listFilesSync(this.resolve(base), {
        ignore: this.options.ignore
      });
    } catch (err) {
      return ignoreNotfound(err) ?? [];
    }
  }

  /**
   * Asynchronously lists all keys under a given base path.
   *
   * @param base - The base path to list keys from.
   * @returns A promise that resolves to an array of keys under the specified base path.
   */
  public override async list(base?: string): Promise<string[]> {
    return listFiles(this.resolve(base), {
      ignore: this.options.ignore
    })
      .catch(ignoreNotfound)
      .then(r => r || []);
  }

  /**
   * Synchronously checks if the given key is a directory.
   *
   * @param key - The key to check.
   * @returns `true` if the key is a directory, otherwise `false`.
   */
  public override isDirectorySync(key: string): boolean {
    return isDirectory(this.resolve(key));
  }

  /**
   * Synchronously checks if the given key is a file.
   *
   * @param key - The key to check.
   * @returns `true` if the key is a file, otherwise `false`.
   */
  public override isFileSync(key: string): boolean {
    return isFile(this.resolve(key));
  }
}
