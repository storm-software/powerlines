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

import type { StreamReader, StreamSink } from "../lib/streaming-channel";

export interface StreamingSubscribeOptions {
  /** Maximum buffered chunks before the oldest is dropped. Default 256. */
  highWaterMark?: number;
}

export interface RpcStreamingClientHost {
  /**
   * Subscribe to a server-side stream by channel + id. Returns a reader
   * that's both an `AsyncIterable<T>` (`for await`) and exposes
   * `readable: ReadableStream<T>` for `pipeTo`-style consumption.
   */
  subscribe: <T = unknown>(
    channel: string,
    id: string,
    options?: StreamingSubscribeOptions
  ) => StreamReader<T>;
  /**
   * Open the client side of a client-to-server upload. The id is
   * typically obtained from a prior action call that ran
   * `channel.openInbound()` on the server. Returns a `StreamSink<T>`
   * that mirrors the server-side producer surface (write / close /
   * error / writable / signal).
   *
   * The sink's `signal` aborts when the server cancels the upload.
   */
  upload: <T = unknown>(channel: string, id: string) => StreamSink<T>;
}
