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

import { replacePath } from "@stryke/path/replace";
import { IsUndefined } from "@stryke/types/base";
import { UnresolvedContext } from "../types/context";

/**
 * Replaces tokens in the given path string with their corresponding values from the context.
 *
 * @remarks
 * The following tokens are supported:
 * - `{workspaceRoot}` - The root directory of the workspace.
 * - `{root}` - The root directory of the project (same as `{projectRoot}`).
 * - `{projectRoot}` - The root directory of the project (same as `{root}`).
 * - `{powerlinesPath}` - The directory where Powerlines is installed.
 * - `{cachePath}` - The environment's directory for cached files.
 * - `{dataPath}` - The environment's directory for data files.
 * - `{logPath}` - The environment's directory for log files.
 * - `{tempPath}` - The environment's directory for temporary files.
 * - `{configPath}` - The environment's directory for configuration files.
 * - `{artifactsPath}` - The configured directory for build artifacts.
 * - `{builtinPath}` - The configured directory for built-in plugins.
 * - `{entryPath}` - The configured directory for entry files.
 *
 * @param context - The context containing the values for the path tokens.
 * @param path - The path string with tokens to replace.
 * @returns The path string with tokens replaced by their corresponding values from the context.
 */
export function replacePathTokens(
  context: UnresolvedContext,
  path?: string
): IsUndefined<typeof path> extends true ? undefined : string {
  if (!path) {
    return path as IsUndefined<typeof path> extends true ? undefined : string;
  }

  return path
    .replaceAll("{workspaceRoot}", context.workspaceConfig.workspaceRoot)
    .replaceAll("{root}", context.config.projectRoot)
    .replaceAll("{projectRoot}", context.config.projectRoot)
    .replaceAll("{powerlinesPath}", context.powerlinesPath)
    .replaceAll("{cachePath}", context.cachePath)
    .replaceAll("{dataPath}", context.dataPath)
    .replaceAll("{logPath}", context.envPaths.log)
    .replaceAll("{tempPath}", context.envPaths.temp)
    .replaceAll("{configPath}", context.envPaths.config)
    .replaceAll(
      "{artifactsPath}",
      replacePath(context.artifactsPath, context.workspaceConfig.workspaceRoot)
    )
    .replaceAll(
      "{builtinPath}",
      replacePath(context.builtinsPath, context.workspaceConfig.workspaceRoot)
    )
    .replaceAll(
      "{entryPath}",
      replacePath(context.entryPath, context.workspaceConfig.workspaceRoot)
    );
}
