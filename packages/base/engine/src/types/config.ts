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

import type {
  CustomLogger,
  ExecutionOptions,
  Options,
  ResolvedConfig,
  UserConfig
} from "@powerlines/core";
import type { PartialKeys, RequiredKeys } from "@stryke/types/base";
import type { BirpcOptions } from "birpc";
import type { RpcCacheOptions } from "devframe/rpc";
import type { WsRpcChannelOptions } from "devframe/rpc/transports/ws-client";
import type { ConnectionMeta, DevframeDefinition } from "devframe/types";
import type { RpcClientFunctions, RpcServerFunctions } from "./rpc";

/**
 * The options required to start the Powerlines engine.
 */
export type EngineOptions = Omit<
  PartialKeys<DevframeDefinition, "name" | "setup">,
  "id" | "basePath"
> &
  Options & {
    /**
     * The host URL for the engine's WebSocket server, which is used for communication between the engine and the various hosts (e.g., dev server, CLI, etc.) that interact with it. This value is required for the engine to function properly, as it allows the engine to establish a WebSocket connection and facilitate communication with other components of the system.
     */
    host?: string;

    /**
     * The port number to use for the websocket connection between the engine and the various hosts.
     */
    port?: number;

    /**
     * A custom logger instance that implements the {@link CustomLogger} interface, which can be used for logging messages during the build process instead of the default Powerlines logger.
     *
     * @remarks
     * Providing a custom logger allows you to integrate Powerlines logging with your own logging system or to customize the logging behavior, such as formatting log messages differently or sending logs to an external service. If a custom logger is not provided, Powerlines will use its default logger implementation.
     */
    customLogger?: CustomLogger;

    /**
     * A string identifier that allows a child framework or tool to identify itself when using Powerlines.
     *
     * @remarks
     * If no values are provided for {@link OutputConfig.types | output.types} or {@link OutputConfig.artifactsPath | output.artifactsFolder}, this value will be used as the default.
     *
     * @defaultValue "powerlines"
     */
    framework?: string;

    /**
     * The organization or author of the framework
     *
     * @defaultValue "storm-software"
     */
    orgId?: string;
  };

export interface EngineExecutionOptions extends ExecutionOptions {
  /**
   * The base URL for the dev server, which can be used by plugins to construct URLs for assets or API endpoints during development. This value is only relevant in "dev" mode and will be `undefined` in "build" mode.
   */
  baseURL: string;

  /**
   * Metadata for the connection used by the dev server, including the backend type and websocket configuration.
   */
  connection: ConnectionMeta;

  /**
   * Options for configuring the WebSocket RPC channel used for communication between the dev server and the client, which can be used by plugins to customize the behavior of the WebSocket connection, such as setting custom timeouts, retry strategies, or other options.
   */
  wsOptions?: Partial<WsRpcChannelOptions>;

  /**
   * Options for configuring the RPC client used for communication between the dev server and the client, which can be used by plugins to customize the behavior of the RPC client, such as setting custom timeouts, retry strategies, or other options.
   */
  rpcOptions?: Partial<
    BirpcOptions<RpcServerFunctions, RpcClientFunctions, boolean>
  >;

  /**
   * Options for configuring the RPC cache used for caching RPC responses between the dev server and the client, which can be used by plugins to customize the behavior of the RPC cache, such as setting custom cache keys, expiration times, or other options.
   *
   * @remarks
   * This option can be set to `true` to enable caching with default options, or it can be set to a configuration object that allows for fine-grained control over the caching behavior.
   */
  cacheOptions?: boolean | Partial<RpcCacheOptions>;
}

export type RpcClientOptions = RequiredKeys<
  EngineExecutionOptions,
  "baseURL" | "connection"
>;

export type EngineResolvedConfig<TUserConfig extends UserConfig = UserConfig> =
  ResolvedConfig<TUserConfig, EngineExecutionOptions>;
