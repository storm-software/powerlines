/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import type { VirtualFileSystemInterface } from "powerlines";
import type { Storage } from "unstorage";
import {
  createStorage,
  filterKeyByDepth,
  joinKeys,
  normalizeKey
} from "unstorage";

function toVfsPath(key: string): string {
  return normalizeKey(key).replace(/:/g, "/");
}

function relativizeKeys(keys: string[]): string[] {
  if (!keys.length) {
    return [];
  }

  const segments = keys.map(key =>
    toVfsPath(key).replace(/\\/g, "/").split("/").filter(Boolean)
  );
  let prefixLength = 0;
  const firstParts = segments[0];

  if (!firstParts) {
    return [];
  }

  while (
    segments.every(
      parts =>
        parts[prefixLength] && parts[prefixLength] === firstParts[prefixLength]
    )
  ) {
    prefixLength++;
  }

  return segments
    .map(parts => parts.slice(prefixLength).join("/"))
    .filter(Boolean);
}

function matchesBase(key: string, base: string): boolean {
  if (!base) {
    return true;
  }

  return key === base || key.startsWith(`${base}/`);
}

export function createStorageAdapter(vfs: VirtualFileSystemInterface): Storage {
  return createStorage({
    driver: {
      name: "powerlines-vfs",
      flags: {
        maxDepth: true
      },
      async hasItem(key) {
        const path = toVfsPath(key);

        return (await vfs.exists(path)) && (await vfs.isFile(path));
      },
      async getItem(key) {
        return (await vfs.read(toVfsPath(key))) ?? null;
      },
      async getItemRaw(key) {
        return (await vfs.readBuffer(toVfsPath(key))) ?? null;
      },
      async setItem(key, value) {
        await vfs.write(toVfsPath(key), value);
      },
      async setItemRaw(key, value) {
        await vfs.write(toVfsPath(key), value);
      },
      async removeItem(key) {
        await vfs.remove(toVfsPath(key));
      },
      async getMeta(key) {
        const metadata = vfs.getMetadata(toVfsPath(key));

        if (!metadata) {
          return null;
        }

        const mtime = new Date(metadata.timestamp);

        return {
          atime: mtime,
          mtime
        };
      },
      async getKeys(base, opts) {
        const normalizedBase = toVfsPath(base);
        const pattern = normalizedBase ? joinKeys(normalizedBase, "**") : "**";
        const keys = new Set<string>();

        for (const path of await vfs.glob(pattern)) {
          const normalized = toVfsPath(path);

          if (
            matchesBase(normalized, normalizedBase) &&
            (await vfs.isFile(normalized))
          ) {
            keys.add(normalized);
          }
        }

        for (const path of Object.keys(vfs.ids)) {
          const normalized = toVfsPath(path);

          if (matchesBase(normalized, normalizedBase)) {
            keys.add(normalized);
          }
        }

        return relativizeKeys([...keys]).filter(key =>
          filterKeyByDepth(normalizeKey(key), opts?.maxDepth)
        );
      },
      async clear(base) {
        const keys = await this.getKeys(base, {});

        await Promise.all(
          keys.map(async key => {
            await vfs.remove(toVfsPath(key));
          })
        );
      }
    }
  });
}
