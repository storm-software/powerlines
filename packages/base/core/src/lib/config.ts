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

import {
  getWorkspaceConfig,
  tryGetWorkspaceConfig
} from "@storm-software/config-tools/get-config";
import {
  isDevelopment,
  isProduction,
  isTest
} from "@stryke/env/environment-checks";
import { getEnvPaths } from "@stryke/env/get-env-paths";
import { existsSync } from "@stryke/fs/exists";
import { isFile } from "@stryke/fs/is-file";
import { readJsonFile } from "@stryke/fs/json";
import { appendPath } from "@stryke/path/append";
import { findFilePath, relativePath } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { camelCase } from "@stryke/string-format/camel-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { PartialKeys } from "@stryke/types/base";
import { PackageJson } from "@stryke/types/package-json";
import { loadConfig as loadConfigC12 } from "c12";
import defu from "defu";
import { resolveLogLevel } from "../plugin-utils/logging";
import type {
  FrameworkOptions,
  InlineConfig,
  Mode,
  ParsedUserConfig,
  UserConfig,
  WorkspaceConfig
} from "../types/config";
import { AnyUserConfig } from "../types/config";
import { Context } from "../types/context";
import { LogLevelResolvedConfig } from "../types/logging";
import { createResolver } from "./resolver";

export function normalizeBasePath(base: string = "/"): string {
  let out = base.startsWith("/") ? base : `/${base}`;
  if (!out.endsWith("/")) out = `${out}/`;
  return out.replace(/\/+/g, "/");
}

export interface ResolvePackageConfigsResult {
  /**
   * The parsed `package.json` file for the project, if it exists. This file typically contains metadata about the project, such as its name, version, dependencies, and other information relevant to the build process.
   */
  packageJson?: PackageJson;

