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
import { omit } from "@stryke/helpers/omit";
import { isRegExp } from "@stryke/type-checks/is-regexp";
import { isSetArray } from "@stryke/type-checks/is-set-array";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { ResolveConfig, ResolvedConfig } from "../types/config";

/**
 * Formats a configuration object into a human-readable string, omitting certain properties and simplifying others for better readability.
 *
 * @param config - The configuration object to format.
 * @returns A formatted string representation of the configuration.
 */
export function formatConfig(config: Record<string, any>): string {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries({
        ...omit(config, [
          "deps",
          "resolve",
          "plugins",
          "initialConfig",
          "userConfig",
          "inlineConfig",
          "pluginConfig",
          "environmentConfig"
        ]),
        deps: isSetObject(config.deps)
          ? {
              alwaysBundle: isSetArray(
                (config.deps as { alwaysBundle?: unknown[] })?.alwaysBundle
              )
                ? (
                    (config.deps as { alwaysBundle?: unknown[] })
                      ?.alwaysBundle ?? []
                  )
                    .filter(Boolean)
                    .map(alwaysBundle =>
                      isSetString(alwaysBundle)
                        ? alwaysBundle
                        : isRegExp(alwaysBundle)
                          ? alwaysBundle.source
                          : "<unknown-bundle>"
                    )
                : undefined,
              onlyBundle: isSetArray(
                (config.deps as { onlyBundle?: unknown[] })?.onlyBundle
              )
                ? (
                    (config.deps as { onlyBundle?: unknown[] })?.onlyBundle ??
                    []
                  )
                    .filter(Boolean)
                    .map(onlyBundle =>
                      isSetString(onlyBundle)
                        ? onlyBundle
                        : isRegExp(onlyBundle)
                          ? onlyBundle.source
                          : "<unknown-bundle>"
                    )
                : undefined,
              neverBundle: isSetArray(
                (config.deps as { neverBundle?: unknown[] })?.neverBundle
              )
                ? (
                    (config.deps as { neverBundle?: unknown[] })?.neverBundle ??
                    []
                  )
                    .filter(Boolean)
                    .map(neverBundle =>
                      isSetString(neverBundle)
                        ? neverBundle
                        : isRegExp(neverBundle)
                          ? neverBundle.source
                          : "<unknown-bundle>"
                    )
                : undefined
            }
          : undefined,

        resolve: isSetObject(config.resolve)
          ? {
              ...config.resolve,
              external: isSetArray((config.resolve as ResolveConfig)?.external)
                ? ((config.resolve as ResolveConfig)?.external ?? [])
                    .filter(Boolean)
                    .map(external =>
                      isSetString(external)
                        ? external
                        : isRegExp(external)
                          ? external.source
                          : "<unknown-bundle>"
                    )
                : undefined,
              noExternal: isSetArray(
                (config.resolve as ResolveConfig)?.noExternal
              )
                ? ((config.resolve as ResolveConfig)?.noExternal ?? [])
                    .filter(Boolean)
                    .map(noExternal =>
                      isSetString(noExternal)
                        ? noExternal
                        : isRegExp(noExternal)
                          ? noExternal.source
                          : "<unknown-bundle>"
                    )
                : undefined
            }
          : undefined,
        plugins: isSetArray(config.plugins)
          ? (toArray(config.plugins) as ResolvedConfig["plugins"])
              ?.flatMap(plugin => toArray(plugin))
              ?.map(plugin =>
                String(
                  isSetString(plugin)
                    ? plugin
                    : isSetObject(plugin) &&
                        isSetString((plugin as { name: string }).name)
                      ? (plugin as { name: string }).name
                      : Array.isArray(plugin) && isSetString(plugin[0])
                        ? plugin[0]
                        : "<function-plugin>"
                )
              )
          : undefined
      }).sort(([key1], [key2]) => key1.localeCompare(key2))
    ),
    null,
    4
  )
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/,\s*$/g, "");
}
