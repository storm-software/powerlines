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

import type { UnpluginOptions as BaseUnpluginOptions } from "unplugin";
import type {
  PluginContext,
  UnresolvedContext,
  WithUnpluginBuildContext
} from "./context";

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

export interface UnpluginOptions<
  TContext extends UnresolvedContext
> extends BaseUnpluginOptions {
  /**
   * An API object that can be used for inter-plugin communication.
   *
   * @see https://rollupjs.org/plugin-development/#direct-plugin-communication
   */
  context: TContext;
}

export type UnpluginHookFunctions<
  TContext extends PluginContext = PluginContext,
  TUnpluginBuilderVariant extends UnpluginBuilderVariant =
    UnpluginBuilderVariant,
  TField extends keyof Required<
    UnpluginOptions<TContext>
  >[TUnpluginBuilderVariant] = keyof Required<
    UnpluginOptions<TContext>
  >[TUnpluginBuilderVariant]
> = Required<
  UnpluginOptions<TContext>
>[TUnpluginBuilderVariant][TField] extends
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
