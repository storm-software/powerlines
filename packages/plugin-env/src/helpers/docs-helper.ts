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

import { joinPaths } from "@stryke/path/join";
import { EnvPluginContext } from "../types/plugin";

/**
 * Gets the output path for the generated environment documentation.
 *
 * @param context - The environment plugin context.
 * @returns The output path for the generated environment documentation.
 */
export function getDocsOutputPath(context: EnvPluginContext): string {
  return joinPaths(context.config.projectRoot, "docs", "generated");
}
