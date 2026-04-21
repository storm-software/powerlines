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
 * The powerlines library used by Storm Software for building NodeJS applications.
 *
 * @remarks
 * A build toolkit and runtime used by Storm Software in TypeScript applications
 *
 * @packageDocumentation
 */

import { PowerlinesAPI } from "./api";
import { PowerlinesEngine } from "./engine";
import type { EngineOptions } from "./types";

export type * from "./types";

/**
 * Creates a new {@link PowerlinesEngine} instance.
 *
 * @param options - The user configuration options.
 * @returns A promise that resolves to a {@link PowerlinesEngine} instance.
 */
export async function createEngine(
  options: EngineOptions
): Promise<PowerlinesEngine> {
  return PowerlinesEngine.fromOptions(options);
}

/**
 * Creates a new {@link PowerlinesAPI} instance.
 *
 * @param options - The user configuration options.
 * @returns A promise that resolves to a {@link PowerlinesAPI} instance.
 */
export async function createAPI(
  options: EngineOptions
): Promise<PowerlinesAPI> {
  return PowerlinesAPI.fromOptions(options);
}

export { PowerlinesAPI, PowerlinesEngine };
