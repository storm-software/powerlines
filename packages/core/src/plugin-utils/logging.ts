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

import { getLogFn, getLogLevel } from "@storm-software/config-tools/logger";
import { getColor } from "@storm-software/config-tools/utilities/colors";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { RequiredKeys } from "@stryke/types/base";
import { uuid } from "@stryke/unique-id/uuid";
import chalk from "chalk";
import { defu } from "defu";
import { DEFAULT_ENVIRONMENT } from "../constants/environments";
import {
  DEFAULT_DEVELOPMENT_LOG_LEVEL,
  DEFAULT_PRODUCTION_LOG_LEVEL,
  DEFAULT_TEST_LOG_LEVEL,
  LOG_CATEGORIES_ARRAY,
  LOG_LEVELS,
  LogCategories,
  LogLevels
} from "../constants/log-level";
import { Mode } from "../types/config";
import { UnresolvedContext } from "../types/context";
import type {
  CustomLogger,
  CustomLoggerMessage,
  LogCategory,
  LogFn,
  LogFnMeta,
  LogFnOptions,
  Logger,
  LoggerMessage,
  LoggerOptions,
  LogLevel,
  LogLevelResolvedConfig,
  LogLevelUserConfig,
  LogMeta
} from "../types/logging";

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
  logLevel?: LogLevelUserConfig,
  mode?: Mode
): LogLevelResolvedConfig {
  if (logLevel === "trace") {
    return {
      general: "trace",
      fs: "trace",
      performance: "trace",
      communication: "trace",
      plugins: "trace",
      hooks: "trace",
      env: "trace",
      rpc: "trace",
      config: "trace",
      babel: "trace"
    };
  } else if (logLevel === "silent") {
    return {
      general: "silent",
      fs: "silent",
      performance: "silent",
      communication: "silent",
      plugins: "silent",
      hooks: "silent",
      env: "silent",
      rpc: "silent",
      config: "silent",
      babel: "silent"
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
      communication: defaultLogLevel.communication,
      plugins: logLevel,
      hooks: logLevel,
      env: defaultLogLevel.env,
      rpc: defaultLogLevel.rpc,
      config: defaultLogLevel.config,
      babel: logLevel
    };
  } else if (isSetObject(logLevel)) {
    if (
      Object.values(logLevel).filter(level => isSetString(level)).length ===
      LOG_CATEGORIES_ARRAY.length
    ) {
      return logLevel as LogLevelResolvedConfig;
    }

    return defu(logLevel, defaultLogLevel) as LogLevelResolvedConfig;
  }

  return defaultLogLevel;
}

const BADGE_COLORS = [
  "#00A0DD",
  "#6FCE4E",
  "#FBBF24",
  "#F43F5E",
  "#3B82F6",
  "#A855F7",
  "#469592",
  "#288EDF",
  "#D8B4FE",
  "#10B981",
  "#EF4444",
  "#F0EC56",
  "#F472B6",
  "#22D3EE",
  "#EAB308",
  "#84CC16",
  "#F87171",
  "#0EA5E9",
  "#D946EF",
  "#FACC15",
  "#34D399",
  "#8B5CF6"
] as const;

const BRAND_COLOR = getColor("brand");

/**
 * Generate a consistent color based on the input text.
 *
 * @param text - The input text to generate the color from.
 * @return A hexadecimal color string.
 */
export const getTextColor = (text: string): string => {
  return (
    BADGE_COLORS[
      text
        .split("")
        .map(char => char.charCodeAt(0))
        .reduce((ret, charCode) => ret + charCode, 0) % BADGE_COLORS.length
    ] || BADGE_COLORS[0]
  );
};

/**
 * Generate a consistent color based on the input text.
 *
 * @param text - The input text to generate the color from.
 * @return A hexadecimal color string.
 */
export const colorText = (text: string): string => {
  const title = titleCase(text);

  return chalk.hex(getTextColor(title))(title);
};

/**
 * Generate a consistent color based on the input text.
 *
 * @param text - The input text to generate the color from.
 * @return A hexadecimal color string.
 */
export const colorBackground = (text: string): string => {
  const title = titleCase(text);

  return chalk.inverse.hex(getTextColor(title))(` ${title} `);
};

