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

import { resolvePackage } from "@stryke/fs/resolve";
import { joinPaths } from "@stryke/path/join-paths";
import type { Context } from "../../types/context";

/**
 * Resolves the path of a file in the workspace or project root.
 *
 * @param context - The context object containing the environment paths.
 * @param file - The file path to resolve.
 * @returns A promise that resolves to the resolved path.
 */
export async function resolvePath(
  context: Context,
  file: string
): Promise<string | undefined> {
  let path = context.fs.resolve(file);
  if (path) {
    return path;
  }

  path = file;
  if (context.fs.existsSync(path)) {
    return path;
  }

  path = joinPaths(context.workspaceConfig.workspaceRoot, file);
  if (context.fs.existsSync(path)) {
    return path;
  }

  path = joinPaths(
    context.workspaceConfig.workspaceRoot,
    context.config.projectRoot,
    file
  );
  if (context.fs.existsSync(path)) {
    return path;
  }

  path = joinPaths(context.config.projectRoot, file);
  if (context.fs.existsSync(path)) {
    return path;
  }

  return resolvePackage(file, {
    paths: [
      context.workspaceConfig.workspaceRoot,
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot
      )
    ]
  });
}
