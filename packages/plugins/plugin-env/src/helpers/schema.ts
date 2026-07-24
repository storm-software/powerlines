/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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
  extract,
  getProperties,
  getPropertiesList,
  isSchema,
  isSchemaObject,
  JsonSchemaObject,
  merge
} from "@power-plant/schema";
import { joinPaths } from "@stryke/path/join";
import { isSetArray } from "@stryke/type-checks/is-set-array";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { FileReference } from "@stryke/types/configuration";
import { UnresolvedContext } from "powerlines";
import { EnvPluginContext, EnvSchema } from "../types/plugin";
import { loadEnv } from "./load";

/**
 * Resolves the runtime type definition file for the environment variables.
 *
 * @param context - The plugin context.
 * @returns The runtime type definition file for the environment variables.
 */
export async function resolveRuntimeTypeFile<
  TContext extends UnresolvedContext
>(context: TContext): Promise<string> {
  const resolved = await context.fs.resolve("@powerlines/plugin-env/types/env");
  if (!resolved) {
    throw new Error(
      `Failed to resolve the runtime type definition file for the environment variables. Please ensure that the "@powerlines/plugin-env" package is installed.`
    );
  }

  return resolved;
}

/**
 * Gets the default type definition for the environment variables.
 *
 * @param context - The plugin context.
 * @returns The default type definition for the environment variables.
 */
export async function getDefaultConfig<TContext extends UnresolvedContext>(
  context: TContext
): Promise<FileReference> {
  return {
    file: await resolveRuntimeTypeFile(context),
    export: "EnvInterface"
  };
}

/** Gets the default type definition for the environment secrets.
 *
 * @param context - The plugin context.
 * @returns The default type definition for the environment secrets.
 */
export async function getDefaultSecrets<TContext extends UnresolvedContext>(
  context: TContext
): Promise<FileReference> {
  return {
    file: await resolveRuntimeTypeFile(context),
    export: "SecretsInterface"
  };
}

/**
 * A helper function to get the cache directory path for storing schemas. This function takes a context object as input and returns the path to the cache directory where schemas are stored. The cache directory is constructed by joining the `cachePath` property from the context with a subdirectory named "schemas". This function is useful for centralizing the logic for determining where schema files should be cached, ensuring that all schema-related file operations use a consistent location for storing and retrieving cached schemas.
 *
 * @param context - The context object providing access to the cache path.
 * @returns The path to the cache directory for storing schemas, constructed by joining the context's `cachePath` with the "schemas" subdirectory.
 */
export function getCacheDirectory<TContext extends EnvPluginContext>(
  context: TContext
): string {
  return joinPaths(context.cachePath, "env");
}

export function getCacheFilePath<TContext extends EnvPluginContext>(
  context: TContext,
  variant: "config" | "secrets"
): string {
  return joinPaths(getCacheDirectory(context), `${variant}.json`);
}

async function writeActive<TContext extends EnvPluginContext>(
  context: TContext,
  variant: "config" | "secrets",
  schema: EnvSchema
) {
  if (!isSchema(schema)) {
    throw new Error(
      `The provided input is not a valid env schema. A valid schema must have a "variant" property indicating the type of the input and a "schema" property containing the parsed JSON Schema object.`
    );
  }

  await context.fs.write(
    getCacheFilePath(context, variant),
    JSON.stringify(schema.schema)
  );
}

