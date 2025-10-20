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

import type { CompilerOptions, TsConfigJson } from "@stryke/types/tsconfig";
import type ts from "typescript";

export type ReflectionMode = "default" | "explicit" | "never";
export type RawReflectionMode =
  | ReflectionMode
  | ""
  | boolean
  | string
  | string[]
  | undefined;

/**
 * Defines the level of reflection to be used during the transpilation process.
 *
 * @remarks
 * The level determines how much extra data is captured in the byte code for each type. This can be one of the following values:
 * - `minimal` - Only the essential type information is captured.
 * - `normal` - Additional type information is captured, including some contextual data.
 * - `verbose` - All available type information is captured, including detailed contextual data.
 */
export type ReflectionLevel = "minimal" | "normal" | "verbose";

export interface DeepkitOptions {
  /**
   * Either true to activate reflection for all files compiled using this tsconfig,
   * or a list of globs/file paths relative to this tsconfig.json.
   * Globs/file paths can be prefixed with a ! to exclude them.
   */
  reflection?: RawReflectionMode;

  /**
   * Defines the level of reflection to be used during the transpilation process.
   *
   * @remarks
   * The level determines how much extra data is captured in the byte code for each type. This can be one of the following values:
   * - `minimal` - Only the essential type information is captured.
   * - `normal` - Additional type information is captured, including some contextual data.
   * - `verbose` - All available type information is captured, including detailed contextual data.
   */
  reflectionLevel?: ReflectionLevel;
}

export type TSCompilerOptions = CompilerOptions & DeepkitOptions;

/**
 * The TypeScript compiler configuration.
 *
 * @see https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
 */
export interface TSConfig extends Omit<TsConfigJson, "reflection"> {
  /**
   * Either true to activate reflection for all files compiled using this tsconfig,
   * or a list of globs/file paths relative to this tsconfig.json.
   * Globs/file paths can be prefixed with a ! to exclude them.
   */
  reflection?: RawReflectionMode;

  /**
   * Defines the level of reflection to be used during the transpilation process.
   *
   * @remarks
   * The level determines how much extra data is captured in the byte code for each type. This can be one of the following values:
   * - `minimal` - Only the essential type information is captured.
   * - `normal` - Additional type information is captured, including some contextual data.
   * - `verbose` - All available type information is captured, including detailed contextual data.
   */
  reflectionLevel?: ReflectionLevel;

  /**
   * Instructs the TypeScript compiler how to compile `.ts` files.
   */
  compilerOptions?: TSCompilerOptions;
}

export type ParsedTypeScriptConfig = ts.ParsedCommandLine & {
  originalTsconfigJson: TsConfigJson;
  tsconfigJson: TSConfig;
  tsconfigFilePath: string;
};
