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

import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isString } from "@stryke/type-checks/is-string";
import { UnpluginMessage } from "unplugin";
import type {
  EnvironmentContext,
  LoggerMessage,
  LogLevel,
  Plugin,
  PluginContext,
  ResolvedConfig
} from "../types";
import { PowerlinesEnvironmentContext } from "./environment-context";

/**
 * Create a Proxy-based PluginContext
 *
 * @param pluginId - The unique identifier of the plugin
 * @param plugin - The plugin instance
 * @param environment - The environment context
 * @returns The proxied plugin context
 */
export function createPluginContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TSystemContext = unknown
>(
  pluginId: string,
  plugin: Plugin<PluginContext<TResolvedConfig, TSystemContext>>,
  environment: PowerlinesEnvironmentContext<TResolvedConfig, TSystemContext>
): PluginContext<TResolvedConfig, TSystemContext> {
  const logger = environment.extendLogger({
    plugin: plugin.name
  });

  const normalizeMessage = (
    message: string | UnpluginMessage
  ): LoggerMessage => {
    return {
      meta: {
        ...(isSetObject(message) ? message.meta : {}),
        environment: environment.config.environment.name,
        plugin: plugin.name
      },
      message: isString(message) ? message : message.message
    };
  };

  return new Proxy({} as PluginContext<TResolvedConfig, TSystemContext>, {
    get(_, prop) {
      if (prop === "environment") {
        return environment;
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

      return environment[
        prop as keyof EnvironmentContext<TResolvedConfig, TSystemContext>
      ];
    },
    set(_, prop, value) {
      if (prop === "unstable_addPlugin") {
        logger.warn(
          "Plugins should not be calling the 'addPlugin' function directly. This function is meant to be used internally by Powerlines and may cause unexpected behavior if used incorrectly."
        );
        return false;
      }

      if (
        [
          "id",
          "environment",
          "config",
          "log",
          "logger",
          "error",
          "warn",
          "plugins",
          "hooks",
          "fs",
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
