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

import type {
  CallHookOptions,
  EnvironmentContext,
  HookListOrders,
  HooksList,
  HooksListItem,
  InferHookParameters,
  InferHookReturnType,
  Plugin,
  PluginContext,
  PluginHookFields,
  ResolvedConfig
} from "@powerlines/core";
import {
  addPluginHook,
  isPluginHook,
  isPluginHookField,
  mergeConfig
} from "@powerlines/core/plugin-utils";
import { colorText } from "@powerlines/core/plugin-utils/logging";
import { getField } from "@stryke/helpers/get-field";
import { isFunction } from "@stryke/type-checks/is-function";
import { isObject } from "@stryke/type-checks/is-object";
import { isSet } from "@stryke/type-checks/is-set";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { ArrayValues } from "@stryke/types/array";
import { AnyFunction } from "@stryke/types/base";
import chalk from "chalk";
import { defu } from "defu";

/**
 * Merges the current hook result with the previous results based on their types.
 *
 * @param currentResult - The current hook result to merge with the previous results.
 * @param previousResults - The previous hook results to merge with the current result.
 * @returns The merged result.
 */
export function mergeResults<
  T extends Record<string | number | symbol, any> | string
>(currentResult: T, previousResults: T[]): T[] {
  if (!previousResults || previousResults.length === 0) {
    return [currentResult];
  }

  if (isSetString(currentResult)) {
    previousResults = [
      `${isSetString(previousResults[0]) ? previousResults[0] || "" : ""}\n${
        isSetString(previousResults[0])
          ? currentResult.replace(previousResults[0], "")
          : currentResult
      }`.trim() as T
    ];
  } else if (isObject(currentResult)) {
    previousResults =
      previousResults.length > 0
        ? [defu(currentResult, previousResults[0])]
        : [currentResult];
  }

  return previousResults;
}

/**
 * Merges multiple hook results together, with special handling for string values and object values.
 *
 * @param currentResult - The current hook result to merge with the previous results.
 * @param previousResults - The previous hook results to merge with the current result.
 * @returns The merged result.
 */
export function mergeConfigs<T>(currentResult: T, previousResults: T): T {
  if (isString(currentResult)) {
    previousResults =
      `${isString(previousResults) ? previousResults || "" : ""}\n${
        currentResult || ""
      }`.trim() as T;
  } else if (isObject(currentResult)) {
    previousResults = mergeConfig(currentResult, previousResults ?? {}) as T;
  }

  return previousResults;
}

/**
 * Calls a hook with the given context, options, and arguments.
 *
 * @param context - The context to use when calling the hook.
 * @param key - The hook to call.
 * @param options - Options for calling the hook.
 * @param args - Arguments to pass to the hook.
 * @returns The return value of the hook.
 */
export async function callHook<
  TResolvedConfig extends ResolvedConfig,
  TKey extends string
>(
  context: EnvironmentContext<TResolvedConfig>,
  key: TKey,
  options: CallHookOptions,
  ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
): Promise<
  InferHookReturnType<PluginContext<TResolvedConfig>, TKey> | undefined
> {
  const hooks = context.selectHooks(key, options);
  if (hooks.length > 0) {
    const logger = context.extendLogger({ category: "hooks" });

    logger.debug(
      `🧩 Calling ${hooks.length} ${chalk.bold.cyanBright(
        `${key}${options?.order ? ` (${options.order})` : ""}`
      )} plugin hook${hooks.length > 1 ? "s" : ""}:\n${hooks
        .map((hook, index) => ` ${index + 1}. ${colorText(hook.plugin.name)}`)
        .join("\n")}`
    );

    const invokeHook = async (
      hook: ArrayValues<typeof hooks>,
      hookArgs: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
    ) => {
      return Reflect.apply(hook.handler as AnyFunction, hook.context, hookArgs);
    };

    let results = [] as InferHookReturnType<
      PluginContext<TResolvedConfig>,
      TKey
    >[];
    if (options?.sequential === false) {
      results = (await Promise.all(
        hooks.map(async hook => {
          if (!isFunction(hook.handler)) {
            throw new Error(
              `Plugin hook handler for hook "${key}" is not a function.`
            );
          }

          return invokeHook(hook, [...args]);
        })
      )) as InferHookReturnType<PluginContext<TResolvedConfig>, TKey>[];
    } else {
      for (const hook of hooks) {
        if (!isFunction(hook.handler)) {
          throw new Error(
            `Plugin hook handler for hook "${key}" is not a function.`
          );
        }

        if (options?.result === "first" || options?.asNextParam === false) {
          results.push(
            (await Promise.resolve(
              invokeHook(hook, [...args])
            )) as InferHookReturnType<PluginContext<TResolvedConfig>, TKey>
          );
          if (
            options?.result === "first" &&
            isSet(results[results.length - 1])
          ) {
            break;
          }
        } else {
          const sequenceArgs = [...args];
          if (results.length > 0 && sequenceArgs.length > 0) {
            sequenceArgs[0] = isFunction(options.asNextParam)
              ? await Promise.resolve(options.asNextParam(results[0]))
              : results[0];
          }

          const result = await Promise.resolve(
            invokeHook(hook, [...sequenceArgs] as InferHookParameters<
              PluginContext<TResolvedConfig>,
              TKey
            >)
          );
          if (result) {
            if (options.result === "last") {
              results = [result];
            } else if (options.result === "merge" && options.merge) {
              results = [
                results.length > 0 && results[0]
                  ? await Promise.resolve(options.merge(result, results[0]))
                  : result
              ];
            } else {
              results = mergeResults(result, results);
            }
          }
        }
      }
    }

    const definedResults = results.filter(
      (
        result
      ): result is NonNullable<
        InferHookReturnType<PluginContext<TResolvedConfig>, TKey>
      > => isSet(result)
    );

    if (definedResults.length > 0) {
      let mergedResult = undefined as
        | InferHookReturnType<PluginContext<TResolvedConfig>, TKey>
        | undefined;

      for (const result of definedResults) {
        mergedResult = defu(
          result as Record<string, unknown>,
          mergedResult ?? {}
        ) as InferHookReturnType<PluginContext<TResolvedConfig>, TKey>;
      }

      return mergedResult;
    }
  }

  return undefined;
}

