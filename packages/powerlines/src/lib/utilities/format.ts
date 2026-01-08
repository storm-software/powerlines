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
import { Context } from "powerlines";
import { format as prettier, resolveConfig } from "prettier";

/**
 * Formats code using Prettier based on the file path.
 *
 * @param path - The file path to use for resolving Prettier configuration.
 * @param data - The code string to format.
 * @returns A promise that resolves to the formatted code string.
 */
export async function format(path: string, data: string): Promise<string> {
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
  const files = await listFiles(path);

  return Promise.allSettled(
    files.map(async file => {
      const data = await context.fs.read(file);
      if (data) {
        const formatted = await format(file, data);

        return context.fs.write(file, formatted);
      }
    })
  );
}
