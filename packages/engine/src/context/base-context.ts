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
  LoggerOptions,
  LogLevelResolvedConfig,
  LogMessage,
  Mode,
  ParsedUserConfig,
  Resolver,
  WorkspaceConfig
} from "@powerlines/core";
import { loadUserConfigFile } from "@powerlines/core/lib/config";
import { resolveLogLevel } from "@powerlines/core/plugin-utils";
import {
  createLogger,
  extendLogger
} from "@powerlines/core/plugin-utils/logging";
import { tryGetWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  isDevelopment,
  isProduction,
  isTest
} from "@stryke/env/environment-checks";
import { EnvPaths, getEnvPaths } from "@stryke/env/get-env-paths";
import { readJsonFile } from "@stryke/fs";
import { resolvePackage } from "@stryke/fs/resolve";
import { joinPaths } from "@stryke/path";
import { appendPath } from "@stryke/path/append";
import { isEqual } from "@stryke/path/is-equal";
import { replacePath } from "@stryke/path/replace";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import chalk from "chalk";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import defu from "defu";
import { existsSync } from "node:fs";
import { UserConfig } from "tsdown/config";
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
  public options!: EngineOptions;

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
    return this.createLogger({});
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
    this.logger.error(message);
  }

  /**
   * A logging function for error messages
   *
   * @param message - The message to log.
   */
  public error(message: string | LogMessage) {
    this.logger.error(message);
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
   * Create a new logger instance
   *
   * @param options - The configuration options to use for the logger instance, which can be used to customize the appearance and behavior of the log messages generated by the logger. This is typically the name of the plugin or module that is creating the logger instance.
   * @param logFn - The custom logging function to use for logging messages, which can be used to override the default logging behavior of the original logger.
   * @returns A logger client instance that can be used to generate log messages with consistent formatting and metadata.
   */
  public createLogger(options: LoggerOptions, logFn?: LogFn): Logger {
    return createLogger(
      this.options.name || this.options.root,
      { ...this.configFile.config, ...this.options, ...options },
      logFn
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
   * Retrieve the workspace configuration for the current project, if it exists. This function will look for a configuration file in the project root and return its contents as a JavaScript object. If no configuration file is found, it will return undefined.
   *
   * @returns A promise that resolves to the workspace configuration object, or undefined if no configuration file is found.
   */
  protected async getWorkspaceConfig(): Promise<WorkspaceConfig | undefined> {
    return tryGetWorkspaceConfig(
      false,
      this.options || this.inputOptions
        ? {
            cwd:
              this.options?.root || this.inputOptions?.root
                ? appendPath(
                    this.options?.root || this.inputOptions?.root || ".",
                    this.options?.cwd || this.inputOptions?.cwd
                  )
                : undefined,
            workspaceRoot: this.options?.cwd || this.inputOptions?.cwd
          }
        : undefined
    );
  }

  /**
   * Determine the default mode for the current execution based on the environment and workspace configuration. This function will check the `NODE_ENV` environment variable to determine if the current environment is development, production, or test. If `NODE_ENV` is not set, it will look for a `mode` property in the workspace configuration file. If no mode is specified in the workspace configuration, it will default to "production".
   *
   * @returns A promise that resolves to the default mode for the current execution, which can be "development", "production", or "test".
   */
  protected async getDefaultMode(): Promise<Mode> {
    const workspaceConfig = await this.getWorkspaceConfig();

    return isProduction
      ? "production"
      : isDevelopment
        ? "development"
        : isTest
          ? "test"
          : workspaceConfig?.mode || "production";
  }

  /**
   * Determine the default log level for the current execution based on the environment and workspace configuration. This function will check the `logLevel` property in the workspace configuration file and resolve it to a `LogLevelResolvedConfig` value. If no log level is specified in the workspace configuration, it will default to "info" for development mode and "warn" for production mode.
   *
   * @returns A promise that resolves to the default log level for the current execution, which can be "fatal", "error", "warn", "info", "debug", or "trace".
   */
  protected async getDefaultLogLevel(): Promise<LogLevelResolvedConfig> {
    const workspaceConfig = await this.getWorkspaceConfig();

    return resolveLogLevel(
      workspaceConfig?.logLevel
        ? workspaceConfig.logLevel === "success" ||
          workspaceConfig.logLevel === "performance"
          ? "info"
          : workspaceConfig.logLevel === "all"
            ? "debug"
            : workspaceConfig.logLevel === "fatal"
              ? "error"
              : workspaceConfig.logLevel
        : undefined,
      this.options?.mode ||
        this.inputOptions?.mode ||
        workspaceConfig?.mode ||
        (await this.getDefaultMode())
    );
  }

  /**
   * Initialize the context with the provided configuration options
   *
   * @remarks
   * This method will set up the resolver and load the user configuration file based on the provided options. It is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup.
   *
   * @param options - The configuration options to initialize the context with
   */
  protected async init(options: EngineOptions) {
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
        name: options.name,
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
        mode: await this.getDefaultMode(),
        logLevel: await this.getDefaultLogLevel()
      }
    );

    this.resolver = createResolver({
      workspaceRoot: cwd,
      root,
      cacheDir: this.envPaths.cache,
      mode: this.options.mode
    });

    this.configFile = await loadUserConfigFile(this.options, this.resolver);
    if (!this.options.name) {
      if (this.configFile.config) {
        if (
          isSetObject(this.configFile.config) &&
          isSetString((this.configFile.config as UserConfig).name)
        ) {
          this.options.name = (this.configFile.config as UserConfig).name;
        } else if (Array.isArray(this.configFile.config)) {
          for (const config of this.configFile.config) {
            if (
              isSetObject(config) &&
              isSetString((config as UserConfig).name)
            ) {
              this.options.name = (config as UserConfig).name;
              break;
            }
          }
        }
      }

      if (!this.options.name) {
        const packageJsonPath = joinPaths(
          appendPath(this.options.root, this.options.cwd),
          "package.json"
        );
        if (existsSync(packageJsonPath)) {
          const packageJson = await readJsonFile(packageJsonPath);
          this.options.name = packageJson.name;
        }

        if (!this.options.name) {
          const projectJsonPath = joinPaths(
            appendPath(this.options.root, this.options.cwd),
            "project.json"
          );
          if (existsSync(projectJsonPath)) {
            const projectJson = await readJsonFile(projectJsonPath);
            this.options.name = projectJson.name;
          }
        }
      }
    }
  }
}
