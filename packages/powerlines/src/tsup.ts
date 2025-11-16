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

import { omit } from "@stryke/helpers/omit";
import type { Options } from "tsup";
import PowerlinesESBuild from "./esbuild";

/**
 * A Tsup configuration function that integrates Powerlines into the build process.
 *
 * @see https://tsup.egoist.dev/#/config
 *
 * @example
 * ```ts
 * // tsup.config.ts
 * import withPowerlines from "powerlines/tsup"
 *
 * export default withPowerlines({
 *  entry: ["src/index.ts"],
 *  format: ["cjs", "esm"],
 *  dts: true,
 *  sourcemap: true,
 *  clean: true,
 * })
 * ```
 *
 * @param options - The Tsup options to merge with the Powerlines configuration.
 * @returns The merged Tsup configuration options.
 */
export function tsup(options: Options = {}): Options {
  return {
    ...options,
    esbuildPlugins: [
      PowerlinesESBuild({
        output: {
          outputPath: options.outDir,
          format: options.format
        },
        build: {
          ...omit(options, [
            "plugins",
            "banner",
            "footer",
            "outExtension",
            "outDir",
            "format",
            "minify",
            "pure"
          ]),
          minify: Boolean(options.minify),
          pure: Array.isArray(options.pure)
            ? options.pure
            : typeof options.pure === "string"
              ? [options.pure]
              : []
        }
      })
    ]
  };
}

export default tsup;
export { tsup as "module.exports" };
