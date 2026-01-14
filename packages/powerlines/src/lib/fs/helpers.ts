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

import { toArray } from "@stryke/convert/to-array";
import { getUnique } from "@stryke/helpers/get-unique";
import { correctPath } from "@stryke/path/correct-path";
import { isAbsolutePath } from "@stryke/path/is-type";
import { joinPaths } from "@stryke/path/join";
import { replaceExtension } from "@stryke/path/replace";
import { slash } from "@stryke/path/slash";
import { isError } from "@stryke/type-checks/is-error";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { AssetGlob } from "@stryke/types/file";
import { PathOrFileDescriptor } from "node:fs";

/**
 * Checks if an error is a file system error.
 *
 * @param err - The error to check.
 * @returns `true` if the error is a file system error, otherwise `false`.
 */
export function isFileError(err: any) {
  return isError(err) && "code" in err && err.code;
}

/**
 * Ignores file not found errors.
 *
 * @param err - The error to check.
 * @returns `null` if the error is a file not found error, otherwise returns the error.
 */
export function ignoreNotfound(err: any) {
  return (
    isFileError(err) &&
    (err.code === "ENOENT" || err.code === "EISDIR" ? null : err)
  );
}

/**
 * Ignores file exists errors.
 *
 * @param err - The error to check.
 * @returns `null` if the error is a file exists error, otherwise returns the error.
 */
export function ignoreExists(err: any) {
  return isFileError(err) && err.code === "EEXIST" ? null : err;
}

export function toFilePath(path: PathOrFileDescriptor): string {
  return correctPath(slash(path?.toString() || ".").replace(/^file:\/\//, ""));
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
 * Formats a file id by removing the file extension and prepended runtime prefix.
 *
 * @param id - The file ID to format.
 * @param prefix - The prefix to use for built-in files. Default is "powerlines".
 * @returns The formatted file ID.
 */
export function normalizeId(id: string, prefix = "powerlines"): string {
  // return `${prefix.replace(/:$/, "")}:${toFilePath(id)
  //   .replace(new RegExp(`^${prefix.replace(/:$/, "")}:`), "")
  //   .replace(/^\\0/, "")
  //   .replace(findFileDotExtensionSafe(toFilePath(id)), "")}`;

  return replaceExtension(toFilePath(id))
    .replace(/^\\0/, "")
    .replace(/^powerlines:/, "")
    .replace(new RegExp(`^${prefix.replace(/:$/, "")}:`), "");
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
  return isAbsolutePath(path)
    ? path
    : isValidId(toFilePath(path), prefix)
      ? normalizeId(toFilePath(path), prefix).replace(
          new RegExp(`^${prefix.replace(/:$/, "")}:`),
          builtinsPath
        )
      : toFilePath(path);
}

/**
 * Normalizes a storage key by replacing all path separators with the specified separator.
 *
 * @param key - The storage key to normalize.
 * @param sep - The separator to use for normalization. Default is ":".
 * @returns The normalized storage key.
 */
export function normalizeKey(
  key: string | undefined,
  sep: ":" | "/" = ":"
): string {
  if (!key) {
    return "";
  }
  return key.replace(/[:/\\]/g, sep).replace(/^[:/\\]|[:/\\]$/g, "");
}

/**
 * Normalizes the base key for storage operations.
 *
 * @param base - The base key to normalize.
 * @returns The normalized base key with a trailing colon if not empty.
 */
export function normalizeBaseKey(base?: string) {
  base = normalizeKey(base);
  return base ? `${base}:` : "";
}

/**
 * Filters a storage key based on the specified base path.
 *
 * @param key - The storage key to filter.
 * @param base - The base path to filter by.
 * @returns `true` if the key matches the base path criteria, otherwise `false`.
 */
export function filterKeyByBase(
  key: string,
  base: string | undefined
): boolean {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }

  return key[key.length - 1] !== "$";
}

/**
 * Normalizes glob patterns by resolving them against the workspace root.
 *
 * @param workspaceRoot - The root directory of the workspace.
 * @param patterns - The glob patterns to normalize.
 * @returns An array of normalized glob patterns.
 */
export function normalizeGlobPatterns(
  workspaceRoot: string,
  patterns:
    | string
    | Omit<AssetGlob, "output">
    | (string | Omit<AssetGlob, "output">)[]
): string[] {
  return getUnique(
    toArray(patterns)
      .map(pattern => {
        if (
          isSetObject(pattern) &&
          (isSetString(pattern.input) || isSetString(pattern.glob))
        ) {
          return joinPaths(
            pattern.input || workspaceRoot,
            pattern.glob || "**/*"
          );
        } else if (!isSetString(pattern)) {
          return undefined;
        }

        return pattern;
      })
      .filter(isSetString)
  );
}
