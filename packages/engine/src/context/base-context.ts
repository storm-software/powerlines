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
  EngineOptions,
  Logger,
  LoggerMessage,
  LoggerOptions,
  LogLevelResolvedConfig,
  LogMessage,
  ParsedUserConfig,
  ResolvedEngineOptions,
  Resolver
} from "@powerlines/core";
import { loadUserConfigFile } from "@powerlines/core/lib/config";
import { resolveLogLevel } from "@powerlines/core/plugin-utils";
import {
  createLogger,
  extendLogger
} from "@powerlines/core/plugin-utils/logging";
import { EnvPaths, getEnvPaths } from "@stryke/env/get-env-paths";
import { resolvePackage } from "@stryke/fs/resolve";
import { StormJSON } from "@stryke/json/storm-json";
import { isEqual } from "@stryke/path/is-equal";
import { replacePath } from "@stryke/path/replace";
import { isString } from "@stryke/type-checks/is-string";
import chalk from "chalk";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import defu from "defu";
import { createResolver } from "../_internal/helpers/resolver";

export class PowerlinesBaseContext implements BaseContext {
  #timestamp: number = Date.now();

  /**
   * The path to the Powerlines package
   */
  public powerlinesPath!: string;

  /**
   * The module resolver for the project
   */
  public resolver!: Resolver;

  /**
   * The options provided to the Powerlines process
   */
  public options!: ResolvedEngineOptions;

  /**
   * The input options used to initialize the context, which may be used when cloning the context to ensure the same configuration is applied to the new context
   */
  public inputOptions: Partial<EngineOptions> = {};

  /**
   * The parsed configuration file for the project
   */
  public configFile!: ParsedUserConfig;

  /**
   * The logger instance for the context, which can be used to create log messages with consistent formatting and metadata. This logger is extended by plugin contexts to include additional metadata such as the plugin name and category, which can be used to filter and format log messages in a more granular way.
   */
  public get logger(): Logger {
    return this.createLogger({ ...this.configFile.config, ...this.options });
  }

  /**
   * A timestamp representing when the context was initialized
   */
  public get timestamp(): number {
    return this.#timestamp;
  }

  public get logLevel(): LogLevelResolvedConfig {
    return resolveLogLevel(this.options.logLevel, this.options.mode);
  }

  /**
   * The environment paths for the project
   */
  public get envPaths(): EnvPaths {
    return getEnvPaths({
      orgId: this.options.organization,
      appId: this.options.framework || "powerlines",
      workspaceRoot: this.options.cwd
    });
  }

  /**
   * Creates a clone of the current context with the same configuration and workspace settings. This can be useful for running multiple builds in parallel or for creating isolated contexts for different parts of the build process.
   *
   * @remarks
   * The cloned context will have the same configuration and workspace settings as the original context, but will have a different build ID, release ID, and timestamp. The virtual file system and caches will also be separate between the original and cloned contexts.
   *
   * @returns A promise that resolves to the cloned context.
   */
  public async clone(): Promise<BaseContext> {
    const clone = new PowerlinesBaseContext();
    await clone.init(this.options);

    return clone;
  }

  /**
   * A logging function for fatal messages
   *
   * @param message - The message to log.
   */
  public fatal(message: string | LogMessage) {
    this.logger.error(
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for error messages
   *
   * @param message - The message to log.
   */
  public error(message: string | LogMessage) {
    this.logger.error(
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for warning messages
   *
   * @param message - The message to log.
   */
  public warn(message: string | LogMessage) {
    this.logger.warn(
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for informational messages
   *
   * @param message - The message to log.
   */
  public info(message: string | LogMessage) {
    this.logger.info(
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for debug messages
   *
   * @param message - The message to log.
   */
  public debug(message: string | LogMessage) {
    this.logger.debug(
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for trace messages
   *
   * @param message - The message to log.
   */
  public trace(message: string | LogMessage) {
    this.logger.trace(
      isString(message) ? message : StormJSON.stringify(message)
    );
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
   * Create a new logger instance
   *
   * @param options - The configuration options to use for the logger instance, which can be used to customize the appearance and behavior of the log messages generated by the logger. This is typically the name of the plugin or module that is creating the logger instance.
   * @returns A logger client instance that can be used to generate log messages with consistent formatting and metadata.
   */
  public createLogger(
    options: LoggerOptions,
    callback?: (message: string | LoggerMessage) => void
  ): Logger {
    return createLogger(
      this.options.name || this.options.framework || "powerlines",
      options,
      callback
    );
  }

  /**
   * Extend the base logger with additional configuration options
   *
   * @param options - The configuration options to extend the base logger with, which can be used to add additional metadata or customize the appearance of log messages generated by the logger. This is typically the name of the plugin or module that is creating the logger instance, as well as any additional metadata such as the plugin category or environment.
   * @returns A new logger client instance that extends the base logger with the provided configuration options.
   */
  public extendLogger(options: LoggerOptions): Logger {
    return extendLogger(this.logger, options);
  }

  /**
   * Initialize the context with the provided configuration options
   *
   * @remarks
   * This method will set up the resolver and load the user configuration file based on the provided options. It is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup.
   *
   * @param options - The configuration options to initialize the context with
   */
  protected async init(options: Partial<EngineOptions> = {}) {
    this.inputOptions = { ...options };

    if (!this.powerlinesPath) {
      const powerlinesPath = await resolvePackage("powerlines");
      if (!powerlinesPath) {
        throw new Error("Could not resolve `powerlines` package location.");
      }
      this.powerlinesPath = powerlinesPath;
    }

    const cwd = options.cwd || this.options?.cwd || process.cwd();
    const root = replacePath(
      (options.root || this.options?.root) &&
        (options.root || this.options.root).replace(/^\.\/?/, "") &&
        !isEqual(options.root || this.options.root, cwd)
        ? options.root || this.options.root
        : ".",
      cwd
    );

    this.options = defu(
      {
        root,
        cwd,
        mode: options.mode,
        logLevel: options.logLevel,
        framework: options.framework,
        organization: options.organization,
        configFile: options.configFile
      },
      this.options ?? {},
      {
        mode: "production",
        framework: "powerlines"
      }
    ) as ResolvedEngineOptions;

    this.resolver = createResolver({
      workspaceRoot: cwd,
      root,
      cacheDir: this.envPaths.cache,
      mode: this.options.mode,
      logLevel: this.logLevel
    });

    this.configFile = await loadUserConfigFile(this.options, this.resolver);
  }
}
