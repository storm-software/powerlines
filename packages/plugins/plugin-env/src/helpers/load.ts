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

import { tryGetWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  isDevelopmentMode,
  isTestMode,
  toMode
} from "@stryke/env/environment-checks";
import {
  loadEnv as loadEnvBase,
  loadEnvFile as loadEnvFileBase
} from "@stryke/env/load-env";
import type { DotenvParseOutput } from "@stryke/env/types";
import { joinPaths } from "@stryke/path/join-paths";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import type { PackageJson } from "@stryke/types/package-json";
import { loadConfig } from "c12";
import defu from "defu";
import { WorkspaceConfig } from "powerlines";
import { DEFAULT_ENVIRONMENT } from "powerlines/constants";
import { EnvPluginContext, EnvPluginOptions } from "../types/plugin";
import { removeEnvPrefix } from "./source-file-env";

async function loadEnvFiles<TEnv extends DotenvParseOutput = DotenvParseOutput>(
  options: EnvPluginOptions,
  mode: string,
  cwd: string
): Promise<TEnv> {
  let env = await loadEnvBase(cwd, mode);
  if (options.additionalFiles && options.additionalFiles?.length > 0) {
    const additionalEnvFiles = await Promise.all(
      options.additionalFiles.map(async additionalEnvFile =>
        loadEnvFileBase(additionalEnvFile, cwd)
      )
    );

    for (const additionalEnvFile of additionalEnvFiles) {
      env = defu(additionalEnvFile, env);
    }
  }

  return removeEnvPrefix(env) as TEnv;
}

async function loadEnvDirectory<
  TEnv extends DotenvParseOutput = DotenvParseOutput
>(
  context: EnvPluginContext,
  options: EnvPluginOptions,
  directory: string,
  mode: string,
  cacheDir: string,
  packageJson: PackageJson,
  workspaceConfig?: WorkspaceConfig
): Promise<TEnv> {
  const [envResult, c12Result] = await Promise.all([
    loadEnvFiles<TEnv>(options, mode, directory),
    loadConfig({
      cwd: directory,
      name: context.config.framework,
      envName: mode,
      defaults: {
        NAME:
          workspaceConfig?.namespace && packageJson.name
            ? packageJson.name?.replace(`@${workspaceConfig.namespace}/`, "")
            : context.config.name,
        MODE: mode,
        ORG: context.config.organization || workspaceConfig?.organization
      },
      globalRc: true,
      packageJson: true,
      dotenv: true,
      jitiOptions: {
        fsCache: joinPaths(cacheDir, "jiti"),
        moduleCache: true
      }
    })
  ]);

  return defu(envResult as any, c12Result.config, workspaceConfig) as TEnv;
}

/**
 * Retrieves various dotenv configuration parameters from the context.
 *
 * @param context - The context to retrieve the dotenv configuration from.
 * @param parsed - The parsed dotenv configuration.
 * @returns An object containing the dotenv configuration.
 */
export function loadEnvFromContext(
  context: EnvPluginContext,
  parsed: DotenvParseOutput,
  workspaceConfig?: WorkspaceConfig
) {
  return defu(
    {
      APP_NAME: kebabCase(context.config.name),
      APP_VERSION: context.packageJson.version,
      BUILD_ID: context.meta.buildId,
      BUILD_TIMESTAMP: new Date(context.meta.timestamp).toISOString(),
      BUILD_CHECKSUM: context.meta.checksum,
      RELEASE_ID: context.meta.releaseId,
      RELEASE_TAG: `${kebabCase(context.config.name)}@${context.packageJson.version}`,
      DEFAULT_LOCALE: workspaceConfig?.locale,
      DEFAULT_TIMEZONE: workspaceConfig?.timezone,
      LOG_LEVEL:
        context.config.logLevel.general === "trace"
          ? "debug"
          : context.config.logLevel.general,
      ERROR_URL: workspaceConfig?.error?.url,
      ORGANIZATION:
        context.config.organization ||
        (isSetObject(workspaceConfig?.organization)
          ? workspaceConfig.organization.name
          : workspaceConfig?.organization),
      PLATFORM: context.config.platform,
      MODE: toMode(context.config.mode),
      TEST: isTestMode(context.config.mode),
      DEBUG: isDevelopmentMode(context.config.mode),
      STACKTRACE: context.config.mode !== "production",
      RUNTIME: context.config.environment.runtime,
      ENVIRONMENT:
        !context.config.environment.name ||
        context.config.environment.name === DEFAULT_ENVIRONMENT
          ? context.config.mode
          : context.config.environment.name
    },
    isSetObject(context?.env?.types?.env)
      ? context.env.types.env?.getProperties().reduce(
          (ret, prop) => {
            ret[prop.name] = parsed[prop.name] ?? prop.getDefaultValue();
            return ret;
          },
          {} as Record<string, any>
        )
      : {}
  );
}

export async function loadEnv<
  TEnv extends DotenvParseOutput = DotenvParseOutput
>(context: EnvPluginContext, options: EnvPluginOptions): Promise<TEnv> {
  const workspaceConfig = await tryGetWorkspaceConfig();

  const [project, workspace, config] = await Promise.all([
    loadEnvDirectory<TEnv>(
      context,
      options,
      context.config.root,
      context.config.mode,
      context.cachePath,
      context.packageJson,
      workspaceConfig
    ),
    loadEnvDirectory<TEnv>(
      context,
      options,
      context.config.cwd,
      context.config.mode,
      context.cachePath,
      context.packageJson,
      workspaceConfig
    ),
    loadEnvDirectory<TEnv>(
      context,
      options,
      context.envPaths.config,
      context.config.mode,
      context.cachePath,
      context.packageJson,
      workspaceConfig
    )
  ]);

  return defu(
    loadEnvFromContext(context, process.env, workspaceConfig),
    project,
    workspace,
    config
  ) as TEnv;
}
