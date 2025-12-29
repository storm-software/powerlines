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
import { appendPath } from "@stryke/path/append";
import { createNitro } from "nitro/builder";
import { NitroConfig } from "nitro/types";
import { getConfigPath } from "powerlines/plugin-utils/get-config-path";
import { Plugin } from "powerlines/types/plugin";
import {
  NitroPluginContext,
  NitroPluginOptions,
  NitroPluginUserConfig
} from "./types/plugin";

export * from "./types";

/**
 * A Powerlines plugin to integrate with Nitro.
 */
export const plugin = <
  TContext extends NitroPluginContext = NitroPluginContext
>(
  options: NitroPluginOptions = {}
) => {
  return [
    {
      name: "nitro:config",
      async config() {
        this.log(
          LogLevelLabel.TRACE,
          "Providing default configuration for the Powerlines `nitro` plugin."
        );

        let configFile = options.configFile;
        if (!configFile) {
          configFile = getConfigPath(this, "nitro");
        }

        return {
          nitro: {
            configFile: configFile
              ? appendPath(configFile, this.workspaceConfig.workspaceRoot)
              : undefined,
            ...options
          }
        } as NitroPluginUserConfig;
      },
      configResolved() {
        this.config.nitro.compatibilityDate = this.config.compatibilityDate;
        this.config.nitro.workspaceDir = this.workspaceConfig.workspaceRoot;

        this.config.nitro.alias = this.config.build
          .alias as NitroConfig["alias"];

        switch (this.config.logLevel) {
          case "error":
            this.config.nitro.logLevel = 1;
            break;
          case "warn":
            this.config.nitro.logLevel = 2;
            break;
          case "info":
            this.config.nitro.logLevel = 3;
            break;
          case "debug":
            this.config.nitro.logLevel = 4;
            break;
          case "trace":
            this.config.nitro.logLevel = 5;
            break;
          case null:
            this.config.nitro.logLevel = 0;
            break;
          default:
            this.config.nitro.logLevel = 2;
            break;
        }
      }
    },
    {
      name: "nitro:init",
      configResolved: {
        order: "post",
        async handler() {
          this.nitro = await createNitro(this.config.nitro);
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
