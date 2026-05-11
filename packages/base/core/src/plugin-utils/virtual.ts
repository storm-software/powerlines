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

const ESCAPE_REGEX = /[-/\\^$*+?.()|[\]{}]/g;
function escapeRegex(str: string): string {
  return str.replace(ESCAPE_REGEX, "\\$&");
}

export const VIRTUAL_MODULE_PREFIX = "\0";
export const VIRTUAL_MODULE_PREFIX_REGEX = prefixRegex("\0");

export interface PrefixRegexOptions {
  /**
   * Flags for the RegExp.
   */
  flags?: string;

  /**
   * The prefix to match. This will be escaped and used as the prefix in the generated RegExp.
   */
  prefix?: string;

  /**
   * Whether the prefix is optional. If true, the generated RegExp will match both strings that start with the prefix and strings that do not start with the prefix. Default is false.
   */
  isPrefixOptional?: boolean;
}

/**
 * Constructs a RegExp that matches a value that has the specified prefix. This is useful for plugin hook filters.
 *
 * @example
 * ```ts
 * import { prefixRegex } from '@rolldown/pluginutils';
 * const plugin = {
 *   name: 'plugin',
 *   resolveId: {
 *     filter: { id: prefixRegex('foo') },
 *     handler(id) {} // will only be called for IDs starting with `foo`
 *   }
 * }
 * ```
 *
 * @param str - the string to match.
 * @param options - options for the RegExp.
 * @return a RegExp that matches the specified string with the specified prefix.
 */
export function prefixRegex(
  str: string,
  options: PrefixRegexOptions = {}
): RegExp {
  const { flags, prefix, isPrefixOptional = false } = options;

  return new RegExp(
    `^${
      prefix
        ? isPrefixOptional
          ? `(${escapeRegex(prefix)})?`
          : `${escapeRegex(prefix)}`
        : ""
    }${escapeRegex(str)}`,
    flags
  );
}

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
  return prefixRegex(removeVirtualPrefix(id), {
    prefix: VIRTUAL_MODULE_PREFIX,
    isPrefixOptional: true
  });
}
