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

/* eslint-disable ts/naming-convention */

import { CallHookOptions } from "../internal/helpers/hooks";
import { EnvironmentContext, PluginContext } from "./context";
import { HookKeys, InferHookParameters, InferHookReturnType } from "./hooks";
import { ResolvedConfig } from "./resolved";

/**
 * Internal fields and methods for the internal plugin context
 *
 * @internal
 */
export interface UNSAFE_PluginContextInternal<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> {
  environment: EnvironmentContext<TResolvedConfig>;
  callHook: <TKey extends HookKeys<PluginContext<TResolvedConfig>>>(
    hook: TKey,
    options: CallHookOptions,
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) => Promise<
    InferHookReturnType<PluginContext<TResolvedConfig>, TKey> | undefined
  >;
}

/**
 * An internal representation of the plugin context, used for managing hooks and environment data.
 *
 * @internal
 */
export interface UNSAFE_PluginContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends PluginContext<TResolvedConfig> {
  $$internal: UNSAFE_PluginContextInternal<TResolvedConfig>;
}
