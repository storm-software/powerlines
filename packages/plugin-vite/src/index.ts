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
import { isPackageExists } from "@stryke/fs/package-fns";
import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import {
  DEFAULT_VITE_CONFIG,
  extractViteConfig
} from "powerlines/lib/build/vite";
import { ViteUserConfig } from "powerlines/types/config";
import { Plugin } from "powerlines/types/plugin";
import { InlineConfig } from "rolldown-vite";
import { createVitePlugin } from "./helpers/unplugin";
import { VitePluginContext, VitePluginOptions } from "./types/plugin";

export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <TContext extends VitePluginContext = VitePluginContext>(
  options: VitePluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "vite",
    config() {
      this.log(
        LogLevelLabel.TRACE,
        "Providing default configuration for the Powerlines `vite` build plugin."
      );

      return {
        output: {
          format: ["cjs", "esm"]
        },
        build: {
          ...DEFAULT_VITE_CONFIG,
          ...options,
          variant: "vite"
        }
      } as Partial<ViteUserConfig>;
    },
    async build() {
      this.log(LogLevelLabel.TRACE, `Building the Powerlines plugin.`);

      const config = defu(
        {
          config: false,
          entry: this.entry
        },
        extractViteConfig(this),
        {
          plugins: [createVitePlugin(this)]
        }
      );

      let importPath = "vite";
      if (
        options.rolldown &&
        isPackageExists("rolldown-vite", {
          paths: [
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot
            ),
            this.workspaceConfig.workspaceRoot
          ]
        })
      ) {
        importPath = "rolldown-vite";
      }

      if (
        !isPackageExists(importPath, {
          paths: [
            joinPaths(
              this.workspaceConfig.workspaceRoot,
              this.config.projectRoot
            ),
            this.workspaceConfig.workspaceRoot
          ]
        })
      ) {
        throw new Error(
          `Failed to find the "${importPath}" package required for the Powerlines "vite" plugin${
            options.rolldown ? " with the `rolldown` option enabled" : ""
          }. Please run "npm install ${importPath} -D" to install it.`
        );
      }

      const vite = await this.resolver.import<{
        build: (opts: InlineConfig) => Promise<void>;
      }>(importPath);
      if (!vite) {
        throw new Error(
          `Failed to load the "${importPath}" module - this package is required when using the Powerlines "vite" plugin${
            options.rolldown ? " with the `rolldown` option enabled" : ""
          }. Please ensure it is installed correctly.`
        );
      }

      await vite.build(config as InlineConfig);
    }
  };
};

export default plugin;
