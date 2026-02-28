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

import env from "@powerlines/plugin-env";
import defu from "defu";
import { Plugin } from "powerlines";
import { dateFnsModule } from "./components/date-fns";
import { dayjsModule } from "./components/dayjs";
import { luxonModule } from "./components/luxon";
import { momentModule } from "./components/moment";
import {
  DatePluginContext,
  DatePluginOptions,
  DatePluginUserConfig
} from "./types/plugin";

export * from "./components";
export * from "./types";

declare module "powerlines" {
  export interface UserConfig {
    date?: DatePluginOptions;
  }
}

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export function plugin<TContext extends DatePluginContext = DatePluginContext>(
  options: DatePluginOptions = {}
) {
  return [
    env(options.env),
    {
      name: "date",
      async config() {
        this.debug(
          "Providing default configuration for the Powerlines `date` build plugin."
        );

        const config = {
          date: defu(options, {
            type: "date-fns"
          })
        } as DatePluginUserConfig;

        if (
          !config.date!.type ||
          !["date-fns", "dayjs", "luxon", "moment"].includes(config.date!.type)
        ) {
          if (config.date!.type) {
            this.warn(
              `Invalid date library type "${config.date!.type}" specified. Defaulting to "date-fns".`
            );
          }

          config.date!.type = "date-fns";
        }

        this.debug(`Using date library: ${config.date!.type}`);

        return config;
      },
      async configResolved() {
        this.debug(
          `Environment plugin configuration has been resolved for the Powerlines project.`
        );

        this.dependencies[this.config.date.type] = "latest";
      },
      async prepare() {
        this.debug(
          `Preparing the Date runtime artifacts for the Powerlines project.`
        );

        let dateModule!: (context: DatePluginContext) => string;
        switch (this.config.date.type) {
          case "dayjs":
            dateModule = dayjsModule;
            break;
          case "luxon":
            dateModule = luxonModule;
            break;
          case "moment":
            dateModule = momentModule;
            break;
          case "date-fns":
          default:
            // Default to date-fns if no type is specified or if the type is not recognized
            dateModule = dateFnsModule;
            break;
        }

        await this.emitBuiltin(await Promise.resolve(dateModule(this)), "date");
      }
    }
  ] as Plugin<TContext>[];
}

export default plugin;
