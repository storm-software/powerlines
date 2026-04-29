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
  CallHookOptions,
  EnvironmentContext,
  InferHookParameters,
  InferHookReturnType,
  LoggerMessage,
  LogLevel,
  Plugin,
  PluginContext,
  ResolvedConfig
} from "@powerlines/core";
import {
  Unstable_EnvironmentContext,
  Unstable_PluginContext
} from "@powerlines/core/types/_internal";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isString } from "@stryke/type-checks/is-string";
import { UnpluginMessage } from "unplugin";

/**
 * Create a Proxy-based PluginContext
 *
 * @param pluginId - The unique identifier of the plugin
 * @param plugin - The plugin instance
 * @param environment - The environment context
 * @returns The proxied plugin context
 */
export function createPluginContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>(
  pluginId: string,
  plugin: Plugin<PluginContext<TResolvedConfig>>,
  environment: Unstable_EnvironmentContext<TResolvedConfig>
): Unstable_PluginContext<TResolvedConfig> {
  const logger = environment.extendLogger({
    plugin: plugin.name
  });

  const normalizeMessage = (
    message: string | UnpluginMessage
  ): LoggerMessage => {
    return {
      meta: {
        ...(isSetObject(message) ? message.meta : {}),
        environment: environment.environment?.name,
        plugin: plugin.name
      },
      message: isString(message) ? message : message.message
    };
  };

  const callHookFn = async <TKey extends string>(
    hook: TKey,
    options: CallHookOptions,
    ...args: InferHookParameters<PluginContext<TResolvedConfig>, TKey>
  ): Promise<
    InferHookReturnType<PluginContext<TResolvedConfig>, TKey> | undefined
  > => {
    return environment.$$internal.api.callHook(
      hook,
      {
        sequential: true,
        result: "merge",
        ...options,
        environment
      } as Parameters<typeof environment.$$internal.api.callHook>[1],
      ...args
    );
  };

  const meta = {} as Record<string, any>;

  return new Proxy({} as Unstable_PluginContext<TResolvedConfig>, {
    get(_, prop) {
      if (prop === "$$internal") {
        return {
          ...environment.$$internal,
          environment,
          callHook: callHookFn,
          meta
        };
      }

      if (prop === "id") {
        return pluginId;
      }

      if (prop === "logger") {
        return logger;
      }

      if (prop === "log") {
        return (type: LogLevel, message: string | UnpluginMessage) => {
          logger.log(type, normalizeMessage(message));
        };
      }

      if (prop === "fatal") {
        return (message: string | UnpluginMessage) => {
          logger.error(normalizeMessage(message));
        };
      }

      if (prop === "error") {
        return (message: string | UnpluginMessage) => {
          logger.error(normalizeMessage(message));
        };
      }

      if (prop === "warn") {
        return (message: string | UnpluginMessage) => {
          logger.warn(normalizeMessage(message));
        };
      }

      if (prop === "info") {
        return (message: string | UnpluginMessage) => {
          logger.info(normalizeMessage(message));
        };
      }

      if (prop === "debug") {
        return (message: string | UnpluginMessage) => {
          logger.debug(normalizeMessage(message));
        };
      }

      if (prop === "trace") {
        return (message: string | UnpluginMessage) => {
          logger.trace(normalizeMessage(message));
        };
      }

      return environment[prop as keyof EnvironmentContext<TResolvedConfig>];
    },
    set(_, prop, value) {
      if (
        [
          "$$internal",
          "id",
          "environment",
          "config",
          "log",
          "logger",
          "error",
          "warn",
          "plugins",
          "hooks",
          "addPlugin",
          "selectHooks"
        ].includes(prop as string)
      ) {
        logger.warn(`Cannot set the read-only "${String(prop)}" property`);

        return false;
      }

      (environment as Record<string, any>)[prop as string] = value;
      return true;
    }
  });
}
