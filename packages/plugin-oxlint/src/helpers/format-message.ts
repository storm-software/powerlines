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

import { relative } from "@stryke/path/find";
import { correctPath } from "@stryke/path/normalize";

export enum MessageSeverity {
  Warning = 1,
  Error = 2
}

export interface LintMessage {
  ruleId: string | null;
  severity: MessageSeverity;
  message: string;
  line: number;
  column: number;
}

export function formatMessage(
  dir: string,
  messages: LintMessage[],
  filePath: string
): string {
  let fileName = correctPath(relative(dir, filePath));
  if (!fileName.startsWith(".")) {
    fileName = `./${fileName}`;
  }

  let output = `\n${fileName}`;

  for (let i = 0; i < messages.length; i++) {
    const { message, severity, line, column, ruleId } = messages[i]!;

    output += "\n";

    if (line && column) {
      output = `${output + line.toString()}:${column.toString()}  `;
    }

    if (severity === MessageSeverity.Warning) {
      output += `Warning: `;
    } else {
      output += `Error: `;
    }

    output += message;

    if (ruleId) {
      output += `  ${ruleId}`;
    }
  }

  return output;
}
