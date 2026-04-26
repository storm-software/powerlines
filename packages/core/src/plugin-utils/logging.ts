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

import { isString } from "@stryke/type-checks/is-string";
import { UnresolvedContext } from "../types";

/**
 * Determines if the provided log level is considered verbose (debug or trace).
 *
 * @param logLevel - The log level to check, which can be a string or an UnresolvedContext containing the log level in its config.
 * @returns True if the log level is "debug" or "trace", false otherwise.
 */
export function isVerbose(logLevel: string): boolean;

/**
 * Determines if the provided context is considered verbose (debug or trace).
 *
 * @param context - The context to check, which contains the log level in its config.
 * @returns True if the log level is "debug" or "trace", false otherwise.
 */
export function isVerbose(context: UnresolvedContext): boolean;

/**
 * Determines if the provided log level is considered verbose (debug or trace).
 *
 * @param logLevelOrContext - The log level to check, which can be a string or an UnresolvedContext containing the log level in its config.
 * @returns True if the log level is "debug" or "trace", false otherwise.
 */
export function isVerbose(
  logLevelOrContext: string | UnresolvedContext
): boolean {
  const level = isString(logLevelOrContext)
    ? logLevelOrContext
    : logLevelOrContext.config.logLevel;

  return level === "debug" || level === "trace";
}
