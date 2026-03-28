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

import { isFunction } from "@stryke/type-checks/is-function";
import { isObject } from "@stryke/type-checks/is-object";
import { isSet } from "@stryke/type-checks/is-set";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { ArrayValues } from "@stryke/types/array";
import chalk from "chalk";
import { createDefu, defu } from "defu";
import { mergeConfig } from "../../plugin-utils";
import {
  CallHookOptions,
  EnvironmentContext,
  InferHookParameters,
  InferHookReturnType,
  PluginContext,
  ResolvedConfig
} from "../../types";

export const mergeResultObjects = createDefu(
  <T>(obj: T, key: keyof T, value: any) => {
    if (isString(obj[key]) && isString(value)) {
      obj[key] = `${obj[key] || ""}\n${value || ""}`.trim() as T[keyof T];

      return true;
    }

    return false;
  }
);

/**
 * Merges the current hook result with the previous results based on their types.
 *
 * @param currentResult - The current hook result to merge with the previous results.
 * @param previousResults - The previous hook results to merge with the current result.
 * @returns The merged result.
 */
export function mergeResults<T>(currentResult: T, previousResults: T[]): T[] {
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
    previousResults = [
      mergeResultObjects(currentResult, previousResults[0] ?? {})
    ];
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
    context.debug(
      ` 🧩  Calling plugin hook: ${chalk.bold.cyanBright(
        `${key}${options?.order ? ` (${options.order})` : ""}`
      )}`
    );

    const invokeHook = async (
      hook: ArrayValues<typeof hooks>,
      hookArgs: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
    ) => {
      return Reflect.apply(hook.handler, hook.context, hookArgs);
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
                  ? options.merge(result, results[0])
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
          (mergedResult ?? {}) as Record<string, unknown>
        ) as InferHookReturnType<PluginContext<TResolvedConfig>, TKey>;
      }

      return mergedResult;
    }
  }

  return undefined;
}
