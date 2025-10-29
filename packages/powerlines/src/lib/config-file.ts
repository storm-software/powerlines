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
 * @param jiti - An instance of Jiti to resolve modules from
 * @param command - The {@link PowerlinesCommand} string associated with the current running process
 * @param mode - The mode in which the project is running (default is "production").
 * @param configFile - An optional path to a specific configuration file.
 * @param framework - The framework name to use for default configuration file names.
 * @returns A promise that resolves to the resolved user configuration.
 */
export async function loadUserConfigFile(
  projectRoot: string,
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
      : configFile && existsSync(joinPaths(projectRoot, configFile))
        ? joinPaths(projectRoot, configFile)
        : existsSync(joinPaths(projectRoot, `${framework}.config.ts`))
          ? joinPaths(projectRoot, `${framework}.config.ts`)
          : existsSync(joinPaths(projectRoot, `${framework}.config.js`))
            ? joinPaths(projectRoot, `${framework}.config.js`)
            : existsSync(joinPaths(projectRoot, `${framework}.config.mts`))
              ? joinPaths(projectRoot, `${framework}.config.mts`)
              : existsSync(joinPaths(projectRoot, `${framework}.config.mjs`))
                ? joinPaths(projectRoot, `${framework}.config.mjs`)
                : undefined;
  if (resolvedUserConfigFile) {
    const resolved = await jiti.import(jiti.esmResolve(resolvedUserConfigFile));
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
