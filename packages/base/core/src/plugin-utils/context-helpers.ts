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

import { tryGetWorkspaceConfig } from "@storm-software/config-tools/get-config";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { PackageJson } from "@stryke/types/package-json";
import { UnresolvedContext } from "../types/context";

/**
 * Get the organization name from the context
 *
 * @param context - The Powerlines plugin context.
 * @returns The organization name or undefined if not found.
 */
export async function getOrganizationName(
  context: UnresolvedContext
): Promise<string | undefined> {
  if (isSetString(context.config.organization)) {
    return context.config.organization;
  }

  return (
    getPackageJsonOrganization(context.packageJson) ||
    (await getWorkspaceName(context)) ||
    context.config.name
  );
}

/**
 * Get the organization name from the `package.json` file
 *
 * @param packageJson - The `package.json` object to extract the organization name from.
 * @returns The organization name or undefined if not found.
 */
export function getPackageJsonOrganization(
  packageJson: PackageJson
): string | undefined {
  let result: string | undefined;
  if (
    Array.isArray(packageJson.maintainers) &&
    packageJson.maintainers.length > 0
  ) {
    if (isSetObject(packageJson.maintainers[0])) {
      result = (packageJson.maintainers[0] as { name: string }).name;
    }

    if (!result && isSetString(packageJson.maintainers[0])) {
      result = packageJson.maintainers[0];
    }
  }

  if (
    !result &&
    Array.isArray(packageJson.author) &&
    packageJson.author.length > 0
  ) {
    if (isSetObject(packageJson.author[0])) {
      result = (packageJson.author[0] as { name: string }).name;
    }

    if (!result && isSetString(packageJson.author[0])) {
      result = packageJson.author[0];
    }
  }

  if (
    !result &&
    Array.isArray(packageJson.contributors) &&
    packageJson.contributors.length > 0
  ) {
    if (isSetObject(packageJson.contributors[0])) {
      result = (packageJson.contributors[0] as { name: string }).name;
    }

    if (!result && isSetString(packageJson.contributors[0])) {
      result = packageJson.contributors[0];
    }
  }

  if (!result && isSetString(packageJson.namespace)) {
    result = packageJson.namespace?.replace(/^@/, "");
  }

  if (!result && isSetString(packageJson.name)) {
    result = packageJson.name.replace(/^@/, "").replace(/\/.*$/, "");
  }

  return result;
}

/**
 * Get the organization name from the context
 *
 * @param context - The Powerlines plugin context.
 * @returns The organization name or undefined if not found.
 */
export async function getWorkspaceName(
  context: UnresolvedContext
): Promise<string | undefined> {
  let result: string | undefined;

  const workspaceConfig = await tryGetWorkspaceConfig(true);
  if (workspaceConfig) {
    if (isSetString(workspaceConfig.name)) {
      result = workspaceConfig.name;
    }

    if (!result && isSetString(workspaceConfig.namespace)) {
      result = workspaceConfig.namespace.replace(/^@/, "");
    }
  }

  if (!result && isSetString(context.packageJson.namespace)) {
    result = context.packageJson.namespace.replace(/^@/, "");
  }

  if (!result && isSetString(context.packageJson.name)) {
    result = context.packageJson.name.replace(/^@/, "").replace(/\/.*$/, "");
  }

  return result;
}

/**
 * Format an execution ID based on the project name, command, and config index.
 *
 * @remarks
 * The execution ID is formatted as `${projectName}-${command}-#${index}`, where:
 * - `projectName` is the name of the project.
 * - `command` is the command being executed.
 * - `index` is a zero-padded number representing the execution index (starting from 1).
 *
 * @example
 * ```ts
 * const executionId = formatExecutionId("my-project", "build", 0);
 * // This will return "my-project-build-01"
 *
 * const executionId2 = formatExecutionId("my-project", "test", 5);
 * // This will return "my-project-test-06"
 * ```
 *
 * @param projectName - The name of the project.
 * @param command - The command being executed.
 * @param configIndex - The index of the execution (starting from 0).
 * @returns The formatted execution ID.
 */
export function formatExecutionId(
  projectName: string,
  command: string,
  configIndex: number = 0
) {
  return `${projectName}-${command}-${String(configIndex + 1).padStart(2, "0")}`;
}
