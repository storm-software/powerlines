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

import { LogLevelLabel } from "@storm-software/config-tools/types";

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export type LogFn = (type: LogLevelLabel, ...args: string[]) => void;

export interface LogLevelConfigTypes {
  /**
   * Should file-system related logs be enabled?
   */
  fs?: LogLevel | boolean;
  /**
   * Should performance related logs be enabled?
   */
  performance?: LogLevel | boolean;
  /**
   * Should configuration related logs be enabled?
   */
  config?: LogLevel | boolean;
  /**
   * Should plugin related logs be enabled?
   */
  plugins?: LogLevel | boolean;
  /**
   * Should environment related logs be enabled?
   */
  env?: LogLevel | boolean;
}

export interface LogLevelDetailsConfig {
  level: LogLevel;
  flags: LogLevelConfigTypes;
}

export type LogLevelUserConfig = LogLevel | LogLevelDetailsConfig;

export type LogLevelDetailsResolvedConfig = Omit<
  LogLevelDetailsConfig,
  "flags"
> & {
  flags: Required<Record<keyof LogLevelConfigTypes, LogLevel>>;
};

export type LogLevelResolvedConfig = LogLevelDetailsResolvedConfig;

export interface Logger {
  log: LogFn;
  level: LogLevelLabel;
}
