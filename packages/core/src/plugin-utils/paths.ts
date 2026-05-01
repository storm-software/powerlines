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
import { replacePath } from "@stryke/path/replace";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { IsUndefined } from "@stryke/types/base";
import { UnresolvedContext } from "../types/context";

/**
 * Replaces tokens in the given path string with their corresponding values from the context.
 *
 * @remarks
 * The following tokens are supported:
 * - `{cwd}` - The current working directory.
 * - `{workspaceRoot}` - The current working directory (same as `{cwd}`).
 * - `{root}` - The root directory of the project (same as `{projectRoot}`).
 * - `{projectRoot}` - The root directory of the project (same as `{root}`).
 * - `{sourceRoot}` - The source root directory of the project (usually `{root}/src`).
 * - `{powerlinesPath}` - The directory where Powerlines is installed.
 * - `{cachePath}` - The environment's directory for cached files.
 * - `{dataPath}` - The environment's directory for data files.
 * - `{logPath}` - The environment's directory for log files.
 * - `{tempPath}` - The environment's directory for temporary files.
 * - `{configPath}` - The environment's directory for configuration files.
 * - `{output}` - The configured output directory for the project.
 * - `{outputPath}` - The configured output directory for the project.
 * - `{copy}` - The configured final/copied distribution directory for the project.
 * - `{copyPath}` - The configured final/copied distribution directory for the project.
 * - `{artifactsPath}` - The configured directory for build artifacts.
 * - `{builtinPath}` - The configured directory for generated built-in plugins.
 * - `{entryPath}` - The configured directory for generated entry files.
 *
 * @example
 * ```ts
 * const path = replacePathTokens(context, "{root}/dist");
 * // If context.config.root is "/home/user/project", this will return "/home/user/project/dist"
 *
 * const pathWithCopy = replacePathTokens(context, "{copy}");
 * // If context.config.output.copy.path is "/home/user/project/dist-copy", this will return "/home/user/project/dist-copy"
 * ```
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

  let result = path
    .replaceAll("{cwd}", context.config.cwd || process.cwd())
    .replaceAll("{workspaceRoot}", context.config.cwd || process.cwd())
    .replaceAll("{root}", context.config.root)
    .replaceAll("{projectRoot}", context.config.root)
    .replaceAll("{sourceRoot}", joinPaths(context.config.root, "src"))
    .replaceAll("{powerlinesPath}", context.powerlinesPath)
    .replaceAll("{cachePath}", context.cachePath)
    .replaceAll("{dataPath}", context.dataPath)
    .replaceAll("{logPath}", context.envPaths.log)
    .replaceAll("{tempPath}", context.envPaths.temp)
    .replaceAll("{configPath}", context.envPaths.config)
    .replaceAll(
      "{artifactsPath}",
      replacePath(context.artifactsPath, context.config.cwd)
    )
    .replaceAll(
      "{builtinPath}",
      replacePath(context.builtinsPath, context.config.cwd)
    )
    .replaceAll(
      "{builtinsPath}",
      replacePath(context.builtinsPath, context.config.cwd)
    )
    .replaceAll(
      "{entryPath}",
      replacePath(context.entryPath, context.config.cwd)
    );

  if (context.config.output) {
    if (isSetString(context.config.output.path)) {
      result = result
        .replaceAll("{outputPath}", context.config.output.path)
        .replaceAll("{output}", context.config.output.path);
    }
    if (
      context.config.output.copy &&
      isSetString(context.config.output.copy?.path)
    ) {
      result = result
        .replaceAll("{copyPath}", context.config.output.copy.path)
        .replaceAll("{copy}", context.config.output.copy.path);
    }
  }

  return result;
}
