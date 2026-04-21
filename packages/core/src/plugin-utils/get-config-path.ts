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
  context: UnresolvedContext,
  name: string
): string | undefined {
  if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.yml`)
    )
  ) {
    return joinPaths(context.config.cwd, context.config.root, `${name}.yml`);
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.yaml`)
    )
  ) {
    return joinPaths(context.config.cwd, context.config.root, `${name}.yaml`);
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.json`)
    )
  ) {
    return joinPaths(context.config.cwd, context.config.root, `${name}.json`);
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.jsonc`)
    )
  ) {
    return joinPaths(context.config.cwd, context.config.root, `${name}.jsonc`);
  } else if (
    existsSync(joinPaths(context.config.cwd, context.config.root, `${name}.ts`))
  ) {
    return joinPaths(context.config.cwd, context.config.root, `${name}.ts`);
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.cts`)
    )
  ) {
    return joinPaths(context.config.cwd, context.config.root, `${name}.cts`);
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.mts`)
    )
  ) {
    return joinPaths(context.config.cwd, context.config.root, `${name}.mts`);
  } else if (
    existsSync(joinPaths(context.config.cwd, context.config.root, `${name}.js`))
  ) {
    return joinPaths(context.config.cwd, context.config.root, `${name}.js`);
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.cjs`)
    )
  ) {
    return joinPaths(context.config.cwd, context.config.root, `${name}.cjs`);
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.mjs`)
    )
  ) {
    return joinPaths(context.config.cwd, context.config.root, `${name}.mjs`);
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.config.ts`)
    )
  ) {
    return joinPaths(
      context.config.cwd,
      context.config.root,
      `${name}.config.ts`
    );
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.config.cts`)
    )
  ) {
    return joinPaths(
      context.config.cwd,
      context.config.root,
      `${name}.config.cts`
    );
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.config.mts`)
    )
  ) {
    return joinPaths(
      context.config.cwd,
      context.config.root,
      `${name}.config.mts`
    );
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.config.js`)
    )
  ) {
    return joinPaths(
      context.config.cwd,
      context.config.root,
      `${name}.config.js`
    );
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.config.cjs`)
    )
  ) {
    return joinPaths(
      context.config.cwd,
      context.config.root,
      `${name}.config.cjs`
    );
  } else if (
    existsSync(
      joinPaths(context.config.cwd, context.config.root, `${name}.config.mjs`)
    )
  ) {
    return joinPaths(
      context.config.cwd,
      context.config.root,
      `${name}.config.mjs`
    );
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.yml`))) {
    return joinPaths(context.config.cwd, `${name}.yml`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.yaml`))) {
    return joinPaths(context.config.cwd, `${name}.yaml`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.json`))) {
    return joinPaths(context.config.cwd, `${name}.json`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.jsonc`))) {
    return joinPaths(context.config.cwd, `${name}.jsonc`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.ts`))) {
    return joinPaths(context.config.cwd, `${name}.ts`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.cts`))) {
    return joinPaths(context.config.cwd, `${name}.cts`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.mts`))) {
    return joinPaths(context.config.cwd, `${name}.mts`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.js`))) {
    return joinPaths(context.config.cwd, `${name}.js`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.cjs`))) {
    return joinPaths(context.config.cwd, `${name}.cjs`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.mjs`))) {
    return joinPaths(context.config.cwd, `${name}.mjs`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.config.ts`))) {
    return joinPaths(context.config.cwd, `${name}.config.ts`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.config.cts`))) {
    return joinPaths(context.config.cwd, `${name}.config.cts`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.config.mts`))) {
    return joinPaths(context.config.cwd, `${name}.config.mts`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.config.js`))) {
    return joinPaths(context.config.cwd, `${name}.config.js`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.config.cjs`))) {
    return joinPaths(context.config.cwd, `${name}.config.cjs`);
  } else if (existsSync(joinPaths(context.config.cwd, `${name}.config.mjs`))) {
    return joinPaths(context.config.cwd, `${name}.config.mjs`);
  }

  return undefined;
}
