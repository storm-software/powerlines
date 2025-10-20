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

import type { PluginContext } from "./context";
import type {
  BasePluginHookFunctions,
  ExternalPluginHookFunctions,
  Plugin,
  PluginHookFunctions,
  PluginHookObject
} from "./plugin";

export type BaseHooks<TContext extends PluginContext = PluginContext> =
  BasePluginHookFunctions<TContext>;

export type BaseHookKeys<TContext extends PluginContext = PluginContext> =
  keyof BaseHooks<TContext>;

export type ExternalHooks<TContext extends PluginContext = PluginContext> =
  ExternalPluginHookFunctions<TContext>;

export type ExternalHookKeys<TContext extends PluginContext = PluginContext> =
  keyof ExternalHooks<TContext>;

export type Hooks<TContext extends PluginContext = PluginContext> =
  PluginHookFunctions<TContext>;

export type HookKeys<TContext extends PluginContext = PluginContext> =
  keyof Hooks<TContext>;

export interface BaseHooksListItem<
  TContext extends PluginContext = PluginContext,
  TKey extends BaseHookKeys<TContext> = BaseHookKeys<TContext>
> extends PluginHookObject<BaseHooks<TContext>[TKey]> {
  plugin: Plugin<TContext>;
}

export interface BaseHooksList<
  TContext extends PluginContext = PluginContext,
  TKey extends BaseHookKeys<TContext> = BaseHookKeys<TContext>
> {
  preOrdered?: BaseHooksListItem<TContext, TKey>[];
  preEnforced?: BaseHooksListItem<TContext, TKey>[];
  normal?: BaseHooksListItem<TContext, TKey>[];
  postEnforced?: BaseHooksListItem<TContext, TKey>[];
  postOrdered?: BaseHooksListItem<TContext, TKey>[];
}

export interface ExternalHooksListItem<
  TContext extends PluginContext = PluginContext,
  TKey extends ExternalHookKeys<TContext> = ExternalHookKeys<TContext>
> {
  plugin: Plugin<TContext>;
  handler: ExternalHooks<TContext>[TKey];
}

export type HooksList<TContext extends PluginContext = PluginContext> = {
  [TKey in BaseHookKeys<TContext>]?: BaseHooksList<TContext, TKey>;
} & {
  [TKey in ExternalHookKeys<TContext>]?: ExternalHooksListItem<
    TContext,
    TKey
  >[];
};

export type InferHookHandler<
  TContext extends PluginContext,
  TKey extends HookKeys<TContext>
> = Hooks<TContext>[TKey];

export type InferHookReturnType<
  TContext extends PluginContext,
  TKey extends HookKeys<TContext>
> =
  ReturnType<InferHookHandler<TContext, TKey>> extends Promise<infer U>
    ? U extends Promise<infer V>
      ? V
      : U
    : ReturnType<InferHookHandler<TContext, TKey>>;

export type InferHookParameters<
  TContext extends PluginContext,
  TKey extends HookKeys<TContext>
> = Parameters<InferHookHandler<TContext, TKey>>;

export type InferHookThisType<
  TContext extends PluginContext,
  TKey extends HookKeys<TContext>
> = ThisParameterType<InferHookHandler<TContext, TKey>>;
