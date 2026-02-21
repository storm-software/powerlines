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
import alloy from "@powerlines/plugin-alloy";
import { render } from "@powerlines/plugin-alloy/render";
import automd from "@powerlines/plugin-automd";
import babel from "@powerlines/plugin-babel";
import { parseTypeDefinition } from "@stryke/convert/parse-type-definition";
import { toArray } from "@stryke/convert/to-array";
import { ENV_PREFIXES } from "@stryke/env/types";
import { existsSync } from "@stryke/fs/exists";
import { joinPaths } from "@stryke/path/join";
import { constantCase } from "@stryke/string-format/constant-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import {
  TypeDefinition,
  TypeDefinitionParameter
} from "@stryke/types/configuration";
import defu from "defu";
import { Plugin } from "powerlines/types/plugin";
import type { UserConfig as ViteUserConfig } from "vite";
import { envBabelPlugin } from "./babel/plugin";
import { EnvDocsFile } from "./components/docs";
import { EnvBuiltin } from "./components/env";
import { env } from "./helpers/automd-generator";
import { getDocsOutputPath } from "./helpers/docs-helper";
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
 * A Powerlines plugin to inject environment variables into the source code.
 */
export const plugin = <TContext extends EnvPluginContext = EnvPluginContext>(
  options: EnvPluginOptions = {}
) => {
  return [
    alloy(options.alloy),
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
          transform: {
            babel: {
              plugins: [envBabelPlugin]
            }
          }
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
          config.env.secrets = parseTypeDefinition(
            config.env.secrets
          ) as TypeDefinition;

          const file = await this.fs.resolve(config.env.secrets.file);
          if (file) {
            config.env.secrets.file = file;
          }
        } else {
          const secretsDefaultTypeDefinition =
            await getSecretsDefaultTypeDefinition(this);

          const file = await this.fs.resolve(secretsDefaultTypeDefinition.file);
          if (file) {
            config.env.secrets = parseTypeDefinition(
              `${file}#${secretsDefaultTypeDefinition.name}`
            ) as TypeDefinition;
          }
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
            ...ENV_PREFIXES,
            "POWERLINES_",
            this.config.framework &&
              this.config.framework !== "powerlines" &&
              `${constantCase(this.config.framework)}_`
          ].filter(Boolean) as string[]
        );

        config.env.prefix = toArray(config.env.prefix).reduce((ret, prefix) => {
          if (!ret.includes(prefix.replace(/_$/g, ""))) {
            ret.push(prefix.replace(/_$/g, ""));
          }
          return ret;
        }, [] as string[]);

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
        ) as EnvPluginContext["env"];

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

          await writeEnvTypeReflection(this, this.env.types.secrets, "secrets");

          this.debug(
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
            getDocsOutputPath(this),
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
