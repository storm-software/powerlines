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

import { createUnpluginResolver } from "@powerlines/core/lib/unplugin";
import { PluginContext } from "@powerlines/core/types/context";
import { findFileName } from "@stryke/path/file-path-fns";
import defu from "defu";
import { build, BuildOptions, OutputFile } from "esbuild";
import { createEsbuildPlugin } from "unplugin";
import { resolveOptions } from "./resolve-options";

/**
 * Bundle a type definition to a module.
 *
 * @param context - The context object containing the environment paths.
 * @param file - The file path to bundle.
 * @param overrides - Optional overrides for the ESBuild configuration.
 * @returns A promise that resolves to the bundled module.
 */
export async function bundle(
  context: PluginContext,
  file: string,
  overrides: Partial<BuildOptions> = {}
): Promise<OutputFile> {
  const path = await context.fs.resolve(file);
  if (!path || !context.fs.existsSync(path)) {
    throw new Error(
      `Module not found: "${file}". Please check the path and try again.`
    );
  }

  const result = await build(
    defu(
      {
        ...resolveOptions(context),
        entryPoints: [path],
        write: false,
        sourcemap: false,
        splitting: false,
        treeShaking: false,
        bundle: true,
        packages: "bundle",
        platform: "node",
        logLevel: "silent",
        ...overrides
      } as BuildOptions,
      {
        plugins: [
          createEsbuildPlugin(
            createUnpluginResolver(context, `${findFileName(file)} Bundler`)
          )({})
        ]
      }
    )
  );
  if (result.errors.length > 0) {
    throw new Error(
      `Failed to bundle ${file}: ${result.errors
        .map(error => error.text)
        .join(", ")}`
    );
  }
  if (result.warnings.length > 0) {
    context.warn(
      `Warnings while bundling ${file}: ${result.warnings
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