export const consoleLog = (meta: LogMeta, ...args: string[]) =>
  getLogFn(
    getLogLevel(
      meta.category === LogCategories.PERFORMANCE ? "performance" : meta.type
    ),
    {
      logLevel: "all"
    }
  )(
    `${meta.name ? chalk.bold.hex(BRAND_COLOR)(kebabCase(meta.name)) : ""}${meta.name ? chalk.grey(" > ") : ""}${
      meta.command
        ? `${chalk.bold.hex(BRAND_COLOR)(
            kebabCase(meta.command)
          )}${chalk.grey(" > ")}`
        : ""
    }${
      meta.environment && kebabCase(meta.environment) !== DEFAULT_ENVIRONMENT
        ? `${chalk.bold.hex(BRAND_COLOR)(
            kebabCase(meta.environment)
          )}${chalk.grey(" > ")}`
        : ""
    }${
      meta.plugin
        ? `${chalk.bold.hex(BRAND_COLOR)(meta.plugin)}${chalk.grey(" > ")}`
        : ""
    }${
      meta.source
        ? `${chalk.bold.hex(BRAND_COLOR)(
            kebabCase(meta.source)
          )}${chalk.grey(" > ")}`
        : ""
    }${
      meta.category &&
      meta.category !== LogCategories.GENERAL &&
      meta.category !== LogCategories.PERFORMANCE
        ? `${colorBackground(kebabCase(meta.category))} `
        : ""
    }${args.join(" ")} `.trim()
  );

export function isValidLogLevel(logLevel: LogLevel, type: LogLevel): boolean {
  if (logLevel === LogLevels.SILENT) {
    return false;
  }

  return LOG_LEVELS.indexOf(logLevel) >= LOG_LEVELS.indexOf(type);
}

export function isValidLogLevelConfig(
  type: LogLevel,
  logLevel: LogLevelResolvedConfig,
  category: LogCategory = LogCategories.GENERAL
): boolean {
  return isValidLogLevel(logLevel[category], type);
}

/**
 * Create a logging function with a specific name and options.
 *
 * @param name - The name of the logging function.
 * @param options - The options to configure the logging function, including the source, command, environment, plugin, log level, custom logger, and colors. These options can be used to customize the appearance and behavior of the log messages generated by the logging function.
 * @returns A logging function.
 */
export const createLogFn = (name: string, options: LogFnOptions): LogFn => {
  const logLevel = resolveLogLevel(options.logLevel, options.mode);

  return (meta: LogFnMeta | LogLevel, ...args: string[]) => {
    const logMeta = isSetObject(meta)
      ? {
          logId: uuid(),
          timestamp: Date.now(),
          category: LogCategories.GENERAL,
          ...options,
          ...meta,
          name
        }
      : {
          logId: uuid(),
          timestamp: Date.now(),
          category: LogCategories.GENERAL,
          ...options,
          type: meta,
          name
        };

    if (
      logMeta.$$ipc ||
      isValidLogLevelConfig(
        logMeta.type,
        logLevel,
        logMeta.category ? logMeta.category : LogCategories.GENERAL
      )
    ) {
      consoleLog(logMeta, ...args);
    }
  };
};

const validateLogger = (
  type: LogLevel,
  name: string | undefined,
  options: LoggerOptions,
  callback: (message: LoggerMessage) => void
) => {
  const logLevel = resolveLogLevel(options.logLevel, options.mode);

  return (message: string | LoggerMessage | Error) => {
    const params = isSetString(message)
      ? {
          name,
          plugin: options.plugin,
          meta: {
            type,
            name,
            category: LogCategories.GENERAL,
            logId: uuid(),
            timestamp: Date.now(),
            ...options
          },
          message
        }
      : message instanceof Error || message.error
        ? {
            name,
            plugin: options.plugin,
            message: `${
              (message instanceof Error ? message : message.error)?.message
                ? (message instanceof Error ? message : message.error)?.name
                  ? `[${message.name}]: ${message.message}`
                  : message.message
                : JSON.stringify(message)
            }${
              (message instanceof Error ? message : message.error)?.stack
                ? `
Stack Trace: ${message.stack}`
                : ""
            }`,
            meta: {
              type,
              name,
              category: LogCategories.GENERAL,
              logId: uuid(),
              timestamp: Date.now(),
              ...options
            }
          }
        : {
            name,
            plugin: options.plugin,
            ...message,
            meta: {
              type,
              name,
              category: LogCategories.GENERAL,
              logId: uuid(),
              timestamp: Date.now(),
              plugin: message.plugin,
              ...options,
              ...message.meta
            }
          };

    if (
      params.meta.$$ipc ||
      isValidLogLevelConfig(type, logLevel, params.meta.category)
    ) {
      callback(params);
    }
  };
};

