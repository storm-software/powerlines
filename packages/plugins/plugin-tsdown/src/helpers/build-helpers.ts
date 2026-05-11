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

// eslint-disable-next-line ts/no-unused-vars
import type { Context, ResolveConfig } from "@powerlines/core";
import type { GetDependencyConfigResult } from "@powerlines/core/plugin-utils";

import { getDependencyConfig as _getDependencyConfig } from "@powerlines/core/plugin-utils";
import { globToRegex } from "@stryke/path/glob-to-regex";
import { isSetString } from "@stryke/type-checks/is-set-string";

/**
 * Get the {@link ResolveConfig.external | external} and {@link ResolveConfig.noExternal | noExternal} dependencies for the build configuration.
 *
 * @param context - The build context.
 * @returns The dependency configuration.
 */
export function getDependencyConfig(
  context: Context
): GetDependencyConfigResult {
  const { external, noExternal } = _getDependencyConfig(context);

  return {
    external:
      !external || external.length === 0
        ? undefined
        : external.map(ext =>
            isSetString(ext) && ext.includes("*") ? globToRegex(ext) : ext
          ),
    noExternal:
      !noExternal || noExternal.length === 0
        ? undefined
        : noExternal.map(noExt =>
            isSetString(noExt) && noExt.includes("*")
              ? globToRegex(noExt)
              : noExt
          )
  };
}
