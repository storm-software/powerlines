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

import { isSetString } from "@stryke/type-checks/is-set-string";
import { defu } from "defu";
import { UnpluginBuildContext } from "unplugin";
import { UnresolvedContext } from "../../types/context";
import {
  UNPLUGIN_BUILDER_VARIANTS,
  UnpluginBuilderVariant
} from "../../types/unplugin";

/**
 * Merges a base plugin context with an unplugin context, combining their properties.
 *
 * @param contextA - The base plugin context to merge into.
 * @param contextB - The unplugin context to merge from.
 * @returns The merged context.
 */
export function combineContexts<
  TContextA extends UnresolvedContext | UnpluginBuildContext,
  TContextB extends UnresolvedContext | UnpluginBuildContext
>(contextA: TContextA, contextB: TContextB): TContextA & TContextB {
  return defu(contextA, contextB) as TContextA & TContextB;
}

/**
 * Checks if a value is a valid UnpluginBuilderVariant.
 *
 * @param str - The value to check.
 * @returns True if the value is a UnpluginBuilderVariant, false otherwise.
 */
export function isUnpluginBuilderVariant(
  str: unknown
): str is UnpluginBuilderVariant {
  return (
    isSetString(str) &&
    UNPLUGIN_BUILDER_VARIANTS.includes(str as UnpluginBuilderVariant)
  );
}
