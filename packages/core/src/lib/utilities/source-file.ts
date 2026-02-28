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

import { readFileIfExistingSync } from "@stryke/fs/read-file";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isString } from "@stryke/type-checks/is-string";
import MagicString from "magic-string";
import { TransformResult } from "unplugin";
import { SourceFile } from "../../types/context";

/**
 * Get the string from the source.
 *
 * @param code - The source string or magic string.
 * @returns The source string.
 */
export function getString(
  code: string | MagicString | TransformResult
): string {
  if (!code) {
    return "";
  }

  if (isString(code)) {
    return code;
  }

  if (isSetObject(code) && "code" in code) {
    return code.code;
  }

  return code.toString();
}

/**
 * Get the magic string.
 *
 * @param code - The source string or magic string.
 * @returns The magic string.
 */
export function getMagicString(code: string | MagicString): MagicString {
  if (isString(code)) {
    return new MagicString(code);
  }

  return code;
}

/**
 * Get the source file.
 *
 * @param code - The source code.
 * @param id - The name of the file.
 * @returns The source file.
 */
export function getSourceFile(
  code: string | MagicString,
  id: string
): SourceFile {
  const content = code ?? readFileIfExistingSync(id);

  return {
    id,
    code: getMagicString(content),
    env: []
  };
}
