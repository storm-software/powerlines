/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import type { ChalkInstance } from "chalk";
import chalkImport from "chalk";

type ChalkModule = typeof chalkImport;

function isChalkFunction(value: unknown): value is ChalkModule {
  return typeof value === "function";
}

/**
 * Resolve chalk across ESM/CJS interop (chalk 5 + rolldown CJS output).
 */
export function resolveChalk(
  mod: typeof chalkImport = chalkImport
): ChalkModule {
  if (isChalkFunction(mod)) {
    return mod;
  }

  const candidate = (mod as { default?: unknown }).default;
  if (isChalkFunction(candidate)) {
    return candidate;
  }

  const nested = (candidate as { default?: unknown } | undefined)?.default;
  if (isChalkFunction(nested)) {
    return nested;
  }

  return mod;
}

const chalk = resolveChalk();

export default chalk;
export { chalk, type ChalkInstance };
