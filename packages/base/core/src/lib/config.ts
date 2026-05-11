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
import { getEnvPaths } from "@stryke/env/get-env-paths";
import { existsSync } from "@stryke/fs/exists";
import { appendPath } from "@stryke/path/append";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { camelCase } from "@stryke/string-format/camel-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { loadConfig as loadConfigC12 } from "c12";
import defu from "defu";
import type {
  Mode,
  ParsedUserConfig,
  UserConfig,
  WorkspaceConfig
} from "../types/config";
import { AnyUserConfig } from "../types/config";
import { Context } from "../types/context";
import { createResolver } from "./resolver";

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
 * @param cwd - The root directory of the workspace.
 * @param root - The current working directory to start searching from.
 * @returns A promise that resolves to the loaded workspace configuration.
 */
export async function loadWorkspaceConfig(
  cwd: string,
  root: string
): Promise<WorkspaceConfig> {
  return defu(
    {
      workspaceRoot: cwd
    },
    await getWorkspaceConfig(true, {
      cwd: root,
      workspaceRoot: cwd,
      useDefault: true
    })
  );
}

/**
 * Loads the user configuration file for the project.
 *
 * @remarks
 * This function will attempt to locate and load the user configuration file for the project based on the provided parameters. It will look for configuration files in various formats (e.g., `.ts`, `.js`, `.mts`, `.mjs`) and with different naming conventions (e.g., `powerlines.config.ts`, `powerlines.development.config.js`, etc.) in the project root and current working directory. If a configuration file is found, it will be loaded using a Jiti resolver, and the resulting configuration object will be returned. If no configuration file is found, an empty configuration object will be returned.
 *
 * @param cwd - The current working directory to start searching from.
 * @param root - The root directory of the project.
 * @param mode - The mode to determine which configuration file to load (e.g., "development", "test", "production").
 * @param command - The command being executed (e.g., "build", "dev", "test"), which can be used to further customize the configuration loading logic if needed.
 * @param framework - The name of the framework to use when looking for configuration files (default is "powerlines").
 * @param orgId - The name of the organization to use when looking for configuration files (default is "storm-software").
 * @param configFile - An explicit path to a configuration file to load (optional). If provided, this file will be loaded instead of searching for configuration files based on the mode and framework.
 * @returns A promise that resolves to the resolved user configuration.
 */
export async function loadUserConfigFile(
  cwd: string,
  root: string,
  mode: Mode,
  command: string,
  framework = "powerlines",
  orgId = "storm-software",
  configFile?: string
): Promise<ParsedUserConfig> {
  let resolvedUserConfig: Partial<ParsedUserConfig> = {};

  let resolvedUserConfigFile: string | undefined;
  if (configFile) {
    resolvedUserConfigFile = existsSync(replacePath(configFile, root))
      ? replacePath(configFile, root)
      : existsSync(
            joinPaths(appendPath(root, cwd), replacePath(configFile, root))
          )
        ? joinPaths(appendPath(root, cwd), replacePath(configFile, root))
        : existsSync(joinPaths(appendPath(root, cwd), configFile))
          ? joinPaths(appendPath(root, cwd), configFile)
          : undefined;
  }

  if (!resolvedUserConfigFile) {
    resolvedUserConfigFile = existsSync(
      joinPaths(appendPath(root, cwd), `${framework}.${mode}.config.ts`)
    )
      ? joinPaths(appendPath(root, cwd), `${framework}.${mode}.config.ts`)
      : existsSync(
            joinPaths(appendPath(root, cwd), `${framework}.${mode}.config.js`)
          )
        ? joinPaths(appendPath(root, cwd), `${framework}.${mode}.config.js`)
        : existsSync(
              joinPaths(
                appendPath(root, cwd),
                `${framework}.${mode}.config.mts`
              )
            )
          ? joinPaths(appendPath(root, cwd), `${framework}.${mode}.config.mts`)
          : existsSync(
                joinPaths(
                  appendPath(root, cwd),
                  `${framework}.${mode}.config.mjs`
                )
              )
            ? joinPaths(
                appendPath(root, cwd),
                `${framework}.${mode}.config.mjs`
              )
            : existsSync(
                  joinPaths(appendPath(root, cwd), `${framework}.config.ts`)
                )
              ? joinPaths(appendPath(root, cwd), `${framework}.config.ts`)
              : existsSync(
                    joinPaths(appendPath(root, cwd), `${framework}.config.js`)
                  )
                ? joinPaths(appendPath(root, cwd), `${framework}.config.js`)
                : existsSync(
                      joinPaths(
                        appendPath(root, cwd),
                        `${framework}.config.mts`
                      )
                    )
                  ? joinPaths(appendPath(root, cwd), `${framework}.config.mts`)
                  : existsSync(
                        joinPaths(
                          appendPath(root, cwd),
                          `${framework}.config.mjs`
                        )
                      )
                    ? joinPaths(
                        appendPath(root, cwd),
                        `${framework}.config.mjs`
                      )
                    : undefined;
  }

  const envPaths = getEnvPaths({
    orgId,
    appId: framework,
    workspaceRoot: cwd
  });

  const jiti = createResolver({
    cwd,
    root,
    cacheDir: envPaths.cache,
    mode
  });

  if (resolvedUserConfigFile) {
    const resolved = await jiti.import<{ default: AnyUserConfig }>(
      jiti.esmResolve(resolvedUserConfigFile)
    );
    if (resolved?.default) {
      let config = {};
      if (isFunction(resolved.default)) {
        config = await Promise.resolve(
          resolved.default({ root, cwd, mode, command })
        );
      } else if (
        isSetObject(resolved.default) ||
        Array.isArray(resolved.default)
      ) {
        config = resolved.default;
      }

      if (isSetObject(config) || Array.isArray(config)) {
        resolvedUserConfig = {
          ...config,
          config,
          configFile: resolvedUserConfigFile
        };
      }
    }
  }

  const result = await loadConfigC12({
    cwd: root,
    name: framework,
    envName: mode,
    globalRc: true,
    packageJson: camelCase(framework),
    dotenv: true,
    jiti
  });

  return defu(
    {
      config: {
        root,
        cwd,
        framework
      }
    },
    resolvedUserConfig,
    isSetObject(result?.config) ? { ...result.config, ...result } : {}
  );
}

/**
 * A type helper to make it easier to use `powerlines.config.ts` files.
 *
 * @remarks
 * The function accepts a direct {@link AnyUserConfig} object/function and returns it typed as a {@link UserConfig} object.
 */
export function defineConfig(config: AnyUserConfig): UserConfig {
  return config as any;
}
