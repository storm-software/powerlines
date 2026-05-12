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

import { toArray } from "@stryke/convert/to-array";
import { install } from "@stryke/fs/install";
import { isPackageExists } from "@stryke/fs/package-fns";
import { joinPaths } from "@stryke/path/join";
import { isError } from "@stryke/type-checks/is-error";
import { isFunction } from "@stryke/type-checks/is-function";
import { isNumber } from "@stryke/type-checks/is-number";
import { isPromiseLike } from "@stryke/type-checks/is-promise";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { MaybePromise } from "@stryke/types/base";
import chalk from "chalk";
import {
  findInvalidPluginConfig,
  isDuplicate,
  isPlugin,
  isPluginConfig,
  isPluginConfigObject,
  isPluginConfigTuple
} from "../plugin-utils";
import type {
  EnvironmentContext,
  ExecutionContext,
  Plugin,
  PluginConfig,
  PluginConfigTuple,
  PluginContext,
  PluginFactory,
  ResolvedConfig
} from "../types";

/**
 * Resolve a plugin module based on the provided plugin path. This function checks if the plugin package is installed, attempts to import the plugin module, and handles various error cases such as missing packages or invalid module exports. It supports both direct plugin exports and plugins exported from a "plugin" subdirectory within the package.
 *
 * @param context - The execution context in which the plugin will be initialized. This context provides access to configuration, logging, and other utilities that may be needed during plugin initialization.
 * @param pluginPath - The path to the plugin module. This can be a package name, a scoped package name, or a path to a local module.
 * @returns A promise that resolves to the plugin module, which can be a plugin instance, a factory function that returns a plugin, or an array of plugins.
 */
export async function resolvePlugin<
  TResolvedConfig extends ResolvedConfig,
  TSystemContext,
  TContext extends
    | EnvironmentContext<TResolvedConfig, TSystemContext>
    | ExecutionContext<TResolvedConfig, TSystemContext> =
    | EnvironmentContext<TResolvedConfig, TSystemContext>
    | ExecutionContext<TResolvedConfig, TSystemContext>,
  TPluginContext extends PluginContext<TResolvedConfig, TSystemContext> =
    PluginContext<TResolvedConfig, TSystemContext>
>(
  context: TContext,
  pluginPath: string
): Promise<
  | Plugin<TPluginContext>
  | Plugin<TPluginContext>[]
  | ((
      options?: any
    ) => MaybePromise<Plugin<TPluginContext> | Plugin<TPluginContext>[]>)
> {
  if (
    pluginPath.startsWith("@") &&
    pluginPath.split("/").filter(Boolean).length > 2
  ) {
    const splits = pluginPath.split("/").filter(Boolean);
    pluginPath = `${splits[0]}/${splits[1]}`;
  }

  const isInstalled = isPackageExists(pluginPath, {
    paths: [context.config.cwd, context.config.root]
  });
  if (!isInstalled && context.config.autoInstall) {
    context.warn(
      `The plugin package "${
        pluginPath
      }" is not installed. It will be installed automatically.`
    );

    const result = await install(pluginPath, {
      cwd: context.config.root
    });
    if (isNumber(result.exitCode) && result.exitCode > 0) {
      context.error(result.stderr);

      throw new Error(
        `An error occurred while installing the build plugin package "${
          pluginPath
        }" `
      );
    }
  }

  try {
    // First check if the package has a "plugin" subdirectory - @scope/package/plugin
    const module = await context.resolver.plugin.import<{
      plugin?:
        | Plugin<TPluginContext>
        | ((options?: any) => MaybePromise<Plugin<TPluginContext>>);
      default?:
        | Plugin<TPluginContext>
        | ((options?: any) => MaybePromise<Plugin<TPluginContext>>);
    }>(context.resolver.plugin.esmResolve(joinPaths(pluginPath, "plugin")));

    const result = module.plugin ?? module.default;
    if (!result) {
      throw new Error(
        `The plugin package "${pluginPath}" does not export a valid module.`
      );
    }

    return result;
  } catch (error) {
    try {
      const module = await context.resolver.plugin.import<{
        plugin?:
          | Plugin<TPluginContext>
          | ((options?: any) => MaybePromise<Plugin<TPluginContext>>);
        default?:
          | Plugin<TPluginContext>
          | ((options?: any) => MaybePromise<Plugin<TPluginContext>>);
      }>(context.resolver.plugin.esmResolve(pluginPath));

      const result = module.plugin ?? module.default;
      if (!result) {
        throw new Error(
          `The plugin package "${pluginPath}" does not export a valid module.`
        );
      }

      return result;
    } catch {
      if (!isInstalled) {
        throw new Error(
          `The plugin package "${
            pluginPath
          }" is not installed. Please install the package using the command: "npm install ${
            pluginPath
          } --save-dev"`
        );
      } else {
        throw new Error(
          `An error occurred while importing the build plugin package "${
            pluginPath
          }":
${isError(error) ? error.message : String(error)}

Note: Please ensure the plugin package's default export is a class that extends \`Plugin\` with a constructor that excepts a single arguments of type \`PluginOptions\`.`
        );
      }
    }
  }
}

