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

import {
  Cache,
  DeclarationTransformer,
  ReflectionTransformer
} from "powerlines/deepkit/type-compiler";
import { Plugin } from "powerlines/types/plugin";
import ts from "typescript";
import {
  DeepkitPluginContext,
  DeepkitPluginOptions,
  DeepkitPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * Deepkit plugin for Powerlines.
 *
 * @param options - The Deepkit plugin user configuration options.
 * @returns A Powerlines plugin that integrates Deepkit transformations.
 */
export const plugin = <
  TContext extends DeepkitPluginContext = DeepkitPluginContext
>(
  options: DeepkitPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "deepkit",
    config() {
      return {
        transform: {
          deepkit: options ?? {}
        }
      } as Partial<DeepkitPluginUserConfig>;
    },
    configResolved: {
      order: "pre",
      handler() {
        this.config.transform.deepkit = {
          exclude: this.config.transform.deepkit.exclude ?? [],
          reflection:
            this.config.transform.deepkit.reflection ||
            this.tsconfig.tsconfigJson.compilerOptions?.reflection ||
            this.tsconfig.tsconfigJson.reflection ||
            "default",
          reflectionLevel:
            this.config.transform.deepkit.reflectionLevel ||
            this.tsconfig.tsconfigJson.compilerOptions?.reflectionLevel ||
            this.tsconfig.tsconfigJson.reflectionLevel ||
            "minimal"
        };

        this.deepkit ??= {} as TContext["deepkit"];
        this.deepkit.cache ??= new Cache();

        this.deepkit.transformer ??= (ctx: ts.TransformationContext) => {
          this.deepkit.cache.tick();
          return new ReflectionTransformer(
            ctx,
            this.deepkit.cache
          ).withReflection(this.config.transform.deepkit);
        };

        this.deepkit.declarationTransformer ??= (
          ctx: ts.TransformationContext
        ) => {
          return new DeclarationTransformer(
            ctx,
            this.deepkit.cache
          ).withReflection(this.config.transform.deepkit);
        };
      }
    },
    async transform(code: string, id: string) {
      const result = ts.transpileModule(code, {
        compilerOptions: {
          ...this.tsconfig.options,
          ...this.config.transform.deepkit
        },
        fileName: id,
        transformers: {
          before: [this.deepkit.transformer],
          after: [this.deepkit.declarationTransformer]
        }
      });
      if (
        result.diagnostics &&
        result.diagnostics.length > 0 &&
        result.diagnostics?.some(
          diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
        )
      ) {
        throw new Error(
          `Deepkit - TypeScript transpilation errors in file: ${id}\n${ts.formatDiagnostics(
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
          `Deepkit - No output generated for file during TypeScript transpilation: ${id}`
        );
      }

      return { code: result.outputText, id };
    }
  } as Plugin<TContext>;
};

export default plugin;