const validateCustomLogger = (
  type: LogLevel,
  name: string | undefined,
  options: LoggerOptions,
  callback?: (message: string | LoggerMessage) => void,
  customCallback?: (message: CustomLoggerMessage) => void
) => {
  const logLevel = resolveLogLevel(options.logLevel, options.mode);

  return (message: string | LoggerMessage) => {
    const params = isSetString(message)
      ? {
          name,
          plugin: options.plugin,
          meta: {
            category: LogCategories.GENERAL,
            ...options,
            type,
            name,
            logId: uuid(),
            timestamp: Date.now()
          },
          message
        }
      : {
          name,
          plugin: options.plugin,
          ...message,
          meta: {
            category: LogCategories.GENERAL,
            ...options,
            type,
            name,
            logId: uuid(),
            timestamp: Date.now(),
            plugin: message.plugin,
            ...message.meta
          }
        };

    if (
      params.meta.$$ipc ||
      isValidLogLevelConfig(type, logLevel, params.meta.category)
    ) {
      callback?.(params);
      customCallback?.(params);
    }
  };
};

/**
 * Create a logging function with a specific name and options.
 *
 * @param logger - The original logger to wrap with the custom logger.
 * @param secondaryLogger - The custom logger to use for logging messages, which can be used to override the default logging behavior of the original logger.
 * @returns A new logger that combines the original logger's options with the custom logger's methods, allowing for customized logging behavior while still maintaining the original logger's configuration.
 */
export const withLogger = (logger: Logger, secondaryLogger: Logger): Logger => {
  const options = { ...secondaryLogger.options, ...logger.options };

  const result = {
    options,
    error: validateLogger(
      "error",
      options.name,
      options,
      (message: LoggerMessage) => {
        logger.error?.(message);
        secondaryLogger.error?.(message);
      }
    ),
    warn: validateLogger(
      "warn",
      options.name,
      options,
      (message: LoggerMessage) => {
        logger.warn?.(message);
        secondaryLogger.warn?.(message);
      }
    ),
    info: validateLogger(
      "info",
      options.name,
      options,
      (message: LoggerMessage) => {
        logger.info?.(message);
        secondaryLogger.info?.(message);
      }
    ),
    debug: validateLogger(
      "debug",
      options.name,
      options,
      (message: LoggerMessage) => {
        logger.debug?.(message);
        secondaryLogger.debug?.(message);
      }
    ),
    trace: validateLogger(
      "trace",
      options.name,
      options,
      (message: LoggerMessage) => {
        logger.trace?.(message);
        secondaryLogger.trace?.(message);
      }
    )
  } as Logger;

  result.log = (type: LogLevel, message: string | LoggerMessage) => {
    switch (type) {
      case "error":
        result.error(message);
        break;
      case "warn":
        result.warn(message);
        break;
      case "info":
        result.info(message);
        break;
      case "debug":
        result.debug(message);
        break;
      case "trace":
        result.trace(message);
        break;
      case "silent":
        break;
      default:
        result.info(message);
        break;
    }
  };

  return result;
};

/**
 * Create a logging function with a specific name and options.
 *
 * @param logger - The original logger to wrap with the custom logger.
 * @param logFn - The custom logging function to use for logging messages, which can be used to override the default logging behavior of the original logger.
 * @returns A new logger that combines the original logger's options with the custom logging function, allowing for customized logging behavior while still maintaining the original logger's configuration.
 */
