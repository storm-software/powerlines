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

import { createAlloyPlugin } from "@powerlines/alloy/create-plugin";
import {
  ReflectionClass,
  ReflectionKind,
  stringifyType
} from "@powerlines/deepkit/vendor/type";
import babel from "@powerlines/plugin-babel";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { parseTypeDefinition } from "@stryke/convert/parse-type-definition";
import { toArray } from "@stryke/convert/to-array";
import { ENV_PREFIXES } from "@stryke/env/types";
import { existsSync } from "@stryke/fs/exists";
import { createDirectory } from "@stryke/fs/helpers";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join";
import { constantCase } from "@stryke/string-format/constant-case";
import {
  TypeDefinition,
  TypeDefinitionParameter
} from "@stryke/types/configuration";
import defu from "defu";
import { writeFile } from "powerlines/lib/utilities/write-file";
import { envBabelPlugin } from "./babel/plugin";
import { EnvBuiltin } from "./components/env";
import { loadEnv } from "./helpers/load";
import {
  getEnvDefaultTypeDefinition,
  getEnvReflectionsPath,
  getEnvTypeReflectionsPath,
  getSecretsDefaultTypeDefinition,
  readEnvReflection,
  readEnvTypeReflection,
  readSecretsReflection,
  writeEnvReflection,
  writeEnvTypeReflection
} from "./helpers/persistence";
import { reflectEnv, reflectSecrets } from "./helpers/reflect";
import { EnvPluginContext, EnvPluginOptions } from "./types/plugin";

export * from "./babel";
export * from "./components";
export * from "./helpers";
export * from "./types";

/**
 * A Powerlines plugin to assist in developing other Powerlines plugins.
 */
