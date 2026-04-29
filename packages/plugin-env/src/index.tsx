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

import {
  ReflectionClass,
  ReflectionKind
} from "@powerlines/deepkit/vendor/type";
import { render } from "@powerlines/plugin-alloy/render";
import automd from "@powerlines/plugin-automd";
import babel from "@powerlines/plugin-babel";
import deepkit from "@powerlines/plugin-deepkit";
import { TypeScriptCompilerPluginUserConfig } from "@powerlines/plugin-tsc";
import { parseTypeDefinition } from "@stryke/convert/parse-type-definition";
import { toArray } from "@stryke/convert/to-array";
import { existsSync } from "@stryke/fs/exists";
import { getUnique } from "@stryke/helpers/get-unique";
import { joinPaths } from "@stryke/path/join";
import { constantCase } from "@stryke/string-format/constant-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import {
  TypeDefinition,
  TypeDefinitionParameter
} from "@stryke/types/configuration";
import defu from "defu";
import { Plugin } from "powerlines";
import { VIRTUAL_MODULE_PREFIX } from "powerlines/constants";
import { getDocsOutputPath } from "powerlines/plugin-utils";
import type { UserConfig as ViteUserConfig } from "vite";
import { envBabelPlugin } from "./babel/plugin";
import { EnvDocsFile } from "./components/docs";
import { EnvBuiltin } from "./components/env-builtin";
import { env } from "./helpers/automd-generator";
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

export type * from "./types";

declare module "powerlines" {
  interface Config {
    env?: EnvPluginOptions;
  }
}

/**
 * A Powerlines plugin to inject environment variables into the source code.
 */
