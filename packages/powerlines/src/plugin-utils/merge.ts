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

import { createDefu } from "defu";
import { PartialPlugin } from "../types/config";
import { PluginContext } from "../types/context";
import { Plugin } from "../types/plugin";
import { getHookHandler, isPluginHook } from "./helpers";

export type MergeResult<
  TContext extends PluginContext,
  TPluginA extends Plugin<TContext> | PartialPlugin<TContext>,
  TPluginB extends Plugin<TContext> | PartialPlugin<TContext>
> =
  TPluginA extends Plugin<TContext>
    ? Plugin<TContext>
    : TPluginB extends Plugin<TContext>
      ? Plugin<TContext>
      : PartialPlugin<TContext>;

const mergePlugin = createDefu((obj, key, value) => {
  if (isPluginHook(obj[key]) && isPluginHook(value)) {
    obj[key] = {
      ...obj[key],
      ...value,
      handler: async (...params: any[]) => {
        const [resultA, resultB] = await Promise.all([
          getHookHandler(obj[key])(...params),
          getHookHandler(value)(...params)
        ]);

        return resultB && resultA
          ? [...resultA, ...resultB]
          : resultA || resultB;
      }
    };
    return true;
  }
});

/**
 * Merges two {@link Plugin | plugins} or {@link PartialPlugin | partial plugins} together.
 *
 * @param pluginA - The first {@link Plugin | plugin} or {@link PartialPlugin | partial plugin} to merge.
 * @param pluginB - The second {@link Plugin | plugin} or {@link PartialPlugin | partial plugin} to merge.
 * @returns The merged {@link Plugin | plugin} or {@link PartialPlugin | partial plugin}.
 */
export function merge<TContext extends PluginContext = PluginContext>(
  pluginA: Plugin<TContext> | PartialPlugin<TContext>,
  pluginB: Plugin<TContext> | PartialPlugin<TContext>
): MergeResult<TContext, typeof pluginA, typeof pluginB> {
  return mergePlugin(pluginA, pluginB) as MergeResult<
    TContext,
    typeof pluginA,
    typeof pluginB
  >;
}
