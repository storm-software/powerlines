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

import { camelCase } from "@stryke/string-format/camel-case";

/**
 * Create an Operation Id from a summary string
 *
 * @param summary - The summary string from the specification
 * @returns The generated operation ID
 */
export function createOperationId(summary: string) {
  return camelCase(
    summary
      .replace(/\b(?:a|from|to|the|given|of|an)\b/gi, "")
      .replace("Get list", "list")
  );
}