export const plugin = <TContext extends EnvPluginContext = EnvPluginContext>(
  options: EnvPluginOptions = {}
) => {
  return [
    deepkit(options.deepkit),
    babel(options.babel),
    {
      name: "env",
      async config() {
        this.debug(
          "Providing default configuration for the Powerlines `env` build plugin."
        );

        const config = {
          env: defu(options, {
            types: {} as TypeDefinitionParameter,
            validate: false,
            inject: false,
            prefix: []
          }),
          babel: {
            plugins: [envBabelPlugin]
          },
          deepkit: {
            reflection: "default",
            level: "all"
          },
          tsc: {} as TypeScriptCompilerPluginUserConfig["tsc"]
        };

        if (
          isSetString(config.env.types) ||
          (config.env.types && isSetString(config.env.types.file))
        ) {
          config.env.types = parseTypeDefinition(
            config.env.types
          ) as TypeDefinition;

          const file = await this.fs.resolve(config.env.types.file);
          if (file) {
            config.env.types.file = file;
          }
        } else {
          this.warn(
            "The `env.types` configuration parameter was not provided. Please ensure this is expected."
          );

          const envDefaultTypeDefinition =
            await getEnvDefaultTypeDefinition(this);

          const file = await this.fs.resolve(envDefaultTypeDefinition.file);
          if (file) {
            config.env.types = parseTypeDefinition(
              `${file}#${envDefaultTypeDefinition.name}`
            ) as TypeDefinition;
          }
        }

        if (
          isSetString(config.env.secrets) ||
          (config.env.secrets && isSetString(config.env.secrets.file))
        ) {
          config.env.secrets = parseTypeDefinition(config.env.secrets);

          const file = await this.fs.resolve(config.env.secrets!.file);
          if (file) {
            config.env.secrets!.file = file;
          }
        } else {
          const secretsDefaultTypeDefinition =
            await getSecretsDefaultTypeDefinition(this);

          const file = await this.fs.resolve(secretsDefaultTypeDefinition.file);
          if (file) {
            config.env.secrets = parseTypeDefinition(
              `${file}#${secretsDefaultTypeDefinition.name}`
            );
          }
        }

        if (config.env.types || config.env.secrets) {
          config.tsc.filter = {
            id: [
              new RegExp(
                `^(${VIRTUAL_MODULE_PREFIX})?${joinPaths(
                  this.builtinsPath,
                  "env.ts"
                )
                  .replace(/\\/g, "\\\\")
                  .replace(/\//g, "\\/")
                  .replace(/\./g, "\\.")
                  .replace(/\$/g, "\\$")}$`
              )
            ]
          };
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
          [
            "POWERLINES_",
            this.config.framework &&
              this.config.framework !== "powerlines" &&
              `${constantCase(this.config.framework)}_`
          ].filter(Boolean) as string[]
        );

        config.env.prefix = getUnique(
          toArray(config.env.prefix).reduce((ret, prefix) => {
            if (!ret.includes(prefix.replace(/_$/g, ""))) {
              ret.push(prefix.replace(/_$/g, ""));
            }
            return ret;
          }, [] as string[])
        );

        this.info({
          meta: {
            category: "env"
          },
          message: `Environment variable config: ${
            config.env.types.file
          }${config.env.types.name ? `#${config.env.types.name}` : ""}${
            config.env.secrets
              ? `\nSecrets config: ${config.env.secrets?.file}${
                  config.env.secrets?.name ? `#${config.env.secrets?.name}` : ""
                }`
              : ""
          }Prefixes: ${config.env.prefix.join(", ")}\nShould inject values: ${
            config.env.inject ? "Yes" : "No"
          }\nShould validate configuration: ${
            config.env.validate ? "Yes" : "No"
          }`
        });

        return config;
      },
      async configResolved() {
        this.debug(
          `Environment plugin configuration has been resolved for the Powerlines project.`
        );

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
        );

        if (
          this.config.command !== "prepare" &&
          !this.config.skipCache &&
          this.persistedMeta?.checksum === this.meta.checksum &&
          existsSync(getEnvTypeReflectionsPath(this, "env"))
        ) {
          this.debug(
            `Skipping reflection initialization as the meta checksum has not changed.`
          );

          this.env.types.env = await readEnvTypeReflection(this, "env");

          this.debug({
            meta: {
              category: "env"
            },
            message: `Found the following environment configuration parameter definitions: \n${this.env.types.env
              .getProperties()
              .map(
                prop =>
                  `- ${prop.getNameAsString()} (aliases: ${prop.getAlias().join(", ")})`
              )
              .join("\n")}`
          });

          if (existsSync(getEnvReflectionsPath(this, "env"))) {
            this.env.used.env = await readEnvReflection(this);

            this.debug({
              meta: {
                category: "env"
              },
              message: `Found the following environment configuration parameters used in project: \n${this.env.used.env
                .getProperties()
                .map(
                  prop =>
                    `- ${prop.getNameAsString()} (aliases: ${prop.getAlias().join(", ")})`
                )
                .join("\n")}`
            });
          }

          if (existsSync(getEnvTypeReflectionsPath(this, "secrets"))) {
            this.env.types.secrets = await readEnvTypeReflection(
              this,
              "secrets"
            );

            if (this.env.types.secrets.getProperties().length > 0) {
              this.debug({
                meta: {
                  category: "env"
                },
                message: `Found the following secret configuration parameter definitions: \n${this.env.types.secrets
                  .getProperties()
                  .map(
                    prop =>
                      `- ${prop.getNameAsString()} (aliases: ${prop.getAlias().join(", ")})`
                  )
                  .join("\n")}`
              });
            }
          }

          if (existsSync(getEnvReflectionsPath(this, "secrets"))) {
            this.env.used.secrets = await readSecretsReflection(this);

            if (this.env.used.secrets.getProperties().length > 0) {
              this.debug({
                meta: {
                  category: "env"
                },
                message: `Found the following secret configuration parameters used in project: \n${this.env.used.secrets
                  .getProperties()
                  .map(
                    prop =>
                      `- ${prop.getNameAsString()} (aliases: ${prop.getAlias().join(", ")})`
                  )
                  .join("\n")}`
              });
            }
          }
        } else {
          this.debug(
            `Starting environment configuration reflection initialization.`
          );

          this.env.types.env = await reflectEnv(
            this,
            this.config.env.types?.file,
            this.config.env.types?.name
          );
          if (!this.env.types.env) {
            throw new Error(
              "Failed to find the environment configuration type reflection in the context."
            );
          }

          this.debug({
            meta: {
              category: "env"
            },
            message: `Found the following environment configuration parameter definitions: \n${this.env.types.env
              .getProperties()
              .map(
                prop =>
                  `- ${prop.getNameAsString()} (aliases: ${prop.getAlias().join(", ")})`
              )
              .join("\n")}`
          });

          await writeEnvTypeReflection(this, this.env.types.env, "env");

          this.env.types.secrets = await reflectSecrets(
            this,
            this.config.env.secrets?.file,
            this.config.env.secrets?.name
          );
          if (!this.env.types.secrets) {
            throw new Error(
              "Failed to find the secrets configuration type reflection in the context."
            );
          }

          if (this.env.types.secrets.getProperties().length > 0) {
            this.debug({
              meta: {
                category: "env"
              },
              message: `Found the following secret configuration parameter definitions: \n${this.env.types.secrets
                .getProperties()
                .map(
                  prop =>
                    `- ${prop.getNameAsString()} (aliases: ${prop.getAlias().join(", ")})`
                )
                .join("\n")}`
            });
          }

          await writeEnvTypeReflection(this, this.env.types.secrets, "secrets");

          this.info({
            meta: {
              category: "env"
            },
            message: `Resolved ${
              this.env.types.env.getProperties().length ?? 0
            } environment configuration parameters and ${
              this.env.types.secrets?.getProperties().length ?? 0
            } secret configuration parameters`
          });

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
      async prepare() {
        this.debug(
          `Preparing the Environment runtime artifacts for the Powerlines project.`
        );

        const result = await readEnvTypeReflection(this, "env");

        return render(
          this,
          <EnvBuiltin
            defaultConfig={this.config.env.defaultConfig}
            reflection={result}
          />
        );
      },
      transform: {
        order: "post",
        async handler() {
          if (this.env.used.env.getProperties().length > 0) {
            this.trace(
              `Persisting used environment configuration reflections to ${getEnvReflectionsPath(
                this,
                "env"
              )}.`
            );
            await writeEnvReflection(this, this.env.used.env, "env");
          }

          if (this.env.used.secrets.getProperties().length > 0) {
            this.trace(
              `Persisting used secret configuration reflections to ${getEnvReflectionsPath(
                this,
                "secrets"
              )}.`
            );
            await writeEnvReflection(this, this.env.used.secrets, "secrets");
          }
        }
      },
      async docs() {
        this.debug(
          `Documenting environment variables configuration values in "${joinPaths(
            getDocsOutputPath(this.config.root),
            "env.md"
          )}"`
        );

        const result = await readEnvTypeReflection(this, "env");

        return render(
          this,
          <EnvDocsFile levelOffset={0} reflection={result} />
        );
      },
      async buildEnd() {
        const reflectionPath = getEnvReflectionsPath(this, "env");

        this.debug(`Writing env reflection types to ${reflectionPath}.`);

        await writeEnvReflection(this, this.env.used.env, "env");
      }
    },
    {
      name: "env:automd-generator",
      config() {
        return {
          automd: defu(options.automd ?? {}, {
            generators: {
              env: env(this)
            }
          })
        };
      }
    },
    {
      name: "env:vite",
      vite: {
        configResolved(this: TContext) {
          return {
            envPrefix: this.config?.env?.prefix
          } as ViteUserConfig;
        }
      }
    },
    automd(options.automd)
  ] as Plugin<TContext>[];
};

export default plugin;
