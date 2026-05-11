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

import { PluginConfig, ResolvedConfig } from "./config";
import { EnvironmentContext, ExecutionContext, PluginContext } from "./context";
import { VirtualFileSystemInterface } from "./fs";
import {
  CallHookOptions,
  InferHookParameters,
  InferHookReturnType
} from "./hooks";
import { RpcClient } from "./rpc";

/**
 * Internal fields and methods for internal contexts
 *
 * @internal
 */
export interface Unstable_ContextInternal<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> {
  /**
   * Invokes the configured plugin hooks
   *
   * @remarks
   * By default, it will call the `"pre"`, `"normal"`, and `"post"` ordered hooks in sequence
   *
   * @param hook - The hook to call
   * @param options - The options to provide to the hook
   * @param args - The arguments to pass to the hook
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
   * The RPC client for communicating with the Powerlines worker
   *
   * @internal
   */
  rpc: RpcClient;

  /**
   * The virtual file system interface for managing files during the build process
   *
   * @internal
   */
  fs: VirtualFileSystemInterface;

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
 * An internal representation of the API context, used for managing hooks and environment data.
 *
 * @internal
 */
export interface Unstable_ExecutionContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends ExecutionContext<TResolvedConfig> {
  $$internal: Unstable_ContextInternal<TResolvedConfig>;
}

/**
 * An internal representation of the environment context, used for managing hooks and environment data.
 *
 * @internal
 */
export interface Unstable_EnvironmentContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends EnvironmentContext<TResolvedConfig> {
  $$internal: Unstable_ContextInternal<TResolvedConfig>;
}

/**
 * Internal fields and methods for the internal plugin context
 *
 * @internal
 */
export interface Unstable_PluginContextInternal<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends Unstable_ContextInternal<TResolvedConfig> {
  /**
   * The environment context associated with this plugin context
   *
   * @internal
   */
  environment: Unstable_EnvironmentContext<TResolvedConfig>;

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
export interface Unstable_PluginContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends PluginContext<TResolvedConfig> {
  $$internal: Unstable_PluginContextInternal<TResolvedConfig>;
}
