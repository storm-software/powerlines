/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import type { GeneratorConfig } from "@power-plant/core";
import { createExecute } from "@power-plant/core";
import { isGeneratorConfigObject } from "@power-plant/core/helpers";
import { kebabCase } from "@stryke/string-format/kebab-case";
import type { Plugin } from "powerlines";
import { createStorageAdapter } from "./helpers/storage-adapter";
import type {
  PowerPlantPluginContext,
  PowerPlantPluginOptions
} from "./types/plugin";

export type * from "./types";

declare module "powerlines" {
  interface Config {
    powerplant?: PowerPlantPluginOptions<any, any>;
  }
}

/**
 * A Powerlines plugin to integrate PowerPlant for code generation.
 *
 * @param options - The plugin options.
 * @returns A Powerlines plugin instance.
 */
export const plugin = <
  TSpec,
  TOptions extends object,
  TContext extends PowerPlantPluginContext<TSpec, TOptions> =
    PowerPlantPluginContext<TSpec, TOptions>
>(
  options: GeneratorConfig<TSpec, TOptions>
): Plugin<TContext> => {
  const name = kebabCase(
    (isGeneratorConfigObject(options) ? options.meta?.name : String(options)) ??
      "default"
  );

  return {
    name: name ? `power-plant:${name}` : "power-plant",
    config() {
      return {
        powerplant: options
      };
    },
    async configResolved() {
      this.powerplant = {
        execute: await createExecute({
          storage: createStorageAdapter(this.fs)
        }),
        options: {} as TContext["powerplant"]["options"]
      };
    },
    async prepare() {
      await this.powerplant.execute<TSpec, TOptions>(
        this.config.powerplant,
        this.powerplant.options
      );
    }
  };
};

export default plugin;
