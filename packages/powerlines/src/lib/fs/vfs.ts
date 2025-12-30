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
import { murmurhash } from "@stryke/hash/murmurhash";
import { getUnique } from "@stryke/helpers/get-unique";
import { appendPath } from "@stryke/path/append";
import {
  findFileName,
  findFilePath,
  hasFileExtension
} from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { isAbsolutePath } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { prettyBytes } from "@stryke/string-format/pretty-bytes";
import { isRegExp } from "@stryke/type-checks/is-regexp";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { AssetGlob } from "@stryke/types/file";
import { create, FlatCache } from "flat-cache";
import { Blob } from "node:buffer";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";
import { FileSystem } from "../../../schemas/fs";
import { replacePathTokens } from "../../plugin-utils/paths";
import { LogFn } from "../../types/config";
import { Context } from "../../types/context";
import {
  ResolveOptions,
  StorageAdapter,
  StoragePort,
  VirtualFileMetadata,
  VirtualFileSystemInterface,
  WriteOptions
} from "../../types/fs";
import { extendLog } from "../logger";
import { normalizeGlobPatterns, normalizeId, normalizePath } from "./helpers";
import { FileSystemStorageAdapter } from "./storage/file-system";
import { VirtualStorageAdapter } from "./storage/virtual";

