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
import { isString } from "@stryke/type-checks/is-string";
import defu, { createDefu } from "defu";
import { PartialPlugin, ResolvedConfig } from "../types/config";
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
          // eslint-disable-next-line ts/no-unsafe-call
          (getHookHandler(obj[key]) as any)(...params),
          // eslint-disable-next-line ts/no-unsafe-call
          (getHookHandler(value) as any)(...params)
        ]);

        return resultB && resultA ? defu(resultA, resultB) : resultA || resultB;
      }
    };
    return true;
  }

  return false;
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

/**
 * Merges two configuration objects together, with special handling for string values.
 * If the value from the second object is a non-empty string, it will overwrite the value from the first object.
 *
 * @example
 * ```ts
 * const configA = { name: "Default", version: "1.0.0" };
 * const configB = { name: "Custom", description: "A custom config" };
 * const mergedConfig = mergeConfig(configA, configB);
 * // Result: { name: "Custom", version: "1.0.0", description: "A custom config" }
 * ```
 *
 * @param objA - The first configuration object.
 * @param objB - The second configuration object.
 * @returns The merged configuration object.
 */
export const mergeConfig = createDefu((obj, key, value) => {
  if (isString(obj[key]) && isString(value)) {
    if (isSetString(value)) {
      obj[key] = value;
    }

    return true;
  }

  return false;
}) as (...configs: unknown[]) => ResolvedConfig;
