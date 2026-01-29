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

import { joinPaths } from "@stryke/path/join";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { format } from "powerlines/lib/utilities/format";
import { TsdownPluginContext } from "../types/plugin";

/**
 * Formats the `package.json` file in the project root.
 *
 * @param context - The Tsdown plugin context.
 */
export async function formatPackageJson(context: TsdownPluginContext) {
  const packageJsonPath = joinPaths(
    context.workspaceConfig.workspaceRoot,
    context.config.projectRoot,
    "package.json"
  );
  const packageJsonFile = await context.fs.read(packageJsonPath);
  if (isSetString(packageJsonFile)) {
    await context.fs.write(
      packageJsonPath,
      await format(context, packageJsonPath, packageJsonFile)
    );
  }
}
