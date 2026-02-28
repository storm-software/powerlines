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
import { replacePath } from "@stryke/path/replace";
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
import { AnyUserConfig } from "../types/config";
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
  mode = "production",
  configFile?: string,
  framework = "powerlines"
): Promise<ParsedUserConfig> {
  let resolvedUserConfig: Partial<ParsedUserConfig> = {};

  let resolvedUserConfigFile: string | undefined;
  if (configFile) {
    resolvedUserConfigFile = existsSync(replacePath(configFile, projectRoot))
      ? replacePath(configFile, projectRoot)
      : existsSync(
            joinPaths(
              appendPath(projectRoot, workspaceRoot),
              replacePath(configFile, projectRoot)
            )
          )
        ? joinPaths(
            appendPath(projectRoot, workspaceRoot),
            replacePath(configFile, projectRoot)
          )
        : existsSync(
              joinPaths(appendPath(projectRoot, workspaceRoot), configFile)
            )
          ? joinPaths(appendPath(projectRoot, workspaceRoot), configFile)
          : undefined;
  }

  if (!resolvedUserConfigFile) {
    resolvedUserConfigFile = existsSync(
      joinPaths(
        appendPath(projectRoot, workspaceRoot),
        `${framework}.${mode}.config.ts`
      )
    )
      ? joinPaths(
          appendPath(projectRoot, workspaceRoot),
          `${framework}.${mode}.config.ts`
        )
      : existsSync(
            joinPaths(
              appendPath(projectRoot, workspaceRoot),
              `${framework}.${mode}.config.js`
            )
          )
        ? joinPaths(
            appendPath(projectRoot, workspaceRoot),
            `${framework}.${mode}.config.js`
          )
        : existsSync(
              joinPaths(
                appendPath(projectRoot, workspaceRoot),
                `${framework}.${mode}.config.mts`
              )
            )
          ? joinPaths(
              appendPath(projectRoot, workspaceRoot),
              `${framework}.${mode}.config.mts`
            )
          : existsSync(
                joinPaths(
                  appendPath(projectRoot, workspaceRoot),
                  `${framework}.${mode}.config.mjs`
                )
              )
            ? joinPaths(
                appendPath(projectRoot, workspaceRoot),
                `${framework}.${mode}.config.mjs`
              )
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
  }

  if (resolvedUserConfigFile) {
    const resolved = await jiti.import(jiti.esmResolve(resolvedUserConfigFile));
    if (resolved) {
      let config = {};
      if (isFunction(resolved)) {
        config = await Promise.resolve(
          resolved({
            command,
            mode,
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

/**
 * A type helper to make it easier to use `powerlines.config.ts` files.
 *
 * @remarks
 * The function accepts a direct {@link AnyUserConfig} object and returns it typed as a {@link UserConfig} object.
 */
export function defineConfig(config: AnyUserConfig): UserConfig {
  return config as any;
}
