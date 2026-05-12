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

import type { Context, Plugin } from "@powerlines/core";
import { createUnplugin } from "@powerlines/core";
import { formatConfig } from "@powerlines/core/plugin-utils";
import { resolveOptions } from "@powerlines/unplugin/vite";
import defu from "defu";
import { createVitePlugin } from "unplugin";
import { build, InlineConfig } from "vite";
import { VitePluginContext, VitePluginOptions } from "./types/plugin";

export * from "./types";

declare module "@powerlines/core" {
  interface Config {
    vite?: VitePluginOptions;
  }
}

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = <TContext extends VitePluginContext = VitePluginContext>(
  options: VitePluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "vite",
    config() {
      this.trace(
        "Providing default configuration for the Powerlines `vite` build plugin."
      );

      return {
        output: {
          format: ["cjs", "esm"]
        },
        vite: {
          ...options
        },
        singleBuild: true
      };
    },
    async build() {
      this.debug("Starting Vite build process...");

      const environments = this.environment.unstable_execution.environments;
      if (!environments || Object.keys(environments).length === 0) {
        throw new Error(
          `No environments found in the Powerlines context. At least one environment should have been generated - please report this issue to https://github.com/storm-software/powerlines/issues.`
        );
      }

      this.trace(
        `Running Vite for ${Object.keys(environments).length} environments.`
      );

      const resolved = resolveOptions(this);
      const options = defu(this.config.vite, {
        ...resolved,
        config: false,
        entry: this.entry,
        environments: Object.fromEntries(
          Object.entries(environments).map(([name, env]) => [
            name,
            defu(this.config.vite, resolveOptions(env as Context))
          ])
        ),
        plugins: [
          createVitePlugin(
            createUnplugin(this, {
              silenceHookLogging: true,
              name: "vite"
            })
          )()
        ]
      }) as InlineConfig;

      this.debug({
        meta: {
          category: "config"
        },
        message: `Resolved Vite configuration: \n${formatConfig(options)}`
      });

      await build(options);
    }
  };
};

export default plugin;
