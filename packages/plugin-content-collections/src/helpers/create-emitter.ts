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

import { EventEmitter } from "node:events";

type EventMap = Record<string, object>;

interface EventWithError {
  error: Error;
}

interface SystemEvent {
  _event: string;
}

type ErrorEvent = EventWithError & SystemEvent;

interface SystemEvents extends EventMap {
  _error: ErrorEvent;
  _all: SystemEvent;
}

type Keys<TEvents extends EventMap> = keyof TEvents & string;
type Listener<TEvent> = (event: TEvent) => void;

/**
 * Create an event emitter with typed events.
 *
 * @returns An event emitter instance with typed event handling.
 */
export function createEmitter<TEvents extends EventMap>() {
  const emitter = new EventEmitter();

  function on<TKey extends Keys<TEvents>>(
    key: TKey,
    listener: Listener<TEvents[TKey]>
  ): void;

  function on<TKey extends Keys<SystemEvents>>(
    key: TKey,
    listener: Listener<SystemEvents[TKey]>
  ): void;

  function on(key: string, listener: Listener<any>) {
    emitter.on(key, listener);
  }

  function emit<TKey extends Keys<TEvents>>(key: TKey, event: TEvents[TKey]) {
    emitter.emit(key, event);

    if (typeof event === "object" && event !== null && "error" in event) {
      emitter.emit("_error", {
        ...event,
        _event: key
      });
    }

    emitter.emit("_all", {
      ...event,
      _event: key
    });
  }

  return {
    on,
    emit
  };
}
