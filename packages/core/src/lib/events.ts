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

import type { EventEmitter, EventsMap, EventUnsubscribe } from "devframe/types";

/**
 * Create event emitter.
 */
export function createEventEmitter<
  Events extends EventsMap
>(): EventEmitter<Events> {
  const _listeners: Partial<{ [E in keyof Events]: Events[E][] }> = {};

  function emit<K extends keyof Events>(
    event: K,
    ...args: Parameters<Events[K]>
  ) {
    const callbacks = _listeners[event] || [];
    for (let i = 0, length = callbacks.length; i < length; i++) {
      const callback = callbacks[i];
      if (callback) {
        // eslint-disable-next-line ts/no-unsafe-call
        callback(...args);
      }
    }
  }
  function emitOnce<K extends keyof Events>(
    event: K,
    ...args: Parameters<Events[K]>
  ) {
    emit(event, ...args);
    delete _listeners[event];
  }
  function on<K extends keyof Events>(
    event: K,
    cb: Events[K]
  ): EventUnsubscribe {
    (_listeners[event] ||= [] as Events[K][]).push(cb);
    return () => {
      _listeners[event] = _listeners[event]?.filter(i => cb !== i);
    };
  }
  function once<K extends keyof Events>(event: K, cb: Events[K]) {
    const unsubscribe = on(event, ((...args: Parameters<Events[K]>) => {
      unsubscribe();

      // eslint-disable-next-line ts/no-unsafe-call
      return cb(...args);
    }) as Events[K]);

    return unsubscribe;
  }

  return {
    _listeners,
    emit,
    emitOnce,
    on,
    once
  };
}
