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

import { listFiles } from "@stryke/fs/list-files";
import { isParentPath } from "@stryke/path/is-parent-path";
import { Context } from "powerlines";
import { format as prettier, resolveConfig } from "prettier";

/**
 * Formats code using Prettier based on the file path.
 *
 * @param context - The Powerlines context.
 * @param path - The file path to use for resolving Prettier configuration.
 * @param data - The code string to format.
 * @param force - Whether to force formatting even for output/build paths.
 * @returns A promise that resolves to the formatted code string.
 */
export async function format(
  context: Context,
  path: string,
  data: string,
  force = false
): Promise<string> {
  if (
    !force &&
    (isParentPath(path, context.config.output.outputPath) ||
      isParentPath(path, context.config.output.buildPath))
  ) {
    return data;
  }

  let code = data;
  const resolvedConfig = await resolveConfig(path);
  if (resolvedConfig) {
    code = await prettier(data, {
      absolutePath: path,
      ...resolvedConfig
    });
  }

  return code;
}

/**
 * Formats all files in a folder using Prettier based on their file paths.
 *
 * @param context - The Powerlines context.
 * @param path - The folder path containing files to format.
 * @returns A promise that resolves when all files have been formatted.
 */
export async function formatFolder(context: Context, path: string) {
  if (
    !isParentPath(path, context.config.output.outputPath) &&
    !isParentPath(path, context.config.output.buildPath)
  ) {
    await Promise.allSettled(
      (await listFiles(path)).map(async file => {
        if (
          !isParentPath(file, context.config.output.outputPath) &&
          !isParentPath(file, context.config.output.buildPath)
        ) {
          const data = await context.fs.read(file);
          if (data) {
            const formatted = await format(context, file, data);

            return context.fs.write(file, formatted);
          }
        }
      })
    );
  }
}
