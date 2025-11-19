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

/* eslint-disable no-console */

import type { CreateNodesResultV2, CreateNodesV2 } from "@nx/devkit";
import { createNodesFromFiles } from "@nx/devkit";
import type { ProjectTagVariant } from "@storm-software/workspace-tools/types";
import { withNamedInputs } from "@storm-software/workspace-tools/utils/nx-json";
import {
  getProjectConfigFromProjectRoot,
  getProjectRoot,
  getRoot
} from "@storm-software/workspace-tools/utils/plugin-helpers";
import {
  addProjectTag,
  setDefaultProjectTags
} from "@storm-software/workspace-tools/utils/project-tags";
import { getEnvPaths } from "@stryke/env/get-env-paths";
import { existsSync } from "@stryke/fs/exists";
import { murmurhash } from "@stryke/hash/murmurhash";
import { joinPaths } from "@stryke/path/join-paths";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isError } from "@stryke/type-checks/is-error";
import type { PackageJson } from "@stryke/types/package-json";
import defu from "defu";
import { createJiti } from "jiti";
import { readFile } from "node:fs/promises";
import { readNxJson } from "nx/src/config/nx-json.js";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json.js";
import type { PackageJson as PackageJsonNx } from "nx/src/utils/package-json.js";
import { readTargetsFromPackageJson } from "nx/src/utils/package-json.js";
import { loadUserConfigFile } from "powerlines/lib/config-file";
import { PROJECT_ROOT_HASH_LENGTH } from "powerlines/lib/utilities/meta";
import { NxPluginOptions } from "../types/plugin";
import { CONFIG_INPUTS } from "./constants";

/**
 * Generates Nx input strings for the Powerlines configuration file, replacing the `{framework}` placeholder with the specified framework name.
 *
 * @param framework - The framework name to use in the input strings
 * @returns An array of Nx input strings for the configuration file
 */
export function getNxTargetInputs(framework: string): string[] {
  return CONFIG_INPUTS.map(input => input.replace("{framework}", framework));
}

/**
 * Generates Nx input strings for the Powerlines configuration file, replacing the `{framework}` placeholder with the specified framework name.
 *
 * @param framework - The framework name to use in the input strings
 * @returns An array of Nx input strings for the configuration file
 */
export function getNxPluginInputs(framework: string): string {
  return `**/{${getNxTargetInputs(framework)
    .map(input => input.replace("{projectRoot}/", ""))
    .join(",")}}`;
}

export interface CreateNxPluginOptions {
  /**
   * The name of the Nx plugin to create
   *
   * @remarks
   * This will be used in logging and project tagging.
   *
   * @defaultValue "powerlines/plugin/nx"
   */
  name?: string;

  /**
   * The folder where the generated runtime artifacts will be located
   *
   * @remarks
   * This folder will contain all runtime artifacts and builtins generated during the "prepare" phase.
   *
   * @defaultValue "\{projectRoot\}/.powerlines"
   */
  artifactsFolder?: string;

  /**
   * A string identifier that allows a child framework or tool to identify itself when using Powerlines.
   *
   * @remarks
   * If no values are provided for {@link OutputConfig.dts | output.dts}, {@link OutputConfig.builtinPrefix | output.builtinPrefix}, or {@link OutputConfig.artifactsFolder | output.artifactsFolder}, this value will be used as the default.
   *
   * @defaultValue "powerlines"
   */
  framework?: string;
}

/**
 * Creates an Nx plugin that integrates Powerlines into the Nx build process.
 *
 * @param opts - Options for creating the Nx plugin
 * @returns A CreateNodesV2 function that can be used as an Nx plugin
 */
export function createNxPlugin<
  TOptions extends NxPluginOptions = NxPluginOptions
