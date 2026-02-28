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

import { getPackageName } from "@stryke/string-format/package";
import { Context } from "../../types";
import { installPackage } from "./install";

/**
 * Install missing project dependencies.
 *
 * @param context - The build context.
 */
export async function installDependencies<TContext extends Context = Context>(
  context: TContext
): Promise<void> {
  context.debug(`Checking and installing missing project dependencies.`);

  context.dependencies ??= {};
  context.devDependencies ??= {};

  if (
    Object.keys(context.dependencies).length === 0 &&
    Object.keys(context.devDependencies).length === 0
  ) {
    context.debug(
      `No dependencies or devDependencies to install. Skipping installation step.`
    );
    return;
  }

  context.debug(
    `The following packages are required: \nDependencies: \n${Object.entries(
      context.dependencies
    )
      .map(([name, version]) => `- ${name}@${String(version)}`)
      .join(" \n")}\n\nDevDependencies: \n${Object.entries(
      context.devDependencies
    )
      .map(([name, version]) => `- ${name}@${String(version)}`)
      .join(" \n")}`
  );

  await Promise.all([
    Promise.all(
      Object.entries(context.dependencies).map(async ([name, version]) =>
        installPackage(
          context,
          `${getPackageName(name)}@${String(version)}`,
          false
        )
      )
    ),
    Promise.all(
      Object.entries(context.devDependencies).map(async ([name, version]) =>
        installPackage(
          context,
          `${getPackageName(name)}@${String(version)}`,
          true
        )
      )
    )
  ]);
}
