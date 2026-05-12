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

import { createEventEmitter } from "@powerlines/core/lib/events";
import { isNumber } from "@stryke/type-checks/is-number";
import { isSet } from "@stryke/type-checks/is-set";
import { StormURL } from "@stryke/url";
import { BirpcOptions } from "birpc";
import {
  createRpcStreamingClientHost,
  DevToolsClientRpcHost,
  DevToolsRpcClientMode,
  RpcClientEvents
} from "devframe/client";
import { RpcCacheManager, RpcFunctionsCollectorBase } from "devframe/rpc";
import { createRpcClient as createDevframeRpcClient } from "devframe/rpc/client";
import {
  createWsRpcChannel,
  WsRpcChannelOptions
} from "devframe/rpc/transports/ws-client";
import {
  ConnectionMeta,
  EventEmitter as DevFrameEventEmitter
} from "devframe/types";
import { promiseWithResolver } from "devframe/utils/promise";
import { humanId } from "human-id";
import { EventEmitter } from "node:events";
import { RpcClientOptions } from "../types/config";
import {
  RpcClient,
  RpcClientFunctions,
  RpcContext,
  RpcServerFunctions
} from "../types/rpc";

function createWsRpcClientMode(
  baseURL: StormURL,
  connectionMeta: ConnectionMeta,
  events: DevFrameEventEmitter<RpcClientEvents>,
  clientRpc: DevToolsClientRpcHost,
  authToken: string = humanId({ separator: "-", capitalize: false }),
  rpcOptions: Partial<
    BirpcOptions<RpcServerFunctions, RpcClientFunctions, boolean>
  > = {},
  wsOptions: Partial<WsRpcChannelOptions> = {}
): DevToolsRpcClientMode {
  let isTrusted = false;
  const trustedPromise = promiseWithResolver<boolean>();
  const url =
    isNumber(connectionMeta.websocket) ||
    (isSet(connectionMeta.websocket) &&
      `${+connectionMeta.websocket}` === `${connectionMeta.websocket}`)
      ? `${baseURL.protocol.replace("http", "ws")}//${baseURL.hostname}:${connectionMeta.websocket}`
      : (connectionMeta.websocket as string);

  // Build a minimal `defs` map from the connection meta so the per-call
  // wire serializer dispatches outgoing requests with the correct
  // encoding (JSON for `jsonSerializable: true` methods; structured-
  // clone for the rest).
  const definitions = new Map<string, { jsonSerializable: true }>();
  for (const name of connectionMeta.jsonSerializableMethods ?? [])
    definitions.set(name, { jsonSerializable: true });

  const serverRpc = createDevframeRpcClient<
    RpcServerFunctions,
    RpcClientFunctions
  >(clientRpc.functions, {
    channel: createWsRpcChannel({
      url,
      authToken,
      definitions,
      ...wsOptions
    }),
    rpcOptions
  });

  // Handle server-initiated auth revocation
  clientRpc.register({
    name: "devframe:auth:revoked",
    type: "event",
    handler: () => {
      isTrusted = false;
      events.emit("rpc:is-trusted:updated", false);
    }
  });

  let currentAuthToken = authToken;

  async function requestTrustWithToken(token: string) {
    currentAuthToken = token;

    // const info = parseUA(navigator.userAgent);
    // const ua = [
    //   "powerlines",
    //   "1.0",
    //   "|",
    //   info.os.name,
    //   info.os.version,
    //   info.device.type
    // ]
    //   .filter(i => i)
    //   .join(" ");

    // const result = await serverRpc.$call("vite:anonymous:auth", {
    //   authToken: token,
    //   ua,
    //   origin: baseURL.origin
    // });

    // isTrusted = result.isTrusted;
    // trustedPromise.resolve(isTrusted);
    // events.emit("rpc:is-trusted:updated", isTrusted);
    // return result.isTrusted;

    return true;
  }

  async function requestTrust() {
    if (isTrusted) return true;
    return requestTrustWithToken(currentAuthToken);
  }

  async function ensureTrusted(timeout = 60_000): Promise<boolean> {
    if (isTrusted) trustedPromise.resolve(true);

    if (timeout <= 0) return trustedPromise.promise;

    let clear = () => {};
    await Promise.race([
      trustedPromise.promise.then(clear),
      new Promise((resolve, reject) => {
        const id = setTimeout(() => {
          reject(new Error("Timeout waiting for rpc to be trusted"));
        }, timeout);
        clear = () => clearTimeout(id);
      })
    ]);

    return isTrusted;
  }

  return {
    get isTrusted() {
      return isTrusted;
    },
    requestTrust,
    requestTrustWithToken,
    ensureTrusted,
    call: (...args: any): any => {
      return serverRpc.$call(
        // @ts-expect-error casting
        ...args
      );
    },
    callEvent: (...args: any): any => {
      return serverRpc.$callEvent(
        // @ts-expect-error casting
        ...args
      );
    },
    callOptional: (...args: any): any => {
      return serverRpc.$callOptional(
        // @ts-expect-error casting
        ...args
      );
    }
  };
}

