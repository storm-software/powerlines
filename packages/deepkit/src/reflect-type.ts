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
import defu from "defu";
import { resolve } from "powerlines/lib/utilities/resolve";
import { ESBuildResolvedBuildConfig } from "powerlines/types/build";
import type { Context } from "powerlines/types/context";
import { esbuildPlugin } from "./esbuild-plugin";

/**
 * Compiles a type definition to a module.
 *
 * @param context - The context object containing the environment paths.
 * @param type - The type definition to compile.
 * @param overrides - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the compiled module.
 */
export async function reflectType(
  context: Context,
  type: TypeDefinition,
  overrides: Partial<ESBuildResolvedBuildConfig> = {}
): Promise<Type> {
  return reflect(
    await resolve(
      context,
      type,
      defu(overrides, {
        plugins: [esbuildPlugin(context)]
      })
    )
  );
}
