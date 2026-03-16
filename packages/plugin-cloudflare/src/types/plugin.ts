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
import type {
  EnvPluginContext,
  EnvPluginResolvedConfig,
  EnvPluginUserConfig
} from "@powerlines/plugin-env";
import type {
  PulumiPluginContext,
  PulumiPluginResolvedConfig,
  PulumiPluginUserConfig
} from "@powerlines/plugin-pulumi";
import type {
  UnenvPluginContext,
  UnenvPluginOptions,
  UnenvPluginResolvedConfig,
  UnenvPluginUserConfig
} from "@powerlines/plugin-unenv";
import type { RequiredKeys } from "@stryke/types/base";
import type { PluginContext, ResolvedEntryTypeDefinition } from "powerlines";
import { WorkerModuleMetadata } from "./worker-module";

export interface CloudflarePluginOptions {
  /**
   * The Cloudflare account ID to use for the plugin.
   *
   * @remarks
   * This is required for certain features of the plugin, such as deploying a Cloudflare Worker entry module. This option can also be set via the `CLOUDFLARE_ACCOUNT_ID` environment variable. If both are provided, the value from the plugin options will take precedence.
   *
   * @see https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/
   */
  accountId?: string;

  /**
   * The Cloudflare API token to use for the plugin.
   *
   * @remarks
   * This option can also be set via the `CLOUDFLARE_API_TOKEN` environment variable. If both are provided, the value from the plugin options will take precedence.
   *
   * @see https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
   */
  apiToken?: string;

  /**
   * The domain to use for the Cloudflare deployed resources.
   */
  domain?: string;

  /**
   * The [unenv](https://unjs.dev/packages/unenv) plugin configuration options.
   *
   * @remarks
   * The plugin will automatically include the Cloudflare preset for unenv, which provides compatibility with Cloudflare Workers runtimes. You can customize the unenv configuration by providing options here, but the Cloudflare preset will always be included.
   */
  unenv?: UnenvPluginOptions;
}

export type CloudflarePluginUserConfig = EnvPluginUserConfig &
  PulumiPluginUserConfig &
  UnenvPluginUserConfig & {
    /**
     * Options for the Cloudflare plugin.
     */
    cloudflare?: Omit<CloudflarePluginOptions, "unenv">;
  };

export type CloudflarePluginResolvedConfig = EnvPluginResolvedConfig &
  PulumiPluginResolvedConfig &
  UnenvPluginResolvedConfig & {
    /**
     * Options for the Cloudflare plugin.
     */
    cloudflare: Required<Omit<CloudflarePluginOptions, "unenv">>;
  };

export type CloudflareWorkerMetadata = RequiredKeys<
  WorkerModuleMetadata,
  "name" | "pattern"
> & {
  /**
   * The resolved entry definition for the Worker module, including the original entry definition and the resolved file path to the module.
   */
  entry: ResolvedEntryTypeDefinition;
};

export type CloudflareWorkerEntryModule = Record<
  keyof ExportedHandler,
  boolean
> & {
  /**
   * The metadata for the Worker module, including the name of the Cloudflare Worker script to deploy. If no name is provided, the plugin will use the `name` configuration value from the plugin configuration as the default name for the Worker script.
   */
  metadata: CloudflareWorkerMetadata;
};

export type CloudflarePluginContext<
  TResolvedConfig extends CloudflarePluginResolvedConfig =
    CloudflarePluginResolvedConfig
> = PluginContext<TResolvedConfig> &
  EnvPluginContext<TResolvedConfig> &
  PulumiPluginContext<TResolvedConfig> &
  UnenvPluginContext<TResolvedConfig> & {
    workers: CloudflareWorkerEntryModule[];
  };
