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
import { BaseStorageAdapter, StorageAdapterOptions } from "./base";

/**
 * Virtual/in-memory storage adapter implementation.
 */
export class VirtualStorageAdapter extends BaseStorageAdapter {
  /**
   * A name identifying the storage adapter type.
   */
  public name = "virtual";

  /**
   * In-memory data storage.
   */
  protected data = new Map<string, any>();

  /**
   * Constructor for the VirtualStorageAdapter.
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
    return this.data.has(this.resolve(key));
  }

  /**
   * Synchronously retrieves the value associated with a given key.
   *
   * @param key - The key whose value is to be retrieved.
   * @returns The value associated with the key, or `null` if the key does not exist.
   */
  public getSync(key: string): string | null {
    return this.data.get(this.resolve(key)) ?? null;
  }

  /**
   * Synchronously sets the value for a given key.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set.
   */
  public setSync(key: string, value: string) {
    if (!this.options.isReadOnly) {
      this.data.set(this.resolve(key), value);
    }
  }

  /**
   * Synchronously removes a key from the storage.
   *
   * @param key - The key to remove.
   */
  public removeSync(key: string) {
    if (!this.options.isReadOnly) {
      this.data.delete(this.resolve(key));
    }
  }

  /**
   * Lists all keys under a given base path synchronously.
   *
   * @param base - The base path to list keys from.
   * @returns An array of keys under the specified base path.
   */
  public listSync(base?: string): string[] {
    return [
      ...this.data
        .keys()
        .filter(key => (!base ? true : isParentPath(key, this.resolve(base))))
    ];
  }

  /**
   * Disposes of the storage adapter, releasing any held resources.
   *
   * @returns A promise that resolves when the disposal is complete.
   */
  public override async dispose(): Promise<void> {
    return this.clear();
  }
}
