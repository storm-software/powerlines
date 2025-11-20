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

import { defu } from "defu";
import { UnpluginBuildContext, UnpluginContext } from "unplugin";
import { PluginContext } from "../../types/context";

/**
 * Merges a base plugin context with an unplugin context, combining their properties.
 *
 * @param context - The base plugin context to merge into.
 * @param unplugin - The unplugin context to merge from.
 * @returns The merged context.
 */
export function combineContexts<TContext extends PluginContext = PluginContext>(
  context: TContext,
  unplugin: UnpluginBuildContext & UnpluginContext
) {
  return defu(context, unplugin);
}
