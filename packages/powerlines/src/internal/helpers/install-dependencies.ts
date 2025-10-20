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
import { isValidRange } from "@stryke/fs/semver-fns";
import {
  getPackageName,
  getPackageVersion,
  hasPackageVersion
} from "@stryke/string-format/package";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { Context } from "../../types/context";
import { installPackage } from "./install";

/**
 * Install missing project dependencies.
 *
 * @param context - The build context.
 */
export async function installDependencies<TContext extends Context = Context>(
  context: TContext
): Promise<void> {
  context.log(
    LogLevelLabel.TRACE,
    `Checking and installing missing project dependencies.`
  );

  context.dependencies ??= {};
  context.dependencies["powerlines"] = { type: "dependency" };

  if (context.config.projectType === "application") {
    context.dependencies.unstorage = { type: "dependency" };
  }

  context.log(
    LogLevelLabel.TRACE,
    `The following packages must be installed as dependencies: \n${Object.keys(
      context.dependencies
    )
      .map(
        key =>
          ` - ${getPackageName(key)}${
            hasPackageVersion(key) ||
            (isSetObject(context.dependencies[key]) &&
              isSetString(context.dependencies[key].version))
              ? ` v${
                  isSetObject(context.dependencies[key]) &&
                  isSetString(context.dependencies[key].version)
                    ? context.dependencies[key].version
                    : getPackageVersion(key)
                }`
              : ""
          } (${
            (isString(context.dependencies[key])
              ? context.dependencies[key]
              : context.dependencies[key]?.type) || "dependency"
          })`
      )
      .join("\n")}`
  );

  for (const [key, value] of Object.entries(context.dependencies)) {
    const version =
      (isSetObject(value) && isValidRange(value.version) && value.version) ||
      getPackageVersion(key);

    await installPackage(
      context,
      version
        ? `${getPackageName(key)}@${String(version)}`
        : getPackageName(key),
      (isSetString(value) ? value : value.type) === "devDependency"
    );
  }
}
