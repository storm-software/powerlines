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

import alloy from "@powerlines/plugin-alloy";
import { render } from "@powerlines/plugin-alloy/render";
import automd from "@powerlines/plugin-automd";
import defu from "defu";
import { Plugin } from "powerlines";
import { FeaturesBuiltin } from "./components/features-builtin";
import { features } from "./helpers/automd-generator";
import {
  OpenFeaturePluginContext,
  OpenFeaturePluginOptions
} from "./types/plugin";

export type * from "./types";

declare module "powerlines" {
  interface Config {
    openFeature?: OpenFeaturePluginOptions;
  }
}

/**
 * A Powerlines plugin to inject environment variables into the source code.
 */
export const plugin = <
  TContext extends OpenFeaturePluginContext = OpenFeaturePluginContext
>(
  options: OpenFeaturePluginOptions = {}
) => {
  return [
    alloy(options.alloy),
    {
      name: "open-feature",
      async prepare() {
        this.debug(
          `Preparing the Feature Flags runtime artifacts for the Powerlines project.`
        );

        return render(this, <FeaturesBuiltin />);
      }
    },
    {
      name: "open-feature:automd-generator",
      config() {
        return {
          automd: defu(options.automd ?? {}, {
            generators: {
              features: features(this)
            }
          })
        };
      }
    },
    automd(options.automd)
  ] as Plugin<TContext>[];
};

export default plugin;
