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

import type { Type } from "@powerlines/deepkit/vendor/type";
import { reflect } from "@powerlines/deepkit/vendor/type";
import type { TypeDefinition } from "@stryke/types/configuration";
import { bundle } from "powerlines/lib/bundle";
import { ESBuildResolvedBuildConfig } from "powerlines/types/build";
import type { Context } from "powerlines/types/context";

/**
 * Compiles a type definition to a module.
 *
 * @param context - The context object containing the environment paths.
 * @param entry - The type definition to compile.
 * @param overrides - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the compiled module.
 */
export async function resolveType<TResult = any>(
  context: Context,
  entry: TypeDefinition,
  overrides: Partial<ESBuildResolvedBuildConfig> = {}
): Promise<TResult> {
  const result = await bundle(context, entry.file, overrides);

  const resolved = (await context.resolver.evalModule(result.text, {
    filename: result.path,
    forceTranspile: true
  })) as Record<string, any>;

  let exportName = entry.name;
  if (!exportName) {
    exportName = "default";
  }

  return resolved[exportName] ?? resolved[`__Ω${exportName}`];
}

/**
 * Compiles a type definition to a module.
 *
 * @param context - The context object containing the environment paths.
 * @param entry - The type definition to compile.
 * @param overrides - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the compiled module.
 */
export async function reflectType(
  context: Context,
  entry: TypeDefinition,
  overrides?: Partial<ESBuildResolvedBuildConfig>
): Promise<Type> {
  return reflect(await resolveType(context, entry, overrides));
}
