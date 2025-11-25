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

import { Context } from "powerlines/types/context";
import { flattenDiagnosticMessageText } from "typescript";

/**
 * Perform type checks on the provided sources using TypeScript's compiler API.
 *
 * @param context - The build context containing information about the current build.
 */
export async function typeCheck(context: Context): Promise<void> {
  const result = context.program.emitToMemory();

  const diagnosticMessages: string[] = [];
  result.getDiagnostics().forEach(diagnostic => {
    if (diagnostic.getSourceFile()?.getBaseName()) {
      diagnosticMessages.push(
        `${diagnostic.getSourceFile()?.getBaseName()} (${
          (diagnostic.getLineNumber() ?? 0) + 1
        }): ${flattenDiagnosticMessageText(
          diagnostic.getMessageText().toString(),
          "\n"
        )}`
      );
    } else {
      diagnosticMessages.push(
        flattenDiagnosticMessageText(
          diagnostic.getMessageText().toString(),
          "\n"
        )
      );
    }
  });

  const diagnosticMessage = diagnosticMessages.join("\n");
  if (diagnosticMessage) {
    throw new Error(
      `TypeScript compilation failed: \n\n${
        diagnosticMessage.length > 5000
          ? `${diagnosticMessage.slice(0, 5000)}...`
          : diagnosticMessage
      }`
    );
  }
}
