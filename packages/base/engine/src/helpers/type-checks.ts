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

import type { ApiExecutionOptions, EngineExecutionOptions } from "../types";

/**
 * Type guard to check if the provided options are EngineExecutionOptions. This is determined by checking for the presence of the "channel" property, which is specific to EngineExecutionOptions and not present in ApiExecutionOptions.
 *
 * @param options - The execution options to check, which can be either ApiExecutionOptions or EngineExecutionOptions.
 * @returns True if the options are EngineExecutionOptions, false otherwise.
 */
export function isEngineExecutionOptions(
  options: ApiExecutionOptions | EngineExecutionOptions
): options is EngineExecutionOptions {
  return (options as EngineExecutionOptions).channel !== undefined;
}

/**
 * Type guard to check if the provided options are ApiExecutionOptions. This is determined by checking for the absence of the "channel" property, which is specific to EngineExecutionOptions and not present in ApiExecutionOptions.
 *
 * @param options - The execution options to check, which can be either ApiExecutionOptions or EngineExecutionOptions.
 * @returns True if the options are ApiExecutionOptions, false otherwise.
 */
export function isApiExecutionOptions(
  options: ApiExecutionOptions | EngineExecutionOptions
): options is ApiExecutionOptions {
  return (options as EngineExecutionOptions).channel === undefined;
}
