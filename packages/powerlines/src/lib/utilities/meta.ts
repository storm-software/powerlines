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
import { existsSync } from "@stryke/fs/exists";
import { readJsonFile } from "@stryke/fs/json";
import { listFiles } from "@stryke/fs/list-files";
import { removeFile } from "@stryke/fs/remove-file";
import { hashDirectory } from "@stryke/hash/hash-files";
import { getUnique } from "@stryke/helpers/get-unique";
import { hasFileExtension } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { Context, MetaInfo } from "../../types/context";
import { __VFS_VIRTUAL__ } from "../../types/vfs";

export interface CreateContextOptions {
  name?: string;
}

export const PROJECT_ROOT_HASH_LENGTH = 45;
export const CACHE_HASH_LENGTH = 62;

/**
 * Generates a prefixed project root hash object.
 *
 * @remarks
 * This function returns a string where the project root hash is prefixed with the project name plus a hyphen. If the total length of this string combination exceeds 45 characters, it will truncate the hash.
 *
 * @param name - The name of the project.
 * @param projectRootHash - The hash of the project root.
 * @returns An object containing the name and project root hash.
 */
export function getPrefixedProjectRootHash(
  name: string,
  projectRootHash: string
): string {
  const combined = `${kebabCase(name)}_${projectRootHash}`;

  return combined.length > PROJECT_ROOT_HASH_LENGTH
    ? combined.slice(0, PROJECT_ROOT_HASH_LENGTH)
    : combined;
}

async function discoverTemplatePath(path: string): Promise<string[]> {
  return (
    await Promise.all([
      Promise.resolve(/.tsx?$/.test(path) && !path.includes("*") && path),
      Promise.resolve(!hasFileExtension(path) && joinPaths(path, ".ts")),
      Promise.resolve(!hasFileExtension(path) && joinPaths(path, ".tsx")),
      Promise.resolve(
        !hasFileExtension(path) && listFiles(joinPaths(path, "**/*.ts"))
      ),
      Promise.resolve(
        !hasFileExtension(path) && listFiles(joinPaths(path, "**/*.tsx"))
      )
    ])
  )
    .flat()
    .filter(Boolean) as string[];
}

export async function discoverTemplates(
  context: Context,
  paths: string[] = []
): Promise<string[]> {
  return getUnique(
    (
      await Promise.all([
        ...paths.map(discoverTemplatePath),
        discoverTemplatePath(joinPaths(context.config.sourceRoot, "plugin")),
        discoverTemplatePath(joinPaths(context.envPaths.config, "templates")),
        discoverTemplatePath(joinPaths(context.config.projectRoot, "templates"))
      ])
    )
      .flat()
      .reduce((ret, path) => {
        if (existsSync(path)) {
          ret.push(path);
        }

        return ret;
      }, [] as string[])
  );
}

export async function getChecksum(path: string): Promise<string> {
  return hashDirectory(path, {
    ignore: ["node_modules", ".git", ".nx", ".cache", ".storm", "tmp", "dist"]
  });
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
      context.log(
        LogLevelLabel.WARN,
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

  context.log(
    LogLevelLabel.DEBUG,
    `Writing runtime metadata to ${metaFilePath}`
  );

  await context.fs.writeFileToDisk(
    metaFilePath,
    JSON.stringify(
      {
        ...context.meta,
        builtinIdMap: Object.fromEntries(context.fs.builtinIdMap.entries()),
        virtualFiles: context.fs[__VFS_VIRTUAL__].toJSON(context.artifactsPath)
      },
      null,
      2
    )
  );
}
