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

import { isString } from "@stryke/type-checks";
import type { OnLoadOptions, Plugin } from "esbuild";
import { Context } from "powerlines/types/context";
import { DiagnosticCategory } from "typescript";
import { transpile } from "./transpile";

/**
 * Esbuild plugin for Deepkit Type reflections.
 *
 * @param context - The Powerlines context.
 * @param options - Optional esbuild onLoad options.
 * @returns An esbuild plugin instance.
 */
export const esbuildPlugin = (
  context: Context,
  options: Partial<OnLoadOptions> = {}
): Plugin => {
  return {
    name: "powerlines:deepkit",
    setup(build) {
      build.onLoad(
        {
          filter: /\.(m|c)?tsx?$/,
          ...options
        },
        async args => {
          const contents = await context.fs.read(args.path);
          if (!contents) {
            return null;
          }

          // If already reflected do nothing
          if (args.pluginData?.isReflected) {
            return {
              contents,
              loader: "ts",
              pluginData: { isReflected: true }
            };
          }

          const result = transpile(context, contents, args.path);
          if (result.diagnostics && result.diagnostics.length > 0) {
            if (
              result.diagnostics.some(
                d => d.category === DiagnosticCategory.Error
              )
            ) {
              const errorMessage = `Deepkit Type reflection transpilation errors: ${
                args.path
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
                  args.path
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
                  args.path
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
            contents: result.outputText,
            loader: "ts",
            pluginData: { isReflected: true }
          };
        }
      );
    }
  };
};
