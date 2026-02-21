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

import { reflectType } from "@powerlines/deepkit/reflect-type";
import {
  merge,
  ReflectionClass,
  ReflectionKind,
  resolveClassType,
  TypeClass,
  TypeObjectLiteral
} from "@powerlines/deepkit/vendor/type";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { titleCase } from "@stryke/string-format/title-case";
import { EnvPluginContext } from "../types/plugin";
import { EnvInterface, SecretsInterface } from "../types/runtime";
import {
  getEnvDefaultTypeDefinition,
  getSecretsDefaultTypeDefinition,
  readEnvTypeReflection,
  readSecretsReflection
} from "./persistence";

export function mergeEnvReflections(
  context: EnvPluginContext,
  reflections: ReflectionClass<any>[]
): ReflectionClass<any> {
  const reflection = createEnvReflection(context, {
    type: merge(reflections.map(reflection => reflection.type))
  });

  return reflection;
}

export function mergeSecretsReflections(
  context: EnvPluginContext,
  reflections: ReflectionClass<any>[]
): ReflectionClass<any> {
  const reflection = createSecretsReflection(context, {
    type: merge(reflections.map(reflection => reflection.type))
  });

  return reflection;
}

export interface CreateEnvReflectionOptions {
  type?: TypeObjectLiteral | TypeClass;
  superReflection?: ReflectionClass<any>;
}

export class BaseEnv implements EnvInterface {
  APP_NAME!: string;

  APP_VERSION!: string;

  BUILD_ID!: string;

  BUILD_TIMESTAMP!: string;

  BUILD_CHECKSUM!: string;

  RELEASE_ID!: string;

  RELEASE_TAG!: string;

  ORGANIZATION!: string;

  PLATFORM: "node" | "browser" | "neutral" = "neutral";

  MODE: "development" | "test" | "production" = "production";

  ENVIRONMENT!: string;

  DEBUG: boolean = false;

  TEST: boolean = false;

  MINIMAL: boolean = false;

  NO_COLOR: boolean = false;

  FORCE_COLOR: number | boolean = false;

  FORCE_HYPERLINK: number | boolean = false;

  STACKTRACE: boolean = false;

  INCLUDE_ERROR_DATA: boolean = false;

  ERROR_URL!: string;

  DEFAULT_TIMEZONE!: string;

  DEFAULT_LOCALE!: string;

  CI: boolean = false;
}

export class BaseSecrets implements SecretsInterface {
  ENCRYPTION_KEY!: string;
}

export function createEnvReflection(
  context: EnvPluginContext,
  options: CreateEnvReflectionOptions = {}
): ReflectionClass<any> {
  const parent =
    options.superReflection ??
    new ReflectionClass({
      kind: ReflectionKind.class,
      description: `The base environment configuration definition for the ${titleCase(
        context.config.name
      )} project.`,
      classType: BaseEnv,
      types: [],
      implements: [
        {
          kind: ReflectionKind.objectLiteral,
          typeName: "EnvInterface",
          description: `The environment configuration interface definition for the ${titleCase(
            context.config.name
          )} project.`,
          types: []
        }
      ]
    });
  parent.name = "Env";

  const result = new ReflectionClass(
    options.type ?? {
      kind: ReflectionKind.objectLiteral,
      typeName: "Env",
      description: `A schema describing the list of available environment variables that can be used by the ${
        context.config.name
          ? `${titleCase(context.config.name)} application`
          : "application"
      }.`,
      types: []
    },
    parent
  );
  result.name = "Env";

  return result;
}

