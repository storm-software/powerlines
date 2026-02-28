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

import { findFileExtension } from "@stryke/path";
import { isString } from "@stryke/type-checks";
import { Context } from "powerlines";
import { HookFilter, LoadResult, Plugin, PluginContext } from "rolldown";
import { DiagnosticCategory } from "typescript";
import { transpile } from "./transpile";

/**
 * Rolldown plugin for Deepkit Type reflections.
 *
 * @param context - The Powerlines context.
 * @param filter - Optional filter to limit which files are processed.
 * @returns A Rolldown plugin instance.
 */
export const rolldownPlugin = (
  context: Context,
  filter: Partial<Pick<HookFilter, "id">> = {}
): Plugin => {
  return {
    name: "powerlines:deepkit",
    load: {
      filter: { id: /\.(m|c)?tsx?$/, ...filter },
      async handler(this: PluginContext, id: string): Promise<LoadResult> {
        const path = await context.resolve(id);
        if (!path?.id) {
          return null;
        }

        const contents = await context.fs.read(path.id);
        if (!contents) {
          return null;
        }

        const result = transpile(context, contents, path.id);
        if (result.diagnostics && result.diagnostics.length > 0) {
          if (
            result.diagnostics.some(
              d => d.category === DiagnosticCategory.Error
            )
          ) {
            const errorMessage = `Deepkit Type reflection transpilation errors: ${
              id
            } \n ${result.diagnostics
              .filter(d => d.category === DiagnosticCategory.Error)
              .map(
                d =>
                  `-${d.file ? `${d.file.fileName}:` : ""} ${
                    isString(d.messageText)
                      ? d.messageText
                      : d.messageText.messageText
                  } (at ${d.start}:${d.length})`
              )
              .join("\n")}`;

            context.error(errorMessage);
            throw new Error(errorMessage);
          } else if (
            result.diagnostics.some(
              d => d.category === DiagnosticCategory.Warning
            )
          ) {
            context.warn(
              `Deepkit Type reflection transpilation warnings: ${
                id
              } \n ${result.diagnostics
                .filter(d => d.category === DiagnosticCategory.Warning)
                .map(
                  d =>
                    `-${d.file ? `${d.file.fileName}:` : ""} ${
                      isString(d.messageText)
                        ? d.messageText
                        : d.messageText.messageText
                    } (at ${d.start}:${d.length})`
                )
                .join("\n")}`
            );
          } else {
            context.debug(
              `Deepkit Type reflection transpilation diagnostics: ${
                id
              } \n ${result.diagnostics
                .map(
                  d =>
                    `-${d.file ? `${d.file.fileName}:` : ""} ${
                      isString(d.messageText)
                        ? d.messageText
                        : d.messageText.messageText
                    } (at ${d.start}:${d.length})`
                )
                .join("\n")}`
            );
          }
        }

        return {
          code: result.outputText,
          moduleType: findFileExtension(path.id)
        };
      }
    }
  };
};