  /**
   * The parsed `project.json` file for the project, if it exists. This file is an optional configuration file that can be used to store additional configuration or metadata specific to the project, and is not required for all projects.
   */
  projectJson?: Record<string, unknown>;
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
export async function resolvePackageConfigs(
  cwd: string,
  root: string
): Promise<ResolvePackageConfigsResult> {
  const result: ResolvePackageConfigsResult = {};
  if (cwd || root) {
    const projectJsonPath = joinPaths(
      appendPath(root || ".", cwd || "."),
      "project.json"
    );
    if (existsSync(projectJsonPath)) {
      result.projectJson = await readJsonFile(projectJsonPath);
    }

    const packageJsonPath = joinPaths(
      appendPath(root || ".", cwd || "."),
      "package.json"
    );
    if (existsSync(packageJsonPath)) {
      result.packageJson = await readJsonFile<PackageJson>(packageJsonPath);
    }
  }

  return result;
}

/**
 * Resolve the root directory for the project based on the provided options. This function will determine the root directory by checking the provided `root` option, and if it is not provided, it will look for a configuration file (such as `powerlines.config.ts`) in the current working directory. If a configuration file is found, the root directory will be set to the directory containing that file. If no configuration file is found, the root directory will default to the current working directory.
 *
 * @param cwd - The current working directory to use as the base for resolving the root directory. This is typically the directory from which the Powerlines process was executed.
 * @param root - An optional root directory to use for the project. If provided, this will be used as the root directory instead of looking for a configuration file. This can be an absolute or relative path, and if it is relative, it will be resolved based on the current working directory.
 * @param configFile - An optional path to a configuration file to look for when resolving the root directory. If provided, this file will be used to determine the root directory if the `root` option is not provided. This can be an absolute or relative path, and if it is relative, it will be resolved based on the current working directory.
 * @returns The resolved root directory for the project, which will be used as the base for resolving other paths and configurations throughout the Powerlines process. This will typically be an absolute path to the root directory of the project.
 */
export function resolveRoot(
  cwd: string,
  root?: string,
  configFile?: string
): string {
  let result = root || ".";
  if (!root) {
    if (configFile) {
      const configFilePath = appendPath(configFile, cwd);
      if (!existsSync(configFilePath)) {
        throw new Error(
          `The user-provided configuration file at "${configFile}" does not exist. Please ensure this path is correct and try again.`
        );
      }
      if (!isFile(configFile)) {
        throw new Error(
          `The user-provided configuration file at "${
            configFile
          }" is not a file. Please ensure this path is correct and try again.`
        );
      }

      result = relativePath(cwd, findFilePath(configFile));
    }
  } else {
    result = replacePath(root, cwd);
  }

  return result;
}

/**
 * Retrieve the workspace configuration for the current project, if it exists. This function will look for a configuration file in the project root and return its contents as a JavaScript object. If no configuration file is found, it will return undefined.
 *
 * @param cwd - The current working directory to start searching from. This is typically the directory from which the Powerlines process was executed.
 * @param root - An optional root directory to use as the base for searching for the configuration file. If provided, this will be used as the starting point for searching for the configuration file instead of the current working directory. This can be an absolute or relative path, and if it is relative, it will be resolved based on the current working directory.
 * @returns A promise that resolves to the workspace configuration object, or undefined if no configuration file is found.
 */
export async function tryResolveWorkspaceConfig(
  cwd: string,
  root?: string
): Promise<WorkspaceConfig | undefined> {
  return tryGetWorkspaceConfig(false, {
    cwd: root ? appendPath(root, cwd) : undefined,
    workspaceRoot: cwd
  });
}

/**
 * Determine the default mode for the current execution based on the environment and workspace configuration. This function will check the `NODE_ENV` environment variable to determine if the current environment is development, production, or test. If `NODE_ENV` is not set, it will look for a `mode` property in the workspace configuration file. If no mode is specified in the workspace configuration, it will default to "production".
 *
 * @remarks
 * The mode is used to determine which configuration file to load (e.g., `powerlines.development.config.js` for development mode, `powerlines.production.config.js` for production mode, etc.) and can also be used by plugins and other parts of the build process to conditionally apply certain behaviors based on the current mode.
 *
 * @param cwd - The current working directory to start searching from. This is typically the directory from which the Powerlines process was executed.
 * @param root - An optional root directory to use as the base for searching for the workspace configuration. If provided, this will be used as the starting point for searching for the workspace configuration instead of the current working directory. This can be an absolute or relative path, and if it is relative, it will be resolved based on the current working directory.
 * @returns A promise that resolves to the default mode for the current execution, which can be "development", "production", or "test".
 */
export async function getDefaultMode(
  cwd: string,
  root?: string
): Promise<Mode> {
  const workspaceConfig = await tryResolveWorkspaceConfig(cwd, root);

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
 * @remarks
 * The log level is used to determine which log messages should be output during the execution of the Powerlines process. For example, if the log level is set to "warn", only messages with a level of "warn", "error", or "fatal" will be output, while messages with a level of "info", "debug", or "trace" will be suppressed. This allows users to control the verbosity of the logs and focus on the most relevant information based on their current needs.
 *
 * @param cwd - The current working directory to start searching from. This is typically the directory from which the Powerlines process was executed.
 * @param root - An optional root directory to use as the base for searching for the workspace configuration. If provided, this will be used as the starting point for searching for the workspace configuration instead of the current working directory. This can be an absolute or relative path, and if it is relative, it will be resolved based on the current working directory.
 * @returns A promise that resolves to the default log level for the current execution, which can be "fatal", "error", "warn", "info", "debug", or "trace".
 */
export async function getDefaultLogLevel(
  cwd: string,
  root?: string
): Promise<LogLevelResolvedConfig> {
  const workspaceConfig = await tryResolveWorkspaceConfig(cwd, root);

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
    workspaceConfig?.mode || (await getDefaultMode(cwd, root))
  );
}

/**
 * Load the user configuration file for the project and set up the context with the loaded configuration. This function will be called during the initialization of the context to load the user configuration file based on the provided options and set up the context accordingly. It will also set up the resolver for loading modules from the user configuration file and ensure that the context is properly initialized with the loaded configuration.
 *
 * @remarks
 * This method will set up the resolver and load the user configuration file based on the provided options. It is called during the construction of the context and can also be called when cloning the context to ensure that the new context has the same configuration and resolver setup.
 *
 * @param cwd - The current working directory to start searching from. This is typically the directory from which the Powerlines process was executed.
 * @param root - The root directory of the project to look for the configuration file. This is typically the root directory of the project, which may be different from the current working directory if the process was executed from a subdirectory.
 * @param framework - The name of the framework to use when looking for configuration files (default is "powerlines"). This is used to determine the naming convention for the configuration files to look for (e.g., `powerlines.development.config.js` for the "powerlines" framework in development mode).
 * @param orgId - The name of the organization to use when looking for configuration files (optional). This can be used to further customize the naming convention for the configuration files to look for (e.g., `powerlines.myorg.development.config.js` for the "powerlines" framework in development mode with an organization of "myorg").
 * @param inlineConfig - The inline configuration options provided during the execution of a Powerlines command, which can include properties such as the project root, mode, and an explicit path to a configuration file. This is used to determine how the context should be initialized and which configuration file should be loaded for the execution.
 * @returns A promise that resolves when the context has been successfully initialized with the loaded configuration and resolver setup.
 * @throws Will throw an error if no configuration file is found in the project root or current working directory. This ensures that the context cannot be initialized without a valid configuration, which is essential for the proper functioning of the Powerlines process.
 */
export async function loadParsedConfig(
  cwd: string,
  root: string,
  framework: string,
  orgId: string,
  inlineConfig: InlineConfig
) {
  const mode = inlineConfig.mode || (await getDefaultMode(cwd, root));

  const configFile = await loadUserConfigFile(
    cwd,
    root,
    mode,
    inlineConfig.command,
    { name: framework, orgId },
    inlineConfig.configFile
  );
  if (!configFile) {
    throw new Error(
      `No configuration file found in ${appendPath(
        root,
        cwd
      )}. Please ensure you have a valid configuration file in your project.`
    );
  }

  return configFile;
}

export type PartiallyResolvedContext<TContext extends Context = Context> = Omit<
  TContext,
  "config" | "tsconfig" | "entry" | "fs" | "compiler" | "unimport"
> &
  Partial<TContext> & {
    config: TContext["config"];
  };

/**
 * Loads the workspace configuration.
 *
 * @param cwd - The root directory of the workspace.
 * @param root - The current working directory to start searching from.
 * @returns A promise that resolves to the loaded workspace configuration.
 */
export async function loadWorkspaceConfig(
  cwd: string,
  root: string
): Promise<WorkspaceConfig> {
  return defu(
    {
      workspaceRoot: cwd
    },
    await getWorkspaceConfig(true, {
      cwd: root,
      workspaceRoot: cwd,
      useDefault: true
    })
  );
}

/**
 * Loads the user configuration file for the project.
 *
 * @remarks
 * This function will attempt to locate and load the user configuration file for the project based on the provided parameters. It will look for configuration files in various formats (e.g., `.ts`, `.js`, `.mts`, `.mjs`) and with different naming conventions (e.g., `powerlines.config.ts`, `powerlines.development.config.js`, etc.) in the project root and current working directory. If a configuration file is found, it will be loaded using a Jiti resolver, and the resulting configuration object will be returned. If no configuration file is found, an empty configuration object will be returned.
 *
 * @param cwd - The current working directory to start searching from.
 * @param root - The root directory of the project.
 * @param mode - The mode to determine which configuration file to load (e.g., "development", "test", "production").
 * @param command - The command being executed (e.g., "build", "dev", "test"), which can be used to further customize the configuration loading logic if needed.
 * @param framework - The name of the framework to use when looking for configuration files (default is "powerlines").
 * @param configFile - An explicit path to a configuration file to load (optional). If provided, this file will be loaded instead of searching for configuration files based on the mode and framework.
 * @returns A promise that resolves to the resolved user configuration.
 */
export async function loadUserConfigFile(
  cwd: string,
  root: string,
  mode: Mode,
  command: string,
  framework?: PartialKeys<FrameworkOptions, "orgId">,
  configFile?: string
): Promise<ParsedUserConfig> {
  const frameworkName = kebabCase(framework?.name || "powerlines");
  const frameworkOrgId = kebabCase(framework?.orgId || "storm-software");

  let resolvedUserConfig: Partial<ParsedUserConfig> = {};

  let resolvedUserConfigFile: string | undefined;
  if (configFile) {
    resolvedUserConfigFile = existsSync(replacePath(configFile, root))
      ? replacePath(configFile, root)
      : existsSync(
            joinPaths(appendPath(root, cwd), replacePath(configFile, root))
          )
        ? joinPaths(appendPath(root, cwd), replacePath(configFile, root))
        : existsSync(joinPaths(appendPath(root, cwd), configFile))
          ? joinPaths(appendPath(root, cwd), configFile)
          : undefined;
  }

  if (!resolvedUserConfigFile) {
    resolvedUserConfigFile = existsSync(
      joinPaths(appendPath(root, cwd), `${frameworkName}.${mode}.config.ts`)
    )
      ? joinPaths(appendPath(root, cwd), `${frameworkName}.${mode}.config.ts`)
      : existsSync(
            joinPaths(
              appendPath(root, cwd),
              `${frameworkName}.${mode}.config.js`
            )
          )
        ? joinPaths(appendPath(root, cwd), `${frameworkName}.${mode}.config.js`)
        : existsSync(
              joinPaths(
                appendPath(root, cwd),
                `${frameworkName}.${mode}.config.mts`
              )
            )
          ? joinPaths(
              appendPath(root, cwd),
              `${frameworkName}.${mode}.config.mts`
            )
          : existsSync(
                joinPaths(
                  appendPath(root, cwd),
                  `${frameworkName}.${mode}.config.mjs`
                )
              )
            ? joinPaths(
                appendPath(root, cwd),
                `${frameworkName}.${mode}.config.mjs`
              )
            : existsSync(
                  joinPaths(appendPath(root, cwd), `${frameworkName}.config.ts`)
                )
              ? joinPaths(appendPath(root, cwd), `${frameworkName}.config.ts`)
              : existsSync(
                    joinPaths(
                      appendPath(root, cwd),
                      `${frameworkName}.config.js`
                    )
                  )
                ? joinPaths(appendPath(root, cwd), `${frameworkName}.config.js`)
                : existsSync(
                      joinPaths(
                        appendPath(root, cwd),
                        `${frameworkName}.config.mts`
                      )
                    )
                  ? joinPaths(
                      appendPath(root, cwd),
                      `${frameworkName}.config.mts`
                    )
                  : existsSync(
                        joinPaths(
                          appendPath(root, cwd),
                          `${frameworkName}.config.mjs`
                        )
                      )
                    ? joinPaths(
                        appendPath(root, cwd),
                        `${frameworkName}.config.mjs`
                      )
                    : undefined;
  }

  const envPaths = getEnvPaths({
    orgId: frameworkOrgId,
    appId: frameworkName,
    workspaceRoot: cwd
  });

  const jiti = createResolver({
    cwd,
    root,
    cacheDir: envPaths.cache,
    mode
  });

  if (resolvedUserConfigFile) {
    const resolved = await jiti.import<{ default: AnyUserConfig }>(
      jiti.esmResolve(resolvedUserConfigFile)
    );
    if (resolved?.default) {
      let config = {};
      if (isFunction(resolved.default)) {
        config = await Promise.resolve(
          resolved.default({ root, cwd, mode, command })
        );
      } else if (
        isSetObject(resolved.default) ||
        Array.isArray(resolved.default)
      ) {
        config = resolved.default;
      }

      if (isSetObject(config) || Array.isArray(config)) {
        resolvedUserConfig = {
          ...config,
          config,
          configFile: resolvedUserConfigFile
        };
      }
    }
  }

  const result = await loadConfigC12({
    cwd: root,
    name: framework?.name,
    envName: mode,
    globalRc: true,
    packageJson: camelCase(framework?.name || "powerlines"),
    dotenv: true,
    jiti
  });

  return defu(
    {
      config: {
        root,
        cwd,
        framework
      }
    },
    resolvedUserConfig,
    isSetObject(result?.config) ? { ...result.config, ...result } : {}
  );
}

/**
 * A type helper to make it easier to use `powerlines.config.ts` files.
 *
 * @remarks
 * The function accepts a direct {@link AnyUserConfig} object/function and returns it typed as a {@link UserConfig} object.
 */
export function defineConfig(config: AnyUserConfig): UserConfig {
  return config as any;
}