const CONNECTION_AUTH_TOKEN_KEY = "__DEVTOOLS_CONNECTION_AUTH_TOKEN__";

export function createRpcClient(options: RpcClientOptions) {
  const baseURL = new StormURL(options.baseURL);

  const cacheManager = new RpcCacheManager({
    functions: [],
    ...(typeof options.cacheOptions === "object" ? options.cacheOptions : {})
  });
  const context: RpcContext = {
    rpc: undefined!
  };

  const clientRpc: DevToolsClientRpcHost = new RpcFunctionsCollectorBase<
    RpcClientFunctions,
    RpcContext
  >(context);

  EventEmitter.setMaxListeners(100);
  const events = createEventEmitter<RpcClientEvents>();

  const mode = createWsRpcClientMode(
    baseURL,
    options.connection,
    events,
    clientRpc,
    undefined,
    {
      ...options.rpcOptions,
      async onRequest(req, next, resolve) {
        await options.rpcOptions?.onRequest?.call(this, req, next, resolve);
        if (options.cacheOptions && cacheManager?.validate(req.m)) {
          const cached = cacheManager.cached(req.m, req.a);
          if (cached) {
            return resolve(cached);
          } else {
            const res = await next(req);
            cacheManager?.apply(req, res);
          }
        } else {
          await next(req);
        }
      }
    },
    options.wsOptions
  );

  const rpc: RpcClient = {
    events,
    get isTrusted() {
      return mode.isTrusted;
    },
    connectionMeta: options.connection,
    ensureTrusted: mode.ensureTrusted,
    requestTrust: mode.requestTrust,
    requestTrustWithToken: async (token: string) => {
      // Update stored token for future reconnections
      localStorage.setItem(CONNECTION_AUTH_TOKEN_KEY, token);
      (globalThis as any)[CONNECTION_AUTH_TOKEN_KEY] = token;
      return mode.requestTrustWithToken(token);
    },
    call: mode.call,
    callEvent: mode.callEvent,
    callOptional: mode.callOptional,
    client: clientRpc,
    sharedState: undefined!,
    streaming: undefined!,
    cacheManager
  };

  // rpc.sharedState = createRpcSharedStateClientHost(rpc);
  rpc.streaming = createRpcStreamingClientHost(rpc);

  // @ts-expect-error assign to readonly property
  context.rpc = rpc;
  void mode.requestTrust();

  // Listen for auth updates from other tabs (e.g., auth URL page)
  try {
    const bc = new BroadcastChannel("vite-devtools-auth");
    bc.onmessage = event => {
      if (event.data?.type === "auth-update" && event.data.authToken) {
        void rpc.requestTrustWithToken(event.data.authToken);
      }
    };
  } catch {
    // BroadcastChannel is not supported in all environments, so we can safely ignore errors here
  }

  return rpc;
}
