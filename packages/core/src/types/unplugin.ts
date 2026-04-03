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

import type { MaybePromise } from "@stryke/types/base";
import type {
  UnpluginOptions as BaseUnpluginOptions,
  HookFilter,
  UnpluginContextMeta
} from "unplugin";
import type { API } from "./api";
import type { UserConfig } from "./config";
import type {
  Context,
  PluginContext,
  WithUnpluginBuildContext
} from "./context";
import type { PluginHook } from "./plugin";

export type UnpluginBuilderVariant =
  | "rollup"
  | "webpack"
  | "rspack"
  | "vite"
  | "esbuild"
  | "farm"
  | "unloader"
  | "rolldown"
  | "bun";

export type BuilderVariant =
  | UnpluginBuilderVariant
  | "tsup"
  | "tsdown"
  | "unbuild";

export type InferUnpluginVariant<TBuildVariant extends BuilderVariant> =
  TBuildVariant extends "tsup"
    ? "esbuild"
    : TBuildVariant extends "tsdown"
      ? "rolldown"
      : TBuildVariant extends "unbuild"
        ? "rollup"
        : TBuildVariant;

export interface UnpluginOptions<
  TContext extends Context = Context
> extends BaseUnpluginOptions {
  /**
   * An API object that can be used for inter-plugin communication.
   *
   * @see https://rollupjs.org/plugin-development/#direct-plugin-communication
   */
  api: API<TContext["config"]>;
}

export type InferUnpluginOptions<
  TContext extends Context = Context,
  TBuilderVariant extends BuilderVariant = BuilderVariant,
  TUnpluginVariant extends InferUnpluginVariant<TBuilderVariant> =
    InferUnpluginVariant<TBuilderVariant>
> = {
  [TKey in keyof Required<
    UnpluginOptions<TContext>
  >[TUnpluginVariant]]?: Required<
    UnpluginOptions<TContext>
  >[TUnpluginVariant][TKey] extends
    | infer THandler
    | {
        handler: infer THandler;
      }
    ? THandler extends (
        this: infer TOriginalContext,
        ...args: infer TArgs
      ) => infer TReturn
      ? PluginHook<
          (
            this: TOriginalContext & TContext,
            ...args: TArgs
          ) => MaybePromise<TReturn>,
          keyof HookFilter
        >
      : Required<UnpluginOptions<TContext>>[TUnpluginVariant][TKey]
    : Required<UnpluginOptions<TContext>>[TUnpluginVariant][TKey];
};

export type UnpluginUserConfig = UserConfig & {
  /**
   * The meta information for the unplugin context
   */
  unplugin: UnpluginContextMeta;
};

export type UnpluginFactory<TContext extends Context = Context> = (
  options: Partial<TContext["config"]["userConfig"]>,
  meta: UnpluginContextMeta
) => UnpluginOptions<TContext>;

export type UnpluginAsyncFactory<TContext extends Context = Context> = (
  options: Partial<TContext["config"]["userConfig"]>,
  meta: UnpluginContextMeta
) => Promise<UnpluginOptions<TContext>>;

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
