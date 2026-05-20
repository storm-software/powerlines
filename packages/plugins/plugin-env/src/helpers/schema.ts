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

import { extract } from "@powerlines/schema/extract";
import {
  getProperties,
  getPropertiesList,
  mergeSchemas
} from "@powerlines/schema/helpers";
import { isSetArray } from "@stryke/type-checks/is-set-array";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isString } from "@stryke/type-checks/is-string";
import type { TypeDefinition } from "@stryke/types/configuration";
import defu from "defu";
import { UnresolvedContext } from "powerlines";
import { Env, EnvPluginContext } from "../types/plugin";
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
export async function extractEnv<TContext extends EnvPluginContext>(
  context: TContext
): Promise<void> {
  const defaultVarsTypeDefinition = await getDefaultVarsTypeDefinition(context);
  const defaultSecretsTypeDefinition =
    await getDefaultSecretsTypeDefinition(context);

  const vars = await extract<Env>(context, context.config.env.vars);
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
    vars.schema = mergeSchemas<Env>(
      vars,
      await extract<Env>(context, defaultVarsTypeDefinition)
    );
  }

  const secrets = await extract<Env>(context, context.config.env.secrets);
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
    secrets.schema = mergeSchemas<Env>(
      secrets,
      await extract<Env>(context, defaultSecretsTypeDefinition)
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
      if (!properties[unprefixedKey]?.isRuntime) {
        const propertySchema =
          context.env.vars.schema.properties?.[unprefixedKey];
        if (propertySchema) {
          propertySchema.default = value;
        }
      }
    } else if (aliases[unprefixedKey]) {
      if (!aliases[unprefixedKey]?.isRuntime) {
        const alias = aliases[unprefixedKey]?.alias?.[0] ?? unprefixedKey;
        const aliasSchema = context.env.vars.schema.properties?.[alias];
        if (aliasSchema) {
          aliasSchema.default = value;
        }
      }
    }
  }
}
