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
import { camelCase } from "@stryke/string-format/camel-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isError } from "@stryke/type-checks/is-error";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { PackageJson } from "@stryke/types/package-json";
import defu from "defu";
import { createJiti } from "jiti";
import { readFile } from "node:fs/promises";
import { readNxJson } from "nx/src/config/nx-json.js";
import type {
  ProjectConfiguration,
  TargetConfiguration
} from "nx/src/config/workspace-json-project-json.js";
import type { PackageJson as PackageJsonNx } from "nx/src/utils/package-json.js";
import { readTargetsFromPackageJson } from "nx/src/utils/package-json.js";
import type { ParsedUserConfig } from "powerlines";
import { loadUserConfigFile } from "powerlines/config";
import { ROOT_HASH_LENGTH } from "powerlines/utils";
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
   * @defaultValue "\{framework\}/plugin/nx"
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
   * If no values are provided for {@link OutputConfig.dts | output.dts} or {@link OutputConfig.artifactsFolder | output.artifactsFolder}, this value will be used as the default.
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
  const title = `${titleCase(framework)} Nx Plugin`;

  try {
    const name = opts?.name || `${framework}/nx/plugin`;
    const artifactsFolder =
      opts?.artifactsFolder || `{projectRoot}/.${framework}`;

    const targetInputs = getNxTargetInputs(framework);
    const pluginInputs = getNxPluginInputs(framework);

    return [
      pluginInputs,
      async (configFiles, options, contextV2): Promise<CreateNodesResultV2> => {
        if (options?.verboseOutput) {
          console.debug(
            `[${title}] - ${new Date().toISOString()} - Initializing the ${title} for the following inputs: ${pluginInputs}`
          );
        }

        const envPaths = getEnvPaths({
          orgId: "storm-software",
          appId: framework,
          workspaceRoot: contextV2.workspaceRoot
        });
        if (!envPaths.cache) {
          throw new Error("The cache directory could not be determined.");
        }

        const nxJson = readNxJson(contextV2.workspaceRoot);
        const resolver = createJiti(contextV2.workspaceRoot, {
          debug: !!options?.debug,
          interopDefault: true,
          fsCache: joinPaths(
            envPaths.cache,
            "nx-plugin",
            murmurhash(contextV2.workspaceRoot, {
              maxLength: ROOT_HASH_LENGTH
            }),
            "jiti"
          ),
          moduleCache: true
        });

        return createNodesFromFiles(
          async (configFile, _, context) => {
            try {
              const projectRoot = getProjectRoot(
                configFile,
                contextV2.workspaceRoot
              );
              if (!projectRoot) {
                console.error(
                  `[${title}] - ${new Date().toISOString()} - package.json and ${
                    framework
                  } configuration files (i.e. ${
                    framework
                  }.config.ts) must be located in the project root directory: ${
                    configFile
                  }`
                );

                return {};
              }

              const root = getRoot(projectRoot, context);

              if (options?.verboseOutput) {
                console.debug(
                  `[${title}] - ${new Date().toISOString()} - Loading ${
                    framework
                  } user configuration for project in root directory ${
                    projectRoot
                  }.`
                );
              }

              let userConfig = {} as ParsedUserConfig;
              try {
                userConfig = await loadUserConfigFile(
                  projectRoot,
                  contextV2.workspaceRoot,
                  resolver,
                  "build",
                  "development",
                  configFile,
                  framework
                );
              } catch (error) {
                console.warn(
                  `[${title}] - ${new Date().toISOString()} - Failed to load user configuration for project in ${
                    projectRoot
                  } - ${
                    isError(error)
                      ? error.message
                      : isSetString(error)
                        ? error
                        : "Unknown error"
                  } \n\nThis error can occur if the project depends on another package in the workspace and the dependent package has not been built yet. To resolve this issue, please ensure that all dependent packages have been built successfully.`
                );
              }

              if (
                !existsSync(
                  joinPaths(
                    contextV2.workspaceRoot,
                    projectRoot,
                    "package.json"
                  )
                )
              ) {
                if (options?.verboseOutput) {
                  console.warn(
                    `[${
                      title
                    }] - ${new Date().toISOString()} - Cannot find \`package.json\` file in the project's root directory (path: "${joinPaths(
                      contextV2.workspaceRoot,
                      projectRoot
                    )}"). Skipping project configuration.`
                  );
                }

                return {};
              }

              const packageJsonContent = await readFile(
                joinPaths(contextV2.workspaceRoot, projectRoot, "package.json"),
                "utf8"
              );
              if (!packageJsonContent) {
                if (options?.verboseOutput) {
                  console.warn(
                    `[${title}] - ${new Date().toISOString()} - No package.json file found for project in root directory ${projectRoot}`
                  );
                }

                return {};
              }

              const packageJson: PackageJson = JSON.parse(packageJsonContent);
              if (
                !userConfig.configFile &&
                !packageJson?.[camelCase(framework)]
              ) {
                if (options?.verboseOutput) {
                  console.debug(
                    `[${title}] - ${new Date().toISOString()} - Skipping ${projectRoot} - no ${
                      framework
                    } configuration found for project in root directory.`
                  );
                }

                return {};
              }

              const projectConfig = getProjectConfigFromProjectRoot(
                projectRoot,
                packageJson
              );
              if (!projectConfig) {
                if (options?.verboseOutput) {
                  console.warn(
                    `[${title}] - ${new Date().toISOString()} - No project configuration found for project in root directory ${
                      projectRoot
                    }`
                  );
                }

                return {};
              }

              const targets: ProjectConfiguration["targets"] =
                readTargetsFromPackageJson(
                  packageJson as PackageJsonNx,
                  nxJson,
                  projectRoot,
                  context.workspaceRoot
                );

              if (options?.verboseOutput) {
                console.debug(
                  `[${title}] - ${new Date().toISOString()} - Preparing Nx targets for project in root directory ${
                    projectRoot
                  }.`
                );
              }

              if (
                options?.clean !== false &&
                !targets[options?.clean?.targetName || "clean"]
              ) {
                targets[options?.clean?.targetName || "clean"] = {
                  cache: true,
                  inputs: Array.isArray(options?.clean?.inputs)
                    ? options.clean.inputs
                    : withNamedInputs(targetInputs, [
                        options?.clean?.inputs || "typescript"
                      ]),
                  outputs: options?.clean?.outputs,
                  executor:
                    options?.clean?.executor ||
                    `@${framework}/nx:${options?.clean?.targetName || "clean"}`,
                  dependsOn: options?.clean?.dependsOn ?? [
                    `^${options?.clean?.targetName || "clean"}`
                  ],
                  defaultConfiguration:
                    options?.clean?.defaultConfiguration || "production",
                  options: {
                    outputPath: userConfig.output?.outputPath,
                    projectType:
                      userConfig.projectType || projectConfig.projectType,
                    autoInstall: userConfig.autoInstall
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
                  dependsOn:
                    options?.prepare?.dependsOn ??
                    ([
                      `^${options?.prepare?.targetName || "build"}`,
                      options?.clean !== false &&
                        `${options?.clean?.targetName || "clean"}`
                    ].filter(Boolean) as string[]),
                  defaultConfiguration:
                    options?.prepare?.defaultConfiguration || "production",
                  options: {
                    input: userConfig.input,
                    projectType:
                      userConfig.projectType || projectConfig.projectType,
                    autoInstall: userConfig.autoInstall,
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
                  cache: true,
                  inputs: Array.isArray(options?.build?.inputs)
                    ? options.build.inputs
                    : withNamedInputs(targetInputs, [
                        options?.build?.inputs || "typescript"
                      ]),
                  outputs: options?.build?.outputs ?? ["{options.outputPath}"],
                  executor:
                    options?.build?.executor ||
                    `@${framework}/nx:${options?.build?.targetName || "build"}`,
                  dependsOn:
                    options?.build?.dependsOn ??
                    ([
                      `^${options?.build?.targetName || "build"}`,
                      userConfig.skipCache
                        ? undefined
                        : isSetObject(options?.prepare) &&
                            options?.prepare?.targetName
                          ? options?.prepare?.targetName
                          : "prepare"
                    ].filter(Boolean) as TargetConfiguration["dependsOn"]),
                  defaultConfiguration:
                    options?.build?.defaultConfiguration || "production",
                  options: {
                    input: userConfig.input,
                    outputPath: userConfig.output?.outputPath,
                    projectType:
                      userConfig.projectType || projectConfig.projectType,
                    autoInstall: userConfig.autoInstall,
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
                  cache: true,
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
                  dependsOn:
                    options?.lint?.dependsOn ??
                    ([
                      `^${options?.lint?.targetName || "lint"}`,
                      userConfig.skipCache
                        ? undefined
                        : isSetObject(options?.prepare) &&
                            options?.prepare?.targetName
                          ? options?.prepare?.targetName
                          : "prepare"
                    ].filter(Boolean) as TargetConfiguration["dependsOn"]),
                  defaultConfiguration:
                    options?.lint?.defaultConfiguration || "production",
                  options: {
                    input: userConfig.input,
                    projectType:
                      userConfig.projectType || projectConfig.projectType,
                    autoInstall: userConfig.autoInstall,
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
                  cache: true,
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
                  dependsOn:
                    options?.docs?.dependsOn ??
                    ([
                      `^${options?.docs?.targetName || "docs"}`,
                      options?.build !== false &&
                        `${options?.build?.targetName || "build"}`,
                      userConfig.skipCache
                        ? undefined
                        : isSetObject(options?.prepare) &&
                            options?.prepare?.targetName
                          ? options?.prepare?.targetName
                          : "prepare"
                    ].filter(Boolean) as TargetConfiguration["dependsOn"]),
                  defaultConfiguration:
                    options?.docs?.defaultConfiguration || "production",
                  options: {
                    input: userConfig.input,
                    projectType:
                      userConfig.projectType || projectConfig.projectType,
                    autoInstall: userConfig.autoInstall,
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
                options?.deploy !== false &&
                !targets[options?.deploy?.targetName || "deploy"]
              ) {
                targets[options?.deploy?.targetName || "deploy"] = {
                  inputs: Array.isArray(options?.deploy?.inputs)
                    ? options.deploy.inputs
                    : withNamedInputs(
                        [...targetInputs, artifactsFolder],
                        options?.deploy?.inputs
                          ? [options.deploy.inputs]
                          : ["documentation", "typescript"]
                      ),
                  outputs: options?.deploy?.outputs ?? ["{options.outputPath}"],
                  executor:
                    options?.deploy?.executor ||
                    `@${framework}/nx:${options?.deploy?.targetName || "deploy"}`,
                  dependsOn:
                    options?.deploy?.dependsOn ??
                    ([
                      `^${options?.deploy?.targetName || "deploy"}`,
                      options?.build !== false &&
                        `${options?.build?.targetName || "build"}`,
                      userConfig.skipCache
                        ? undefined
                        : isSetObject(options?.prepare) &&
                            options?.prepare?.targetName
                          ? options?.prepare?.targetName
                          : "prepare"
                    ].filter(Boolean) as TargetConfiguration["dependsOn"]),
                  defaultConfiguration:
                    options?.deploy?.defaultConfiguration || "production",
                  options: {
                    input: userConfig.input,
                    projectType:
                      userConfig.projectType || projectConfig.projectType,
                    autoInstall: userConfig.autoInstall,
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
                userConfig.projectType ||
                  projectConfig.projectType ||
                  "library",
                {
                  overwrite: true
                }
              );

              if (options?.verboseOutput) {
                console.debug(
                  `[${
                    title
                  }] - ${new Date().toISOString()} - Completed preparing Nx configuration for project in root directory ${projectRoot}.`
                );
              }

              return {
                projects: {
                  [root]: defu(projectConfig, {
                    name: kebabCase(userConfig.name)!,
                    projectType: userConfig.projectType || "library",
                    root,
                    sourceRoot: joinPaths(root, "src"),
                    targets
                  })
                }
              };
            } catch (error) {
              console.error(
                `[${title}] - ${new Date().toISOString()} - Failed to process the project configuration for file "${
                  configFile
                }" - ${
                  isError(error)
                    ? error.message
                    : isSetString(error)
                      ? error
                      : "Unknown fatal error"
                }`
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
  } catch (error) {
    console.error(
      `[${title}] - ${new Date().toISOString()} - ${
        isError(error)
          ? error.message
          : isSetString(error)
            ? error
            : "Unknown fatal error during plugin initialization"
      }`
    );

    throw new Error(
      `Failed to initialize the ${title} - ${
        isError(error)
          ? error.message
          : isSetString(error)
            ? error
            : "See previous logs for more details"
      }`,
      {
        cause: error instanceof Error ? error : undefined
      }
    );
  }
}