export const withLogFn = (logger: Logger, logFn: LogFn): Logger => {
  const result = {
    options: logger.options,
    error: validateLogger(
      "error",
      logger.options.name,
      logger.options,
      (msg: LoggerMessage) => {
        logger.error?.(msg);
        logFn(
          {
            category: LogCategories.GENERAL,
            ...logger.options,
            type: "error",
            logId: uuid(),
            timestamp: Date.now(),
            ...msg.meta
          },
          msg.message
        );
      }
    ),
    warn: validateLogger(
      "warn",
      logger.options.name,
      logger.options,
      (msg: LoggerMessage) => {
        logger.warn?.(msg);
        logFn(
          {
            category: LogCategories.GENERAL,
            ...logger.options,
            type: "warn",
            logId: uuid(),
            timestamp: Date.now(),
            ...msg.meta
          },
          msg.message
        );
      }
    ),
    info: validateLogger(
      "info",
      logger.options.name,
      logger.options,
      (msg: LoggerMessage) => {
        logger.info?.(msg);
        logFn(
          {
            category: LogCategories.GENERAL,
            ...logger.options,
            type: "info",
            logId: uuid(),
            timestamp: Date.now(),
            ...msg.meta
          },
          msg.message
        );
      }
    ),
    debug: validateLogger(
      "debug",
      logger.options.name,
      logger.options,
      (msg: LoggerMessage) => {
        logger.debug?.(msg);
        logFn(
          {
            category: LogCategories.GENERAL,
            ...logger.options,
            type: "debug",
            logId: uuid(),
            timestamp: Date.now(),
            ...msg.meta
          },
          msg.message
        );
      }
    ),
    trace: validateLogger(
      "trace",
      logger.options.name,
      logger.options,
      (msg: LoggerMessage) => {
        logger.trace?.(msg);
        logFn(
          {
            category: LogCategories.GENERAL,
            ...logger.options,
            type: "trace",
            logId: uuid(),
            timestamp: Date.now(),
            ...msg.meta
          },
          msg.message
        );
      }
    )
  } as Logger;

  result.log = (type: LogLevel, message: string | LoggerMessage) => {
    switch (type) {
      case "error":
        result.error(message);
        break;
      case "warn":
        result.warn(message);
        break;
      case "info":
        result.info(message);
        break;
      case "debug":
        result.debug(message);
        break;
      case "trace":
        result.trace(message);
        break;
      case "silent":
        break;
      default:
        result.info(message);
        break;
    }
  };

  return result;
};

/**
 * Create a logging function with a specific name and options.
 *
 * @param logger - The original logger to wrap with the custom logger.
 * @param customLogger - The custom logger to use for logging messages, which can be used to override the default logging behavior of the original logger.
 * @returns A new logger that combines the original logger's options with the custom logger's methods, allowing for customized logging behavior while still maintaining the original logger's configuration.
 */
export const withCustomLogger = (
  logger: Logger,
  customLogger: CustomLogger
): Logger => {
  const result = {
    options: logger.options,
    error: validateCustomLogger(
      "error",
      logger.options.name,
      logger.options,
      logger.error.bind(logger),
      customLogger.error?.bind(customLogger)
    ),
    warn: validateCustomLogger(
      "warn",
      logger.options.name,
      logger.options,
      logger.warn.bind(logger),
      customLogger.warn?.bind(customLogger)
    ),
    info: validateCustomLogger(
      "info",
      logger.options.name,
      logger.options,
      logger.info.bind(logger),
      customLogger.info?.bind(customLogger)
    ),
    debug: validateCustomLogger(
      "debug",
      logger.options.name,
      logger.options,
      logger.debug.bind(logger),
      customLogger.debug?.bind(customLogger)
    ),
    trace: validateCustomLogger(
      "trace",
      logger.options.name,
      logger.options,
      logger.trace.bind(logger),
      customLogger.trace?.bind(customLogger)
    )
  } as Logger;

  result.log = (type: LogLevel, message: string | LoggerMessage) => {
    switch (type) {
      case "error":
        result.error(message);
        break;
      case "warn":
        result.warn(message);
        break;
      case "info":
        result.info(message);
        break;
      case "debug":
        result.debug(message);
        break;
      case "trace":
        result.trace(message);
        break;
      case "silent":
        break;
      default:
        result.info(message);
        break;
    }
  };

  return result;
};

