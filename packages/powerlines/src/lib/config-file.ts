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

import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import { existsSync } from "@stryke/fs/exists";
import { appendPath } from "@stryke/path/append";
import { joinPaths } from "@stryke/path/join-paths";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { loadConfig as loadConfigC12 } from "c12";
import defu from "defu";
import type { Jiti } from "jiti";
import type {
  ParsedUserConfig,
  PowerlinesCommand,
  UserConfig,
  WorkspaceConfig
} from "../types/config";
import { Context } from "../types/context";

export type PartiallyResolvedContext<TContext extends Context = Context> = Omit<
  TContext,
  "config" | "tsconfig" | "entry" | "fs" | "compiler" | "unimport"
> &
  Partial<TContext> & {
    config: TContext["config"];
  };

/**
 * Loads the workspace configuration.
 *
 * @param workspaceRoot - The root directory of the workspace.
 * @param cwd - The current working directory to start searching from.
 * @returns A promise that resolves to the loaded workspace configuration.
 */
export async function loadWorkspaceConfig(
  workspaceRoot: string,
  cwd: string
): Promise<WorkspaceConfig> {
  return defu(
    {
      workspaceRoot
    },
    await getWorkspaceConfig(true, {
      cwd,
      workspaceRoot,
      useDefault: true
    })
  );
}

/**
 * Loads the user configuration file for the project.
 *
 * @param projectRoot - The root directory of the project.
 * @param workspaceRoot - The root directory of the workspace.
 * @param jiti - An instance of Jiti to resolve modules from
 * @param command - The {@link PowerlinesCommand} string associated with the current running process
 * @param mode - The mode in which the project is running (default is "production").
 * @param configFile - An optional path to a specific configuration file.
 * @param framework - The framework name to use for default configuration file names.
 * @returns A promise that resolves to the resolved user configuration.
 */
export async function loadUserConfigFile(
  projectRoot: string,
  workspaceRoot: string,
  jiti: Jiti,
  command?: PowerlinesCommand,
  mode?: string,
  configFile?: string,
  framework = "powerlines"
): Promise<ParsedUserConfig> {
  let resolvedUserConfig: Partial<ParsedUserConfig> = {};

  const resolvedUserConfigFile =
    configFile && existsSync(configFile)
      ? configFile
      : configFile &&
          existsSync(
            joinPaths(appendPath(projectRoot, workspaceRoot), configFile)
          )
        ? joinPaths(appendPath(projectRoot, workspaceRoot), configFile)
        : existsSync(
              joinPaths(
                appendPath(projectRoot, workspaceRoot),
                `${framework}.config.ts`
              )
            )
          ? joinPaths(
              appendPath(projectRoot, workspaceRoot),
              `${framework}.config.ts`
            )
          : existsSync(
                joinPaths(
                  appendPath(projectRoot, workspaceRoot),
                  `${framework}.config.js`
                )
              )
            ? joinPaths(
                appendPath(projectRoot, workspaceRoot),
                `${framework}.config.js`
              )
            : existsSync(
                  joinPaths(
                    appendPath(projectRoot, workspaceRoot),
                    `${framework}.config.mts`
                  )
                )
              ? joinPaths(
                  appendPath(projectRoot, workspaceRoot),
                  `${framework}.config.mts`
                )
              : existsSync(
                    joinPaths(
                      appendPath(projectRoot, workspaceRoot),
                      `${framework}.config.mjs`
                    )
                  )
                ? joinPaths(
                    appendPath(projectRoot, workspaceRoot),
                    `${framework}.config.mjs`
                  )
                : undefined;
  if (resolvedUserConfigFile) {
    let resolvedPath!: string;
    try {
      resolvedPath = jiti.esmResolve(resolvedUserConfigFile);
    } catch {
      resolvedPath = resolvedUserConfigFile;
    }

    const resolved = await jiti.import(resolvedPath);
    if (resolved) {
      let config = {};
      if (isFunction(resolved)) {
        config = await Promise.resolve(
          resolved({
            command,
            mode: mode || "production",
            isSsrBuild: false,
            isPreview: false
          })
        );
      }

      if (isSetObject(config)) {
        resolvedUserConfig = {
          ...config,
          config: config as UserConfig,
          configFile: resolvedUserConfigFile
        };
      }
    }
  }

  const result = await loadConfigC12({
    cwd: projectRoot,
    name: framework,
    envName: mode,
    globalRc: true,
    packageJson: true,
    dotenv: true,
    jiti
  });

  return defu(
    resolvedUserConfig,
    isSetObject(result?.config) ? { ...result.config, ...result } : {}
  ) as ParsedUserConfig;
}
