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
import { getUnique } from "@stryke/helpers/get-unique";
import { isRegExp } from "@stryke/type-checks/is-regexp";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { ResolveConfig } from "../types/config";
import { Context } from "../types/context";

export interface GetDependencyConfigResult {
  external: ResolveConfig["external"];
  noExternal: ResolveConfig["noExternal"];
}

/**
 * Get the {@link ResolveConfig.external | external} and {@link ResolveConfig.noExternal | noExternal} dependencies for the build configuration.
 *
 * @param context - The build context.
 * @returns The dependency configuration.
 */
export function getDependencyConfig(
  context: Context
): GetDependencyConfigResult {
  const noExternal = getUnique(
    toArray(context.config.resolve.noExternal).concat(context.builtins)
  );

  const external = getUnique(
    toArray(context.config.resolve.external).reduce(
      (ret, ext) => {
        if (isRegExp(ext)) {
          if (
            noExternal.some(
              noExt => isRegExp(noExt) && noExt.source === ext.source
            )
          ) {
            return ret;
          }

          const noExts = noExternal.filter(
            noExt => isSetString(noExt) && ext.test(noExt)
          );
          if (noExts.length > 0) {
            ret.push(
              new RegExp(
                noExts.reduce(
                  (regex: string, noExt: string | RegExp) =>
                    `(?!${
                      isRegExp(noExt) ? noExt.source : `^${noExt}$`
                    })${regex}`,
                  `${ext.source
                    .replace(/^\^@\?/, "^@")
                    .replace(/^@\?/, "@")
                    .replace(/\$$/, "")
                    .replace(/\.\*$/, "")}.*$`
                )
              )
            );
            return ret;
          }
        }

        ret.push(ext);
        return ret;
      },
      [] as (string | RegExp)[]
    )
  );

  return {
    external: external.length === 0 ? undefined : external,
    noExternal: noExternal.length === 0 ? undefined : noExternal
  };
}
