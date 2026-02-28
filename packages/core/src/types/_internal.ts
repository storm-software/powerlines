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

import { API } from "./api";
import { PluginConfig, ResolvedConfig } from "./config";
import {
  APIContext,
  Context,
  EnvironmentContext,
  PluginContext
} from "./context";
import {
  CallHookOptions,
  InferHookParameters,
  InferHookReturnType
} from "./hooks";

/**
 * Internal fields and methods for internal contexts
 *
 * @internal
 */
export interface UNSAFE_ContextInternal<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> {
  /**
   * The API instance for interacting with Powerlines
   *
   * @internal
   */
  api: API<TResolvedConfig>;

  /**
   * Add a Powerlines plugin used in the build process
   *
   * @internal
   *
   * @param config - The import path of the plugin to add
   */
  addPlugin: (
    config: PluginConfig<PluginContext<TResolvedConfig>>
  ) => Promise<void>;
}

/**
 * An internal representation of the context, used for managing hooks and environment data.
 *
 * @internal
 */
export interface UNSAFE_Context<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends Context<TResolvedConfig> {
  $$internal: UNSAFE_ContextInternal<TResolvedConfig>;
}

/**
 * An internal representation of the API context, used for managing hooks and environment data.
 *
 * @internal
 */
export interface UNSAFE_APIContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends APIContext<TResolvedConfig> {
  $$internal: UNSAFE_ContextInternal<TResolvedConfig>;
}

/**
 * An internal representation of the environment context, used for managing hooks and environment data.
 *
 * @internal
 */
export interface UNSAFE_EnvironmentContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends EnvironmentContext<TResolvedConfig> {
  $$internal: UNSAFE_ContextInternal<TResolvedConfig>;
}

/**
 * Internal fields and methods for the internal plugin context
 *
 * @internal
 */
export interface UNSAFE_PluginContextInternal<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends UNSAFE_ContextInternal<TResolvedConfig> {
  /**
   * The API instance for interacting with Powerlines
   *
   * @internal
   */
  api: API<TResolvedConfig>;

  /**
   * The environment context associated with this plugin context
   *
   * @internal
   */
  environment: UNSAFE_EnvironmentContext<TResolvedConfig>;

  /**
   * Call a hook within the Powerlines system
   *
   * @internal
   *
   * @param hook - The name of the hook to call
   * @param options - Options for calling the hook
   * @param args - Arguments to pass to the hook
   * @returns The result of the hook call
   */
  callHook: <TKey extends string>(
    hook: TKey,
    options: CallHookOptions & {
      environment?: string | EnvironmentContext<TResolvedConfig>;
    },
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ) => Promise<
    InferHookReturnType<PluginContext<TResolvedConfig>, TKey> | undefined
  >;

  /**
   * A place to store internal data for the plugin context
   *
   * @internal
   */
  meta: Record<string, any>;
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
