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
import { DeployPulumiResult, PulumiOutputRecord } from "./types";
import { PulumiPluginOptions } from "./types/plugin";

declare module "powerlines" {
  interface Config {
    pulumi?: PulumiPluginOptions;
  }

  interface Hooks<TContext extends PluginContext> {
    /**
     * A hook that can be implemented to deploy Pulumi resources after the main build process. This allows you to define and manage your infrastructure as code using Pulumi, directly from your Powerlines plugin.
     *
     * @param this - The plugin context.
     * @param resources - An object containing the Pulumi resources' outputs that were added in earlier hook invocations.
     * @returns Optionally, the resources' outputs that were added during the Pulumi deployment that will be passed to the next hook invocation.
     */
    deployPulumi?: (
      this: TContext,
      resources?: PulumiOutputRecord
    ) => MaybePromise<DeployPulumiResult>;
  }
}

export * from "./plugin";
export type * from "./types";
