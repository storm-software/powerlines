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

import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { UnresolvedContext } from "../types/context";

/**
 * Get the organization name from the context
 *
 * @param context - The Powerlines plugin context.
 * @returns The organization name or undefined if not found.
 */
export function getOrganizationName(
  context: UnresolvedContext
): string | undefined {
  let result: string | undefined;
  if (isSetObject(context.workspaceConfig.organization)) {
    result = context.workspaceConfig.organization.name;
  }

  if (!result && isSetString(context.workspaceConfig.organization)) {
    result = context.workspaceConfig.organization;
  }

  if (
    !result &&
    Array.isArray(context.packageJson.maintainers) &&
    context.packageJson.maintainers.length > 0
  ) {
    if (isSetObject(context.packageJson.maintainers[0])) {
      result = (context.packageJson.maintainers[0] as { name: string }).name;
    }

    if (!result && isSetString(context.packageJson.maintainers[0])) {
      result = context.packageJson.maintainers[0];
    }
  }

  if (
    !result &&
    Array.isArray(context.packageJson.author) &&
    context.packageJson.author.length > 0
  ) {
    if (isSetObject(context.packageJson.author[0])) {
      result = (context.packageJson.author[0] as { name: string }).name;
    }

    if (!result && isSetString(context.packageJson.author[0])) {
      result = context.packageJson.author[0];
    }
  }

  if (
    !result &&
    Array.isArray(context.packageJson.contributors) &&
    context.packageJson.contributors.length > 0
  ) {
    if (isSetObject(context.packageJson.contributors[0])) {
      result = (context.packageJson.contributors[0] as { name: string }).name;
    }

    if (!result && isSetString(context.packageJson.contributors[0])) {
      result = context.packageJson.contributors[0];
    }
  }

  return result;
}