>(opts?: CreateNxPluginOptions): CreateNodesV2<TOptions> {
  const framework = opts?.framework || "powerlines";
  const name = opts?.name || `${framework}/plugin/nx`;
  const artifactsFolder =
    opts?.artifactsFolder || `{projectRoot}/.${framework}`;

  const targetInputs = getNxTargetInputs(framework);
  const pluginInputs = getNxPluginInputs(framework);

  console.debug(
    `[${name}] - ${new Date().toISOString()} - Initializing the ${titleCase(framework)} Nx plugin for the following inputs: ${pluginInputs}`
  );

  return [
    pluginInputs,
    async (configFiles, options, contextV2): Promise<CreateNodesResultV2> => {
      const envPaths = getEnvPaths({
        orgId: "storm-software",
        appId: framework,
        workspaceRoot: contextV2.workspaceRoot
      });
      if (!envPaths.cache) {
        throw new Error("The cache directory could not be determined.");
      }

      const nxJson = readNxJson(contextV2.workspaceRoot);

      return createNodesFromFiles(
        async (configFile, _, context) => {
          try {
            const projectRoot = getProjectRoot(
              configFile,
              contextV2.workspaceRoot
            );
            if (!projectRoot) {
              console.error(
                `[${name}] - ${new Date().toISOString()} - package.json and ${framework} configuration files (i.e. ${framework}.config.ts) must be located in the project root directory: ${configFile}`
              );

              return {};
            }

            const root = getRoot(projectRoot, context);

            const cacheDir = joinPaths(
              envPaths.cache,
              "nx-plugin",
              murmurhash(contextV2.workspaceRoot, {
                maxLength: PROJECT_ROOT_HASH_LENGTH
              })
            );

            const jiti = createJiti(
              joinPaths(contextV2.workspaceRoot, projectRoot),
              {
                interopDefault: true,
                fsCache: joinPaths(cacheDir, "jiti"),
                moduleCache: true
              }
            );

            console.debug(
              `[${name}] - ${new Date().toISOString()} - Loading ${
                framework
              } user configuration for project in root directory ${projectRoot}.`
            );

            const userConfig = await loadUserConfigFile(
              joinPaths(contextV2.workspaceRoot, projectRoot),
              jiti,
              "build",
              "development",
              configFile,
              framework
            );

            if (
              !existsSync(
                joinPaths(contextV2.workspaceRoot, projectRoot, "package.json")
              )
            ) {
              console.warn(
                `[${name}] - ${new Date().toISOString()} - Cannot find \`package.json\` file in the project's root directory (path: "${joinPaths(
                  contextV2.workspaceRoot,
                  projectRoot
                )}"). Skipping project configuration.`
              );

              return {};
            }

            const packageJsonContent = await readFile(
              joinPaths(contextV2.workspaceRoot, projectRoot, "package.json"),
              "utf8"
            );
            if (!packageJsonContent) {
              console.warn(
                `[${name}] - ${new Date().toISOString()} - No package.json file found for project in root directory ${projectRoot}`
              );

              return {};
            }

            const packageJson: PackageJson = JSON.parse(packageJsonContent);
            if (!userConfig.configFile && !packageJson?.storm) {
              console.debug(
                `[${name}] - ${new Date().toISOString()} - Skipping ${projectRoot} - no ${framework} configuration found for project in root directory.`
              );

              return {};
            }

            const projectConfig = getProjectConfigFromProjectRoot(
              projectRoot,
              packageJson
            );
            if (!projectConfig) {
              console.warn(
                `[${name}] - ${new Date().toISOString()} - No project configuration found for project in root directory ${projectRoot}`
              );

              return {};
            }

            const tsconfig =
              userConfig?.tsconfig ||
              (existsSync(joinPaths(projectRoot, "tsconfig.json"))
                ? joinPaths(projectRoot, "tsconfig.json")
                : undefined);

            const targets: ProjectConfiguration["targets"] =
              readTargetsFromPackageJson(
                packageJson as PackageJsonNx,
                nxJson,
                projectRoot,
                context.workspaceRoot
              );

            console.debug(
              `[${name}] - ${new Date().toISOString()} - Preparing Nx targets for project in root directory ${projectRoot}.`
            );

            if (
              options?.clean !== false &&
              !targets[options?.clean?.targetName || "clean"]
            ) {
              targets[options?.clean?.targetName || "clean"] = {
                inputs: Array.isArray(options?.clean?.inputs)
                  ? options.clean.inputs
                  : withNamedInputs(targetInputs, [
                      options?.clean?.inputs || "typescript"
                    ]),
                outputs: options?.clean?.outputs,
                executor:
                  options?.clean?.executor ||
                  `@${framework}/nx:${options?.clean?.targetName || "clean"}`,
                dependsOn: [`^${options?.clean?.targetName || "clean"}`],
                defaultConfiguration:
                  options?.clean?.defaultConfiguration || "production",
                options: {
                  outputPath:
                    userConfig.output?.outputPath || "dist/{projectRoot}",
                  projectType: projectConfig.projectType || userConfig.type,
                  skipInstalls: userConfig.skipInstalls
                },
                configurations: {
                  production: {
                    mode: "production"
                  },
                  test: {
                    mode: "test"
                  },
                  development: {
                    mode: "development",
                    skipCache: true
                  }
                }
              };
            }

            if (
              options?.prepare !== false &&
              !targets[options?.prepare?.targetName || "prepare"]
            ) {
              targets[options?.prepare?.targetName || "prepare"] = {
                cache: true,
                inputs: Array.isArray(options?.prepare?.inputs)
                  ? options.prepare.inputs
                  : withNamedInputs(targetInputs, [
                      options?.prepare?.inputs || "typescript"
                    ]),
                outputs: options?.prepare?.outputs ?? [artifactsFolder],
                executor:
                  options?.prepare?.executor ||
                  `@${framework}/nx:${options?.prepare?.targetName || "prepare"}`,
                dependsOn: [
                  `^${options?.prepare?.targetName || "prepare"}`,
                  "clean"
                ],
                defaultConfiguration:
                  options?.prepare?.defaultConfiguration || "production",
                options: {
                  entry: userConfig.entry || "{sourceRoot}/index.ts",
                  projectType: projectConfig.projectType || userConfig.type,
                  tsconfig,
                  skipInstalls: userConfig.skipInstalls,
                  skipCache: userConfig.skipCache
                },
                configurations: {
                  production: {
                    mode: "production"
                  },
                  test: {
                    mode: "test"
                  },
                  development: {
                    mode: "development",
                    skipCache: true
                  }
                }
              };
            }

            if (
              options?.build !== false &&
              !targets[options?.build?.targetName || "build"]
            ) {
              targets[options?.build?.targetName || "build"] = {
                inputs: Array.isArray(options?.build?.inputs)
                  ? options.build.inputs
                  : withNamedInputs(targetInputs, [
                      options?.build?.inputs || "typescript"
                    ]),
                outputs: options?.build?.outputs ?? ["{options.outputPath}"],
                executor:
                  options?.build?.executor ||
                  `@${framework}/nx:${options?.build?.targetName || "build"}`,
                dependsOn: [
                  `^${options?.build?.targetName || "build"}`,
                  "prepare"
                ],
                defaultConfiguration:
                  options?.build?.defaultConfiguration || "production",
                options: {
                  entry: userConfig.entry || "{sourceRoot}/index.ts",
                  outputPath:
                    userConfig.output?.outputPath || "dist/{projectRoot}",
                  projectType: projectConfig.projectType || userConfig.type,
                  tsconfig,
                  skipInstalls: userConfig.skipInstalls,
                  skipCache: userConfig.skipCache
                },
                configurations: {
                  production: {
                    mode: "production"
                  },
                  test: {
                    mode: "test"
                  },
                  development: {
                    mode: "development",
                    skipCache: true
                  }
                }
              };
            }

            if (
              options?.lint !== false &&
              !targets[options?.lint?.targetName || "lint"]
            ) {
              targets[options?.lint?.targetName || "lint"] = {
                inputs: Array.isArray(options?.lint?.inputs)
                  ? options.lint.inputs
                  : withNamedInputs(
                      [...targetInputs, artifactsFolder],
                      options?.lint?.inputs
                        ? [options.lint.inputs]
                        : ["linting", "typescript"]
                    ),
                outputs: options?.lint?.outputs ?? ["{options.outputPath}"],
                executor:
                  options?.lint?.executor ||
                  `@${framework}/nx:${options?.lint?.targetName || "lint"}`,
                dependsOn: [
                  `^${options?.lint?.targetName || "lint"}`,
                  "prepare"
                ],
                defaultConfiguration:
                  options?.lint?.defaultConfiguration || "production",
                options: {
                  entry: userConfig.entry || "{sourceRoot}/index.ts",
                  projectType: projectConfig.projectType || userConfig.type,
                  tsconfig,
                  skipInstalls: userConfig.skipInstalls,
                  skipCache: userConfig.skipCache
                },
                configurations: {
                  production: {
                    mode: "production"
                  },
                  test: {
                    mode: "test"
                  },
                  development: {
                    mode: "development",
                    skipCache: true
                  }
                }
              };
            }

            if (
              options?.docs !== false &&
              !targets[options?.docs?.targetName || "docs"]
            ) {
              targets[options?.docs?.targetName || "docs"] = {
                inputs: Array.isArray(options?.docs?.inputs)
                  ? options.docs.inputs
                  : withNamedInputs(
                      [...targetInputs, artifactsFolder],
                      options?.docs?.inputs
                        ? [options.docs.inputs]
                        : ["documentation", "typescript"]
                    ),
                outputs: options?.docs?.outputs ?? ["{options.outputPath}"],
                executor:
                  options?.docs?.executor ||
                  `@${framework}/nx:${options?.docs?.targetName || "docs"}`,
                dependsOn: [`^${options?.docs?.targetName || "docs"}`, "build"],
                defaultConfiguration:
                  options?.docs?.defaultConfiguration || "production",
                options: {
                  entry: userConfig.entry || "{sourceRoot}/index.ts",
                  projectType: projectConfig.projectType || userConfig.type,
                  tsconfig,
                  skipInstalls: userConfig.skipInstalls,
                  skipCache: userConfig.skipCache
                },
                configurations: {
                  production: {
                    mode: "production"
                  },
                  test: {
                    mode: "test"
                  },
                  development: {
                    mode: "development",
                    skipCache: true
                  }
                }
              };
            }

            setDefaultProjectTags(projectConfig, name);
            addProjectTag(
              projectConfig,
              framework as ProjectTagVariant,
              projectConfig.projectType || userConfig.type || "library",
              {
                overwrite: true
              }
            );

            console.debug(
              `[${name}] - ${new Date().toISOString()} - Completed preparing Nx configuration for project in root directory ${projectRoot}.`
            );

            return {
              projects: {
                [root]: defu(projectConfig, {
                  name: kebabCase(userConfig.name)!,
                  projectType: userConfig.type || "library",
                  root,
                  sourceRoot: joinPaths(root, "src"),
                  targets
                })
              }
            };
          } catch (error) {
            console.error(
              `[${name}] - ${new Date().toISOString()} - ${isError(error) ? error.message : "Unknown fatal error"}`
            );

            return {};
          }
        },
        configFiles,
        options,
        contextV2
      );
    }
  ];
}
