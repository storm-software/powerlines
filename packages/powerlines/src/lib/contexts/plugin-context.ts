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
import { isString } from "@stryke/type-checks/is-string";
import { UnpluginMessage } from "unplugin";
import { CallHookOptions } from "../../internal/helpers/hooks";
import { LogFn } from "../../types/config";
import { EnvironmentContext, PluginContext } from "../../types/context";
import { InferHookParameters, InferHookReturnType } from "../../types/hooks";
import {
  UNSAFE_EnvironmentContext,
  UNSAFE_PluginContext
} from "../../types/internal";
import { Plugin } from "../../types/plugin";
import { ResolvedConfig } from "../../types/resolved";

/**
 * Create a Proxy-based PluginContext
 *
 * @param plugin - The plugin instance
 * @param environment - The environment context
 * @returns The proxied plugin context
 */
export function createPluginContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>(
  plugin: Plugin<PluginContext<TResolvedConfig>>,
  environment: UNSAFE_EnvironmentContext<TResolvedConfig>
): UNSAFE_PluginContext<TResolvedConfig> {
  const normalizeMessage = (message: string | UnpluginMessage): string => {
    return isString(message) ? message : message.message;
  };

  const log: LogFn = environment.extendLog(plugin.name.replaceAll(":", " - "));

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

  return new Proxy({} as UNSAFE_PluginContext<TResolvedConfig>, {
    get(_, prop) {
      if (prop === "$$internal") {
        return {
          ...environment.$$internal,
          environment,
          callHook: callHookFn
        };
      }

      if (prop === "log" || prop === "logger") {
        return log;
      }

      if (prop === "fatal") {
        return (message: string | UnpluginMessage) => {
          log(LogLevelLabel.FATAL, normalizeMessage(message));
        };
      }

      if (prop === "error") {
        return (message: string | UnpluginMessage) => {
          log(LogLevelLabel.ERROR, normalizeMessage(message));
        };
      }

      if (prop === "warn") {
        return (message: string | UnpluginMessage) => {
          log(LogLevelLabel.WARN, normalizeMessage(message));
        };
      }

      if (prop === "info") {
        return (message: string | UnpluginMessage) => {
          log(LogLevelLabel.INFO, normalizeMessage(message));
        };
      }

      if (prop === "debug") {
        return (message: string | UnpluginMessage) => {
          log(LogLevelLabel.DEBUG, normalizeMessage(message));
        };
      }

      if (prop === "trace") {
        return (message: string | UnpluginMessage) => {
          log(LogLevelLabel.TRACE, normalizeMessage(message));
        };
      }

      return environment[prop as keyof EnvironmentContext<TResolvedConfig>];
    },
    set(_, prop, value) {
      if (
        [
          "$$internal",
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
        log(
          LogLevelLabel.WARN,
          `Cannot set read-only property "${String(prop)}"`
        );

        return false;
      }

      environment[prop as keyof EnvironmentContext<TResolvedConfig>] = value;
      return true;
    }
  });
}