export function createSecretsReflection(
  context: EnvPluginContext,
  options: CreateEnvReflectionOptions = {}
): ReflectionClass<any> {
  const parent =
    options.superReflection ??
    new ReflectionClass({
      kind: ReflectionKind.class,
      description: `The base secrets configuration definition for the ${titleCase(
        context.config.name
      )} project.`,
      classType: BaseSecrets,
      types: [],
      implements: [
        {
          kind: ReflectionKind.objectLiteral,
          typeName: "SecretsInterface",
          description: `The secrets configuration interface definition for the ${titleCase(
            context.config.name
          )} project.`,
          types: []
        }
      ]
    });
  parent.name = "Secrets";

  const result = new ReflectionClass(
    options.type ?? {
      kind: ReflectionKind.objectLiteral,
      typeName: "Secrets",
      description: `A schema describing the list of available environment secrets that can be used by the ${
        context.config.name
          ? `${titleCase(context.config.name)} application`
          : "application"
      }.`,
      types: []
    },
    parent
  );
  result.name = "Secrets";

  return result;
}

/**
 * Reflects the environment configuration type definition from the provided file and name, and merges it with the default environment configuration reflection and the currently used environment configuration reflection.
 *
 * @remarks
 * The resulting reflection will contain the structure of the expected environment variables as defined by the type definitions provided in the plugin configuration, as well as any additional properties that are currently used in the source code and defined in the default environment configuration reflection.
 *
 * @param context - The plugin context
 * @param file - The file path to reflect the environment configuration type definition from
 * @param name - The name of the type definition to reflect the environment configuration from, if the file contains multiple type definitions. If not provided, the first type definition found in the file will be used.
 * @returns A reflection of the environment configuration type definition, merged with the default environment configuration reflection and the currently used environment configuration reflection. The resulting reflection will contain the structure of the expected environment variables as defined by the type definitions provided in the plugin configuration, as well as any additional properties that are currently used in the source code and defined in the default environment configuration reflection.
 */
export async function reflectEnv(
  context: EnvPluginContext,
  file?: string,
  name?: string
) {
  let config: ReflectionClass<any> | undefined;
  if (file) {
    const configType = await reflectType(context, {
      file: !isParentPath(file, context.workspaceConfig.workspaceRoot)
        ? joinPaths(context.workspaceConfig.workspaceRoot, file)
        : file,
      name
    });

    config = resolveClassType(configType);
  }

  return mergeEnvReflections(
    context,
    [
      await readEnvTypeReflection(context, "env"),
      config,
      resolveClassType(
        await reflectType(context, await getEnvDefaultTypeDefinition(context))
      )
    ].filter(Boolean) as ReflectionClass<any>[]
  );
}

/**
 * Reflects the secrets configuration type definition from the provided file and name, and merges it with the default secrets configuration reflection and the currently used secrets configuration reflection.
 *
 * @remarks
 * The resulting reflection will contain the structure of the expected environment secrets as defined by the type definitions provided in the plugin configuration, as well as any additional properties that are currently used in the source code and defined in the default secrets configuration reflection.
 *
 * @param context - The plugin context
 * @param file - The file path to reflect the secrets configuration type definition from
 * @param name - The name of the type definition to reflect the secrets configuration from, if the file contains multiple type definitions. If not provided, the first type definition found in the file will be used.
 * @returns A reflection of the secrets configuration type definition, merged with the default secrets configuration reflection and the currently used secrets configuration reflection. The resulting reflection will contain the structure of the expected environment secrets as defined by the type definitions provided in the plugin configuration, as well as any additional properties that are currently used in the source code and defined in the default secrets configuration reflection.
 */
export async function reflectSecrets(
  context: EnvPluginContext,
  file?: string,
  name?: string
) {
  let config: ReflectionClass<any> | undefined;
  if (file) {
    const configType = await reflectType(context, {
      file: !isParentPath(file, context.workspaceConfig.workspaceRoot)
        ? joinPaths(context.workspaceConfig.workspaceRoot, file)
        : file,
      name
    });

    config = resolveClassType(configType);
  }

  return mergeSecretsReflections(
    context,
    [
      await readSecretsReflection(context),
      config,
      resolveClassType(
        await reflectType(
          context,
          await getSecretsDefaultTypeDefinition(context)
        )
      )
    ].filter(Boolean) as ReflectionClass<any>[]
  );
}
