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
import { existsSync } from "node:fs";
import { UnresolvedContext } from "../types/context";

/**
 * Get the configuration file path for a given name.
 *
 * @param context - The Powerlines context.
 * @param name - The name of the configuration file (without extension).
 * @returns The absolute path to the configuration file, or undefined if not found.
 */
export function getConfigPath(
  context: UnresolvedContext | { cwd?: string; root: string },
  name: string
): string | undefined {
  const cwd =
    ((context as UnresolvedContext).config
      ? (context as UnresolvedContext).config.cwd
      : (context as { cwd?: string; root: string }).cwd) || process.cwd();
  const root = (context as UnresolvedContext).config
    ? (context as UnresolvedContext).config.root
    : (context as { cwd?: string; root: string }).root;

  if (existsSync(joinPaths(cwd, root, `${name}.yml`))) {
    return joinPaths(cwd, root, `${name}.yml`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.yaml`))) {
    return joinPaths(cwd, root, `${name}.yaml`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.json`))) {
    return joinPaths(cwd, root, `${name}.json`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.jsonc`))) {
    return joinPaths(cwd, root, `${name}.jsonc`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.ts`))) {
    return joinPaths(cwd, root, `${name}.ts`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.cts`))) {
    return joinPaths(cwd, root, `${name}.cts`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.mts`))) {
    return joinPaths(cwd, root, `${name}.mts`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.js`))) {
    return joinPaths(cwd, root, `${name}.js`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.cjs`))) {
    return joinPaths(cwd, root, `${name}.cjs`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.mjs`))) {
    return joinPaths(cwd, root, `${name}.mjs`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.config.ts`))) {
    return joinPaths(cwd, root, `${name}.config.ts`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.config.cts`))) {
    return joinPaths(cwd, root, `${name}.config.cts`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.config.mts`))) {
    return joinPaths(cwd, root, `${name}.config.mts`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.config.js`))) {
    return joinPaths(cwd, root, `${name}.config.js`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.config.cjs`))) {
    return joinPaths(cwd, root, `${name}.config.cjs`);
  } else if (existsSync(joinPaths(cwd, root, `${name}.config.mjs`))) {
    return joinPaths(cwd, root, `${name}.config.mjs`);
  } else if (existsSync(joinPaths(cwd, `${name}.yml`))) {
    return joinPaths(cwd, `${name}.yml`);
  } else if (existsSync(joinPaths(cwd, `${name}.yaml`))) {
    return joinPaths(cwd, `${name}.yaml`);
  } else if (existsSync(joinPaths(cwd, `${name}.json`))) {
    return joinPaths(cwd, `${name}.json`);
  } else if (existsSync(joinPaths(cwd, `${name}.jsonc`))) {
    return joinPaths(cwd, `${name}.jsonc`);
  } else if (existsSync(joinPaths(cwd, `${name}.ts`))) {
    return joinPaths(cwd, `${name}.ts`);
  } else if (existsSync(joinPaths(cwd, `${name}.cts`))) {
    return joinPaths(cwd, `${name}.cts`);
  } else if (existsSync(joinPaths(cwd, `${name}.mts`))) {
    return joinPaths(cwd, `${name}.mts`);
  } else if (existsSync(joinPaths(cwd, `${name}.js`))) {
    return joinPaths(cwd, `${name}.js`);
  } else if (existsSync(joinPaths(cwd, `${name}.cjs`))) {
    return joinPaths(cwd, `${name}.cjs`);
  } else if (existsSync(joinPaths(cwd, `${name}.mjs`))) {
    return joinPaths(cwd, `${name}.mjs`);
  } else if (existsSync(joinPaths(cwd, `${name}.config.ts`))) {
    return joinPaths(cwd, `${name}.config.ts`);
  } else if (existsSync(joinPaths(cwd, `${name}.config.cts`))) {
    return joinPaths(cwd, `${name}.config.cts`);
  } else if (existsSync(joinPaths(cwd, `${name}.config.mts`))) {
    return joinPaths(cwd, `${name}.config.mts`);
  } else if (existsSync(joinPaths(cwd, `${name}.config.js`))) {
    return joinPaths(cwd, `${name}.config.js`);
  } else if (existsSync(joinPaths(cwd, `${name}.config.cjs`))) {
    return joinPaths(cwd, `${name}.config.cjs`);
  } else if (existsSync(joinPaths(cwd, `${name}.config.mjs`))) {
    return joinPaths(cwd, `${name}.config.mjs`);
  }

  return undefined;
}
