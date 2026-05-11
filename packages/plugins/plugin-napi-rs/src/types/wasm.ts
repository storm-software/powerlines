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

/**
 * Wasm Browser compilation options
 */
export interface WasmBrowserOptions {
  /**
   * Whether to use fs module in browser
   */
  fs?: boolean;

  /**
   * Whether to initialize wasm asynchronously
   */
  asyncInit?: boolean;

  /**
   * Whether to inject `buffer` to emnapi context
   */
  buffer?: boolean;

  /**
   * Whether to emit custom events for errors in worker
   */
  errorEvent?: boolean;
}

/**
 * Wasm compilation options
 */
export interface WasmOptions {
  /**
   * https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory
   *
   * @defaultValue 4000 pages (256MiB)
   */
  initialMemory?: number;

  /**
   * @defaultValue 65536 pages (4GiB)
   */
  maximumMemory?: number;

  /**
   * Browser wasm binding configuration
   */
  browser: WasmBrowserOptions;
}
