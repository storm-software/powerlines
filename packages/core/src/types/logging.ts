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

import { PartialKeys, RequiredKeys } from "@stryke/types/base";
import { UnpluginMessage } from "unplugin";
import { Mode } from "./config";

export const LogLevels = {
  SILENT: "silent",
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
  TRACE: "trace"
} as const;

export const LOG_LEVELS = [
  LogLevels.SILENT,
  LogLevels.ERROR,
  LogLevels.WARN,
  LogLevels.INFO,
  LogLevels.DEBUG,
  LogLevels.TRACE
] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

export const LogCategories = {
  GENERAL: "general",
  FS: "fs",
  PERFORMANCE: "performance",
  CONFIG: "config",
  PLUGINS: "plugins",
  HOOKS: "hooks",
  ENV: "env",
  IPC: "ipc",
  BABEL: "babel",
  NETWORK: "network"
} as const;

export const LOG_CATEGORIES = [
  LogCategories.GENERAL,
  LogCategories.FS,
  LogCategories.PERFORMANCE,
  LogCategories.CONFIG,
  LogCategories.PLUGINS,
  LogCategories.HOOKS,
  LogCategories.ENV,
  LogCategories.IPC,
  LogCategories.NETWORK,
  LogCategories.BABEL
] as const;

export type LogCategory = (typeof LOG_CATEGORIES)[number];

export interface LogMeta {
  /**
   * A unique identifier for the log message, which can be used to correlate related log entries across different parts of the system or different executions.
   */
  logId: string;
  /**
   * The log level of the message, which indicates the severity or importance of the log entry. The log level can be used to filter log messages based on their importance, allowing users to focus on critical issues or relevant information while ignoring less important messages.
   */
  type: LogLevel;
  /**
   * The category of the log message, which can be used to classify and filter log entries based on their purpose or origin.
   */
  category: LogCategory;
  /**
   * The timestamp when the IPC message was created, represented as the number of milliseconds since the Unix epoch.
   */
  timestamp: number;
  /**
   * The name of the project or package associated with the log message, which can be used to identify the source of the log entry and provide context for the message.
   */
  name?: string;
  /**
   * A unique identifier for the current execution instance, which can be used for logging and other purposes to distinguish between different executions in the same process.
   */
  executionId?: string;
  /**
   * The zero-based index of the current execution within the sequence of executions in the same process.
   */
  executionIndex?: number;
  /**
   * Optional command identifier to specify the command or task associated with the log message, which can be used to provide additional context about the operation being performed when the log entry was generated.
   */
  command?: string;
  /**
   * Optional hook name to specify the plugin hook associated with the log message, which can be used to provide additional context about the specific plugin hook being executed when the log entry was generated.
   */
  hook?: string;
  /**
   * Optional environment identifier to specify the context or environment in which the message is being processed.
   */
  environment?: string;
  /**
   * Optional plugin name to specify the source plugin of the log message.
   */
  plugin?: string;
  /**
   * The name of the logger or source of the log message, which can be used to identify the origin of the log entry.
   */
  source?: string;
  /**
   * Indicates whether the log message is related to inter-process communication (IPC).
   *
   * @internal
   */
  $$ipc?: boolean;
}

export type LogFnOptions = Omit<
  Partial<LogMeta>,
  "logId" | "timestamp" | "name" | "type"
> & {
  mode?: Mode;
  logLevel?: LogLevelUserConfig;
};

export type LogFnMeta =
  | LogLevel
  | PartialKeys<LogMeta, "logId" | "timestamp" | "name" | "category">;

export type LogFn = (meta: LogFnMeta, message: string) => void;

export type LoggerMeta = PartialKeys<
  Omit<LogMeta, "type">,
  "logId" | "timestamp" | "name" | "category"
>;

export type LoggerOptions = Omit<LoggerMeta, "logId" | "timestamp" | "type"> & {
  mode?: Mode;
  logLevel?: LogLevelUserConfig;
};

export interface PowerlinesMessage<TMeta> extends UnpluginMessage {
  meta: TMeta;
}

export type LogMessage = PowerlinesMessage<Partial<LogMeta>>;

/**
 * A type representing a log message that can be passed to the logging methods defined in the {@link Logger} interface, which includes the log metadata and message content. This type is used as the parameter for the logging methods defined in the {@link Logger} interface, allowing users to log messages with rich metadata that can be used for filtering, formatting, or other purposes in the logging implementation.
 */
