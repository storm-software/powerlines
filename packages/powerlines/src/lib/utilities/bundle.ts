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

import { LogLevelLabel } from "@storm-software/config-tools/types";
import { build, BuildOptions, OutputFile } from "esbuild";
import { ESBuildResolvedBuildConfig } from "../../types/build";
import { Context } from "../../types/context";
import { extractESBuildConfig } from "../build/esbuild";
import { resolvePath } from "./resolve-path";

/**
 * Bundle a type definition to a module.
 *
 * @param context - The context object containing the environment paths.
 * @param file - The file path to bundle.
 * @param overrides - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the bundled module.
 */
export async function bundle(
  context: Context,
  file: string,
  overrides: Partial<ESBuildResolvedBuildConfig> = {}
): Promise<OutputFile> {
  const path = await resolvePath(context, file);
  if (!path || !context.fs.existsSync(path)) {
    throw new Error(
      `Module not found: "${file}". Please check the path and try again.`
    );
  }

  const result = await build({
    ...extractESBuildConfig(context),
    entry: [path],
    write: false,
    sourcemap: false,
    splitting: false,
    treeShaking: false,
    bundle: true,
    ...overrides
  } as BuildOptions);
  if (result.errors.length > 0) {
    throw new Error(
      `Failed to transpile ${file}: ${result.errors
        .map(error => error.text)
        .join(", ")}`
    );
  }
  if (result.warnings.length > 0) {
    context.log(
      LogLevelLabel.WARN,
      `Warnings while transpiling ${file}: ${result.warnings
        .map(warning => warning.text)
        .join(", ")}`
    );
  }
  if (!result.outputFiles || result.outputFiles.filter(Boolean).length === 0) {
    throw new Error(
      `No output files generated for ${
        file
      }. Please check the configuration and try again.`
    );
  }

  return result.outputFiles.filter(Boolean)[0]!;
}
