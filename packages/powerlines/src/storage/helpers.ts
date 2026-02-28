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

import { isError } from "@stryke/type-checks/is-error";

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
