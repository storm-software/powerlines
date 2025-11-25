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

import { LogLevelLabel } from "@storm-software/config-tools/types";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSet } from "@stryke/type-checks/is-set";
import { ArrayValues } from "@stryke/types/array";
import chalk from "chalk";
import { defu } from "defu";
import {
  EnvironmentContext,
  PluginContext,
  SelectHooksOptions
} from "../../types/context";
import {
  HookKeys,
  InferHookParameters,
  InferHookReturnType
} from "../../types/hooks";
import { ResolvedConfig } from "../../types/resolved";

export type CallHookOptions = SelectHooksOptions &
  (
    | {
        /**
         * Whether to call the hooks sequentially or in parallel.
         *
         * @defaultValue true
         */
        sequential?: true;

        /**
         * How to handle multiple return values from hooks.
         * - "merge": Merge all non-undefined return values (if they are objects).
         * - "first": Return the first non-undefined value.
         *
         * @remarks
         * Merging only works if the return values are objects.
         *
         * @defaultValue "merge"
         */
        result?: "merge" | "first";
      }
    | {
        /**
         * Whether to call the hooks sequentially or in parallel.
         */
        sequential: false;
      }
  );

/**
 * Calls a hook with the given context, options, and arguments.
 *
 * @param context - The context to use when calling the hook.
 * @param hook - The hook to call.
 * @param options - Options for calling the hook.
 * @param args - Arguments to pass to the hook.
 * @returns The return value of the hook.
 */
export async function callHook<
  TResolvedConfig extends ResolvedConfig,
  TContext extends
    EnvironmentContext<TResolvedConfig> = EnvironmentContext<TResolvedConfig>,
  TKey extends HookKeys<ArrayValues<TContext["plugins"]>["context"]> = HookKeys<
    ArrayValues<TContext["plugins"]>["context"]
  >
>(
  context: TContext,
  hook: TKey,
  options: CallHookOptions,
  ...args: InferHookParameters<PluginContext<TContext["config"]>, TKey>
): Promise<
  InferHookReturnType<PluginContext<TContext["config"]>, TKey> | undefined
> {
  const handlers = context.selectHooks(hook, options);
  if (handlers.length > 0) {
    context.log(
      LogLevelLabel.DEBUG,
      ` 🧩  Calling plugin hook: ${chalk.bold.cyanBright(
        `${hook}${options?.order ? ` (${options.order})` : ""}`
      )}`
    );

    let results = [] as InferHookReturnType<
      PluginContext<TContext["config"]>,
      TKey
    >[];
    if (options?.sequential === false) {
      results = await Promise.all(
        handlers.map(async handler => {
          if (!isFunction(handler)) {
            throw new Error(
              `Plugin hook handler for hook "${hook}" is not a function.`
            );
          }

          // eslint-disable-next-line ts/no-unsafe-call
          return Promise.resolve(handler.apply(null, ...args));
        })
      );
    } else {
      for (const handler of handlers) {
        if (!isFunction(handler)) {
          throw new Error(
            `Plugin hook handler for hook "${hook}" is not a function.`
          );
        }

        // eslint-disable-next-line ts/no-unsafe-call
        results.push(await Promise.resolve(handler.apply(null, ...args)));
        if (options?.result === "first" && isSet(results[results.length - 1])) {
          break;
        }
      }
    }

    const definedResults = results.filter(
      (
        result
      ): result is NonNullable<
        InferHookReturnType<PluginContext<TContext["config"]>, TKey>
      > => isSet(result)
    );

    if (definedResults.length > 0) {
      let mergedResult = undefined as
        | InferHookReturnType<PluginContext<TContext["config"]>, TKey>
        | undefined;

      for (const result of definedResults) {
        mergedResult = defu(
          result as Record<string, unknown>,
          (mergedResult ?? {}) as Record<string, unknown>
        ) as InferHookReturnType<PluginContext<TContext["config"]>, TKey>;
      }

      return mergedResult;
    }
  }

  return undefined;
}
