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
import { Mode, WorkspaceConfig } from "./config";
import { BaseContext } from "./context";

export type LogLevel = "silent" | "error" | "warn" | "info" | "debug" | "trace";

export type LogCategory =
  | "general"
  | "fs"
  | "performance"
  | "config"
  | "plugins"
  | "hooks"
  | "env"
  | "ipc"
  | "babel"
  | "network";

export const LogLevels = {
  SILENT: "silent",
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
  TRACE: "trace"
} as const;

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

export interface LogMeta {
  /**
   * A unique identifier for the log message, which can be used to correlate related log entries across different parts of the system or different executions.
   */
  logId: string;
  /**
   * The log level label indicating the severity of the log message.
   */
  level: LogLevel;
  /**
   * The category of the log message, which can be used to classify and filter log entries based on their purpose or origin.
   */
  category: LogCategory;
  /**
   * The timestamp when the IPC message was created, represented as the number of milliseconds since the Unix epoch.
   */
  timestamp: number;
  /**
   * A unique identifier for the current execution instance, which can be used for logging and other purposes to distinguish between different executions in the same process.
   */
  executionId?: string;
  /**
   * The zero-based index of the current execution within the sequence of executions in the same process.
   */
  executionIndex?: number;
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
}

export type Logger = (meta: LogMeta, ...args: string[]) => void;

export type LogFnConfig = Omit<
  Partial<LogMeta>,
  "logId" | "level" | "timestamp"
> & {
  mode?: Mode;
  command?: string;
  logLevel?: LogLevelUserConfig | LogLevelResolvedConfig;
  colors?: WorkspaceConfig["colors"];
};

export type LogFnMeta =
  | LogLevel
  | PartialKeys<LogMeta, "logId" | "category" | "timestamp">;

export type LogFn = (meta: LogFnMeta, ...args: string[]) => void;

export type CreateLoggerFunction<TContext extends BaseContext = BaseContext> = (
  context: TContext
) => Logger;

export type LogLevelUserConfig =
  | LogLevel
  | RequiredKeys<
      Record<LogCategory, LogLevel | boolean | undefined>,
      "general"
    >;

export type LogLevelResolvedConfig = Record<LogCategory, LogLevel>;
