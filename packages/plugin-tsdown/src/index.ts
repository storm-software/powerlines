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

import { Plugin } from "@powerlines/core";
import { formatPackageJson } from "@powerlines/core/plugin-utils/format-package-json";
import { omit } from "@stryke/helpers/omit";
import defu from "defu";
import { build } from "tsdown";
import { resolveOptions } from "./helpers/resolve-options";
import { createTsdownPlugin } from "./helpers/unplugin";
import { TsdownPluginContext, TsdownPluginOptions } from "./types/plugin";

export * from "./helpers";
export type * from "./types";

declare module "@powerlines/core" {
  interface Config {
    tsdown?: TsdownPluginOptions;
  }
}

/**
 * A Powerlines plugin to use Tsdown to build the project.
 */
export const plugin = <
  TContext extends TsdownPluginContext = TsdownPluginContext
>(
  options: TsdownPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "tsdown",
    config() {
      this.debug(
        "Providing default configuration for the Powerlines `tsdown` build plugin."
      );

      return {
        output: {
          format: ["cjs", "esm"]
        },
        tsdown: {
          ...options
        }
      };
    },
    configResolved() {
      this.debug(
        "Checking for Tsdown related dependencies required by the project."
      );

      if (this.config.tsdown?.attw) {
        this.devDependencies["@arethetypeswrong/core"] = "^0.18.2";
      }

      if (this.config.tsdown?.publint) {
        this.devDependencies.publint = "^0.3.18";
      }
    },
    async build() {
      this.debug("Starting Tsdown build process...");

      const options = defu(
        {
          config: false,
          plugins: createTsdownPlugin(this)
        },
        resolveOptions(this)
      );

      this.trace({
        meta: {
          category: "config"
        },
        message: `Resolved Tsdown configuration: \n${JSON.stringify(
          omit(options, ["plugins"]),
          null,
          2
        )}`
      });

      await build(options);
      await formatPackageJson(this);
    }
  };
};

export default plugin;