async function readActive<TContext extends EnvPluginContext>(
  context: TContext,
  variant: "config" | "secrets"
): Promise<string[]> {
  if (!context.fs.existsSync(getCacheFilePath(context, variant))) {
    return [];
  }

  const data = await context.fs.read(getCacheFilePath(context, variant));
  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

/**
 * Extracts the environment variables and secrets schema from the provided type definitions in the plugin options, merges them with the default environment variables and secrets schema, and stores the resulting schema in the plugin context for later use during the build process.
 *
 * @remarks
 * This function should be called during the plugin's `config` hook to ensure that the environment variables and secrets schema is available in the plugin context before the build process begins. The resulting schema will be used to validate the loaded environment variables and secrets, as well as to provide type information for the injected environment variables and secrets during the build process.
 *
 * @param context - The plugin context
 * @returns A promise that resolves when the schema has been extracted and stored in the plugin context.
 */
export async function extractEnv<TContext extends EnvPluginContext>(
  context: TContext
): Promise<void> {
  const defaultConfig = await getDefaultConfig(context);
  const defaultSecrets = await getDefaultSecrets(context);

  context.debug({
    meta: {
      category: "env"
    },
    message: `Environment Variables configuration: ${
      context.config.env.config
        ? JSON.stringify(context.config.env.config, null, 2)
        : "None"
    }\nEnvironment Secret configuration: ${
      context.config.env.secrets
        ? JSON.stringify(context.config.env.secrets, null, 2)
        : "None"
    }`
  });

  context.env ??= {} as EnvPluginContext["env"];
  context.env.parsed ??= {};
  context.env.injected ??= [];

  context.env.config = (await extract(context.config.env.config)) as EnvSchema;
  context.env.config.active = await readActive(context, "config");

  if (
    (isSetString(context.config.env.config) &&
      new RegExp(`${defaultConfig.file}[:#;@]?${defaultConfig.export}`).test(
        context.config.env.config
      ) === false) ||
    (isSetObject(context.config.env.config) &&
      ((context.config.env.config as FileReference).file !==
        defaultConfig.file ||
        (context.config.env.config as FileReference).export !==
          defaultConfig.export))
  ) {
    context.env.config.schema = merge(
      await extract(defaultConfig),
      context.env.config
    ) as JsonSchemaObject;
  }

  context.env.secrets = (await extract(
    context.config.env.secrets
  )) as EnvSchema;
  context.env.secrets.active = await readActive(context, "secrets");

  if (
    (isSetString(context.config.env.secrets) &&
      new RegExp(`${defaultSecrets.file}[:#;@]?${defaultSecrets.export}`).test(
        context.config.env.secrets
      ) === false) ||
    (isSetObject(context.config.env.secrets) &&
      ((context.config.env.secrets as FileReference).file !==
        defaultSecrets.file ||
        (context.config.env.secrets as FileReference).export !==
          defaultSecrets.export))
  ) {
    context.env.secrets.schema = merge(
      await extract(defaultSecrets),
      context.env.secrets
    ) as JsonSchemaObject;
  }

  const properties = getProperties(context.env.config);
  const describeVariant = (variant: EnvSchema["variant"]) => {
    switch (variant) {
      case "json-schema":
        return "JSON Schema";
      case "standard-schema":
        return "Standard Schema";
      case "zod3":
        return "Zod v3 schema";
      case "valibot":
        return "Valibot schema";
      case "untyped":
        return "Untyped configuration";
      case "file-reference":
        return "Typescript exported type";
      default: {
        const _exhaustive: never = variant;

        return _exhaustive;
      }
    }
  };
  context.info({
    meta: {
      category: "env"
    },
    message: `Environment Variables configuration: ${
      context.config.env.config ? "" : "Defaulted "
    }${describeVariant(context.env.config.variant)}${
      context.config.env.config ? " from plugin options" : ""
    } provided ${
      Object.keys(properties).length
    } parameters\nEnvironment Secret configuration: ${
      context.config.env.secrets ? "" : "Defaulted "
    }${describeVariant(context.env.secrets.variant)}${
      context.config.env.secrets ? " from plugin options" : ""
    } provided ${
      context.env.secrets?.schema
        ? getPropertiesList(context.env.secrets).length
        : "0"
    } parameters\nEnvironment variable Prefixes: ${context.config.env.prefix.join(
      ", "
    )}\nShould inject values: ${
      context.config.env.inject ? "Yes" : "No"
    }\nShould validate configuration: ${
      context.config.env.validate ? "Yes" : "No"
    }`
  });

  const aliases = Object.fromEntries(
    Object.entries(properties).flatMap(
      ([key, prop]) =>
        (isSetArray(prop.alias)
          ? prop.alias?.map(alias => [
              alias,
              {
                ...prop,
                name: alias,
                alias: [...(prop.alias?.filter(a => a !== alias) ?? []), key]
              }
            ])
          : []) as [string, typeof prop][]
    )
  );

  context.env.parsed = await loadEnv(context);
  for (const [key, value] of Object.entries(context.env.parsed)) {
    const unprefixedKey = context.config.env.prefix.reduce((ret, prefix) => {
      if (key.startsWith(prefix)) {
        return key.slice(prefix.length + 1); // + 1 to account for the underscore after the prefix
      }
      return ret;
    }, key);
    if (properties[unprefixedKey]) {
      if (!properties[unprefixedKey]?.runtime) {
        const propertySchema = getProperties(context.env.config.schema)?.[
          unprefixedKey
        ];
        if (propertySchema) {
          propertySchema.default = value;
        }
      }
    } else if (aliases[unprefixedKey]) {
      if (!aliases[unprefixedKey]?.runtime) {
        const alias = aliases[unprefixedKey]?.alias?.[0] ?? unprefixedKey;
        const aliasSchema = getProperties(context.env.config.schema)?.[alias];
        if (aliasSchema) {
          aliasSchema.default = value;
        }
      }
    }
  }

  if (!isSchemaObject(context.env.config)) {
    throw new Error(
      "Invalid environment variable schema extracted. Please ensure the `env.types` option points to a valid TypeScript type definition file that exports an interface representing the environment variable schema."
    );
  }

  getPropertiesList(context.env.config).forEach(property => {
    property.alias ??= [];
    const aliases = [...property.alias];
    context.config.env.prefix.forEach(prefix => {
      if (!property.alias!.includes(`${prefix}_${property.name}`)) {
        property.alias!.push(`${prefix}_${property.name}`);
      }

      aliases
        .map(alias => `${prefix}_${alias}`)
        .forEach(prefixedAlias => {
          if (!property.alias!.includes(prefixedAlias)) {
            property.alias!.push(prefixedAlias);
          }
        });
    });
  });

  getPropertiesList(context.env.secrets).forEach(property => {
    property.alias ??= [];
    const aliases = [...property.alias];
    context.config.env.prefix.forEach(prefix => {
      if (!property.alias!.includes(`${prefix}_${property.name}`)) {
        property.alias!.push(`${prefix}_${property.name}`);
      }

      aliases
        .map(alias => `${prefix}_${alias}`)
        .forEach(prefixedAlias => {
          if (!property.alias!.includes(prefixedAlias)) {
            property.alias!.push(prefixedAlias);
          }
        });
    });
  });
}

/**
 * Writes the environment variables and secrets schema stored in the plugin context to the cache directory for later retrieval during the build process. This function should be called during the plugin's `build` hook after the schema has been extracted and stored in the plugin context to ensure that the active environment variables and secrets are persisted across builds and can be accessed during the build process for validation and injection purposes.
 *
 * @param context - The plugin context containing the environment variables and secrets schema to be written to the cache directory.
 * @returns A promise that resolves when the schema has been successfully written to the cache directory.
 */
export async function writeEnv<TContext extends EnvPluginContext>(
  context: TContext
): Promise<void[]> {
  return Promise.all([
    writeActive(context, "config", context.env.config),
    writeActive(context, "secrets", context.env.secrets)
  ]);
}
