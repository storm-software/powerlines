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
  DuplexOptions,
  ReadableOptions,
  WritableOptions
} from "node:stream";
import { Duplex, Readable, Writable } from "node:stream";
import type { MessagePort, Transferable } from "node:worker_threads";

const kPort = Symbol("kPort");

type PortLike = MessagePort & {
  close: (callback?: () => void) => void;
};

interface WritevChunk {
  chunk: unknown;
  encoding: BufferEncoding;
}

function toTransferable(chunk: unknown): Transferable | undefined {
  if (ArrayBuffer.isView(chunk)) {
    return chunk.buffer instanceof ArrayBuffer ? chunk.buffer : undefined;
  }

  if (chunk instanceof ArrayBuffer) {
    return chunk;
  }

  return undefined;
}

export class MessagePortWritable extends Writable {
  private [kPort]: PortLike;

  public constructor(port: MessagePort, options?: WritableOptions) {
    super(options);
    this[kPort] = port;
  }

  public override _write(
    chunk: unknown,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    const transfer = toTransferable(chunk);
    this[kPort].postMessage(chunk, transfer ? [transfer] : []);
    callback();
  }

  public override _writev(
    data: WritevChunk[],
    callback: (error?: Error | null) => void
  ): void {
    const chunks = data.map(entry => entry.chunk);
    const transfers = data
      .map(entry => toTransferable(entry.chunk))
      .filter((value): value is Transferable => Boolean(value));

    this[kPort].postMessage(chunks, transfers);
    callback();
  }

  public override _final(callback: (error?: Error | null) => void): void {
    this[kPort].postMessage(null);
    callback();
  }

  public override _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void
  ): void {
    this[kPort].close(() => callback(error));
  }

  public unref(): this {
    this[kPort].unref();
    return this;
  }

  public ref(): this {
    this[kPort].ref();
    return this;
  }
}

export class MessagePortReadable extends Readable {
  private [kPort]: PortLike;

  public constructor(port: MessagePort, options?: ReadableOptions) {
    super(options);
    this[kPort] = port;
    port.onmessage = ({ data }) => {
      this.push(data);
    };
  }

  public override _read(_size: number): void {
    this[kPort].start();
  }

  public override _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void
  ): void {
    this[kPort].close(() => {
      this[kPort].onmessage = null;
      callback(error);
    });
  }

  public unref(): this {
    this[kPort].unref();
    return this;
  }

  public ref(): this {
    this[kPort].ref();
    return this;
  }
}

export interface MessagePortDuplexOptions extends DuplexOptions {
  onActivityAbort?: () => void;
}

export class MessagePortDuplex extends Duplex {
  private [kPort]: PortLike;

  private _activityAbortHandler?: () => void;

  public constructor(port: MessagePort, options?: MessagePortDuplexOptions) {
    super(options);
    this[kPort] = port;
    this._activityAbortHandler = options?.onActivityAbort;

    port.onmessage = ({ data }) => {
      this.push(data);
    };
  }

  public override _read(_size: number): void {
    this[kPort].start();
  }

  public override _write(
    chunk: unknown,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    if (this._activityAbortHandler) {
      this._activityAbortHandler();
    }
    const transfer = toTransferable(chunk);
    this[kPort].postMessage(chunk, transfer ? [transfer] : []);
    callback();
  }

  public override _writev(
    data: WritevChunk[],
    callback: (error?: Error | null) => void
  ): void {
    const chunks = data.map(entry => entry.chunk);
    const transfers = data
      .map(entry => toTransferable(entry.chunk))
      .filter((value): value is Transferable => Boolean(value));

    this[kPort].postMessage(chunks, transfers);
    callback();
  }

  public override _final(callback: (error?: Error | null) => void): void {
    this[kPort].postMessage(null);
    callback();
  }

  public override _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void
  ): void {
    this[kPort].close(() => {
      this[kPort].onmessage = null;
      callback(error);
    });
  }

  public unref(): this {
    this[kPort].unref();
    return this;
  }

  public ref(): this {
    this[kPort].ref();
    return this;
  }
}
