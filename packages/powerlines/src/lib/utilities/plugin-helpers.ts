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

import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import { AnyFunction } from "@stryke/types/base";
import { ResolvedConfig } from "powerlines/types/resolved";
import { SUPPORTED_COMMANDS } from "../../types/commands";
import {
  PluginConfig,
  PluginConfigObject,
  PluginConfigTuple
} from "../../types/config";
import { PluginContext } from "../../types/context";
import {
  BaseHookKeys,
  BaseHooksListItem,
  ExternalHookKeys,
  HookKeys
} from "../../types/hooks";
import { Plugin, PluginHook, PluginHookObject } from "../../types/plugin";

/**
 * Type guard to check if an object is a {@link Plugin}
 *
 * @param value - The object to check
 * @returns True if the object is a {@link Plugin}, false otherwise
 */
export function isPlugin<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
>(value: unknown): value is Plugin<PluginContext<TResolvedConfig>> {
  return (
    isSetObject(value) &&
    "name" in value &&
    isSetString(value.name) &&
    (isUndefined(
      (value as Plugin<PluginContext<TResolvedConfig>>).applyToEnvironment
    ) ||
      ("applyToEnvironment" in value &&
        isFunction(value.applyToEnvironment))) &&
    (isUndefined((value as Plugin<PluginContext<TResolvedConfig>>).dedupe) ||
      ("dedupe" in value && isFunction(value.dedupe))) &&
    (isUndefined((value as Plugin<PluginContext<TResolvedConfig>>).dependsOn) ||
      ("dependsOn" in value &&
        Array.isArray(value.dependsOn) &&
        value.dependsOn.every(isPluginConfig))) &&
    SUPPORTED_COMMANDS.every(
      command =>
        isUndefined(
          (value as Plugin<PluginContext<TResolvedConfig>>)[command]
        ) ||
        (command in value &&
          (isFunction((value as Record<string, any>)[command]) ||
            (isSetObject((value as Record<string, any>)[command]) &&
              "handler" in (value as Record<string, any>)[command] &&
              isFunction((value as Record<string, any>)[command].handler))))
    )
  );
}

/**
 * Type guard to check if an object is a {@link PluginConfigObject}
 *
 * @param value - The object to check
 * @returns True if the object is a {@link PluginConfigObject}, false otherwise
 */
export function isPluginConfigObject(
  value: unknown
): value is PluginConfigObject {
  return (
    isSetObject(value) &&
    "plugin" in value &&
    (((isSetString(value.plugin) || isFunction(value.plugin)) &&
      "options" in value &&
      isSetObject(value.options)) ||
      isPlugin(value.plugin))
  );
}

/**
 * Type guard to check if an object is a {@link PluginConfigTuple}
 *
 * @param value - The object to check
 * @returns True if the object is a {@link PluginConfigTuple}, false otherwise
 */
export function isPluginConfigTuple(
  value: unknown
): value is PluginConfigTuple {
  return (
    Array.isArray(value) &&
    (value.length === 1 || value.length === 2) &&
    (((isSetString(value[0]) || isFunction(value[0])) &&
      value.length > 1 &&
      isSetObject(value[1])) ||
      isPlugin(value[0]))
  );
}

/**
 * Type guard to check if an object is a {@link PluginConfig}
 *
 * @param value - The object to check
 * @returns True if the object is a {@link PluginConfig}, false otherwise
 */
export function isPluginConfig(value: unknown): value is PluginConfig {
  return (
    isSetString(value) ||
    isFunction(value) ||
    isPlugin(value) ||
    isPluginConfigObject(value) ||
    isPluginConfigTuple(value)
  );
}

/**
 * Type guard to check if an value is a {@link PluginHook} function
 *
 * @param value - The value to check
 * @returns True if the value is a {@link PluginHook} function, false otherwise
 */
export function isPluginHookFunction(value: unknown): value is AnyFunction {
  return (
    isFunction(value) ||
    (isSetObject(value) && "handler" in value && isFunction(value.handler))
  );
}

/**
 * Type guard to check if an value is a {@link PluginHook} function
 *
 * @param value - The value to check
 * @returns True if the value is a {@link PluginHook} function, false otherwise
 */
