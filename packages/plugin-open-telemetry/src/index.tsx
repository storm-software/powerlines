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

import { render } from "@powerlines/plugin-alloy/render";
import automd from "@powerlines/plugin-automd";
import env from "@powerlines/plugin-env";
import defu from "defu";
import { Plugin } from "powerlines";
import { TraceBuiltin } from "./components/trace-builtin";
import { trace } from "./helpers/automd-generator";
import type {
  OpenTelemetryPluginContext,
  OpenTelemetryPluginOptions
} from "./types/plugin";

export type * from "./types";

declare module "powerlines" {
  interface Config {
    openTelemetry?: OpenTelemetryPluginOptions;
  }
}

/**
 * A Powerlines plugin to inject environment variables into the source code.
 */
export const plugin = <
  TContext extends OpenTelemetryPluginContext = OpenTelemetryPluginContext
>(
  options: OpenTelemetryPluginOptions = {}
) => {
  return [
    env(options.env),
    {
      name: "open-telemetry",
      async prepare() {
        this.debug(
          `Preparing the OpenTelemetry runtime artifacts for the Powerlines project.`
        );

        return render(this, <TraceBuiltin />);
      }
    },
    {
      name: "open-telemetry:automd-generator",
      config() {
        return {
          automd: defu(options.automd ?? {}, {
            generators: {
              trace: trace(this)
            }
          })
        };
      }
    },
    automd(options.automd)
  ] as Plugin<TContext>[];
};

export default plugin;
