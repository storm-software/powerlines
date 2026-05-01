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
  UserConfig,
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
import { isFile, readJsonFile } from "@stryke/fs";
import { resolvePackage } from "@stryke/fs/resolve";
import { findFilePath, joinPaths, relativePath } from "@stryke/path";
import { appendPath } from "@stryke/path/append";
import { replacePath } from "@stryke/path/replace";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { DeepPartial, RequiredKeys } from "@stryke/types/base";
import { PackageJson } from "@stryke/types/package-json";
import chalk from "chalk";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";
import defu from "defu";
import { existsSync } from "node:fs";
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
   * The options provided to the Powerlines process, resolved with default values and merged with any configuration provided by plugins or other sources. This is typically the final configuration used during the build process, but may also include additional options that are relevant to the context and its interactions with the Powerlines engine.
   */
  public options!: RequiredKeys<
    EngineOptions,
    "mode" | "cwd" | "root" | "framework"
  >;

  /**
   * The parsed `package.json` file for the project
   */
  public packageJson!: PackageJson;

  /**
   * The parsed `project.json` file for the project
   */
  public projectJson: Record<string, any> | undefined = undefined;

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
      this.options.name || this.options.root || "powerlines",
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
   * The input options used to initialize the context, which may be used when cloning the context to ensure the same configuration is applied to the new context
   */
  protected initialOptions: EngineOptions = {};

  /**
   * The initial configuration provided when initializing the context, which may be used during the setup process to ensure that the configuration is properly merged and applied to the context. This is typically the user configuration provided in the Powerlines configuration file, but may also include additional configuration options provided by plugins or other sources.
   */
  protected initialConfig: DeepPartial<UserConfig> = {};

  /**
   * Initialize the context with the provided configuration options and set up the resolver and user configuration file. This method is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup as the original context.
   *
   * @param options - The configuration options to initialize the context with, which can include properties such as the project root, mode, log level, and other settings that affect the behavior of the context and its plugins.
   * @param initialConfig - The initial configuration to initialize the context with, which is typically the user configuration provided in the Powerlines configuration file. This can also include additional configuration options provided by plugins or other sources that should be merged with the user configuration during initialization
   */
  protected constructor(
    options: EngineOptions,
    initialConfig: DeepPartial<UserConfig> = {}
  ) {
    this.initialOptions = options;
    this.initialConfig = initialConfig;
  }

  /**
   * Retrieve the workspace configuration for the current project, if it exists. This function will look for a configuration file in the project root and return its contents as a JavaScript object. If no configuration file is found, it will return undefined.
   *
   * @returns A promise that resolves to the workspace configuration object, or undefined if no configuration file is found.
   */
  protected async getWorkspaceConfig(): Promise<WorkspaceConfig | undefined> {
    return tryGetWorkspaceConfig(
      false,
      this.options || this.initialOptions
        ? {
            cwd:
              this.options?.root || this.initialOptions?.root
                ? appendPath(
                    this.options?.root || this.initialOptions?.root || ".",
                    this.options?.cwd || this.initialOptions?.cwd
                  )
                : undefined,
            workspaceRoot: this.options?.cwd || this.initialOptions?.cwd
          }
        : undefined
    );
  }

  /**
   * Initialize the context with the provided configuration options
   *
   * @remarks
   * This method will set up the resolver and load the user configuration file based on the provided options. It is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup.
   */
  protected async init() {
    if (!this.powerlinesPath) {
      const powerlinesPath = await resolvePackage("powerlines");
      if (!powerlinesPath) {
        throw new Error("Could not resolve `powerlines` package location.");
      }
      this.powerlinesPath = powerlinesPath;
    }

    this.options = defu(this.initialOptions, this.initialConfig, {
      cwd: process.cwd(),
      mode: await this.getDefaultMode(),
      logLevel: await this.getDefaultLogLevel(),
      framework: "powerlines"
    }) as RequiredKeys<EngineOptions, "mode" | "cwd" | "root" | "framework">;

    if (!this.options.root) {
      if (this.options.configFile) {
        const configFile = appendPath(
          this.options.configFile,
          this.options.cwd
        );
        if (!existsSync(configFile)) {
          throw new Error(
            `The user-provided configuration file at "${
              this.options.configFile
            }" does not exist. Please ensure this path is correct and try again.`
          );
        }
        if (!isFile(configFile)) {
          throw new Error(
            `The user-provided configuration file at "${
              this.options.configFile
            }" is not a file. Please ensure this path is correct and try again.`
          );
        }

        this.options.root = relativePath(
          this.options.cwd,
          findFilePath(configFile)
        );
      } else {
        this.options.root = ".";
      }
    } else {
      this.options.root = replacePath(this.options.root, this.options.cwd);
    }

    this.resolver = createResolver({
      workspaceRoot: this.options.cwd,
      root: this.options.root,
      cacheDir: this.envPaths.cache,
      mode: this.options.mode
    });

    await this.resolvePackageConfigs();

    this.configFile = await loadUserConfigFile(this.options, this.resolver);
    if (this.configFile.config) {
      if (isSetString(this.configFile.configFile)) {
        this.options.configFile ??= replacePath(
          this.configFile.configFile,
          this.options.cwd
        );
      }

      if (!this.options.name) {
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
        this.options.name = this.projectJson?.name || this.packageJson?.name;
      }
    }
  }

  /**
   * Resolve the package configurations for the project by loading the `package.json` and `project.json` files, if they exist. This function will look for these files in the project root and parse their contents as JavaScript objects. The parsed contents will be stored in the context for later use by plugins and other parts of the build process.
   *
   * @remarks
   * The `package.json` file is typically used to store metadata about the project, such as its name, version, dependencies, and other information. The `project.json` file is an optional file that can be used to store additional configuration or metadata specific to the project, and is not required for all projects.
   *
   * @param cwd - The current working directory to look for the package configurations. Defaults to the `cwd` specified in the context configuration.
   * @param root - The root directory of the project to look for the package configurations. Defaults to the `root` specified in the context configuration.
   * @returns A promise that resolves when the package configurations have been loaded and stored in the context.
   */
  protected async resolvePackageConfigs(
    cwd: string = this.options.cwd,
    root: string = this.options.root
  ) {
    if (cwd || root) {
      const projectJsonPath = joinPaths(
        appendPath(root || ".", cwd || "."),
        "project.json"
      );
      if (existsSync(projectJsonPath)) {
        this.projectJson = await readJsonFile(projectJsonPath);
      }

      const packageJsonPath = joinPaths(
        appendPath(root || ".", cwd || "."),
        "package.json"
      );
      if (existsSync(packageJsonPath)) {
        this.packageJson = await readJsonFile<PackageJson>(packageJsonPath);
        this.options.organization ??= isSetObject(this.packageJson?.author)
          ? kebabCase(this.packageJson?.author?.name)
          : kebabCase(this.packageJson?.author);
      }
    }
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
        this.initialOptions?.mode ||
        workspaceConfig?.mode ||
        (await this.getDefaultMode())
    );
  }
}
