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

import { MaybePromise } from "@stryke/types/base";
import { UnpluginOptions } from "unplugin";
import type {
  PluginContext,
  SelectHooksOptions,
  WithUnpluginBuildContext
} from "./context";
import type { Plugin, PluginHookFields, PluginHookFunctions } from "./plugin";
import { UnpluginBuilderVariant } from "./unplugin";

export type HookListOrders =
  | "preOrdered"
  | "preEnforced"
  | "normal"
  | "postEnforced"
  | "postOrdered";

export const HOOKS_LIST_ORDERS = [
  "preOrdered",
  "preEnforced",
  "normal",
  "postEnforced",
  "postOrdered"
] as const;

export type UnpluginHookFunctions<
  TContext extends PluginContext = PluginContext,
  TUnpluginBuilderVariant extends UnpluginBuilderVariant =
    UnpluginBuilderVariant,
  TField extends keyof Required<UnpluginOptions>[TUnpluginBuilderVariant] =
    keyof Required<UnpluginOptions>[TUnpluginBuilderVariant]
> = Required<UnpluginOptions>[TUnpluginBuilderVariant][TField] extends
  | infer THandler
  | {
      handler: infer THandler;
    }
  ? THandler extends (
      this: infer THandlerOriginalContext,
      ...args: infer THandlerArgs
    ) => infer THandlerReturn
    ? (
        this: THandlerOriginalContext & WithUnpluginBuildContext<TContext>,
        ...args: THandlerArgs
      ) => THandlerReturn
    : THandler extends { handler: infer THandlerFunction }
      ? THandlerFunction extends (
          this: infer THandlerFunctionOriginalContext,
          ...args: infer THandlerFunctionArgs
        ) => infer THandlerFunctionReturn
        ? (
            this: THandlerFunctionOriginalContext &
              WithUnpluginBuildContext<TContext>,
            ...args: THandlerFunctionArgs
          ) => THandlerFunctionReturn
        : never
      : never
  : never;

export interface PluginHooksListItem<
  TContext extends PluginContext = PluginContext,
  TFields extends PluginHookFields<TContext> = PluginHookFields<TContext>
> {
  plugin: Plugin<TContext>;
  handler: PluginHookFunctions<TContext>[TFields];
}

export type PluginHooksList<
  TContext extends PluginContext = PluginContext,
  TFields extends PluginHookFields<TContext> = PluginHookFields<TContext>
> = {
  [TKey in HookListOrders]?:
    | PluginHooksListItem<TContext, TFields>[]
    | undefined;
};

export interface UnpluginHooksListItem<
  TContext extends PluginContext = PluginContext,
  TUnpluginBuilderVariant extends UnpluginBuilderVariant =
    UnpluginBuilderVariant,
  TField extends keyof Required<UnpluginOptions>[TUnpluginBuilderVariant] =
    keyof Required<UnpluginOptions>[TUnpluginBuilderVariant]
> {
  plugin: Plugin<TContext>;
  handler: UnpluginHookFunctions<TContext, TUnpluginBuilderVariant, TField>;
}

export type UnpluginHookList<
  TContext extends PluginContext = PluginContext,
  TUnpluginBuilderVariant extends UnpluginBuilderVariant =
    UnpluginBuilderVariant,
  TField extends keyof UnpluginOptions[TUnpluginBuilderVariant] =
    keyof UnpluginOptions[TUnpluginBuilderVariant]
> = {
  [TKey in HookListOrders]?:
    | UnpluginHooksListItem<TContext, TUnpluginBuilderVariant, TField>[]
    | undefined;
};

export type UnpluginHookVariantField<
  TContext extends PluginContext = PluginContext,
  TUnpluginBuilderVariant extends UnpluginBuilderVariant =
    UnpluginBuilderVariant
> = {
  [TKey in keyof UnpluginOptions[TUnpluginBuilderVariant]]?: UnpluginHookList<
    TContext,
    TUnpluginBuilderVariant,
    TKey
  >;
};

export type UnpluginHookVariant<
  TContext extends PluginContext = PluginContext
> = {
  [TKey in UnpluginBuilderVariant]?: UnpluginHookVariantField<TContext, TKey>;
};

export type HookFields<TContext extends PluginContext = PluginContext> =
  | PluginHookFields<TContext>
  | UnpluginBuilderVariant;

export type HooksList<TContext extends PluginContext = PluginContext> = {
  [TField in HookFields<TContext>]?: TField extends PluginHookFields<TContext>
    ? PluginHooksList<TContext, TField>
    : TField extends UnpluginBuilderVariant
      ? UnpluginHookVariant<TContext>[TField]
      : never;
};

export type InferHooksListItem<
  TContext extends PluginContext,
  TKey extends string
> = TKey extends `${infer TUnpluginBuilderVariant}:${infer TUnpluginField}`
  ? TUnpluginBuilderVariant extends UnpluginBuilderVariant
    ? TUnpluginField extends keyof Required<UnpluginOptions>[TUnpluginBuilderVariant]
      ? UnpluginHooksListItem<TContext, TUnpluginBuilderVariant, TUnpluginField>
      : never
    : never
  : TKey extends keyof PluginHookFunctions<TContext>
    ? PluginHooksListItem<TContext, TKey>
    : never;

export type InferHookFunction<
  TContext extends PluginContext,
  TKey extends string
> = TKey extends `${infer TUnpluginBuilderVariant}:${infer TUnpluginField}`
  ? TUnpluginBuilderVariant extends UnpluginBuilderVariant
    ? TUnpluginField extends keyof Required<UnpluginOptions>[TUnpluginBuilderVariant]
      ? UnpluginHookFunctions<TContext, TUnpluginBuilderVariant, TUnpluginField>
      : never
    : never
  : TKey extends keyof PluginHookFunctions<TContext>
    ? PluginHookFunctions<TContext>[TKey]
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

export type CallHookOptions = SelectHooksOptions &
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
            asNextParam?: false | ((previousResult: any) => MaybePromise<any>);
          } & (
            | {
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
                result?: "merge";

                /**
                 * A custom function to merge multiple return values from hooks.
                 *
                 * @remarks
                 * If not provided, the {@link mergeResults} function will be used by default, which merges string results by concatenation and object results by deep merging.
                 *
                 * @param currentResult - The current hook result to merge with the previous results.
                 * @param previousResults - The previous hook results to merge with the current result.
                 * @returns The merged result.
                 */
                merge?: <T>(currentResult: T, previousResults: T[]) => T[];
              }
            | {
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
