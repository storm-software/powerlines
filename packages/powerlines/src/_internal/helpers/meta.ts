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

import { existsSync } from "@stryke/fs/exists";
import { readJsonFile } from "@stryke/fs/json";
import { removeFile } from "@stryke/fs/remove-file";
import { joinPaths } from "@stryke/path/join-paths";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { Context, MetaInfo } from "../../types";
import { ROOT_HASH_LENGTH } from "../../utils";

export interface CreateContextOptions {
  name?: string;
}

/**
 * Generates a prefixed project root hash object.
 *
 * @remarks
 * This function returns a string where the project root hash is prefixed with the project name plus a hyphen. If the total length of this string combination exceeds 45 characters, it will truncate the hash.
 *
 * @param name - The name of the project.
 * @param rootHash - The hash of the project root.
 * @returns An object containing the name and project root hash.
 */
export function getPrefixedRootHash(name: string, rootHash: string): string {
  const combined = `${kebabCase(name)}_${rootHash}`;

  return combined.length > ROOT_HASH_LENGTH
    ? combined.slice(0, ROOT_HASH_LENGTH)
    : combined;
}

/**
 * Retrieves the persisted meta information from the context's data path.
 *
 * @param context - The build context.
 * @returns A promise that resolves to the persisted meta information, or undefined if not found.
 */
export async function getPersistedMeta(
  context: Context
): Promise<MetaInfo | undefined> {
  const metaFilePath = joinPaths(context.dataPath, "meta.json");
  if (existsSync(metaFilePath)) {
    try {
      return await readJsonFile<MetaInfo>(metaFilePath);
    } catch {
      context.warn(
        `Failed to read meta file at ${metaFilePath}. It may be corrupted.`
      );
      await removeFile(metaFilePath);

      context.persistedMeta = undefined;
    }
  }

  return undefined;
}

/**
 * Writes the meta file for the context.
 *
 * @param context - The context to write the meta file for.
 * @returns A promise that resolves when the meta file has been written.
 */
export async function writeMetaFile(context: Context): Promise<void> {
  const metaFilePath = joinPaths(context.dataPath, "meta.json");

  context.debug(`Writing runtime metadata to ${metaFilePath}`);

  await context.fs.write(metaFilePath, JSON.stringify(context.meta, null, 2));
}
