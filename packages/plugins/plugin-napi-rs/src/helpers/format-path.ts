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

import { appendPath } from "@stryke/path/append";
import { relativePath } from "@stryke/path/file-path-fns";
import { replacePathTokens } from "powerlines/plugin-utils";
import { NapiPluginContext } from "../types";

/**
 * Format the given path by replacing tokens and making it relative to the project root.
 *
 * @remarks
 * This function is used to format paths in the plugin's configuration, such as the path to the crate or the output directory. It replaces tokens in the path (e.g. `{crate}`) with their corresponding values from the plugin context, and then makes the path relative to the project root.
 *
 * @param context - The plugin context, which contains the configuration and other information about the plugin's execution environment.
 * @param path - The path to format or undefined, which may contain tokens to be replaced. This can be a path to a file or directory, and can include tokens such as `{crate}` that will be replaced with their corresponding values from the plugin context.
 * @returns The formatted path, which has had tokens replaced and is relative to the project root. If the input path is undefined, this function will return undefined.
 */
export function formatPath(
  context: NapiPluginContext,
  path?: string
): string | undefined {
  const cwd = appendPath(context.config.root, context.config.cwd);

  return path
    ? relativePath(
        cwd,
        appendPath(
          appendPath(replacePathTokens(context, path), context.config.root),
          context.config.cwd
        )
      )
    : undefined;
}