export function extractHooks<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>(
  context: PluginContext<TResolvedConfig>,
  hooks: Record<string, HooksList<PluginContext<TResolvedConfig>>>,
  plugin: Plugin<PluginContext<TResolvedConfig>>,
  key: string,
  parentKey?: string
): Record<string, HooksList<PluginContext<TResolvedConfig>>> {
  const combinedKey = parentKey ? `${parentKey}:${key}` : key;
  const pluginField = getField(plugin, combinedKey.replace(/:/g, "."));
  if (
    isPluginHookField<PluginContext<TResolvedConfig>>(combinedKey) &&
    isPluginHook(pluginField)
  ) {
    const pluginHook = pluginField;
    if (!isPluginHook(pluginHook)) {
      return hooks;
    }

    hooks[combinedKey] ??= {
      preEnforced: [] as HooksListItem<PluginContext<TResolvedConfig>>[],
      preOrdered: [] as HooksListItem<PluginContext<TResolvedConfig>>[],
      normal: [] as HooksListItem<PluginContext<TResolvedConfig>>[],
      postEnforced: [] as HooksListItem<PluginContext<TResolvedConfig>>[],
      postOrdered: [] as HooksListItem<PluginContext<TResolvedConfig>>[]
    };

    if (plugin.enforce) {
      const hookListOrder = `${plugin.enforce}Enforced` as HookListOrders;
      hooks[combinedKey][hookListOrder] ??= [] as HooksListItem<
        PluginContext<TResolvedConfig>
      >[];

      hooks[combinedKey][hookListOrder] = addPluginHook<
        PluginContext<TResolvedConfig>,
        PluginHookFields<PluginContext<TResolvedConfig>>
      >(context, plugin, pluginHook, hooks[combinedKey][hookListOrder]);

      return hooks;
    }

    if (isFunction(pluginHook) || !pluginHook.order) {
      hooks[combinedKey].normal ??= [];

      hooks[combinedKey].normal = addPluginHook<
        PluginContext<TResolvedConfig>,
        PluginHookFields<PluginContext<TResolvedConfig>>
      >(context, plugin, pluginHook, hooks[combinedKey].normal);

      return hooks;
    }

    const hookListOrder = `${pluginHook.order}Ordered` as HookListOrders;
    hooks[combinedKey][hookListOrder] ??= [];

    hooks[combinedKey][hookListOrder] = addPluginHook<
      PluginContext<TResolvedConfig>,
      PluginHookFields<PluginContext<TResolvedConfig>>
    >(context, plugin, pluginHook, hooks[combinedKey][hookListOrder]);

    return hooks;
  } else if (isSetObject(pluginField)) {
    return Object.keys(pluginField)
      .map(pluginKey =>
        extractHooks(context, hooks, plugin, pluginKey, combinedKey)
      )
      .reduce((ret, current) => {
        Object.keys(current).forEach(key => {
          ret[key] ??= {
            preEnforced: [] as HooksListItem<PluginContext<TResolvedConfig>>[],
            preOrdered: [] as HooksListItem<PluginContext<TResolvedConfig>>[],
            normal: [] as HooksListItem<PluginContext<TResolvedConfig>>[],
            postEnforced: [] as HooksListItem<PluginContext<TResolvedConfig>>[],
            postOrdered: [] as HooksListItem<PluginContext<TResolvedConfig>>[]
          };

          [
            "preEnforced",
            "preOrdered",
            "normal",
            "postEnforced",
            "postOrdered"
          ].forEach(order => {
            if (
              current[key]?.[
                order as keyof HooksList<PluginContext<TResolvedConfig>>
              ]
            ) {
              ret[key]![
                order as keyof HooksList<PluginContext<TResolvedConfig>>
              ] ??= [];
              ret[key]![
                order as keyof HooksList<PluginContext<TResolvedConfig>>
              ] = ret[key]![
                order as keyof HooksList<PluginContext<TResolvedConfig>>
              ]!.concat(
                current[key][
                  order as keyof HooksList<PluginContext<TResolvedConfig>>
                ]!
              );
            }
          });
        });

        return ret;
      }, hooks);
  }

  return hooks;
}
