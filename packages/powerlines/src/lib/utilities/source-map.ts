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

import Diff from "diff-match-patch";
import type MagicString from "magic-string";
import type { CompilerResult } from "../../types/compiler";

const dmp = new Diff();

/**
 * Generate code with source map.
 *
 * @param code - The source code.
 * @param id - The file name.
 * @param transpiled - The transpiled code.
 * @returns The compiler result.
 */
export function generateSourceMap(
  code: MagicString,
  id: string,
  transpiled?: string
): CompilerResult {
  if (!transpiled) {
    return;
  }

  const diff = dmp.diff_main(code.toString(), transpiled);
  dmp.diff_cleanupSemantic(diff);

  let offset = 0;

  for (let index = 0; index < diff.length; index++) {
    if (diff[index]) {
      const [type, text] = diff[index]!;
      const textLength = text.length;

      switch (type) {
        case 0: {
          offset += textLength;
          break;
        }
        case 1: {
          code.prependLeft(offset, text);
          break;
        }
        case -1: {
          const next = diff.at(index + 1);

          if (next && next[0] === 1) {
            const replaceText = next[1];

            const firstNonWhitespaceIndexOfText = text.search(/\S/);
            const offsetStart =
              offset + Math.max(firstNonWhitespaceIndexOfText, 0);

            code.update(offsetStart, offset + textLength, replaceText);
            index += 1;
          } else {
            code.remove(offset, offset + textLength);
          }

          offset += textLength;

          break;
        }
      }
    }
  }

  if (!code.hasChanged()) {
    return;
  }

  return {
    code: code.toString(),
    map: code.generateMap({
      source: id,
      file: `${id}.map`,
      includeContent: true
    })
  };
}
