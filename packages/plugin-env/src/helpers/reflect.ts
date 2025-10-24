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

export class StormBaseEnv implements EnvInterface {
  POWERLINES_LOCAL: boolean = false;

  APP_NAME!: string;

  APP_VERSION!: string;

  BUILD_ID!: string;

  BUILD_TIMESTAMP!: string;

  BUILD_CHECKSUM!: string;

  RELEASE_ID!: string;

  RELEASE_TAG!: string;

  ORGANIZATION!: string;

  PLATFORM: "node" | "browser" | "neutral" = "neutral";

  MODE: "development" | "test" | "production" = "development";

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

export class StormBaseSecrets implements SecretsInterface {
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
      classType: StormBaseEnv,
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
  parent.name = "StormEnv";

  const result = new ReflectionClass(
    options.type ?? {
      kind: ReflectionKind.objectLiteral,
      typeName: "StormEnv",
      description: `A schema describing the list of available environment variables that can be used by the ${
        context.config.name
          ? `${titleCase(context.config.name)} application`
          : "application"
      }.`,
      types: []
    },
    parent
  );
  result.name = "StormEnv";

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
      classType: StormBaseSecrets,
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
  parent.name = "StormSecrets";

  const result = new ReflectionClass(
    options.type ?? {
      kind: ReflectionKind.objectLiteral,
      typeName: "StormSecrets",
      description: `A schema describing the list of available environment secrets that can be used by the ${
        context.config.name
          ? `${titleCase(context.config.name)} application`
          : "application"
      }.`,
      types: []
    },
    parent
  );
  result.name = "StormSecrets";

  return result;
}

export async function reflectEnv(
  context: EnvPluginContext,
  file?: string,
  name?: string
) {
  let config: ReflectionClass<any> | undefined;
  if (file) {
    const configType = await reflectType(
      context,
      {
        file: !isParentPath(file, context.workspaceConfig.workspaceRoot)
          ? joinPaths(context.workspaceConfig.workspaceRoot, file)
          : file,
        name
      },
      {
        skipNodeModulesBundle: true
      }
    );

    config = resolveClassType(configType);
  }

  const defaultConfigType = await reflectType(
    context,
    getEnvDefaultTypeDefinition(context)
  );

  const reflection = await readEnvTypeReflection(context, "env");

  // const defaultConfig = resolveClassType(defaultConfigType);
  // if (config) {
  //   defaultConfig.getProperties().forEach(prop => {
  //     if (!config!.hasProperty(prop.getName())) {
  //       config!.addProperty(prop.property);
  //     }
  //   });
  // } else {
  //   config = defaultConfig;
  // }

  return mergeEnvReflections(
    context,
    [reflection, config, resolveClassType(defaultConfigType)].filter(
      Boolean
    ) as ReflectionClass<any>[]
  );
}

export async function reflectSecrets(
  context: EnvPluginContext,
  file?: string,
  name?: string
) {
  let config: ReflectionClass<any> | undefined;
  if (file) {
    const configType = await reflectType(
      context,
      {
        file: !isParentPath(file, context.workspaceConfig.workspaceRoot)
          ? joinPaths(context.workspaceConfig.workspaceRoot, file)
          : file,
        name
      },
      {
        skipNodeModulesBundle: true
      }
    );

    config = resolveClassType(configType);
  }

  const defaultSecretsType = await reflectType(
    context,
    getSecretsDefaultTypeDefinition(context)
  );

  const reflection = await readSecretsReflection(context);

  // const defaultConfig = resolveClassType(defaultConfigType);
  // if (config) {
  //   defaultConfig.getProperties().forEach(prop => {
  //     if (!config!.hasProperty(prop.getName())) {
  //       config!.addProperty(prop.property);
  //     }
  //   });
  // } else {
  //   config = defaultConfig;
  // }

  return mergeSecretsReflections(
    context,
    [reflection, config, resolveClassType(defaultSecretsType)].filter(
      Boolean
    ) as ReflectionClass<any>[]
  );
}
