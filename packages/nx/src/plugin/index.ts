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
import { readJsonFileSync } from "@stryke/fs/json";
import { murmurhash } from "@stryke/hash/murmurhash";
import { joinPaths } from "@stryke/path/join-paths";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { isError } from "@stryke/type-checks/is-error";
import type { PackageJson } from "@stryke/types/package-json";
import defu from "defu";
import { createJiti } from "jiti";
import { readNxJson } from "nx/src/config/nx-json.js";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json.js";
import type { PackageJson as PackageJsonNx } from "nx/src/utils/package-json.js";
import { readTargetsFromPackageJson } from "nx/src/utils/package-json.js";
import { loadUserConfigFile } from "powerlines/lib/config-file";
import { PROJECT_ROOT_HASH_LENGTH } from "powerlines/lib/utilities/meta";
import { CONFIG_INPUTS } from "../helpers/constants";

/* eslint-disable no-console */

export const name = "powerlines/nx/plugin";

export interface NxPluginOptions {
  /**
   * The folder where the generated runtime modules/builtins will be located. This path should be relative to the project root.
   *
   * @remarks
   * This folder will contain all runtime modules and builtins generated during the "prepare" phase.
   *
   * @defaultValue ".powerlines"
   */
  runtimeFolder?: string;
}

export const createNodesV2: CreateNodesV2<NxPluginOptions> = [
  `**/{${CONFIG_INPUTS.map(input => input.replace("{projectRoot}/", "")).join(
    ","
  )}}`,
  async (configFiles, optionsV2, contextV2): Promise<CreateNodesResultV2> => {
    const envPaths = getEnvPaths({
      orgId: "storm-software",
      appId: "powerlines",
      workspaceRoot: contextV2.workspaceRoot
    });
    if (!envPaths.cache) {
      throw new Error("The cache directory could not be determined.");
    }

    const runtimeFolder = optionsV2?.runtimeFolder || ".powerlines";

    const nxJson = readNxJson(contextV2.workspaceRoot);

    return createNodesFromFiles(
      async (configFile, options, context) => {
        try {
          const projectRoot = getProjectRoot(
            configFile,
            contextV2.workspaceRoot
          );
          if (!projectRoot) {
            console.error(
              `[${name}]: package.json and Powerlines configuration files (i.e. powerlines.config.ts) must be located in the project root directory: ${configFile}`
            );

            return {};
          }

          const root = getRoot(projectRoot, context);

          const cacheDir = joinPaths(
            envPaths.cache,
            "projects",
            murmurhash(joinPaths(contextV2.workspaceRoot, projectRoot), {
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

          const userConfig = await loadUserConfigFile(projectRoot, jiti);
          const packageJson = readJsonFileSync<PackageJson>(
            joinPaths(projectRoot, "package.json")
          );

          if (!userConfig.configFile && !packageJson.storm) {
            console.debug(
              `[${name}]: Skipping ${projectRoot} - no Powerlines configuration found for project in root directory.`
            );

            return {};
          }

          const projectConfig = getProjectConfigFromProjectRoot(
            projectRoot,
            packageJson
          );
          if (!projectConfig) {
            console.warn(
              `[${name}]: No project configuration found for project in root directory ${projectRoot}`
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

          targets.clean = {
            dependsOn: ["^clean"],
            executor: "@powerlines/nx:clean",
            defaultConfiguration: "production",
            options: {
              outputPath: userConfig.output?.outputPath || "dist/{projectRoot}",
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

          targets.prepare = {
            cache: true,
            inputs: withNamedInputs(CONFIG_INPUTS as any, ["typescript"]),
            outputs: [`{projectRoot}/${runtimeFolder}`],
            dependsOn: ["clean", "^prepare"],
            executor: "@powerlines/nx:prepare",
            defaultConfiguration: "production",
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

          targets.build = {
            cache: true,
            inputs: withNamedInputs(CONFIG_INPUTS as any, ["typescript"]),
            outputs: ["{options.outputPath}"],
            dependsOn: ["prepare", "^build"],
            executor: "@powerlines/nx:build",
            defaultConfiguration: "production",
            options: {
              entry: userConfig.entry || "{sourceRoot}/index.ts",
              outputPath: userConfig.output?.outputPath || "dist/{projectRoot}",
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

          targets.lint = {
            cache: true,
            inputs: withNamedInputs(
              [...CONFIG_INPUTS, `{projectRoot}/${runtimeFolder}`],
              ["linting", "typescript"]
            ),
            outputs: withNamedInputs(
              [`{projectRoot}/${runtimeFolder}`],
              ["typescript"]
            ),
            dependsOn: ["prepare", "^lint"],
            executor: "@powerlines/nx:lint",
            defaultConfiguration: "production",
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

          targets.docs = {
            cache: true,
            inputs: withNamedInputs(
              [...CONFIG_INPUTS, `{projectRoot}/${runtimeFolder}`],
              ["documentation", "typescript"]
            ),
            outputs: ["{projectRoot}/docs/generated"],
            dependsOn: ["prepare", "build", "^docs"],
            executor: "@powerlines/nx:docs",
            defaultConfiguration: "production",
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

          setDefaultProjectTags(projectConfig, name);
          addProjectTag(
            projectConfig,
            "powerlines" as ProjectTagVariant,
            projectConfig.projectType || userConfig.type || "library",
            {
              overwrite: true
            }
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
            `[${name}]: ${isError(error) ? error.message : "Unknown fatal error"}`
          );

          return {};
        }
      },
      configFiles,
      optionsV2,
      contextV2
    );
  }
];
