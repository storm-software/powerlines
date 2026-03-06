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

import type { ExportedHandler } from "@cloudflare/workers-types";
import type { EnvPluginContext } from "@powerlines/plugin-env/types";
import {
  EnvPluginResolvedConfig,
  EnvPluginUserConfig
} from "packages/plugin-env/dist/types/index.cjs";
import type { PluginContext, ResolvedEntryTypeDefinition } from "powerlines";

export interface CloudflarePluginOptions {}

export interface CloudflarePluginUserConfig extends EnvPluginUserConfig {
  /**
   * Options for the Cloudflare plugin.
   */
  cloudflare?: CloudflarePluginOptions;
}

export interface CloudflarePluginResolvedConfig extends EnvPluginResolvedConfig {
  /**
   * Options for the Cloudflare plugin.
   */
  cloudflare: Required<CloudflarePluginOptions>;
}

export type CloudflareWorkerEntryModule = Record<
  keyof ExportedHandler,
  boolean
> & {
  entry: ResolvedEntryTypeDefinition;
};

export type CloudflarePluginContext<
  TResolvedConfig extends CloudflarePluginResolvedConfig =
    CloudflarePluginResolvedConfig
> = PluginContext<TResolvedConfig> &
  EnvPluginContext<TResolvedConfig> & {
    workers: CloudflareWorkerEntryModule[];
  };
