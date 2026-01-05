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
import { isFunction } from "@stryke/type-checks/is-function";
import { BuilderVariant } from "../types/build";
import { PartialPlugin, PluginFactory } from "../types/config";
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
  TBuildVariant extends BuilderVariant = BuilderVariant
>(
  plugin: Plugin<TContext> | Plugin<TContext>[],
  variant: TBuildVariant | TBuildVariant[]
): Promise<Plugin<TContext>[]>;
export function enforceBuild<
  TContext extends PluginContext = PluginContext,
  TBuildVariant extends BuilderVariant = BuilderVariant
>(
  plugin: PluginFactory<TContext>,
  variant: TBuildVariant | TBuildVariant[]
): Promise<PluginFactory<TContext>>;
export async function enforceBuild<
  TContext extends PluginContext = PluginContext,
  TBuildVariant extends BuilderVariant = BuilderVariant
>(
  plugin: Plugin<TContext> | Plugin<TContext>[] | PluginFactory<TContext>,
  variant: TBuildVariant | TBuildVariant[]
) {
  const extension = {
    configResolved(this: TContext) {
      const allowedVariants = toArray<TBuildVariant>(variant);
      const currentVariant = this.config?.build?.variant as
        | TBuildVariant
        | undefined;

      if (!currentVariant || !allowedVariants.includes(currentVariant)) {
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
            currentVariant ?? "undefined"
          }". Please ensure the \`build.variant\` is set correctly in your configuration.`
        );
      }
    }
  } as PartialPlugin<TContext>;

  // The `extend` function has different overloads for plugin factories vs concrete
  // plugins - narrow here so TypeScript can select the correct overload.
  if (isFunction(plugin)) {
    return extend(plugin, extension);
  }

  return extend(plugin, () => extension)({});
}
