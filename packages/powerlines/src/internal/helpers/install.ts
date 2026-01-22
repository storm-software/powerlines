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

import { install } from "@stryke/fs/install";
import {
  doesPackageMatch,
  getPackageListing,
  isPackageListed
} from "@stryke/fs/package-fns";
import {
  getPackageName,
  getPackageVersion,
  hasPackageVersion
} from "@stryke/string-format/package";
import { isNumber } from "@stryke/type-checks/is-number";
import type { Context } from "../../types/context";

/**
 * Installs a package if it is not already installed.
 *
 * @param context - The resolved options
 * @param packageName - The name of the package to install
 * @param dev - Whether to install the package as a dev dependency
 */
export async function installPackage(
  context: Context,
  packageName: string,
  dev = false
) {
  if (
    !(await isPackageListed(getPackageName(packageName), {
      cwd: context.config.projectRoot
    }))
  ) {
    if (context.config.autoInstall) {
      context.warn(
        `The package "${packageName}" is not installed. It will be installed automatically.`
      );

      const result = await install(packageName, {
        cwd: context.config.projectRoot,
        dev
      });
      if (isNumber(result.exitCode) && result.exitCode > 0) {
        context.error(result.stderr);
        throw new Error(
          `An error occurred while installing the package "${packageName}"`
        );
      }
    } else {
      context.warn(
        `The package "${packageName}" is not installed. Since the "autoInstall" option is set to false, it will not be installed automatically.`
      );
    }
  } else if (
    hasPackageVersion(packageName) &&
    !process.env.POWERLINES_SKIP_VERSION_CHECK
  ) {
    const isMatching = await doesPackageMatch(
      getPackageName(packageName),
      getPackageVersion(packageName)!,
      context.config.projectRoot
    );
    if (!isMatching) {
      const packageListing = await getPackageListing(
        getPackageName(packageName),
        {
          cwd: context.config.projectRoot
        }
      );
      if (
        !packageListing?.version.startsWith("catalog:") &&
        !packageListing?.version.startsWith("workspace:")
      ) {
        context.warn(
          `The package "${getPackageName(packageName)}" is installed but does not match the expected version ${getPackageVersion(
            packageName
          )} (installed version: ${packageListing?.version || "<Unknown>"}). Please ensure this is intentional before proceeding. Note: You can skip this validation with the "STORM_STACK_SKIP_VERSION_CHECK" environment variable.`
        );
      }
    }
  }
}

/**
 * Installs a package if it is not already installed.
 *
 * @param context - The resolved options
 * @param packages - The list of packages to install
 */
export async function installPackages(
  context: Context,
  packages: Array<{ name: string; dev?: boolean }>
) {
  return Promise.all(
    packages.map(async pkg => installPackage(context, pkg.name, pkg.dev))
  );
}
