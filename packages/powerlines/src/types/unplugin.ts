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
import type {
  UnpluginOptions as BaseUnpluginOptions,
  HookFilter,
  UnpluginContextMeta
} from "unplugin";
import { API } from "./api";
import type {
  BuilderVariant,
  InferUnpluginVariant,
  UnpluginBuilderVariant
} from "./build";
import type { InferUserConfig } from "./config";
import type { Context } from "./context";
import { PluginHook } from "./plugin";
import type { InferResolvedConfig } from "./resolved";

// export type UnpluginPluginHookFunctions<
//   TContext extends PluginContext,
//   TUnpluginBuilderVariant extends UnpluginBuilderVariant
// > = {
//   [TKey in keyof Required<BaseUnpluginOptions>[TUnpluginBuilderVariant]]: Required<BaseUnpluginOptions>[TUnpluginBuilderVariant][TKey] extends
//     | infer THandler
//     | {
//         handler: infer THandler;
//       }
//     ? THandler extends (
//         this: infer TOriginalContext,
//         ...args: infer TArgs
//       ) => infer TReturn
//       ? (
//           this: TOriginalContext & TContext,
//           ...args: TArgs
//         ) => MaybePromise<TReturn>
//       : never
//     : never;
// };

export interface UnpluginOptions<
  TUnpluginBuilderVariant extends UnpluginBuilderVariant =
    UnpluginBuilderVariant
> extends BaseUnpluginOptions {
  /**
   * An API object that can be used for inter-plugin communication.
   *
   * @see https://rollupjs.org/plugin-development/#direct-plugin-communication
   */
  api: API<InferResolvedConfig<TUnpluginBuilderVariant>>;
}

export type InferUnpluginOptions<
  TContext extends Context = Context,
  TBuilderVariant extends BuilderVariant = BuilderVariant,
  TUnpluginVariant extends InferUnpluginVariant<TBuilderVariant> =
    InferUnpluginVariant<TBuilderVariant>
> = {
  [TKey in keyof Required<
    UnpluginOptions<TUnpluginVariant>
  >[TUnpluginVariant]]?: Required<
    UnpluginOptions<TUnpluginVariant>
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
      : Required<UnpluginOptions<TUnpluginVariant>>[TUnpluginVariant][TKey]
    : Required<UnpluginOptions<TUnpluginVariant>>[TUnpluginVariant][TKey];
};

export type UnpluginUserConfig<
  TBuilderVariant extends BuilderVariant | undefined
> = InferUserConfig<TBuilderVariant> & {
  /**
   * The meta information for the unplugin context
   */
  unplugin: UnpluginContextMeta;
};

export type UnpluginFactory<
  TUnpluginBuilderVariant extends UnpluginBuilderVariant
> = (
  options: Partial<InferUserConfig<TUnpluginBuilderVariant>>,
  meta: UnpluginContextMeta
) => UnpluginOptions;