export const plugin = createAlloyPlugin<EnvPluginOptions, EnvPluginContext>(
  options => {
    return {
      name: "env",
      dependsOn: [babel()],
      async config() {
        this.log(
          LogLevelLabel.TRACE,
          "Providing default configuration for the Powerlines `env` build plugin."
        );

        const config = {
          env: defu(options, {
            types: {} as TypeDefinitionParameter,
            prefix: []
          }),
          transform: {
            babel: {
              plugins: [envBabelPlugin]
            }
          }
        };

        if (config.env.types) {
          config.env.types = parseTypeDefinition(
            config.env.types
          ) as TypeDefinition;
        } else {
          this.log(
            LogLevelLabel.WARN,
            "The `env.types` configuration parameter was not provided. Please ensure this is expected."
          );

          const envDefaultTypeDefinition =
            await getEnvDefaultTypeDefinition(this);
          config.env.types = parseTypeDefinition(
            `${envDefaultTypeDefinition.file}#${envDefaultTypeDefinition.name}`
          ) as TypeDefinition;
        }

        if (config.env.secrets) {
          config.env.secrets = parseTypeDefinition(
            config.env.secrets
          ) as TypeDefinition;
        } else {
          const secretsDefaultTypeDefinition =
            await getSecretsDefaultTypeDefinition(this);
          config.env.secrets = parseTypeDefinition(
            `${secretsDefaultTypeDefinition.file}#${
              secretsDefaultTypeDefinition.name
            }`
          ) as TypeDefinition;
        }

        config.env.prefix = toArray(
          (config.env.prefix ?? []) as string[]
        ).reduce(
          (ret: string[], prefix: string) => {
            const formattedPrefix = constantCase(prefix);
            if (!ret.includes(formattedPrefix)) {
              ret.push(formattedPrefix);
            }

            return ret;
          },
          [...ENV_PREFIXES, "POWERLINES_"] as string[]
        );

        config.env.prefix = config.env.prefix.reduce((ret, prefix) => {
          if (!ret.includes(prefix.replace(/_$/g, ""))) {
            ret.push(prefix.replace(/_$/g, ""));
          }
          return ret;
        }, [] as string[]);

        return config;
      },
      async configResolved() {
        this.log(
          LogLevelLabel.TRACE,
          `Environment plugin configuration has been resolved for the Powerlines project.`
        );

        this.config.env.inject ??= this.config.projectType === "application";
        this.env = defu(
          {
            parsed: await loadEnv(this, this.config.env)
          },
          this.env ?? {},
          {
            types: {
              env: {}
            },
            used: {
              env: {},
              secrets: {}
            },
            parsed: {},
            injected: {}
          }
        ) as EnvPluginContext["env"];

        if (
          this.config.command !== "prepare" &&
          this.persistedMeta?.checksum === this.meta.checksum &&
          existsSync(getEnvTypeReflectionsPath(this, "env"))
        ) {
          this.log(
            LogLevelLabel.TRACE,
            `Skipping reflection initialization as the meta checksum has not changed.`
          );

          this.env.types.env = await readEnvTypeReflection(this, "env");

          if (existsSync(getEnvReflectionsPath(this, "env"))) {
            this.env.used.env = await readEnvReflection(this);
          }

          if (existsSync(getEnvTypeReflectionsPath(this, "secrets"))) {
            this.env.types.secrets = await readEnvTypeReflection(
              this,
              "secrets"
            );
          }

          if (existsSync(getEnvReflectionsPath(this, "secrets"))) {
            this.env.used.secrets = await readSecretsReflection(this);
          }
        } else {
          this.env.types.env = await reflectEnv(
            this,
            this.config.env.types?.file
              ? isParentPath(
                  this.config.env.types?.file,
                  this.workspaceConfig.workspaceRoot
                )
                ? this.config.env.types?.file
                : joinPaths(
                    this.config.projectRoot,
                    this.config.env.types?.file
                  )
              : undefined,
            this.config.env.types?.name
          );
          if (!this.env.types.env) {
            throw new Error(
              "Failed to find the environment configuration type reflection in the context."
            );
          }

          await writeEnvTypeReflection(this, this.env.types.env, "env");

          this.env.types.secrets = await reflectSecrets(
            this,
            this.config.env.secrets?.file
              ? isParentPath(
                  this.config.env.secrets?.file,
                  this.workspaceConfig.workspaceRoot
                )
                ? this.config.env.secrets?.file
                : joinPaths(
                    this.config.projectRoot,
                    this.config.env.secrets?.file
                  )
              : undefined,
            this.config.env.secrets?.name
          );
          if (!this.env.types.secrets) {
            throw new Error(
              "Failed to find the secrets configuration type reflection in the context."
            );
          }

          await writeEnvTypeReflection(this, this.env.types.secrets, "secrets");

          this.log(
            LogLevelLabel.TRACE,
            `Resolved ${
              this.env.types.env.getProperties().length ?? 0
            } environment configuration parameters and ${
              this.env.types.secrets?.getProperties().length ?? 0
            } secret configuration parameters`
          );

          const envWithAlias = this.env.types.env
            .getProperties()
            .filter(prop => prop.getAlias().length > 0);

          Object.entries(await loadEnv(this, this.config.env)).forEach(
            ([key, value]) => {
              const unprefixedKey = this.config.env.prefix.reduce(
                (ret, prefix) => {
                  if (key.replace(/_$/g, "").startsWith(prefix)) {
                    return key.replace(/_$/g, "").slice(prefix.length);
                  }
                  return ret;
                },
                key
              );

              const aliasKey = envWithAlias.find(prop =>
                prop?.getAlias().reverse().includes(unprefixedKey)
              );
              if (this.env.types.env?.hasProperty(unprefixedKey) || aliasKey) {
                this.env.types.env
                  .getProperty(unprefixedKey)
                  .setDefaultValue(value);
              }
            }
          );

          this.env.used.env = new ReflectionClass(
            {
              kind: ReflectionKind.objectLiteral,
              typeName: "Env",
              description: `An object containing the environment configuration parameters used by the ${
                this.config.name
                  ? `${this.config.name} application`
                  : "application"
              }.`,
              types: []
            },
            this.env.types.env
          );

          await writeEnvReflection(this, this.env.used.env, "env");

          if (this.env.types.secrets) {
            await writeEnvTypeReflection(
              this,
              this.env.types.secrets,
              "secrets"
            );

            this.env.used.secrets = new ReflectionClass(
              {
                kind: ReflectionKind.objectLiteral,
                typeName: "Secrets",
                description: `An object containing the secret configuration parameters used by the ${
                  this.config.name
                    ? `${this.config.name} application`
                    : "application"
                }.`,
                types: []
              },
              this.env.types.secrets
            );
            await writeEnvReflection(this, this.env.used.secrets, "secrets");
          }
        }
      },
      render() {
        this.log(
          LogLevelLabel.TRACE,
          `Preparing the Environment runtime artifacts for the Powerlines project.`
        );

        return <EnvBuiltin defaultConfig={this.config.env.defaultConfig} />;
      },
      async docs() {
        this.log(
          LogLevelLabel.TRACE,
          "Writing Environment documentation for the Powerlines project artifacts."
        );

        // Clean and recreate the output directories
        const outputPath = joinPaths(
          this.config.projectRoot,
          "docs",
          "generated"
        );

        if (!existsSync(outputPath)) {
          await createDirectory(outputPath);
        }

        const reflection = await readEnvTypeReflection(this, "env");
        const envDocFile = joinPaths(outputPath, "env.md");

        this.log(
          LogLevelLabel.TRACE,
          `Documenting environment variables configuration in "${envDocFile}"`
        );

        await writeFile(
          this.log,
          envDocFile,
          `<!-- Generated by Powerlines -->

      # Environment variables configuration

      Below is a list of environment variables used by the [${
        this.packageJson.name
      }](https://www.npmjs.com/package/${
        this.packageJson.name
      }) package. These values can be updated in the \`.env\` file in the root of the project.

      ## Environment Configuration

      The below list of environment variables are used as configuration parameters to drive the processing of the application. The data contained in these variables are **not** considered sensitive or confidential. Any values provided in these variables will be available in plain text to the public.

      | Name | Description | Type | Default Value | Required |
      | ---- | ----------- | ---- | ------------- | :------: |
      ${reflection
        .getProperties()
        .filter(property => property.getNameAsString() !== "__STORM_INJECTED__")
        .sort((a, b) => a.getNameAsString().localeCompare(b.getNameAsString()))
        .map(reflectionProperty => {
          return `| ${reflectionProperty.getNameAsString().trim()} | ${(
            reflectionProperty
              .getDescription()
              ?.replaceAll("\r", "")
              ?.replaceAll("\n", "") ?? ""
          ).trim()} | ${stringifyType(reflectionProperty.getType())
            .trim()
            .replaceAll(" | ", ", or ")} | ${
            reflectionProperty.hasDefault()
              ? String(reflectionProperty.getDefaultValue())?.includes('"')
                ? reflectionProperty.getDefaultValue()
                : `\`${reflectionProperty.getDefaultValue()}\``
              : ""
          } | ${reflectionProperty.isValueRequired() ? "" : "✔"} |`;
        })
        .join("\n")}
      `
        );
      },
      async buildFinish() {
        const reflectionPath = getEnvReflectionsPath(this, "env");

        this.log(
          LogLevelLabel.TRACE,
          `Writing env reflection types to ${reflectionPath}.`
        );

        await writeEnvReflection(this, this.env.used.env, "env");
      }
      // vite: {
      //   config(config: ViteUserConfig, env: ViteConfigEnv) {
      //     this.log(
      //       LogLevelLabel.TRACE,
      //       "Writing Vite environment variables configuration for the Powerlines project artifacts."
      //     );

      //     return {
      //       envPrefix: this.config.env.prefix
      //     };
      //   }
      // }
    };
  }
);

export default plugin;
