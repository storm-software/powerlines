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
import type { PluginContext, ResolvedEntryTypeDefinition } from "powerlines";

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
   * The name of the Cloudflare Worker script to deploy - used in URLs and route configuration.
   *
   * @remarks
   * If no value is provided, the {@link Config.name} configuration value will be used.
   */
  scriptName?: string;
}

export type CloudflarePluginUserConfig = EnvPluginUserConfig &
  PulumiPluginUserConfig & {
    /**
     * Options for the Cloudflare plugin.
     */
    cloudflare?: CloudflarePluginOptions;
  };

export type CloudflarePluginResolvedConfig = EnvPluginResolvedConfig &
  PulumiPluginResolvedConfig & {
    /**
     * Options for the Cloudflare plugin.
     */
    cloudflare: Required<CloudflarePluginOptions>;
  };

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
  EnvPluginContext<TResolvedConfig> &
  PulumiPluginContext<TResolvedConfig> & {
    workers: CloudflareWorkerEntryModule[];
  };
