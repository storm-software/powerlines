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

import defu from "defu";
import { Plugin } from "powerlines/types/plugin";
import { nanoidModule } from "./components/nanoid";
import {
  IdPluginContext,
  IdPluginOptions,
  IdPluginUserConfig
} from "./types/plugin";

export * from "./components";
export * from "./types";

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export function plugin(options: IdPluginOptions = {}): Plugin<IdPluginContext> {
  return {
    name: "id",
    async config() {
      this.debug(
        "Providing default configuration for the Powerlines `id` build plugin."
      );

      const config = {
        id: defu(options, {
          type: "nanoid"
        })
      } as Partial<IdPluginUserConfig>;

      if (!config.id!.type || !["nanoid"].includes(config.id!.type)) {
        if (config.id!.type) {
          this.warn(
            `Invalid ID generation type "${config.id!.type}" specified. Defaulting to "nanoid".`
          );
        }

        config.id!.type = "nanoid";
      }

      this.debug(`Using ID generation library: ${config.id!.type}`);

      return config;
    },
    async prepare() {
      this.debug(
        "Preparing the ID runtime artifacts for the Powerlines project."
      );

      let idModule!: (context: IdPluginContext) => string;
      switch (this.config.id.type) {
        case "nanoid":
        default:
          // Default to nanoid if no type is specified or if the type is not recognized
          idModule = nanoidModule;
          break;
      }

      await this.emitBuiltin(await Promise.resolve(idModule(this)), "id");
    }
  };
}

export default plugin;
