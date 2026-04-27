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

import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { defu } from "defu";
import {
  DEFAULT_DEVELOPMENT_LOG_LEVEL,
  DEFAULT_PRODUCTION_LOG_LEVEL,
  DEFAULT_TEST_LOG_LEVEL
} from "../constants/log-level";
import { Mode, UnresolvedContext } from "../types";
import { LogLevelResolvedConfig, LogLevelUserConfig } from "../types/log";

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

/**
 * Resolves the log level configuration based on the provided log level and mode, returning a complete LogLevelResolvedConfig object that specifies the log level for each log category.
 *
 * @param logLevel - The user-provided log level configuration, which can be a string or an object specifying log levels for each category.
 * @param mode - The current mode of the application (e.g., "development", "test", "production"), which determines the default log levels.
 * @returns A LogLevelResolvedConfig object specifying the log level for each log category.
 */
export function resolveLogLevel(
  logLevel: LogLevelUserConfig,
  mode?: Mode
): LogLevelResolvedConfig {
  if (logLevel === "trace") {
    return {
      general: "trace",
      fs: "trace",
      performance: "trace",
      network: "trace",
      plugins: "trace",
      hooks: "trace",
      env: "trace",
      ipc: "trace",
      config: "trace"
    };
  } else if (logLevel === "silent") {
    return {
      general: "silent",
      fs: "silent",
      performance: "silent",
      network: "silent",
      plugins: "silent",
      hooks: "silent",
      env: "silent",
      ipc: "silent",
      config: "silent"
    };
  }

  let defaultLogLevel: LogLevelResolvedConfig;
  if (mode === "development") {
    defaultLogLevel = DEFAULT_DEVELOPMENT_LOG_LEVEL;
  } else if (mode === "test") {
    defaultLogLevel = DEFAULT_TEST_LOG_LEVEL;
  } else {
    defaultLogLevel = DEFAULT_PRODUCTION_LOG_LEVEL;
  }

  if (isSetString(logLevel)) {
    return {
      general: logLevel,
      fs: defaultLogLevel.fs,
      performance: logLevel,
      network: defaultLogLevel.network,
      plugins: logLevel,
      hooks: logLevel,
      env: defaultLogLevel.env,
      ipc: defaultLogLevel.ipc,
      config: defaultLogLevel.config
    };
  } else if (isSetObject(logLevel)) {
    return defu(logLevel, defaultLogLevel) as LogLevelResolvedConfig;
  }

  return defaultLogLevel;
}
