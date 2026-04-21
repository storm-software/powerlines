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
import { camelCase } from "@stryke/string-format/camel-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { loadConfig as loadConfigC12 } from "c12";
import defu from "defu";
import type { Jiti } from "jiti";
import type {
  ParsedUserConfig,
  ResolvedEngineOptions,
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
 * @param options - The engine options containing the root, cwd, mode, framework, and organization.
 * @param jiti - An instance of Jiti to resolve modules from
 * @returns A promise that resolves to the resolved user configuration.
 */
export async function loadUserConfigFile(
  options: ResolvedEngineOptions,
  jiti: Jiti
): Promise<ParsedUserConfig> {
  let resolvedUserConfig: Partial<ParsedUserConfig> = {};

  let resolvedUserConfigFile: string | undefined;
  if (options.configFile) {
    resolvedUserConfigFile = existsSync(
      replacePath(options.configFile, options.root)
    )
      ? replacePath(options.configFile, options.root)
      : existsSync(
            joinPaths(
              appendPath(options.root, options.cwd),
              replacePath(options.configFile, options.root)
            )
          )
        ? joinPaths(
            appendPath(options.root, options.cwd),
            replacePath(options.configFile, options.root)
          )
        : existsSync(
              joinPaths(
                appendPath(options.root, options.cwd),
                options.configFile
              )
            )
          ? joinPaths(appendPath(options.root, options.cwd), options.configFile)
          : undefined;
  }

  if (!resolvedUserConfigFile) {
    resolvedUserConfigFile = existsSync(
      joinPaths(
        appendPath(options.root, options.cwd),
        `${options.framework}.${options.mode}.config.ts`
      )
    )
      ? joinPaths(
          appendPath(options.root, options.cwd),
          `${options.framework}.${options.mode}.config.ts`
        )
      : existsSync(
            joinPaths(
              appendPath(options.root, options.cwd),
              `${options.framework}.${options.mode}.config.js`
            )
          )
        ? joinPaths(
            appendPath(options.root, options.cwd),
            `${options.framework}.${options.mode}.config.js`
          )
        : existsSync(
              joinPaths(
                appendPath(options.root, options.cwd),
                `${options.framework}.${options.mode}.config.mts`
              )
            )
          ? joinPaths(
              appendPath(options.root, options.cwd),
              `${options.framework}.${options.mode}.config.mts`
            )
          : existsSync(
                joinPaths(
                  appendPath(options.root, options.cwd),
                  `${options.framework}.${options.mode}.config.mjs`
                )
              )
            ? joinPaths(
                appendPath(options.root, options.cwd),
                `${options.framework}.${options.mode}.config.mjs`
              )
            : existsSync(
                  joinPaths(
                    appendPath(options.root, options.cwd),
                    `${options.framework}.config.ts`
                  )
                )
              ? joinPaths(
                  appendPath(options.root, options.cwd),
                  `${options.framework}.config.ts`
                )
              : existsSync(
                    joinPaths(
                      appendPath(options.root, options.cwd),
                      `${options.framework}.config.js`
                    )
                  )
                ? joinPaths(
                    appendPath(options.root, options.cwd),
                    `${options.framework}.config.js`
                  )
                : existsSync(
                      joinPaths(
                        appendPath(options.root, options.cwd),
                        `${options.framework}.config.mts`
                      )
                    )
                  ? joinPaths(
                      appendPath(options.root, options.cwd),
                      `${options.framework}.config.mts`
                    )
                  : existsSync(
                        joinPaths(
                          appendPath(options.root, options.cwd),
                          `${options.framework}.config.mjs`
                        )
                      )
                    ? joinPaths(
                        appendPath(options.root, options.cwd),
                        `${options.framework}.config.mjs`
                      )
                    : undefined;
  }

  if (resolvedUserConfigFile) {
    const resolved = await jiti.import<{ default: AnyUserConfig }>(
      jiti.esmResolve(resolvedUserConfigFile)
    );
    if (resolved?.default) {
      let config = {};
      if (isFunction(resolved.default)) {
        config = await Promise.resolve(resolved.default(options));
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
    cwd: options.root,
    name: options.framework,
    envName: options.mode,
    globalRc: true,
    packageJson: camelCase(options.framework),
    dotenv: true,
    jiti
  });

  return defu(
    {
      config: {
        root: options.root,
        cwd: options.cwd,
        framework: options.framework,
        organization: options.organization
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
