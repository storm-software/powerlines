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

import type { PluginContext } from "@powerlines/core";
import { omit } from "@stryke/helpers/omit";
import { isString } from "@stryke/type-checks";
import type { OnLoadOptions, Plugin } from "esbuild";
import { DiagnosticCategory } from "typescript";
import { transpile } from "./transpile";
import type { Level, Mode } from "./vendor/type-compiler/config";

export interface ReflectionConfig {
  /**
   * Allows to exclude type definitions/TS files from being included in the type compilation step. When a global .d.ts is matched, their types won't be embedded (useful to exclude DOM for example)
   */
  exclude?: string[];

  /**
   * Either a boolean indication general reflection mode, or a list of globs to match against.
   *
   * @remarks
   * - `default`: The default reflection mode, which includes a standard set of type information in the output.
   * - `true`: An alias for "default", enabling the default reflection mode.
   * - `false`: Disables reflection, resulting in no type information being included in the output.
   * - `string[]`: A list of glob patterns to match against files for which reflection should be applied. Only files matching these patterns will have type information included in the output.
   *
   * @defaultValue "default"
   */
  reflection?: string[] | Mode;

  /**
   * Defines the level of reflection to be used during the transpilation process.
   *
   * @remarks
   * - `minimal`: Only essential type information is included in the reflection output, resulting in a smaller output size but less detailed type metadata.
   * - `normal`: A balanced level of type information is included, providing a good trade-off between output size and type metadata detail.
   * - `extended`: More comprehensive type information is included, which may increase the output size but provides richer type metadata for advanced use cases.
   * - `verbose`: Detailed type information is included, resulting in a larger output size but more comprehensive type metadata.
   *
   * @defaultValue "normal"
   */
  reflectionLevel?: Level;
}

export interface ESBuildPluginOptions extends Partial<ReflectionConfig> {
  onLoad?: Partial<OnLoadOptions>;
}

/**
 * Esbuild plugin for Deepkit Type reflections.
 *
 * @param context - The Powerlines context.
 * @param options - Optional esbuild onLoad options and reflection configuration.
 * @returns An esbuild plugin instance.
 */
export const esbuildPlugin = <TContext extends PluginContext>(
  context: TContext,
  options: ESBuildPluginOptions = {}
): Plugin => {
  return {
    name: "powerlines:deepkit",
    setup(build) {
      build.onLoad(
        {
          filter: /\.(m|c)?tsx?$/,
          ...(options.onLoad ?? {})
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

          const result = transpile(
            context,
            contents,
            args.path,
            omit(options, ["onLoad"])
          );
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
