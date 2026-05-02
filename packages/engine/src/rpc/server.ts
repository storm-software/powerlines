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

import type { BirpcGroup, ChannelOptions, EventOptions } from "birpc";
import { createBirpcGroup } from "birpc";
import {
  strictJsonStringify,
  STRUCTURED_CLONE_PREFIX,
  structuredCloneParse,
  structuredCloneStringify
} from "./serialization";
import { RpcFunctionDefinitionAny } from "./types";

export function createRpcServer<
  ClientFunctions extends object = Record<string, never>,
  ServerFunctions extends object = Record<string, never>
>(
  functions: ServerFunctions,
  options: {
    rpcOptions?: EventOptions<ClientFunctions, ServerFunctions, false>;
  } = {}
): BirpcGroup<ClientFunctions, ServerFunctions, false> {
  return createBirpcGroup<ClientFunctions, ServerFunctions, false>(
    functions,
    [],
    {
      ...options.rpcOptions,
      proxify: false
    }
  );
}

export interface WsRpcChannelOptions {
  url: string;
  onConnected?: (e: Event) => void;
  onError?: (e: Error) => void;
  onDisconnected?: (e: CloseEvent) => void;
  /**
   * RPC function definitions (or just the `jsonSerializable` flag per
   * method) used to dispatch the per-call wire serializer. Pass an
   * empty / partial map on clients that don't have the full registry —
   * encoding falls back to structured-clone (the safer superset) and
   * decoding still routes correctly via the wire prefix.
   */
  definitions?: ReadonlyMap<
    string,
    Pick<RpcFunctionDefinitionAny, "jsonSerializable">
  >;
}

function NOOP() {}

const EMPTY_DEFS: ReadonlyMap<
  string,
  Pick<RpcFunctionDefinitionAny, "jsonSerializable">
> = new Map();

/**
 * Build a birpc `ChannelOptions` object backed by a browser `WebSocket`.
 * Pass the result straight to `createRpcClient`'s `channel` option.
 */
export function createWsRpcChannel(
  options: WsRpcChannelOptions
): ChannelOptions {
  const {
    onConnected = NOOP,
    onError = NOOP,
    onDisconnected = NOOP,
    definitions = EMPTY_DEFS
  } = options;

  const ws = new WebSocket(options.url);

  ws.addEventListener("open", e => {
    onConnected(e);
  });

  ws.addEventListener("error", e => {
    const _e = e instanceof Error ? e : new Error(e.type);
    onError(_e);
  });

  ws.addEventListener("close", e => {
    onDisconnected(e);
  });

  // Per-channel state: maps an incoming request id to its method name
  // so the matching outgoing response can independently look the
  // method up in `definitions` and pick the right encoder.
  const pendingRequestMethods = new Map<string, string>();

  return {
    on: (handler: (data: string) => void) => {
      ws.addEventListener("message", e => {
        handler(e.data);
      });
    },
    post: (data: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      } else {
        function handler() {
          ws.send(data);
          ws.removeEventListener("open", handler);
        }
        ws.addEventListener("open", handler);
      }
    },
    serialize: (msg: any): string => {
      let method: string | undefined;
      if (msg.t === "q") {
        method = msg.m;
      } else {
        method = pendingRequestMethods.get(msg.i);
        pendingRequestMethods.delete(msg.i);
      }
      const useJson =
        !!method && definitions.get(method)?.jsonSerializable === true;
      if (useJson) return strictJsonStringify(msg, method ?? "");
      return `${STRUCTURED_CLONE_PREFIX}${structuredCloneStringify(msg)}`;
    },
    deserialize: (raw: string): any => {
      const msg: any = raw.startsWith(STRUCTURED_CLONE_PREFIX)
        ? structuredCloneParse(raw.slice(STRUCTURED_CLONE_PREFIX.length))
        : JSON.parse(raw);
      if (msg.t === "q" && msg.i && msg.m)
        pendingRequestMethods.set(msg.i, msg.m);
      return msg;
    }
  };
}