/**
 * Initialize a plugin based on the provided plugin configuration. This function handles various forms of plugin configurations, including direct plugin instances, factory functions, string paths to plugins, and arrays of plugins or plugin configurations. It validates the plugin configuration, resolves any plugin paths, and returns an array of initialized plugins.
 *
 * @param context - The execution context in which the plugin will be initialized. This context provides access to configuration, logging, and other utilities that may be needed during plugin initialization.
 * @param config - The plugin configuration, which can be in various forms such as a direct plugin instance, a string path to a plugin, a factory function that returns a plugin, or an array of plugins or plugin configurations. This configuration will be processed and validated to initialize the appropriate plugins.
 * @returns A promise that resolves to an array of initialized plugins based on the provided configuration. If the configuration is invalid, an error will be thrown with details about the issue.
 */
export async function initPlugin<
  TResolvedConfig extends ResolvedConfig,
  TSystemContext,
  TContext extends
    | EnvironmentContext<TResolvedConfig, TSystemContext>
    | ExecutionContext<TResolvedConfig, TSystemContext> =
    | EnvironmentContext<TResolvedConfig, TSystemContext>
    | ExecutionContext<TResolvedConfig, TSystemContext>,
  TPluginContext extends PluginContext<TResolvedConfig, TSystemContext> =
    PluginContext<TResolvedConfig, TSystemContext>
