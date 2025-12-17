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
import { BuildVariant } from "../types/build";
import { PluginFactory } from "../types/config";
import { PluginContext } from "../types/context";
import { Plugin } from "../types/plugin";
import { extend } from "./extend";

/**
 * Enforces a specific build variant for a plugin.
 *
 * @param plugin - The plugin or plugin factory to enforce the build variant on.
 * @param variant - The build variant to enforce.
 * @returns A new plugin or plugin factory that enforces the specified build variant.
 */
export function enforceBuild<
  TContext extends PluginContext = PluginContext,
  TBuildVariant extends BuildVariant = BuildVariant
>(
  plugin: Plugin<TContext> | PluginFactory<TContext>,
  variant: TBuildVariant | TBuildVariant[]
) {
  return extend(plugin, {
    config: Array.isArray(variant)
      ? undefined
      : {
          build: {
            variant
          }
        },
    configResolved(this: TContext) {
      if (
        !toArray<TBuildVariant>(variant).includes(this.config.build.variant)
      ) {
        throw new Error(
          `The plugin requires ${
            Array.isArray(variant)
              ? `the build variants ${variant
                  .map(v => `"${v}"`)
                  .slice(0, -1)
                  .join(", ")}, or ${variant
                  .map(v => `"${v}"`)
                  .slice(-1)
                  .join("")}`
              : `the build variant "${variant}"`
          }, but received "${
            this.config.build.variant
          }". Please ensure the \`build.variant\` is set correctly in your configuration.`
        );
      }
    }
  });
}
