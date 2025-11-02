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
import { Context } from "../types/context";

/**
 * Get the configuration file path for a given name.
 *
 * @param context - The Powerlines context.
 * @param name - The name of the configuration file (without extension).
 * @returns The absolute path to the configuration file, or undefined if not found.
 */
export function getConfigPath(
  context: Context,
  name: string
): string | undefined {
  if (
    existsSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        `${name}.yml`
      )
    )
  ) {
    return joinPaths(
      context.workspaceConfig.workspaceRoot,
      context.config.projectRoot,
      `${name}.yml`
    );
  } else if (
    existsSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        `${name}.yaml`
      )
    )
  ) {
    return joinPaths(
      context.workspaceConfig.workspaceRoot,
      context.config.projectRoot,
      `${name}.yaml`
    );
  } else if (
    existsSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        `${name}.json`
      )
    )
  ) {
    return joinPaths(
      context.workspaceConfig.workspaceRoot,
      context.config.projectRoot,
      `${name}.json`
    );
  } else if (
    existsSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        `${name}.jsonc`
      )
    )
  ) {
    return joinPaths(
      context.workspaceConfig.workspaceRoot,
      context.config.projectRoot,
      `${name}.jsonc`
    );
  } else if (
    existsSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        `${name}.ts`
      )
    )
  ) {
    return joinPaths(
      context.workspaceConfig.workspaceRoot,
      context.config.projectRoot,
      `${name}.ts`
    );
  } else if (
    existsSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        `${name}.cts`
      )
    )
  ) {
    return joinPaths(
      context.workspaceConfig.workspaceRoot,
      context.config.projectRoot,
      `${name}.cts`
    );
  } else if (
    existsSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        `${name}.mts`
      )
    )
  ) {
    return joinPaths(
      context.workspaceConfig.workspaceRoot,
      context.config.projectRoot,
      `${name}.mts`
    );
  } else if (
    existsSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        `${name}.js`
      )
    )
  ) {
    return joinPaths(
      context.workspaceConfig.workspaceRoot,
      context.config.projectRoot,
      `${name}.js`
    );
  } else if (
    existsSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        `${name}.cjs`
      )
    )
  ) {
    return joinPaths(
      context.workspaceConfig.workspaceRoot,
      context.config.projectRoot,
      `${name}.cjs`
    );
  } else if (
    existsSync(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot,
        `${name}.mjs`
      )
    )
  ) {
    return joinPaths(
      context.workspaceConfig.workspaceRoot,
      context.config.projectRoot,
      `${name}.mjs`
    );
  } else if (
    existsSync(joinPaths(context.workspaceConfig.workspaceRoot, `${name}.yml`))
  ) {
    return joinPaths(context.workspaceConfig.workspaceRoot, `${name}.yml`);
  } else if (
    existsSync(joinPaths(context.workspaceConfig.workspaceRoot, `${name}.yaml`))
  ) {
    return joinPaths(context.workspaceConfig.workspaceRoot, `${name}.yaml`);
  } else if (
    existsSync(joinPaths(context.workspaceConfig.workspaceRoot, `${name}.json`))
  ) {
    return joinPaths(context.workspaceConfig.workspaceRoot, `${name}.json`);
  } else if (
    existsSync(
      joinPaths(context.workspaceConfig.workspaceRoot, `${name}.jsonc`)
    )
  ) {
    return joinPaths(context.workspaceConfig.workspaceRoot, `${name}.jsonc`);
  } else if (
    existsSync(joinPaths(context.workspaceConfig.workspaceRoot, `${name}.ts`))
  ) {
    return joinPaths(context.workspaceConfig.workspaceRoot, `${name}.ts`);
  } else if (
    existsSync(joinPaths(context.workspaceConfig.workspaceRoot, `${name}.cts`))
  ) {
    return joinPaths(context.workspaceConfig.workspaceRoot, `${name}.cts`);
  } else if (
    existsSync(joinPaths(context.workspaceConfig.workspaceRoot, `${name}.mts`))
  ) {
    return joinPaths(context.workspaceConfig.workspaceRoot, `${name}.mts`);
  } else if (
    existsSync(joinPaths(context.workspaceConfig.workspaceRoot, `${name}.js`))
  ) {
    return joinPaths(context.workspaceConfig.workspaceRoot, `${name}.js`);
  } else if (
    existsSync(joinPaths(context.workspaceConfig.workspaceRoot, `${name}.cjs`))
  ) {
    return joinPaths(context.workspaceConfig.workspaceRoot, `${name}.cjs`);
  } else if (
    existsSync(joinPaths(context.workspaceConfig.workspaceRoot, `${name}.mjs`))
  ) {
    return joinPaths(context.workspaceConfig.workspaceRoot, `${name}.mjs`);
  }

  return undefined;
}
