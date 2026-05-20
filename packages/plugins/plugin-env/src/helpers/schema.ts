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

import { getCacheDirectory } from "@powerlines/schema";
import { extract } from "@powerlines/schema/extract";
import {
  getProperties,
  getPropertiesList,
  mergeSchemas
} from "@powerlines/schema/helpers";
import { joinPaths } from "@stryke/path/join";
import { isSetArray } from "@stryke/type-checks/is-set-array";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isString } from "@stryke/type-checks/is-string";
import type { TypeDefinition } from "@stryke/types/configuration";
import defu from "defu";
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
export async function getDefaultVarsTypeDefinition<
  TContext extends UnresolvedContext
>(context: TContext): Promise<TypeDefinition> {
  return {
    file: await resolveRuntimeTypeFile(context),
    name: "EnvInterface"
  };
}

/** Gets the default type definition for the environment secrets.
 *
 * @param context - The plugin context.
 * @returns The default type definition for the environment secrets.
 */
export async function getDefaultSecretsTypeDefinition<
  TContext extends UnresolvedContext
>(context: TContext): Promise<TypeDefinition> {
  return {
    file: await resolveRuntimeTypeFile(context),
    name: "SecretsInterface"
  };
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
export async function extractEnvSchema<TContext extends EnvPluginContext>(
  context: TContext
): Promise<void> {
  const defaultVarsTypeDefinition = await getDefaultVarsTypeDefinition(context);
  const defaultSecretsTypeDefinition =
    await getDefaultSecretsTypeDefinition(context);

  const vars = (await extract(context, context.config.env.vars)) as EnvSchema;
  if (
    (isString(context.config.env.vars) &&
      context.config.env.vars !==
        `${defaultVarsTypeDefinition.file}#${
          defaultVarsTypeDefinition.name
        }`) ||
    (isSetObject(context.config.env.vars) &&
      ((context.config.env.vars as TypeDefinition).file !==
        defaultVarsTypeDefinition.file ||
        (context.config.env.vars as TypeDefinition).name !==
          defaultVarsTypeDefinition.name))
  ) {
    vars.schema = mergeSchemas(
      vars,
      (await extract(context, defaultVarsTypeDefinition)) as EnvSchema
    );
  }

  const secrets = (await extract(
    context,
    context.config.env.secrets
  )) as EnvSchema;
  if (
    (isString(context.config.env.secrets) &&
      context.config.env.secrets !==
        `${defaultSecretsTypeDefinition.file}#${
          defaultSecretsTypeDefinition.name
        }`) ||
    (isSetObject(context.config.env.secrets) &&
      ((context.config.env.secrets as TypeDefinition).file !==
        defaultSecretsTypeDefinition.file ||
        (context.config.env.secrets as TypeDefinition).name !==
          defaultSecretsTypeDefinition.name))
  ) {
    secrets.schema = mergeSchemas(
      secrets,
      (await extract(context, defaultSecretsTypeDefinition)) as EnvSchema
    );
  }

  context.env = defu(
    {
      vars,
      secrets,
      parsed: await loadEnv(context, context.config.env)
    },
    context.env ?? {},
    {
      parsed: {},
      injected: []
    }
  );
  await readActiveEnv(context);

  const properties = getProperties(context.env.vars);
  context.info({
    meta: {
      category: "env"
    },
    message: `Environment Variables configuration: ${
      context.config.env.vars ? "" : "Defaulted "
    }${
      context.env.vars.variant === "reflection"
        ? "Deepkit type definition"
        : context.env.vars.variant === "json-schema"
          ? "JSON Schema"
          : context.env.vars.variant === "standard-schema"
            ? "Standard Schema"
            : context.env.vars.variant === "zod3"
              ? "Zod v3 schema"
              : "Typescript exported type"
    }${context.config.env.vars ? " from plugin options" : ""} provided ${
      Object.keys(properties).length
    } parameters\nEnvironment Secret configuration: ${
      context.config.env.secrets ? "" : "Defaulted "
    }${
      context.env.secrets.variant === "reflection"
        ? "Deepkit type definition"
        : context.env.secrets.variant === "json-schema"
          ? "JSON Schema"
          : context.env.secrets.variant === "standard-schema"
            ? "Standard Schema"
            : context.env.secrets.variant === "zod3"
              ? "Zod v3 schema"
              : "Typescript exported type"
    }${context.config.env.secrets ? " from plugin options" : ""} provided ${
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
        (isSetArray(prop.metadata?.alias)
          ? prop.metadata?.alias?.map(alias => [
              alias,
              { ...prop, metadata: { ...prop.metadata, alias: [key] } }
            ])
          : []) as [string, typeof prop][]
    )
  );

  for (const [key, value] of Object.entries(
    await loadEnv(context, context.config.env)
  )) {
    const unprefixedKey = context.config.env.prefix.reduce((ret, prefix) => {
      if (key.replace(/_$/g, "").startsWith(prefix)) {
        return key.replace(/_$/g, "").slice(prefix.length);
      }
      return ret;
    }, key);
    if (properties[unprefixedKey]) {
      if (!properties[unprefixedKey].metadata?.isRuntime) {
        const propertySchema =
          context.env.vars.schema.properties?.[unprefixedKey];
        if (propertySchema) {
          propertySchema.default = value;
        }
      }
    } else if (aliases[unprefixedKey]) {
      if (!aliases[unprefixedKey].metadata?.isRuntime) {
        const alias =
          aliases[unprefixedKey].metadata?.alias?.[0] ?? unprefixedKey;
        const aliasSchema = context.env.vars.schema.properties?.[alias];
        if (aliasSchema) {
          aliasSchema.default = value;
        }
      }
    }
  }
}

/**
 * Reads the active environment variables and secrets from the plugin context's cache and stores them in the plugin context for use during the build process. This function should be called during the plugin's `buildStart` hook to ensure that the active environment variables and secrets are available before the build process begins.
 *
 * @param context - The plugin context
 * @returns A promise that resolves when the active environment variables and secrets have been read and stored in the plugin context.
 */
export async function readActiveEnv<TContext extends EnvPluginContext>(
  context: TContext
) {
  context.env.vars.active ??= [];
  if (
    context.fs.existsSync(
      joinPaths(getCacheDirectory(context), "env", "vars.json")
    )
  ) {
    const content = await context.fs.read(
      joinPaths(getCacheDirectory(context), "env", "vars.json")
    );
    if (content) {
      context.env.vars.active = JSON.parse(content)?.elements ?? [];
    }
  }

  context.env.secrets.active ??= [];
  if (
    context.fs.existsSync(
      joinPaths(getCacheDirectory(context), "env", "secrets.json")
    )
  ) {
    const content = await context.fs.read(
      joinPaths(getCacheDirectory(context), "env", "secrets.json")
    );
    if (content) {
      context.env.secrets.active = JSON.parse(content)?.elements ?? [];
    }
  }
}

/**
 * Writes the active environment variables and secrets from the plugin context to the plugin context's cache for use during the build process. This function should be called whenever the active environment variables and secrets are updated in the plugin context to ensure that the latest values are available during the build process.
 *
 * @param context - The plugin context
 * @returns A promise that resolves when the active environment variables and secrets have been written to the plugin context's cache.
 */
export async function writeActiveEnv<TContext extends EnvPluginContext>(
  context: TContext
) {
  return Promise.all(
    [
      isSetArray(context.env.vars.active)
        ? context.fs.write(
            joinPaths(getCacheDirectory(context), "env", "vars.json"),
            JSON.stringify({
              elements: context.env.vars.active
            })
          )
        : undefined,
      isSetArray(context.env.secrets.active)
        ? context.fs.write(
            joinPaths(getCacheDirectory(context), "env", "secrets.json"),
            JSON.stringify({
              elements: context.env.secrets.active
            })
          )
        : undefined
    ].filter(Boolean) as Promise<void>[]
  );
}
