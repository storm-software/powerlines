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

import type {
  BaseContext,
  LogFn,
  Logger,
  LoggerOptions,
  LogMessage,
  Options
} from "@powerlines/core";
import { extendLogger } from "@powerlines/core/plugin-utils";
import { EnvPaths } from "@stryke/env/get-env-paths";
import { resolvePackage } from "@stryke/fs/resolve";
import chalk from "chalk";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";

export abstract class PowerlinesBaseContext implements BaseContext {
  #timestamp: number = Date.now();

  public powerlinesPath!: string;

  public abstract get envPaths(): EnvPaths;

  public get logger(): Logger {
    return this.createLogger();
  }

  public get cwd(): string {
    return this.options.cwd || process.cwd();
  }

  public get timestamp(): number {
    return this.#timestamp;
  }

  /**
   * Initialize the context with the provided configuration options and set up the resolver and user configuration file. This method is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup as the original context.
   *
   * @param options - The configuration options to initialize the context with, which can include properties such as the project root, mode, log level, and other settings that affect the behavior of the context and its plugins.
   */
  protected constructor(public options: Options) {}

  public abstract createLogger(options?: LoggerOptions, logFn?: LogFn): Logger;

  public extendLogger(options: LoggerOptions) {
    return extendLogger(this.logger, options);
  }

  /**
   * A logging function for fatal messages
   *
   * @param message - The message to log.
   */
  public fatal(message: string | LogMessage | Error) {
    this.logger.error(
      message instanceof Error
        ? {
            meta: {},
            message: message.message,
            error: message
          }
        : message
    );
  }

  /**
   * A logging function for error messages
   *
   * @param message - The message to log.
   */
  public error(message: string | LogMessage | Error) {
    this.logger.error(
      message instanceof Error
        ? {
            meta: {},
            message: message.message,
            error: message
          }
        : message
    );
  }

  /**
   * A logging function for warning messages
   *
   * @param message - The message to log.
   */
  public warn(message: string | LogMessage) {
    this.logger.warn(message);
  }

  /**
   * A logging function for informational messages
   *
   * @param message - The message to log.
   */
  public info(message: string | LogMessage) {
    this.logger.info(message);
  }

  /**
   * A logging function for debug messages
   *
   * @param message - The message to log.
   */
  public debug(message: string | LogMessage) {
    this.logger.debug(message);
  }

  /**
   * A logging function for trace messages
   *
   * @param message - The message to log.
   */
  public trace(message: string | LogMessage) {
    this.logger.trace(message);
  }

  /**
   * A function to create a timer for measuring the duration of asynchronous operations
   *
   * @example
   * ```ts
   * const stopTimer = context.timer("Your Async Operation");
   * await performAsyncOperation();
   * stopTimer(); // "Your Async Operation completed in 123.45 milliseconds"
   * ```
   *
   * @param name - The name of the timer.
   * @returns A function that, when called, stops the timer and logs the duration.
   */
  public timer(name: string): () => void {
    const startDate = Date.now();
    const startDuration = performance.now();

    return () => {
      const duration = performance.now() - startDuration;
      this.logger.info({
        meta: {
          category: "performance"
        },
        message: `${chalk.bold.cyanBright(name)} completed in ${chalk.bold.cyanBright(
          duration < 1000
            ? `${duration.toFixed(2)} milliseconds`
            : formatDistanceToNowStrict(startDate)
        )}`
      });
    };
  }

  /**
   * Initialize the context with the provided configuration options
   */
  protected async init() {
    if (!this.powerlinesPath) {
      const powerlinesPath = await resolvePackage("powerlines");
      if (!powerlinesPath) {
        throw new Error("Could not resolve `powerlines` package location.");
      }
      this.powerlinesPath = powerlinesPath;
    }
  }
}
