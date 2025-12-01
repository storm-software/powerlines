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

import { toArray } from "@stryke/convert/to-array";
import { omit } from "@stryke/helpers/omit";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { UserConfig } from "tsdown/config";
import { resolveFromTsdownFormat } from "./lib/build/tsdown";
import PowerlinesRolldown from "./rolldown";
import { BuildConfig } from "./types/build";
import { OutputConfig } from "./types/config";

/**
 * A Tsdown configuration function that integrates Powerlines into the build process.
 *
 * @see https://github.com/rolldown/tsdown
 *
 * @example
 * ```ts
 * // tsdown.config.ts
 * import withPowerlines from "powerlines/tsdown";
 *
 * export default withPowerlines({
 *  entry: ["src/index.ts"],
 *  format: ["cjs", "esm"],
 *  dts: true,
 *  sourcemap: true,
 *  clean: true,
 * });
 *
 * ```
 *
 * @param options - The Tsdown options to merge with the Powerlines configuration.
 * @returns The merged Tsdown configuration options.
 */
export function tsdown(options: UserConfig = {}): UserConfig {
  return {
    ...options,
    entry: options.entry,
    plugins: [
      PowerlinesRolldown({
        name: options.name,
        root: options.cwd,
        output: {
          outputPath: options.outDir,
          format: resolveFromTsdownFormat(options.format),
          assets: toArray(options.copy)
            .map(copy => {
              if (!copy) {
                return undefined;
              }

              if (isSetString(copy)) {
                return copy;
              }

              if (isFunction(copy)) {
                // eslint-disable-next-line no-console
                console.warn(
                  "Function-based copy options are not supported in Powerlines."
                );

                return undefined;
              }

              return {
                input: copy.from,
                output: copy.to
              };
            })
            .filter(Boolean) as OutputConfig["assets"]
        },
        clean: options.clean === false ? false : undefined,
        build: {
          ...omit(options, [
            "name",
            "entry",
            "outDir",
            "format",
            "minify",
            "clean",
            "cwd",
            "tsconfig",
            "publicDir",
            "copy",
            "debug",
            "watch",
            "external",
            "noExternal"
          ]),
          external: options.external
            ? (toArray(options.external)
                .map(external => {
                  if (isFunction(external)) {
                    // eslint-disable-next-line no-console
                    console.warn(
                      "Function-based external options are not supported in Powerlines."
                    );

                    return undefined;
                  }

                  return external;
                })
                .filter(Boolean) as BuildConfig["external"])
            : undefined,
          noExternal: options.noExternal
            ? (toArray(options.noExternal)
                .map(noExternal => {
                  if (isFunction(noExternal)) {
                    // eslint-disable-next-line no-console
                    console.warn(
                      "Function-based noExternal options are not supported in Powerlines."
                    );

                    return undefined;
                  }

                  return noExternal;
                })
                .filter(Boolean) as BuildConfig["noExternal"])
            : undefined
        },
        tsconfig: isSetString(options.tsconfig) ? options.tsconfig : undefined
      })
    ]
  };
}

export default tsdown;
export { tsdown as "module.exports" };
