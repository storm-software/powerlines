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
  LogFn,
  Logger,
  LogLevel,
  ParsedUserConfig,
  ResolvedEngineOptions,
  Resolver
} from "@powerlines/core";
import { loadUserConfigFile } from "@powerlines/core/lib/config";
import { createLog, extendLog } from "@powerlines/core/lib/logger";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { EnvPaths, getEnvPaths } from "@stryke/env/get-env-paths";
import { resolvePackage } from "@stryke/fs/resolve";
import { StormJSON } from "@stryke/json/storm-json";
import { isNull } from "@stryke/type-checks/is-null";
import { isString } from "@stryke/type-checks/is-string";
import chalk from "chalk";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import defu from "defu";
import { UnpluginMessage } from "unplugin";
import { createResolver } from "../_internal/helpers/resolver";

export class PowerlinesBaseContext implements BaseContext {
  #timestamp: number = Date.now();

  #logLevel: LogLevel | null = "info";

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
   * The parsed configuration file for the project
   */
  public configFile!: ParsedUserConfig;

  /**
   * A timestamp representing when the context was initialized
   */
  public get timestamp(): Date {
    return new Date(this.#timestamp);
  }

  public get logLevel(): LogLevel | null {
    return this.#logLevel || "info";
  }

  public set logLevel(level: LogLevel | null) {
    this.#logLevel = level;
  }

  /**
   * The logger function
   */
  public get log(): LogFn {
    const level = this.logLevel || "info";
    if (!this.logger || this.logger.level !== level) {
      this.logger = {
        log: this.createLog(),
        level
      };
    }

    return this.logger.log;
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
  public fatal(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.FATAL,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for error messages
   *
   * @param message - The message to log.
   */
  public error(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.ERROR,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for warning messages
   *
   * @param message - The message to log.
   */
  public warn(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.WARN,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for informational messages
   *
   * @param message - The message to log.
   */
  public info(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.INFO,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for debug messages
   *
   * @param message - The message to log.
   */
  public debug(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.DEBUG,
      isString(message) ? message : StormJSON.stringify(message)
    );
  }

  /**
   * A logging function for trace messages
   *
   * @param message - The message to log.
   */
  public trace(message: string | UnpluginMessage) {
    this.log(
      LogLevelLabel.TRACE,
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
      this.log(
        LogLevelLabel.PERFORMANCE,
        `${chalk.bold.cyanBright(name)} completed in ${chalk.bold.cyanBright(
          duration < 1000
            ? `${duration.toFixed(2)} milliseconds`
            : formatDistanceToNowStrict(startDate)
        )}`
      );
    };
  }

  /**
   * Create a new logger instance
   *
   * @param name - The name to use for the logger instance
   * @returns A logger function
   */
  public createLog(name: string | null = null): LogFn {
    return createLog(name, {
      ...this.options,
      logLevel: isNull(this.logLevel) ? "silent" : this.logLevel
    });
  }

  /**
   * Extend the current logger instance with a new name
   *
   * @param name - The name to use for the extended logger instance
   * @returns A logger function
   */
  public extendLog(name: string): LogFn {
    return extendLog(this.log, name);
  }

  /**
   * A logger function specific to this context
   */
  protected logger!: Logger;

  /**
   * Initialize the context with the provided configuration options
   *
   * @remarks
   * This method will set up the resolver and load the user configuration file based on the provided options. It is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup.
   *
   * @param options - The configuration options to initialize the context with
   */
  protected async init(options: Partial<EngineOptions> = {}) {
    if (!this.powerlinesPath) {
      const powerlinesPath = await resolvePackage("powerlines");
      if (!powerlinesPath) {
        throw new Error("Could not resolve `powerlines` package location.");
      }
      this.powerlinesPath = powerlinesPath;
    }

    const cwd = options.cwd || this.options?.cwd || process.cwd();
    const root =
      (options.root || this.options?.root) &&
      (options.root || this.options.root).replace(/^\.\/?/, "") &&
      (options.root || this.options.root) !== cwd
        ? options.root || this.options.root
        : "./";

    this.options = defu(
      {
        root,
        cwd,
        mode: options.mode,
        framework: options.framework,
        organization: options.organization,
        configFile: options.configFile
      },
      this.options ?? {}
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
