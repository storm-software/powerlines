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

import { joinPaths } from "@stryke/path";
import { UnresolvedContext } from "powerlines";

export interface ResolveConfigPathOptions {
  useRedirectIfAvailable?: boolean;
}

export interface ConfigPaths {
  /**
   * Absolute path to the actual configuration being used (possibly redirected from the user's config).
   */
  configPath: string | undefined;
  /**
   * Absolute path to the user's configuration, which may not be the same as `configPath` if it was redirected.
   */
  userConfigPath: string | undefined;
  /**
   * Absolute path to the deploy config path used
   */
  deployConfigPath: string | undefined;
  /**
   * Was a redirected config file read?
   */
  redirected: boolean;
}

/**
 * Resolves the Wrangler configuration file path by checking for allowed extensions in the specified root directory.
 *
 * @param context - The Cloudflare plugin context containing the configuration and file system access.
 * @returns The absolute path to the found configuration file, or undefined if no file is found.
 */
export function resolveWranglerConfigPath(
  context: UnresolvedContext
): string | undefined {
  for (const extension of ["jsonc", "json", "toml"]) {
    if (
      context.fs.existsSync(
        joinPaths(context.config.root, `wrangler.${extension}`)
      )
    ) {
      return joinPaths(context.config.root, `wrangler.${extension}`);
    }
  }

  return undefined;
}
