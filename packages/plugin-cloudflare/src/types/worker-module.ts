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

export interface WorkerModuleMetadata {
  /**
   * The name of the Cloudflare Worker script to deploy - used in URLs and route configuration.
   *
   * @remarks
   * If no value is provided, the {@link Config.name} configuration value will be used.
   */
  name?: string;
}

export interface WorkerModule {
  metadata?: WorkerModuleMetadata;
  default: ExportedHandler;
}