export function isPluginHookObject(
  value: unknown
): value is PluginHookObject<AnyFunction> {
  return isSetObject(value) && "handler" in value && isFunction(value.handler);
}

/**
 * Type guard to check if an object is a {@link PluginHook}
 *
 * @param value - The object to check
 * @returns True if the object is a {@link PluginHook}, false otherwise
 */
export function isPluginHook(value: unknown): value is PluginHook<AnyFunction> {
  return isPluginHookFunction(value) || isPluginHookObject(value);
}

/**
 * Extract the hook handler function from a plugin hook
 *
 * @param pluginHook - The plugin hook to extract the handler function from
 * @returns The hook handler function
 */
export function getHookHandler(
  pluginHook: PluginHook<AnyFunction>
): AnyFunction {
  return isFunction(pluginHook) ? pluginHook : pluginHook.handler;
}

/**
 * Extract a plugin hook from a plugin
 *
 * @param context - The build context
 * @param plugin - The plugin to extract the hook from
 * @param hook - The name of the hook to extract
 * @returns The extracted hook, or undefined if the hook does not exist
 */
export function extractPluginHook<
  TContext extends PluginContext = PluginContext,
  TPlugin extends Plugin<TContext> = Plugin<TContext>
>(context: TContext, plugin: TPlugin, hook: BaseHookKeys<TContext>) {
  const pluginHook = plugin[hook];
  if (!isPluginHook(pluginHook)) {
    return undefined;
  }

  return isFunction(pluginHook)
    ? {
        normal: pluginHook.bind(context)
      }
    : {
        [pluginHook.order ? pluginHook.order : "normal"]:
          pluginHook.handler.bind(context)
      };
}

/**
 * Check if a hook is external.
 *
 * @param hook - The name of the hook to check.
 * @returns True if the hook is external, false otherwise.
 */
export function isHookExternal(hook: HookKeys): hook is ExternalHookKeys {
  return (
    hook.startsWith("vite:") ||
    hook.startsWith("esbuild:") ||
    hook.startsWith("rolldown:") ||
    hook.startsWith("rollup:") ||
    hook.startsWith("webpack:") ||
    hook.startsWith("rspack:") ||
    hook.startsWith("farm:")
  );
}

/**
 * Check if a hook is internal.
 *
 * @param hook - The name of the hook to check.
 * @returns True if the hook is external, false otherwise.
 */
export function isHookInternal(hook: HookKeys): hook is BaseHookKeys {
  return !isHookExternal(hook);
}

/**
 * Check if a plugin should be deduplicated.
 *
 * @param plugin - The plugin to check
 * @param plugins - The list of plugins to check against
 * @returns True if the plugin should be deduplicated, false otherwise
 */
export function checkDedupe<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig,
  TContext extends
    PluginContext<TResolvedConfig> = PluginContext<TResolvedConfig>
>(plugin: Plugin<TContext>, plugins: Plugin<TContext>[]) {
  return plugins.some(
    p =>
      p.dedupe !== false &&
      ((isFunction(p.dedupe) && p.dedupe(plugin)) || p.name === plugin.name)
  );
}

/**
 * Add a plugin hook to the hooks list.
 *
 * @param context - The plugin context
 * @param plugin - The plugin to add the hook from
 * @param pluginHook - The plugin hook to add
 * @param hooksList - The list of hooks to add to
 */
export function addPluginHook<TContext extends PluginContext = PluginContext>(
  context: TContext,
  plugin: Plugin<TContext>,
  pluginHook: PluginHook<AnyFunction>,
  hooksList: BaseHooksListItem<TContext, BaseHookKeys<TContext>>[]
) {
  if (
    !checkDedupe(
      plugin,
      hooksList.map(hook => hook.plugin)
    )
  ) {
    hooksList.push(
      isFunction(pluginHook)
        ? {
            plugin,
            handler: getHookHandler(pluginHook).bind(context)
          }
        : {
            plugin,
            ...pluginHook,
            handler: getHookHandler(pluginHook).bind(context)
          }
    );
  }
}
