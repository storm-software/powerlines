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

import type { StormWorkspaceConfig } from "@storm-software/config/types";
import { getGenerateAction } from "@storm-software/untyped/generate";
import type { Plugin } from "powerlines/types/plugin";
import { UntypedPluginContext, UntypedPluginOptions } from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to use Untyped for code generation based on user-defined schemas.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TContext extends UntypedPluginContext = UntypedPluginContext
>(
  options: UntypedPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "untyped",
    config() {
      return {
        untyped: {
          schema: "**/{untyped.ts,*.untyped.ts}",
          ...options
        }
      };
    },
    async configResolved() {
      this.untyped ??= getGenerateAction(
        this.workspaceConfig as StormWorkspaceConfig
      );
    },
    async prepare() {
      return this.untyped({
        entry: this.config.untyped.schema,
        outputPath: this.config.untyped.outputPath,
        generatedBy: this.config.framework
      });
    }
  };
};

export default plugin;