export const consoleLogger: LogFn = (meta: LogFnMeta, message: string) =>
  consoleLog(
    {
      type: isSetString(meta) ? meta : meta.type,
      category: LogCategories.GENERAL,
      logId: uuid(),
      timestamp: Date.now(),
      ...(isSetObject(meta) ? meta : {})
    },
    message
  );

/**
 * Create a logging function with a specific name and options.
 *
 * @param name - The name of the logging function.
 * @param options - The options to configure the logging function, including the source, command, environment, plugin, log level, custom logger, and colors. These options can be used to customize the appearance and behavior of the log messages generated by the logging function.
 * @returns A logging function.
 */
export const createLogger = (
  name: string | undefined,
  options: LoggerOptions,
  callback: LogFn = consoleLogger
): Logger => {
  const result = {
    options: { name, ...options },
    error: validateLogger("error", name, { name, ...options }, data =>
      callback({ ...data.meta, type: "error" }, data.message)
    ),
    warn: validateLogger("warn", name, { name, ...options }, data =>
      callback({ ...data.meta, type: "warn" }, data.message)
    ),
    info: validateLogger("info", name, { name, ...options }, data =>
      callback({ ...data.meta, type: "info" }, data.message)
    ),
    debug: validateLogger("debug", name, { name, ...options }, data =>
      callback({ ...data.meta, type: "debug" }, data.message)
    ),
    trace: validateLogger("trace", name, { name, ...options }, data =>
      callback({ ...data.meta, type: "trace" }, data.message)
    )
  } as Logger;

  result.log = (type: LogLevel, message: string | LoggerMessage) => {
    switch (type) {
      case "error":
        result.error(message);
        break;
      case "warn":
        result.warn(message);
        break;
      case "info":
        result.info(message);
        break;
      case "debug":
        result.debug(message);
        break;
      case "trace":
        result.trace(message);
        break;
      case "silent":
        break;
      default:
        result.info(message);
        break;
    }
  };

  return result;
};

/**
 * Extend a logging function with a specific name, adding a colored badge to the log output.
 *
 * @param logFn - The original logging function to extend.
 * @param options - The overlay metadata to use for the badge in the log output.
 * @returns A new logging function that includes the badge in its output.
 */
export const extendLogFn = (logFn: LogFn, options: LogFnOptions): LogFn => {
  return (meta, ...args) =>
    options.source || options.category
      ? logFn(
          isSetObject(meta)
            ? { ...options, ...meta }
            : { ...options, type: meta },
          `${colorBackground(String(options.source || options.category))} ${args
            .filter(Boolean)
            .map(arg => String(arg).trim())
            .join(" ")} `
        )
      : logFn(meta, ...args);
};

/**
 * Extend a logger with a specific name and options, adding a colored badge to the log output for each log message generated by the logger.
 *
 * @param logger - The original logger to extend.
 * @param options - The options to configure the logging function, including the source, command, environment, plugin, log level, custom logger, and colors. These options can be used to customize the appearance and behavior of the log messages generated by the extended logger.
 * @returns A new logger that includes the badge in its output for each log message.
 */
export const extendLogger = (
  logger: Logger,
  options: LoggerOptions
): Logger => {
  const opts = { ...logger.options, ...options } as RequiredKeys<
    LoggerOptions,
    "name"
  >;

  const result = {
    options: opts,
    error: validateLogger("error", opts.name, opts, logger.error.bind(logger)),
    warn: validateLogger("warn", opts.name, opts, logger.warn.bind(logger)),
    info: validateLogger("info", opts.name, opts, logger.info.bind(logger)),
    debug: validateLogger("debug", opts.name, opts, logger.debug.bind(logger)),
    trace: validateLogger("trace", opts.name, opts, logger.trace.bind(logger))
  } as Logger;

  result.log = (type: LogLevel, message: string | LoggerMessage) => {
    switch (type) {
      case "error":
        result.error(message);
        break;
      case "warn":
        result.warn(message);
        break;
      case "info":
        result.info(message);
        break;
      case "debug":
        result.debug(message);
        break;
      case "trace":
        result.trace(message);
        break;
      case "silent":
        break;
      default:
        result.info(message);
        break;
    }
  };

  return result;
};