export type LoggerMessage = PowerlinesMessage<LoggerMeta>;

/**
 * An internal interface representing a logger instance used within Powerlines for logging messages at various log levels, including "error", "warn", "info", "debug", and "trace". This interface defines methods for logging messages at each log level, which accept a message parameter that can be either a string or an object containing the log metadata and message content. The logger instance also includes an options property that contains the configuration options used for the logger, such as the source, command, environment, plugin, log level, and other relevant metadata. This interface is intended for internal use within Powerlines and is not meant to be implemented by users directly; instead, users can provide a custom logger that implements the {@link CustomLogger} interface to integrate with Powerlines' logging system.
 */
export interface Logger {
  options: LoggerOptions;
  error: (message: string | LoggerMessage) => void;
  warn: (message: string | LoggerMessage) => void;
  info: (message: string | LoggerMessage) => void;
  debug: (message: string | LoggerMessage) => void;
  trace: (message: string | LoggerMessage) => void;
  log: (type: LogLevel, message: string | LoggerMessage) => void;
}

/**
 * A type representing a log message that can be passed to a custom logger, which includes the log metadata and message content. This type is used as the parameter for the logging methods defined in the {@link CustomLogger} interface, allowing users to log messages with rich metadata that can be used for filtering, formatting, or other purposes in their custom logging implementation.
 */
export type CustomLoggerMessage = PowerlinesMessage<Omit<LogMeta, "type">>;

/**
 * An interface representing a custom logger that can be provided by the user to override the default logging behavior of Powerlines. This interface defines methods for logging messages at different log levels, including "error", "warn", "info", "debug", and "trace". Each method accepts a message parameter, which can be either a string or an object containing the log metadata and message content. By implementing this interface, users can integrate their own logging system with Powerlines or customize the logging behavior to suit their specific needs.
 */
export interface CustomLogger {
  /**
   * A function to log messages at the "error" level, which indicates a serious issue that has caused a failure in the build process or a critical problem that needs immediate attention.
   *
   * @param message - The log message to be recorded, which can be a string or an object containing the log metadata and message content. The log message should provide sufficient information to understand the context and nature of the error being reported.
   * @returns void
   */
  error?: (message: CustomLoggerMessage) => void;
  /**
   * A function to log messages at the "warn" level, which indicates a potential issue or a situation that may require attention but does not necessarily cause a failure in the build process.
   *
   * @param message - The log message to be recorded, which can be a string or an object containing the log metadata and message content. The log message should provide sufficient information to understand the context and nature of the warning being reported.
   * @returns void
   */
  warn?: (message: CustomLoggerMessage) => void;
  /**
   * A function to log messages at the "info" level, which indicates general informational messages about the build process, such as the start and completion of tasks, configuration details, or other relevant information that may be useful for monitoring the build process.
   *
   * @param message - The log message to be recorded, which can be a string or an object containing the log metadata and message content. The log message should provide sufficient information to understand the context and nature of the informational message being reported.
   * @returns void
   */
  info?: (message: CustomLoggerMessage) => void;
  /**
   * A function to log messages at the "debug" level, which indicates detailed debugging information that may be useful for diagnosing issues during development or troubleshooting problems in the build process.
   *
   * @param message - The log message to be recorded, which can be a string or an object containing the log metadata and message content. The log message should provide sufficient information to understand the context and nature of the debug information being reported.
   * @returns void
   */
  debug?: (message: CustomLoggerMessage) => void;
  /**
   * A function to log messages at the "trace" level, which indicates very detailed tracing information that may be useful for in-depth analysis of the build process or for tracking the flow of execution through various stages of the build.
   *
   * @param message - The log message to be recorded, which can be a string or an object containing the log metadata and message content. The log message should provide sufficient information to understand the context and nature of the trace information being reported.
   * @returns void
   */
  trace?: (message: CustomLoggerMessage) => void;
}

export type LogLevelUserConfig =
  | LogLevel
  | RequiredKeys<
      Partial<Record<LogCategory, LogLevel | boolean | undefined>>,
      "general"
    >;

export type LogLevelResolvedConfig = Record<LogCategory, LogLevel>;
