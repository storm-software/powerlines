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

import type { AnyFunction, MaybePromise } from "@stryke/types/base";
import type { StringOrRegExp, UnpluginOptions } from "unplugin";
import type { PluginContext, SelectHooksOptions } from "./context";
import type { BasePlugin, Plugin, PluginHook, PluginHooks } from "./plugin";
import type { UnpluginBuilderVariant, UnpluginHookFunctions } from "./unplugin";

export type HookListOrders =
  | "preOrdered"
  | "preEnforced"
  | "normal"
  | "postEnforced"
  | "postOrdered";

export interface HooksListItem<
  TContext extends PluginContext = PluginContext,
  TFields extends string = string
> {
  plugin: Plugin<TContext>;
  handler: InferHookFunction<TContext, TFields>;
}

export type PluginFilter = (input: string) => boolean;
export type TransformHookFilter = (id: string, code: string) => boolean;

export interface NormalizedStringFilter {
  include?: StringOrRegExp[];
  exclude?: StringOrRegExp[];
}

export type HooksList<
  TContext extends PluginContext = PluginContext,
  TFields extends string = string
> = {
  [TKey in HookListOrders]?: HooksListItem<TContext, TFields>[] | undefined;
};

type InferPluginFunction<
  TObject,
  TKey extends keyof Required<TObject>
> = InferPluginFunctionKey<Required<TObject>[TKey]>;

type InferPluginFunctionKey<TValue> = TValue extends AnyFunction
  ? TValue
  : TValue extends PluginHook<infer THookFunction, any>
    ? THookFunction
    : never;

export type InferHookFunction<
  TContext extends PluginContext,
  TKey extends string
> = TKey extends `${infer TVariant}:${infer TField}`
  ? TVariant extends keyof Required<BasePlugin<TContext>>
    ? TField extends keyof Required<BasePlugin<TContext>>[TVariant]
      ? InferPluginFunction<Required<BasePlugin<TContext>>[TVariant], TField>
      : TVariant extends keyof Required<PluginHooks<TContext>>
        ? TField extends keyof Required<PluginHooks<TContext>>[TVariant]
          ? InferPluginFunction<
              Required<PluginHooks<TContext>>[TVariant],
              TField
            >
          : never
        : never
    : TVariant extends UnpluginBuilderVariant
      ? TField extends keyof Required<UnpluginOptions>[TVariant]
        ? UnpluginHookFunctions<TContext, TVariant, TField>
        : never
      : never
  : TKey extends keyof Required<BasePlugin<TContext>>
    ? InferPluginFunction<Required<BasePlugin<TContext>>, TKey>
    : TKey extends keyof Required<PluginHooks<TContext>>
      ? InferPluginFunction<Required<PluginHooks<TContext>>, TKey>
      : never;

export type InferHookReturnType<
  TContext extends PluginContext,
  TKey extends string
> = ReturnType<InferHookFunction<TContext, TKey>>;

export type InferHookParameters<
  TContext extends PluginContext,
  TKey extends string
> = Parameters<InferHookFunction<TContext, TKey>>;

export type InferHookThisType<
  TContext extends PluginContext,
  TKey extends string
> = ThisParameterType<InferHookFunction<TContext, TKey>>;

export type CallHookOptions<TResult = any> = SelectHooksOptions &
  (
    | ({
        /**
         * Whether to call the hooks sequentially or in parallel.
         *
         * @defaultValue true
         */
        sequential?: true;
      } & (
        | {
            /**
             * How to handle multiple return values from hooks.
             * - "merge": Merge all non-undefined return values (if they are objects).
             * - "first": Return the first non-undefined value.
             * - "last": Return the last non-undefined value.
             *
             * @remarks
             * Merging only works if the return values are objects.
             *
             * @defaultValue "merge"
             */
            result: "first";
          }
        | ({
            /**
             * An indicator specifying if the results of the previous hook should be provided as the **first** parameter of the next hook function, or a function to process the result of the previous hook function and pass the returned value as the next hook's **first** parameter
             */
            asNextParam?:
              | false
              | ((previousResult: TResult) => MaybePromise<TResult>);
          } & (
            | {
                /**
                 * How to handle multiple return values from hooks.
                 * - "merge": Merge all non-undefined return values (if they are objects).
                 * - "first": Return the first non-undefined value.
                 * - "last": Return the last non-undefined value.
                 *
                 * @remarks
                 * Merging only works if the return values are objects.
                 *
                 * @defaultValue "merge"
                 */
                result?: "merge";

                /**
                 * A custom function to merge two sets of return values from hooks.
                 *
                 * @remarks
                 * If not provided, the {@link mergeResults} function will be used by default, which merges string results by concatenation and object results by deep merging.
                 *
                 * @param currentResult - The current hook result to merge with the previous results.
                 * @param previousResult - The previous hook result to merge with the current result.
                 * @returns The merged result.
                 */
                merge?: (
                  currentResult: TResult,
                  previousResult: TResult
                ) => MaybePromise<TResult>;
              }
            | {
                /**
                 * How to handle multiple return values from hooks.
                 * - "merge": Merge all non-undefined return values (if they are objects).
                 * - "first": Return the first non-undefined value.
                 * - "last": Return the last non-undefined value.
                 *
                 * @remarks
                 * Merging only works if the return values are objects.
                 *
                 * @defaultValue "merge"
                 */
                result?: "last";
              }
          ))
      ))
    | {
        /**
         * Whether to call the hooks sequentially or in parallel.
         */
        sequential: false;
      }
  );