>(
  context: TContext,
  config: PluginConfig<TPluginContext>
): Promise<Plugin<TPluginContext>[] | null> {
  let awaited = config;
  if (isPromiseLike(config)) {
    awaited = (await Promise.resolve(
      config as Promise<any>
    )) as PluginConfig<TPluginContext>;
  }

  if (!isPluginConfig<TPluginContext>(awaited)) {
    const invalid = findInvalidPluginConfig(awaited);

    throw new Error(
      `Invalid ${
        invalid && invalid.length > 1 ? "plugins" : "plugin"
      } specified in the configuration - ${
        invalid && invalid.length > 0
          ? JSON.stringify(awaited)
          : invalid?.join("\n\n")
      } \n\nPlease ensure the value is one of the following: \n - an instance of \`Plugin\` \n - a plugin name \n - an object with the \`plugin\` and \`options\` properties \n - a tuple array with the plugin and options \n - a factory function that returns a plugin or array of plugins \n - an array of plugins or plugin configurations`
    );
  }

  let plugins!: Plugin<TPluginContext>[];
  if (isPlugin<TPluginContext>(awaited)) {
    plugins = [awaited];
  } else if (isFunction(awaited)) {
    plugins = toArray(await Promise.resolve(awaited()));
  } else if (isString(awaited)) {
    const resolved = await resolvePlugin<
      TResolvedConfig,
      TSystemContext,
      TContext
    >(context, awaited);
    if (isFunction(resolved)) {
      plugins = toArray(await Promise.resolve(resolved()));
    } else {
      plugins = toArray(resolved);
    }
  } else if (
    Array.isArray(awaited) &&
    (awaited as TPluginContext[]).every(isPlugin<TPluginContext>)
  ) {
    plugins = awaited as Plugin<TPluginContext>[];
  } else if (
    Array.isArray(awaited) &&
    (awaited as PluginConfig<TPluginContext>[]).every(
      isPluginConfig<TPluginContext>
    )
  ) {
    plugins = [];
    for (const pluginConfig of awaited as PluginConfig<TPluginContext>[]) {
      const initialized = await initPlugin<
        TResolvedConfig,
        TSystemContext,
        TContext,
        TPluginContext
      >(context, pluginConfig);
      if (initialized) {
        plugins.push(...initialized);
      }
    }
  } else if (
    isPluginConfigTuple<TPluginContext>(awaited) ||
    isPluginConfigObject<TPluginContext>(awaited)
  ) {
    let pluginConfig!:
      | string
      | PluginFactory<TPluginContext>
      | Plugin<TPluginContext>;
    let pluginOptions: any;

    if (isPluginConfigTuple<TPluginContext>(awaited)) {
      pluginConfig = awaited[0] as Plugin<TPluginContext>;
      pluginOptions =
        (awaited as PluginConfigTuple)?.length === 2 ? awaited[1] : undefined;
    } else {
      pluginConfig = awaited.plugin as Plugin<TPluginContext>;
      pluginOptions = awaited.options;
    }

    if (isSetString(pluginConfig)) {
      const resolved = await resolvePlugin<
        TResolvedConfig,
        TSystemContext,
        TContext,
        TPluginContext
      >(context, pluginConfig);
      if (isFunction(resolved)) {
        plugins = toArray(
          await Promise.resolve(
            pluginOptions ? resolved(pluginOptions) : resolved()
          )
        );
      } else {
        plugins = toArray(resolved);
      }
    } else if (isFunction(pluginConfig)) {
      plugins = toArray(await Promise.resolve(pluginConfig(pluginOptions)));
    } else if (
      Array.isArray(pluginConfig) &&
      pluginConfig.every(isPlugin<TPluginContext>)
    ) {
      plugins = pluginConfig;
    } else if (isPlugin<TPluginContext>(pluginConfig)) {
      plugins = toArray(pluginConfig);
    }
  }

  if (!plugins) {
    throw new Error(
      `The plugin configuration ${JSON.stringify(awaited)} is invalid. This configuration must point to a valid Powerlines plugin module.`
    );
  }

  if (plugins.length > 0 && !plugins.every(isPlugin<TPluginContext>)) {
    throw new Error(
      `The plugin option ${JSON.stringify(plugins)} does not export a valid module. This configuration must point to a valid Powerlines plugin module.`
    );
  }

  const result = [] as Plugin<TPluginContext>[];
  for (const plugin of plugins) {
    if (isDuplicate<TPluginContext>(plugin, context.plugins)) {
      context.trace({
        meta: {
          category: "plugins"
        },
        message: `Duplicate ${chalk.bold.cyanBright(
          plugin.name
        )} plugin dependency detected - Skipping initialization.`
      });
    } else {
      result.push(plugin);

      context.trace({
        meta: {
          category: "plugins"
        },
        message: `Initializing the ${chalk.bold.cyanBright(plugin.name)} plugin...`
      });
    }
  }

  return result;
}

/**
 * Initialize a plugin based on the provided plugin configuration. This function handles various forms of plugin configurations, including direct plugin instances, plugin names, factory functions, and arrays of plugins. It validates the configuration, resolves plugin modules if necessary, and returns an array of initialized plugins ready to be added to the execution context.
 *
 * @param context - The execution context in which the plugin will be initialized. This context provides access to configuration, logging, and other utilities that may be needed during plugin initialization.
 * @param config - The plugin configuration, which can be in various forms such as a plugin instance, a plugin name string, a factory function that returns a plugin or an array of plugins, or an array of plugin configurations. The function will handle the resolution and initialization of the plugin(s) based on the provided configuration.
 * @returns A promise that resolves to an array of initialized plugins that can be added to the execution context, or null if the configuration is invalid or results in no plugins being initialized.
 */
export async function resolvePlugins<
  TResolvedConfig extends ResolvedConfig,
  TSystemContext,
  TContext extends
    | EnvironmentContext<TResolvedConfig, TSystemContext>
    | ExecutionContext<TResolvedConfig, TSystemContext> =
    | EnvironmentContext<TResolvedConfig, TSystemContext>
    | ExecutionContext<TResolvedConfig, TSystemContext>,
  TPluginContext extends PluginContext<TResolvedConfig, TSystemContext> =
    PluginContext<TResolvedConfig, TSystemContext>
>(context: TContext, config: PluginConfig<TPluginContext>) {
  const plugins = [] as Plugin<TPluginContext>[];
  if (config) {
    const result = await initPlugin<
      TResolvedConfig,
      TSystemContext,
      TContext,
      TPluginContext
    >(context, config);
    if (result) {
      for (const plugin of result) {
        context.debug({
          meta: {
            category: "plugins"
          },
          message: `Successfully initialized the ${chalk.bold.cyanBright(
            plugin.name
          )} plugin`
        });

        plugins.push(plugin);
      }
    }
  }

  return plugins;
}