interface StorageAdapterState {
  adapter: StorageAdapter;
  relativeKey: string;
  base: string;
}

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
   * The unified volume that combines the virtual file system with the real file system.
   *
   * @remarks
   * This volume allows for seamless access to both virtual and real files.
   */
  #storage: StoragePort = { "": new FileSystemStorageAdapter() };

  /**
   * A cache for module resolution results.
   */
  #resolverCache!: FlatCache;

  /**
   * Indicator specifying if the virtual file system (VFS) is disposed
   */
  #isDisposed = false;

  /**
   * The context of the virtual file system.
   */
  #context: Context;

  /**
   * The file system's logging function.
   */
  #log: LogFn;

  /**
   * Normalizes a given module id by resolving it against the built-ins path.
   *
   * @param id - The module id to normalize.
   * @returns The normalized module id.
   */
  #normalizeId(id: string): string {
    let normalized = id;
    if (isParentPath(normalized, this.#context.builtinsPath)) {
      normalized = replacePath(normalized, this.#context.builtinsPath);
    }

    return normalizeId(normalized, this.#context.config.output.builtinPrefix);
  }

  /**
   * Normalizes a given path by resolving it against the project root, workspace root, and built-ins path.
   *
   * @param path - The path to normalize.
   * @returns The normalized path.
   */
  #normalizePath(path: string): string {
    return normalizePath(
      path.includes("{") || path.includes("}")
        ? replacePathTokens(this.#context, path)
        : path,
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
   * Gets the storage adapter and relative key for a given key.
   *
   * @remarks
   * The `key` can be either a path or a storage adapter name.
   *
   * @param key - The key to get the storage adapter for.
   * @returns The storage adapter and relative key for the given key.
   */
  #getStorage(key: string): StorageAdapterState {
    const found = Object.entries(this.#storage).find(
      ([, adapter]) =>
        adapter.name === key ||
        (adapter.preset && adapter.preset.toLowerCase() === key?.toLowerCase())
    );
    if (found) {
      return {
        base: found[0],
        relativeKey: "",
        adapter: found[1]
      };
    }

    const path = this.resolveSync(this.#normalizePath(key)) || key;
    for (const base of Object.keys(this.#storage)
      .filter(Boolean)
      .sort()
      .reverse()) {
      if (isParentPath(path, base)) {
        return {
          base,
          relativeKey: replacePath(path, base),
          adapter: this.#storage[base]!
        };
      }
    }

    return {
      base: "",
      relativeKey: path,
      adapter: this.#storage[""]!
    };
  }

  /**
   * Gets all storage adapters that match a given base key.
   *
   * @param base - The base key to match storage adapters against.
   * @param includeParent - Whether to include parent storage adapters.
   * @returns An array of storage adapters that match the given base key.
   */
  #getStorages(base = "", includeParent = false) {
    return Object.keys(this.#storage)
      .sort()
      .reverse()
      .filter(
        key =>
          isParentPath(key, base) || (includeParent && isParentPath(base, key))
      )
      .map(key => ({
        relativeBase:
          base.length > key.length ? base.slice(key.length) : undefined,
        base: key,
        adapter: this.#storage[key]!
      }));
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
      const fs = message.getRoot(FileSystem);

      const result = new VirtualFileSystem(context, fs);

      if (fs._hasStorage() && fs.storage.length > 0) {
        await Promise.all(
          fs.storage.values().map(async file => {
            await result.write(file.path, file.code);
          })
        );
      }
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
      const fs = message.getRoot(FileSystem);

      const result = new VirtualFileSystem(context, fs);

      if (fs._hasStorage() && fs.storage.length > 0) {
        fs.storage.values().map(file => {
          result.writeSync(file.path, file.code);
        });
      }
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

  /**
   * Gets the resolver cache.
   */
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

    if (isSetObject(this.#context.config.output.storage)) {
      this.#storage = {
        ...this.#storage,
        ...this.#context.config.output.storage
      };
    }

    this.#storage.virtual ??= new VirtualStorageAdapter({
      base: "/_virtual"
    });

    if (this.#context.config.output.storage !== "fs") {
      this.#storage[this.#context.artifactsPath] ??= new VirtualStorageAdapter({
        base: this.#context.artifactsPath
      });
      this.#storage[this.#context.builtinsPath] ??= new VirtualStorageAdapter({
        base: this.#context.builtinsPath
      });
      this.#storage[this.#context.entryPath] ??= new VirtualStorageAdapter({
        base: this.#context.entryPath
      });
    }

    this.#metadata = {} as Record<string, VirtualFileMetadata>;
    if (fs._hasMetadata()) {
      this.#metadata = fs.metadata.values().reduce(
        (ret, metadata) => {
          ret[metadata.id] = {
            id: metadata.id,
            type: metadata.type,
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

      if (context.config.skipCache !== true) {
        Object.entries(this.#metadata)
          .filter(([, value]) => value.type === "entry")
          .forEach(([id, value]) => {
            this.#context.entry ??= [];
            this.#context.entry.push({
              file: id,
              name: value.properties.name,
              output: value.properties.output,
              input: value.properties["input.file"]
                ? {
                    file: value.properties["input.file"],
                    name: value.properties["input.name"]
                  }
                : undefined
            });
          });
      }
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
   * Asynchronously checks if a file exists in the virtual file system (VFS).
   *
   * @param path - The path to the file.
   * @returns A promise that resolves to `true` if the file exists, otherwise `false`.
   */
  public async exists(path: string): Promise<boolean> {
    const { relativeKey, adapter } = this.#getStorage(path);

    return adapter.exists(relativeKey);
  }

  /**
   * Synchronously checks if a file exists in the virtual file system (VFS).
   *
   * @param path - The path to the file.
   * @returns `true` if the file exists, otherwise `false`.
   */
  public existsSync(path: string): boolean {
    const { relativeKey, adapter } = this.#getStorage(path);

    return adapter.existsSync(relativeKey);
  }

  /**
   * Checks if a file is virtual in the virtual file system (VFS).
   *
   * @param path - The path to the file.
   * @returns `true` if the file is virtual, otherwise `false`.
   */
  public isVirtual(path: string): boolean {
    const resolved = this.resolveSync(path);
    if (!resolved) {
      return false;
    }

    return this.#getStorage(resolved)?.adapter?.name === "virtual";
  }

  /**
   * Checks if a path is a directory in the virtual file system (VFS).
   *
   * @param path - The path to check.
   * @returns `true` if the path is a directory, otherwise `false`.
   */
  public isDirectorySync(path: string): boolean {
    const resolved = this.resolveSync(path);
    if (!resolved) {
      return false;
    }

    return !!(
      this.existsSync(resolved) &&
      this.#getStorage(resolved)?.adapter?.isDirectorySync(resolved)
    );
  }

  /**
   * Checks if a path is a directory in the virtual file system (VFS).
   *
   * @param path - The path to check.
   * @returns `true` if the path is a directory, otherwise `false`.
   */
  public async isDirectory(path: string): Promise<boolean> {
    const resolved = await this.resolve(path);
    if (!resolved) {
      return false;
    }

    return !!(
      (await this.exists(resolved)) &&
      (await this.#getStorage(resolved)?.adapter?.isDirectory(resolved))
    );
  }

  /**
   * Checks if a path is a file in the virtual file system (VFS).
   *
   * @param path - The path to check.
   * @returns `true` if the path is a file, otherwise `false`.
   */
  public isFileSync(path: string): boolean {
    const resolved = this.resolveSync(path);
    if (!resolved) {
      return false;
    }

    return this.#getStorage(resolved)?.adapter?.isFileSync(resolved) ?? false;
  }

  /**
   * Checks if a path is a file in the virtual file system (VFS).
   *
   * @param path - The path to check.
   * @returns `true` if the path is a file, otherwise `false`.
   */
  public async isFile(path: string): Promise<boolean> {
    const resolved = await this.resolve(path);
    if (!resolved) {
      return false;
    }

    return (
      (await this.#getStorage(resolved)?.adapter?.isFile(resolved)) ?? false
    );
  }

  /**
   * Lists files in a given path.
   *
   * @param path - The path to list files from.
   * @returns An array of file names in the specified path.
   */
  public listSync(path?: string): string[] {
    return getUnique(
      this.#getStorages(path, true)
        .map(storage =>
          storage.adapter.listSync(
            storage.relativeBase
              ? storage.base
                ? appendPath(storage.relativeBase, storage.base)
                : storage.relativeBase
              : storage.base
          )
        )
        .flat()
    );
  }

  /**
   * Lists files in a given path.
   *
   * @param path - The path to list files from.
   * @returns An array of file names in the specified path.
   */
  public async list(path?: string): Promise<string[]> {
    return getUnique(
      (
        await Promise.all(
          this.#getStorages(path, true).map(async storage =>
            storage.adapter.list(
              storage.relativeBase
                ? storage.base
                  ? appendPath(storage.relativeBase, storage.base)
                  : storage.relativeBase
                : storage.base
            )
          )
        )
      ).flat()
    );
  }

  /**
   * Removes a file in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   */
  public async remove(path: string): Promise<void> {
    const normalizedPath = this.#normalizePath(path);
    this.#log(LogLevelLabel.TRACE, `Removing file: ${normalizedPath}`);

    const { relativeKey, adapter } = this.#getStorage(normalizedPath);

    if (hasFileExtension(normalizedPath)) {
      await adapter.remove(relativeKey);
    } else {
      await adapter.clear(relativeKey);
    }

    const id = this.#ids[normalizedPath];
    if (id && this.#metadata[id]) {
      delete this.#metadata[id];
      delete this.#ids[normalizedPath];
      delete this.#paths[id];
    }
  }

  /**
   * Removes a file in the virtual file system (VFS).
   *
   * @param path - The path to create the directory at.
   */
  public removeSync(path: string) {
    const normalizedPath = this.#normalizePath(path);
    this.#log(LogLevelLabel.TRACE, `Removing file: ${normalizedPath}`);

    const { relativeKey, adapter } = this.#getStorage(normalizedPath);

    if (hasFileExtension(normalizedPath)) {
      adapter.removeSync(relativeKey);
    } else {
      adapter.clearSync(relativeKey);
    }

    const id = this.#ids[normalizedPath];
    if (id && this.#metadata[id]) {
      delete this.#metadata[id];
      delete this.#ids[normalizedPath];
      delete this.#paths[id];
    }
  }

  /**
   * Glob files in the virtual file system (VFS) based on the provided pattern(s).
   *
   * @param patterns - A pattern (or multiple patterns) to use to determine the file paths to return
   * @returns An array of file paths matching the provided pattern(s)
   */
  public async glob(
    patterns:
      | string
      | Omit<AssetGlob, "output">
      | (string | Omit<AssetGlob, "output">)[]
  ): Promise<string[]> {
    const results: string[] = [];

    for (const pattern of normalizeGlobPatterns(
      this.#context.workspaceConfig.workspaceRoot,
      patterns
    )) {
      const normalized = this.#normalizePath(pattern);

      // No glob characters: treat as a single file path
      if (!/[*?[\]{}]/.test(normalized) && !normalized.includes("**")) {
        if (this.isDirectorySync(normalized)) {
          results.push(...(await this.list(normalized)));
        } else {
          const resolved = await this.resolve(normalized);
          if (resolved && !results.includes(resolved)) {
            results.push(resolved);
          }
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

      await Promise.all(
        (
          await this.list(
            baseDir && isAbsolutePath(baseDir)
              ? baseDir
              : this.#context.workspaceConfig.workspaceRoot
          )
        ).map(async file => {
          if (this.#buildRegex(absPattern).test(file)) {
            const resolved = this.resolveSync(file);
            if (resolved && !results.includes(resolved)) {
              results.push(resolved);
            }
          }
        })
      );
    }

    return results;
  }

  /**
   * Synchronously glob files in the virtual file system (VFS) based on the provided pattern(s).
   *
   * @param patterns - A pattern (or multiple patterns) to use to determine the file paths to return
   * @returns An array of file paths matching the provided pattern(s)
   */
  public globSync(
    patterns:
      | string
      | Omit<AssetGlob, "output">
      | (string | Omit<AssetGlob, "output">)[]
  ): string[] {
    const results: string[] = [];

    for (const pattern of normalizeGlobPatterns(
      this.#context.workspaceConfig.workspaceRoot,
      patterns
    )) {
      const normalized = this.#normalizePath(pattern);

      // No glob characters: treat as a single file path
      if (!/[*?[\]{}]/.test(normalized) && !normalized.includes("**")) {
        if (this.isDirectorySync(normalized)) {
          results.push(...this.listSync(normalized));
        } else {
          const resolved = this.resolveSync(normalized);
          if (resolved && !results.includes(resolved)) {
            results.push(resolved);
          }
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

      const files = this.listSync(
        baseDir && isAbsolutePath(baseDir)
          ? baseDir
          : this.#context.workspaceConfig.workspaceRoot
      );
      for (const file of files) {
        if (this.#buildRegex(absPattern).test(file)) {
          const resolved = this.resolveSync(file);
          if (resolved && !results.includes(resolved)) {
            results.push(resolved);
          }
        }
      }
    }

    return results;
  }

  /**
   * Copies a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to copy
   * @param destPath - The destination path to copy to
   */
  public async copy(
    srcPath: string | URL | Omit<AssetGlob, "output">,
    destPath: string | URL
  ) {
    const src = srcPath instanceof URL ? fileURLToPath(srcPath) : srcPath;
    const dest = destPath instanceof URL ? fileURLToPath(destPath) : destPath;

    if (
      (!isSetString(src) && (!isSetObject(src) || !isSetString(src.input))) ||
      !isSetString(dest)
    ) {
      return;
    }

    const sourceStr = isString(src)
      ? src
      : src.input
        ? src.input
        : this.#context.workspaceConfig.workspaceRoot;
    const source = await this.resolve(sourceStr);
    if (!source) {
      return;
    }

    if (
      this.isDirectorySync(source) ||
      (isSetString(src) && src.includes("*")) ||
      (isSetObject(src) && isSetString(src.glob))
    ) {
      await Promise.all(
        (await this.glob(src)).map(async file => {
          return this.copy(
            file,
            appendPath(replacePath(file, sourceStr), dest)
          );
        })
      );
    } else {
      const content = await this.read(source);
      if (content !== undefined) {
        await this.write(this.#normalizePath(dest), content, {
          skipFormat: true
        });
      }
    }
  }

  /**
   * Synchronously copies a file from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to copy
   * @param destPath - The destination path to copy to
   */
  public copySync(
    srcPath: string | URL | Omit<AssetGlob, "output">,
    destPath: string | URL
  ) {
    const src = srcPath instanceof URL ? fileURLToPath(srcPath) : srcPath;
    const dest = destPath instanceof URL ? fileURLToPath(destPath) : destPath;

    if (
      (!isSetString(src) && (!isSetObject(src) || !isSetString(src.input))) ||
      !isSetString(dest)
    ) {
      return;
    }

    const sourceStr = isString(src)
      ? src
      : src.input
        ? src.input
        : this.#context.workspaceConfig.workspaceRoot;
    const source = this.resolveSync(sourceStr);
    if (!source) {
      return;
    }

    if (
      this.isDirectorySync(source) ||
      (isSetString(src) && src.includes("*")) ||
      (isSetObject(src) && isSetString(src.glob))
    ) {
      this.globSync(src).map(file => {
        return this.copySync(
          file,
          appendPath(findFilePath(replacePath(file, sourceStr)), dest)
        );
      });
    } else {
      const content = this.readSync(source);
      if (content !== undefined) {
        this.writeSync(
          this.#normalizePath(
            hasFileExtension(dest)
              ? dest
              : appendPath(findFileName(source), dest)
          ),
          content,
          { skipFormat: true }
        );
      }
    }
  }

  /**
   * Moves a file (or files) from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to move
   * @param destPath - The destination path to move to
   */
  public async move(srcPath: string, destPath: string) {
    if (hasFileExtension(srcPath)) {
      await this.copy(srcPath, destPath);
      await this.remove(srcPath);
    } else {
      await Promise.all(
        (await this.list(srcPath)).map(async file => {
          await this.copy(file, destPath);
          await this.remove(file);
        })
      );
    }
  }

  /**
   * Synchronously moves a file (or files) from one path to another in the virtual file system (VFS).
   *
   * @param srcPath - The source path to move
   * @param destPath - The destination path to move to
   */
  public moveSync(srcPath: string, destPath: string) {
    if (hasFileExtension(srcPath)) {
      this.copySync(srcPath, destPath);
      this.removeSync(srcPath);
    } else {
      this.listSync(srcPath).forEach(file => {
        this.copySync(file, destPath);
        this.removeSync(file);
      });
    }
  }

  /**
   * Asynchronously reads a file from the virtual file system (VFS).
   *
   * @param path - The path or ID of the file to read.
   * @returns A promise that resolves to the contents of the file as a string, or undefined if the file does not exist.
   */
  public async read(path: string): Promise<string | undefined> {
    const filePath = await this.resolve(path);
    if (!filePath) {
      return undefined;
    }

    const { relativeKey, adapter } = this.#getStorage(filePath);
    this.#log(LogLevelLabel.TRACE, `Reading ${adapter.name} file: ${filePath}`);

    return (await adapter.get(relativeKey)) ?? undefined;
  }

  /**
   * Synchronously reads a file from the virtual file system (VFS).
   *
   * @param path - The path or ID of the file to read.
   * @returns The contents of the file as a string, or undefined if the file does not exist.
   */
  public readSync(path: string): string | undefined {
    const filePath = this.resolveSync(path);
    if (!filePath) {
      return undefined;
    }

    const { relativeKey, adapter } = this.#getStorage(filePath);
    this.#log(LogLevelLabel.TRACE, `Reading ${adapter.name} file: ${filePath}`);

    return adapter.getSync(relativeKey) ?? undefined;
  }

  /**
   * Writes a file to the virtual file system (VFS).
   *
   * @param path - The path to the file.
   * @param data - The contents of the file.
   * @param options - Optional parameters for writing the file.
   * @returns A promise that resolves when the file is written.
   */
  public async write(
    path: string,
    data: string = "",
    options: WriteOptions = {}
  ): Promise<void> {
    let code = data;
    if (!options.skipFormat) {
      const resolvedConfig = await resolveConfig(this.#normalizePath(path));
      if (resolvedConfig) {
        code = await format(data, {
          absolutePath: this.#normalizePath(path),
          ...resolvedConfig
        });
      }
    }

    const { relativeKey, adapter } = this.#getStorage(options.storage || path);

    this.#log(
      LogLevelLabel.TRACE,
      `Writing ${this.#normalizePath(relativeKey)} to ${
        adapter.name === "virtual"
          ? "the virtual file system"
          : adapter.name === "file-system"
            ? "the local file system"
            : adapter.name
      } (size: ${prettyBytes(new Blob(toArray(code)).size)})`
    );

    const id = options?.meta?.id || this.#normalizeId(relativeKey);
    this.#metadata[id] = {
      variant: "normal",
      timestamp: Date.now(),
      ...(options.meta ?? {})
    } as VirtualFileMetadata;
    this.#paths[id] = this.#normalizePath(relativeKey);
    this.#ids[this.#normalizePath(relativeKey)] = id;

    return adapter.set(relativeKey, code);
  }

  /**
   * Synchronously writes a file to the virtual file system (VFS).
   *
   * @param path - The file to write.
   * @param data - The contents of the file.
   * @param options - Optional parameters for writing the file.
   */
  public writeSync(
    path: string,
    data: string = "",
    options: WriteOptions = {}
  ): void {
    const { relativeKey, adapter } = this.#getStorage(options.storage || path);

    this.#log(
      LogLevelLabel.TRACE,
      `Writing ${this.#normalizePath(relativeKey)} file to ${
        adapter.name === "virtual"
          ? "the virtual file system"
          : adapter.name === "file-system"
            ? "the local file system"
            : adapter.name
      } (size: ${prettyBytes(new Blob(toArray(data)).size)})`
    );

    const id = options?.meta?.id || this.#normalizeId(relativeKey);
    this.#metadata[id] = {
      variant: "normal",
      timestamp: Date.now(),
      ...(options.meta ?? {})
    } as VirtualFileMetadata;
    this.#paths[id] = this.#normalizePath(relativeKey);
    this.#ids[this.#normalizePath(relativeKey)] = id;

    return adapter.setSync(relativeKey, data);
  }

  /**
   * Synchronously creates a directory at the specified path.
   *
   * @param dirPath - The path of the directory to create.
   */
  public mkdirSync(dirPath: string) {
    return this.#getStorage(dirPath)?.adapter?.mkdirSync(dirPath);
  }

  /**
   * Creates a directory at the specified path.
   *
   * @param path - The path of the directory to create.
   */
  public async mkdir(path: string): Promise<void> {
    return this.#getStorage(path)?.adapter?.mkdir(path);
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
   * Resolves a given module ID using the configured aliases.
   *
   * @remarks
   * This function can be used to map module IDs to different paths based on the alias configuration.
   *
   * @param id - The module ID to resolve.
   * @returns The resolved module ID - after applying any configured aliases (this will be the same as the input ID if no aliases match).
   */
  public resolveAlias(id: string): string {
    let path = id;

    if (this.#context.config.build.alias) {
      if (
        Array.isArray(this.#context.config.build.alias) &&
        this.#context.config.build.alias.length > 0
      ) {
        const found = this.#context.config.build.alias.filter(
          alias =>
            (isSetString(alias.find) &&
              (alias.find === path || path.startsWith(`${alias.find}/`))) ||
            (isRegExp(alias.find) && alias.find.test(path))
        );
        if (found.length > 0) {
          const alias = found.reduce((ret, current) => {
            const retLength = isSetString(ret.find)
              ? ret.find.length
              : isRegExp(ret.find)
                ? ret.find.source.length
                : 0;
            const currentLength = isSetString(current.find)
              ? current.find.length
              : isRegExp(current.find)
                ? current.find.source.length
                : 0;

            return retLength > currentLength ? ret : current;
          });

          if (isSetString(alias.find)) {
            path = path.replace(
              new RegExp(`^${alias.find}`),
              alias.replacement
            );
          } else if (isRegExp(alias.find)) {
            path = path.replace(alias.find, alias.replacement);
          }
        }
      } else if (isSetObject(this.#context.config.build.alias)) {
        const found = Object.keys(
          this.#context.config.build.alias as Record<string, string>
        ).filter(key => key === path || path.startsWith(`${key}/`));
        if (found.length > 0) {
          const alias = found.reduce((ret, current) => {
            return ret.length > current.length ? ret : current;
          });

          path = path.replace(
            new RegExp(`^${alias}`),
            (this.#context.config.build.alias as Record<string, string>)[alias]!
          );
        }
      }
    }

    return path;
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
    let path = id;
    if (path.includes("{") || path.includes("}")) {
      path = replacePathTokens(this.#context, path);
    }

    if (options.skipAlias !== true) {
      path = this.resolveAlias(path);
    }

    if (isAbsolutePath(path)) {
      return path;
    }

    const resolverCacheKey = murmurhash({
      path: this.#normalizeId(path),
      importer,
      options
    });

    let result!: string | undefined;
    if (!this.#context.config.skipCache) {
      result = this.resolverCache.get<string | undefined>(resolverCacheKey);
      if (result) {
        return result;
      }
    }

    result = this.paths[this.#normalizeId(path)];
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
          Object.keys(this.#context.tsconfig?.options?.paths ?? {})
            .filter(tsconfigPath =>
              path.startsWith(tsconfigPath.replace(/\*$/, ""))
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

      for (const combination of getResolutionCombinations(path, { paths })) {
        const { relativeKey, adapter } = this.#getStorage(combination);
        if (await adapter.exists(relativeKey)) {
          result = combination;
          break;
        }
      }

      if (!result) {
        try {
          result = await resolve(path, { ...options, paths });
        } catch {
          // Do nothing
        }
      }
    }

    if (result && !this.#context.config.skipCache) {
      this.resolverCache.set(resolverCacheKey, result);
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
    let path = id;
    if (path.includes("{") || path.includes("}")) {
      path = replacePathTokens(this.#context, path);
    }

    if (options.skipAlias !== true) {
      path = this.resolveAlias(path);
    }

    if (isAbsolutePath(path)) {
      return path;
    }

    let result!: string | undefined;
    if (!this.#context.config.skipCache) {
      result = this.resolverCache.get<string | undefined>(
        this.#normalizeId(path)
      );
      if (result) {
        return result;
      }
    }

    result = this.paths[this.#normalizeId(path)];
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
          Object.keys(this.#context.tsconfig?.options?.paths ?? {})
            .filter(tsconfigPath =>
              path.startsWith(tsconfigPath.replace(/\*$/, ""))
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

      for (const combination of getResolutionCombinations(path, { paths })) {
        const { relativeKey, adapter } = this.#getStorage(combination);
        if (adapter.existsSync(relativeKey)) {
          result = combination;
          break;
        }
      }

      if (!result) {
        try {
          result = resolveSync(path, { ...options, paths });
        } catch {
          // Do nothing
        }
      }
    }

    if (result && !this.#context.config.skipCache) {
      this.resolverCache.set(this.#normalizeId(path), result);
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
      await this.remove(joinPaths(this.#context.dataPath, "fs.bin"));

      const message = new capnp.Message();
      const fs = message.initRoot(FileSystem);

      const paths = await this.list();

      const storage = fs._initStorage(paths.length);
      await Promise.all(
        paths.map(async (path, index) => {
          const code = await this.read(path);

          const fd = storage.get(index);
          fd.path = path;
          fd.code = code || "";
        })
      );

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
          fileMetadata.type = value.type;
          fileMetadata.timestamp = value.timestamp ?? BigInt(Date.now());

          if (value.properties) {
            const props = fileMetadata._initProperties(
              Object.keys(value.properties).length
            );
            Object.entries(value.properties)
              .filter(([, val]) => isSetString(val))
              .forEach(([key, val], index) => {
                const prop = props.get(index);
                prop.key = key;
                prop.value = val!;
              });
          }
        });

      await writeFileBuffer(
        joinPaths(this.#context.dataPath, "fs.bin"),
        message.toArrayBuffer()
      );

      if (!this.#context.config.skipCache) {
        this.#resolverCache.save(true);
      }

      await Promise.all(
        this.#getStorages().map(async storage => storage.adapter.dispose())
      );

      this.#log(LogLevelLabel.TRACE, "Virtual file system has been disposed.");
    }
  }

  // /**
  //  * Initializes the virtual file system (VFS) by patching the file system module if necessary.
  //  */
  // public [__VFS_PATCH__]() {
  //   if (!this.#isPatched && this.#context.config.output.mode !== "fs") {
  //     this.#revert = patchFS(fs, this);
  //     this.#isPatched = true;
  //   }
  // }

  // /**
  //  * Reverts the file system module to its original state if it was previously patched.
  //  */
  // public [__VFS_REVERT__]() {
  //   if (this.#isPatched && this.#context.config.output.mode !== "fs") {
  //     if (!this.#revert) {
  //       throw new Error(
  //         "Attempting to revert File System patch prior to calling `__init__` function"
  //       );
  //     }

  //     this.#revert?.();
  //     this.#isPatched = false;
  //   }
  // }

  async [Symbol.asyncDispose]() {
    return this.dispose();
  }
}
