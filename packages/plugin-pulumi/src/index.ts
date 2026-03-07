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

import { MaybePromise } from "@stryke/types";
import { PluginContext } from "powerlines";
import { PulumiPluginOptions } from "./types/plugin";

declare module "powerlines" {
  interface Config {
    pulumi?: PulumiPluginOptions;
  }

  interface Hooks<TContext extends PluginContext> {
    deployPulumi?: (this: TContext) => MaybePromise<void>;
  }
}

export * from "./plugin";
export type * from "./types";
