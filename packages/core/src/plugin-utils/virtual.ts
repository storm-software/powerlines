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

import { prefixRegex } from "@rolldown/pluginutils";

export const VIRTUAL_MODULE_PREFIX = "\0";
export const VIRTUAL_MODULE_PREFIX_REGEX = prefixRegex("\0");

/**
 * Adds the virtual module prefix to the given ID.
 *
 * @param id - The ID to add the virtual module prefix to.
 * @returns The ID with the virtual module prefix added.
 */
export function addVirtualPrefix(id: string): string {
  return `${VIRTUAL_MODULE_PREFIX}${id}`;
}

/**
 * Removes the virtual module prefix from the given ID, if it exists.
 *
 * @param id - The ID to remove the virtual module prefix from.
 * @returns The ID without the virtual module prefix.
 */
export function removeVirtualPrefix(id: string): string {
  return id.replace(VIRTUAL_MODULE_PREFIX_REGEX, "");
}

/**
 * Checks if the given ID is a virtual module by checking if it starts with the virtual module prefix.
 *
 * @param id - The ID to check.
 * @returns True if the ID is a virtual module, false otherwise.
 */
export function isVirtualModule(id: string): boolean {
  return id.startsWith(VIRTUAL_MODULE_PREFIX);
}

/**
 * Creates a regular expression that matches the given ID with the virtual module prefix.
 *
 * @param id - The ID to create a regular expression for.
 * @returns A regular expression that matches the given ID with the virtual module prefix.
 */
export function createVirtualPrefixRegex(id: string): RegExp {
  return prefixRegex(addVirtualPrefix(removeVirtualPrefix(id)));
}
