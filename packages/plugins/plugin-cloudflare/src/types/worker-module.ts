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

import { ExportedHandler } from "@cloudflare/workers-types";
import { WranglerUserConfig } from "./wrangler";

export type WorkerModuleMetadata = Partial<
  Omit<WranglerUserConfig, "account_id" | "name">
> & {
  /**
   * The name of the Cloudflare Worker script to deploy - used in URLs and route configuration.
   *
   * @remarks
   * If no value is provided, the {@link Config.name} configuration value will be used.
   */
  name?: string;

  /**
   * A path to the Wrangler configuration file (either `.toml` or `.jsonc`) to use as the base configuration for the plugin.
   *
   * @remarks
   * This is required for certain features of the plugin, such as deploying a Cloudflare Worker entry module. If not provided, the plugin will look for a Wrangler configuration file in the project root directory with the default name `wrangler.toml`. You can also specify a custom path to the Wrangler configuration file using this option.
   */
  configPath?: string;

  /**
   * A routing pattern to associate with the deployed Worker script.
   *
   * @remarks
   * This is required for the Worker script to be accessible via a public URL. The plugin will replace the string `{domain}` in the pattern with the value of the `domain` configuration option, if provided. If no pattern is provided, a default pattern will be generated based on the script name and plugin mode (e.g. `https://{scriptName}.{mode}.worker-script.{domain}`).
   *
   * @example
   * ```typescript
   * // Example pattern for: "worker-script.my-example-domain.com"
   * pattern: "worker-script.{domain}"
   * ```
   */
  pattern?: string;
};

export interface WorkerModule {
  metadata?: WorkerModuleMetadata;
  default: ExportedHandler;
}
