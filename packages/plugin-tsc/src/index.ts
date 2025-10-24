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

import { Plugin } from "powerlines/types/plugin";
import ts from "typescript";
import {
  TypeScriptCompilerPluginContext,
  TypeScriptCompilerPluginOptions,
  TypeScriptCompilerPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * TypeScript Compiler plugin for Powerlines.
 *
 * @param options - The TypeScript Compiler plugin user configuration options.
 * @returns A Powerlines plugin that integrates TypeScript Compiler transformations.
 */
export const plugin = <
  TContext extends
    TypeScriptCompilerPluginContext = TypeScriptCompilerPluginContext
>(
  options: TypeScriptCompilerPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "tsc",
    config() {
      return {
        transform: {
          tsc: options ?? {}
        }
      } as Partial<TypeScriptCompilerPluginUserConfig>;
    },
    async transform(code: string, id: string) {
      const result = ts.transpileModule(code, {
        ...this.config.transform.tsc,
        compilerOptions: {
          ...this.tsconfig.options,
          ...this.config.transform.tsc.compilerOptions
        },
        fileName: id
      });
      if (
        result.diagnostics &&
        result.diagnostics.length > 0 &&
        result.diagnostics?.some(
          diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
        )
      ) {
        throw new Error(
          `TypeScript Compiler - TypeScript transpilation errors in file: ${id}\n${ts.formatDiagnostics(
            result.diagnostics,
            {
              getCanonicalFileName: fileName =>
                ts.sys.useCaseSensitiveFileNames
                  ? fileName
                  : fileName.toLowerCase(),
              getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
              getNewLine: () => ts.sys.newLine
            }
          )}`
        );
      }

      if (!result.outputText) {
        throw new Error(
          `TypeScript Compiler - No output generated for file during TypeScript transpilation: ${id}`
        );
      }

      return { code: result.outputText, id };
    }
  } as Plugin<TContext>;
};

export default plugin;
