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

import { appendPath } from "@stryke/path/append";
import { correctPath } from "@stryke/path/correct-path";
import { joinPaths } from "@stryke/path/join";
import { MaybePromise } from "@stryke/types/base";
import { resolve } from "node:path";
import { StorageAdapter } from "../../../types/fs";

export interface StorageAdapterOptions {
  base: string;
  isReadOnly?: boolean;
  ignore?: string | string[];
}

/**
 * Abstract base class for storage adapters, providing a template for storage operations.
 */
export abstract class BaseStorageAdapter<
  TOptions extends StorageAdapterOptions = StorageAdapterOptions
> implements StorageAdapter
{
  /**
   * Indicates whether the storage adapter has been disposed.
   */
  #isDisposed = false;

  /**
   * A name identifying the storage adapter type.
   */
  public abstract name: string;

  /**
   * Configuration options for the storage adapter.
   */
  public options: TOptions;

  /**
   * Constructor for the BaseStorageAdapter.
   *
   * @param options - Configuration options for the storage adapter.
   */
  public constructor(options: TOptions = { base: "/" } as TOptions) {
    this.options = options;
    this.options.base = resolve(options.base);
    this.options.isReadOnly = !!options.isReadOnly;
  }

  /**
   * Synchronously checks if a key exists in the storage.
   *
   * @param key - The key to check for existence.
   * @returns Returns `true` if the key exists, otherwise `false`.
   */
  public abstract existsSync(key: string): boolean;

  /**
   * Asynchronously checks if a key exists in the storage.
   *
   * @param key - The key to check for existence.
   * @returns A promise that resolves to `true` if the key exists, otherwise `false`.
   */
  public async exists(key: string): Promise<boolean> {
    return this.existsSync(key);
  }

  /**
   * Synchronously retrieves the value associated with a given key.
   *
   * @param key - The key whose value is to be retrieved.
   * @returns The value associated with the key, or `null` if the key does not exist.
   */
  public abstract getSync(key: string): string | null;

  /**
   * Asynchronously retrieves the value associated with a given key.
   *
   * @param key - The key whose value is to be retrieved.
   * @returns A promise that resolves to the value associated with the key, or `null` if the key does not exist.
   */
  public async get(key: string): Promise<string | null> {
    return this.getSync(key);
  }

  /**
   * Synchronously sets the value for a given key.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set.
   */
  public abstract setSync(key: string, value: string): void;

  /**
   * Asynchronously sets the value for a given key.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set.
   */
  public async set(key: string, value: string): Promise<void> {
    if (!this.options.isReadOnly) {
      this.setSync(key, value);
    }
  }

  /**
   * Synchronously removes a key from the storage.
   *
   * @param key - The key to remove.
   */
  public abstract removeSync(key: string): void;

  /**
   * Asynchronously removes a key from the storage.
   *
   * @param key - The key to remove.
   */
  public async remove(key: string): Promise<void> {
    if (!this.options.isReadOnly) {
      this.removeSync(key);
    }
  }

  /**
   * Synchronously removes all entries from the storage that match the provided base path.
   *
   * @param base - The base path to clear keys from.
   */
  public clearSync(base?: string) {
    if (!this.options.isReadOnly) {
      const keys = this.listSync(base || this.options.base);
      if (!keys.length) {
        return;
      }

      keys.map(key =>
        this.removeSync(
          base && !key.startsWith(base) ? joinPaths(base, key) : key
        )
      );
    }
  }

  /**
   * Asynchronously removes all entries from the storage that match the provided base path.
   *
   * @param base - The base path to clear keys from.
   * @returns A promise that resolves when the operation is complete.
   */
  public async clear(base?: string): Promise<void> {
    if (!this.options.isReadOnly) {
      const keys = await this.list(base || this.options.base);
      if (!keys.length) {
        return;
      }

      await Promise.all(
        keys.map(async key =>
          this.remove(
            base && !key.startsWith(base) ? joinPaths(base, key) : key
          )
        )
      );
    }
  }

  /**
   * Lists all keys under a given base path synchronously.
   *
   * @param base - The base path to list keys from.
   * @returns An array of keys under the specified base path.
   */
  public abstract listSync(base?: string): string[];

  /**
   * Asynchronously lists all keys under a given base path.
   *
   * @param base - The base path to list keys from.
   * @returns A promise that resolves to an array of keys under the specified base path.
   */
  public async list(base?: string): Promise<string[]> {
    return this.listSync(base);
  }

  /**
   * Disposes of the storage adapter, releasing any held resources.
   *
   * @returns A promise that resolves when the disposal is complete.
   */
  public dispose(): MaybePromise<void> {
    return Promise.resolve();
  }

  /**
   * Async dispose method to clean up resources.
   *
   * @returns A promise that resolves when disposal is complete.
   */
  public async [Symbol.asyncDispose]() {
    return this._dispose();
  }

  /**
   * Resolves a given key to its full path within the storage adapter.
   *
   * @param key - The key to resolve.
   * @returns The resolved full path for the key.
   */
  protected resolve(key: string = this.options.base) {
    if (/\.\.:|\.\.$/.test(key)) {
      throw new Error(
        `[${this.name}]: Invalid key: ${JSON.stringify(key)} provided to storage adapter.`
      );
    }

    return appendPath(correctPath(key).replace(/:/g, "/"), this.options.base);
  }

  /**
   * Disposes of the storage adapter, releasing any held resources.
   *
   * @returns A promise that resolves when the disposal is complete.
   */
  protected async _dispose(): Promise<void> {
    if (!this.#isDisposed) {
      await Promise.resolve(this.dispose());
      this.#isDisposed = true;
    }
  }
}
