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
import {
  getProjectConfigFromProjectRoot,
  getProjectRoot,
  getRoot
} from "@storm-software/workspace-tools/utils/plugin-helpers";
import {
  addProjectTag,
  setDefaultProjectTags
} from "@storm-software/workspace-tools/utils/project-tags";
import defu from "defu";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { readNxJson } from "nx/src/config/nx-json.js";
import type {
  ProjectConfiguration,
  ProjectType
} from "nx/src/config/workspace-json-project-json.js";
import type { PackageJson as PackageJsonNx } from "nx/src/utils/package-json.js";
import { readTargetsFromPackageJson } from "nx/src/utils/package-json.js";

/* eslint-disable no-console */

export const name = "powerlines/tools-nx/plugin";

export const createNodesV2: CreateNodesV2 = [
  "packages/*/powerlines.config.ts",
  async (configFiles, optionsV2, contextV2): Promise<CreateNodesResultV2> => {
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

          const packageJsonContent = await readFile(
            join(projectRoot, "package.json"),
            "utf8"
          );
          const packageJson = JSON.parse(packageJsonContent);

          if (!packageJson.name) {
            console.warn(
              `[${name}]: The package.json file located at ${join(
                projectRoot,
                "package.json"
              )} is missing a \`name\` field. Skipping Nx project creation.`
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

          const targets: ProjectConfiguration["targets"] =
            readTargetsFromPackageJson(
              packageJson as PackageJsonNx,
              nxJson,
              projectRoot,
              context.workspaceRoot
            );

          targets.clean ??= {
            executor: "@powerlines/nx:clean"
          };

          targets.prepare ??= {
            cache: true,
            inputs: ["typescript", "^production"],
            outputs: ["{projectRoot}/.powerlines"],
            dependsOn: ["^prepare"],
            executor: "@powerlines/nx:prepare",
            defaultConfiguration: "production",
            configurations: {
              production: {
                mode: "production"
              },
              test: {
                mode: "test"
              },
              development: {
                mode: "development",
                skipCache: true,
                logLevel: "debug"
              }
            }
          };

          targets.build ??= {
            cache: true,
            inputs: ["typescript", "^production"],
            outputs: ["{options.outputPath}"],
            executor: "@powerlines/nx:build",
            dependsOn: ["^build"],
            defaultConfiguration: "production",
            configurations: {
              production: {
                mode: "production"
              },
              test: {
                mode: "test"
              },
              development: {
                mode: "development",
                skipCache: true,
                logLevel: "debug"
              }
            }
          };

          setDefaultProjectTags(projectConfig, name);
          addProjectTag(
            projectConfig,
            "powerlines" as ProjectTagVariant,
            "library",
            {
              overwrite: true
            }
          );

          return {
            projects: {
              [root]: defu(
                {
                  root,
                  targets,
                  implicitDependencies: ["nx"]
                },
                projectConfig,
                {
                  name: String(packageJson.name).replace(/^@powerlines\//, ""),
                  projectType: "library" as ProjectType,
                  sourceRoot: join(root, "src")
                }
              )
            }
          };
        } catch (error) {
          console.error(
            `[${name}]: ${error?.message ? error.message : "Unknown fatal error"}`
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
