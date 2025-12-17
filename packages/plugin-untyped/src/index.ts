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

/* eslint-disable @nx/enforce-module-boundaries */

import type { StormWorkspaceConfig } from "@storm-software/config/types";
import { getGenerateAction } from "@storm-software/untyped/generate";
import { toArray } from "@stryke/convert/to-array";
import { replacePathTokens } from "powerlines/plugin-utils/paths";
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
          schema: "{projectRoot}/**/{untyped.ts,*.untyped.ts}",
          ...options
        }
      };
    },
    async configResolved() {
      if (!this.config.untyped.schema) {
        throw new Error(
          "Untyped plugin requires a schema path or glob pattern to be specified in the configuration."
        );
      }

      this.config.untyped.schema = toArray(this.config.untyped.schema).map(
        path => replacePathTokens(this, path)
      );

      this.untyped = getGenerateAction(
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
