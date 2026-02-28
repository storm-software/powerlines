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
} from "@powerlines/deepkit/vendor/type-compiler";
import { ReflectionConfig } from "@powerlines/deepkit/vendor/type-compiler/config";
import defu from "defu";
import { Context } from "powerlines";
import ts from "typescript";

let loaded = false;
const cache = new Cache();

/**
 * Creates a Deepkit TypeScript transformer.
 *
 * @param context - The Powerlines plugin context.
 * @param options - The transformation options.
 * @returns A Deepkit TypeScript custom transformer factory.
 */
export function createTransformer(
  context: Context,
  options: Partial<ReflectionConfig> = {}
): ts.CustomTransformerFactory {
  return function transformer(ctx: ts.TransformationContext) {
    if (!loaded) {
      loaded = true;
    }

    cache.tick();
    return new ReflectionTransformer(ctx, cache).withReflection(
      defu(
        options,
        {
          reflection:
            context.tsconfig.tsconfigJson.compilerOptions?.reflection ||
            context.tsconfig.tsconfigJson.reflection,
          reflectionLevel:
            context.tsconfig.tsconfigJson.compilerOptions?.reflectionLevel ||
            context.tsconfig.tsconfigJson.reflectionLevel
        },
        {
          exclude: [],
          reflection: "default",
          reflectionLevel: "minimal"
        }
      ) as ReflectionConfig
    );
  };
}

/**
 * Creates a Deepkit TypeScript declaration transformer.
 *
 * @param context - The Powerlines plugin context.
 * @param options - The transformation options.
 * @returns A Deepkit TypeScript custom declaration transformer factory.
 */
export function createDeclarationTransformer(
  context: Context,
  options: Partial<ReflectionConfig> = {}
): ts.CustomTransformerFactory {
  return function declarationTransformer(ctx: ts.TransformationContext) {
    return new DeclarationTransformer(ctx, cache).withReflection(
      defu(
        options,
        {
          reflection:
            context.tsconfig.tsconfigJson.compilerOptions?.reflection ||
            context.tsconfig.tsconfigJson.reflection,
          reflectionLevel:
            context.tsconfig.tsconfigJson.compilerOptions?.reflectionLevel ||
            context.tsconfig.tsconfigJson.reflectionLevel
        },
        {
          exclude: [],
          reflection: "default",
          reflectionLevel: "minimal"
        }
      ) as ReflectionConfig
    );
  };
}
