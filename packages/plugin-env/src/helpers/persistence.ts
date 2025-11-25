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

import { convertFromCapnp, convertToCapnp } from "@powerlines/deepkit/capnp";
import { getReflectionsPath } from "@powerlines/deepkit/resolve-reflections";
import { SerializedTypes } from "@powerlines/deepkit/schemas/reflection";
import { Reflection } from "@powerlines/deepkit/types";
import {
  deserializeType,
  ReflectionClass,
  ReflectionKind,
  resolveClassType
} from "@powerlines/deepkit/vendor/type";
import * as capnp from "@stryke/capnp";
import {
  readFileBuffer,
  writeFileBuffer,
  writeFileBufferSync
} from "@stryke/fs/buffer";
import { resolvePackage } from "@stryke/fs/resolve";
import { joinPaths } from "@stryke/path/join-paths";
import { isEmptyObject } from "@stryke/type-checks/is-empty-object";
import type { TypeDefinition } from "@stryke/types/configuration";
import { existsSync } from "node:fs";
import { Context, UnresolvedContext } from "powerlines/types/context";
import {
  EnvPluginContext,
  EnvPluginResolvedConfig,
  EnvType
} from "../types/plugin";
import { createEnvReflection } from "./reflect";

/**
 * Resolves the runtime type definition file for the environment variables.
 *
 * @param context - The plugin context.
 * @returns The runtime type definition file for the environment variables.
 */
export async function resolveRuntimeTypeFile(
  context: UnresolvedContext<EnvPluginResolvedConfig>
): Promise<string> {
  return resolvePackage("@powerlines/plugin-env/types/runtime", {
    paths: [
      context.workspaceConfig.workspaceRoot,
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.config.projectRoot
      )
    ]
  });
}

/**
 * Gets the default type definition for the environment variables.
 *
 * @param context - The plugin context.
 * @returns The default type definition for the environment variables.
 */
export async function getEnvDefaultTypeDefinition(
  context: UnresolvedContext<EnvPluginResolvedConfig>
): Promise<TypeDefinition> {
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
export async function getSecretsDefaultTypeDefinition(
  context: UnresolvedContext<EnvPluginResolvedConfig>
): Promise<TypeDefinition> {
  return {
    file: await resolveRuntimeTypeFile(context),
    name: "SecretsInterface"
  };
}

/**
 * Gets the path to the environment type reflections.
 *
 * @param context - The plugin context.
 * @param name - The name of the type reflections.
 * @returns The path to the environment type reflections.
 */
export function getEnvTypeReflectionsPath(
  context: Context<EnvPluginResolvedConfig>,
  name: EnvType = "env"
): string {
  return joinPaths(getReflectionsPath(context), "env", `${name}-types.bin`);
}

/**
 * Reads the environment type reflection from the file system.
 *
 * @param context - The plugin context.
 * @param name - The name of the type reflections.
 * @returns The environment type reflection.
 */
export async function readEnvTypeReflection(
  context: EnvPluginContext,
  name: EnvType = "env"
): Promise<ReflectionClass<any>> {
  const filePath = getEnvTypeReflectionsPath(context, name);
  if (!existsSync(filePath)) {
    if (!context.env.types.env || isEmptyObject(context.env.types.env)) {
      const reflection = createEnvReflection(context) as Reflection;

      const message = new capnp.Message();
      reflection.messageRoot = message.initRoot(SerializedTypes);
      reflection.dataBuffer = message.toArrayBuffer();

      context.env.types.env = reflection;
      await writeEnvTypeReflection(context, context.env.types.env, name);
    }

    return context.env.types.env;
  }

  const buffer = await readFileBuffer(filePath);
  const message = new capnp.Message(buffer, false);
  const messageRoot = message.getRoot(SerializedTypes);

  const reflection = resolveClassType(
    deserializeType(convertFromCapnp(messageRoot.types))
  );

  context.env.types[name] = reflection;
  context.env.types[name].messageRoot = messageRoot;
  context.env.types[name].dataBuffer = buffer;

  return reflection;
}

/**
 * Writes the environment type reflection to the file system.
 *
 * @param context - The plugin context.
 * @param reflection - The environment type reflection to write.
 * @param name - The name of the type reflections.
 */
export async function writeEnvTypeReflection(
  context: EnvPluginContext,
  reflection: ReflectionClass<any>,
  name: EnvType = "env"
) {
  const serialized = reflection.serializeType();

  const message = new capnp.Message();
  const root = message.initRoot(SerializedTypes);

  convertToCapnp(serialized, root._initTypes(serialized.length));

  await writeFileBuffer(
    getEnvTypeReflectionsPath(context, name),
    message.toArrayBuffer()
  );
}

export function getEnvReflectionsPath(
  context: EnvPluginContext,
  name: EnvType
): string {
  return joinPaths(getReflectionsPath(context), "env", `${name}.bin`);
}

/**
 * Reads the environment reflection data from the file system.
 *
 * @param context - The plugin context.
 * @returns The environment reflection data.
 */
export async function readEnvReflection(
  context: EnvPluginContext
): Promise<ReflectionClass<any>> {
  const filePath = getEnvReflectionsPath(context, "env");
  if (!existsSync(filePath)) {
    if (!context.env.types.env) {
      context.env.types.env = await readEnvTypeReflection(context, "env");
    }

    if (!context.env.used.env || isEmptyObject(context.env.used.env)) {
      const reflection = createEnvReflection(context, {
        type: {
          kind: ReflectionKind.objectLiteral,
          typeName: "Env",
          description: `An object containing the environment configuration parameters that are used (at least once) by the ${
            context.config.name
              ? `${context.config.name} application`
              : "application"
          }.`,
          types: []
        },
        superReflection: context.env.types.env
      }) as Reflection;
      reflection.name = "Env";

      const message = new capnp.Message();
      reflection.messageRoot = message.initRoot(SerializedTypes);
      reflection.dataBuffer = message.toArrayBuffer();

      context.env.used.env = reflection;
      await writeEnvReflection(context, context.env.used.env, "env");
    }

    return context.env.used.env;
  }

  const buffer = await readFileBuffer(filePath);
  const message = new capnp.Message(buffer, false);
  const messageRoot = message.getRoot(SerializedTypes);

  const reflection = resolveClassType(
    deserializeType(convertFromCapnp(messageRoot.types))
  );

  context.env.used.env = reflection;
  context.env.used.env.messageRoot = messageRoot;
  context.env.used.env.dataBuffer = buffer;

  return reflection;
}

/**
 * Reads the secret environment reflection data from the file system.
 *
 * @param context - The plugin context.
 * @returns The environment reflection data.
 */
export async function readSecretsReflection(
  context: EnvPluginContext
): Promise<ReflectionClass<any>> {
  const filePath = getEnvReflectionsPath(context, "secrets");
  if (!existsSync(filePath)) {
    if (!context.env.types.secrets) {
      context.env.types.secrets = await readEnvTypeReflection(
        context,
        "secrets"
      );
    }

    if (!context.env.used.secrets || isEmptyObject(context.env.used.secrets)) {
      const reflection = createEnvReflection(context, {
        type: {
          kind: ReflectionKind.objectLiteral,
          typeName: "Secrets",
          description: `An object containing the secret configuration parameters that are used (at least once) by the ${
            context.config.name
              ? `${context.config.name} application`
              : "application"
          }.`,
          types: []
        },
        superReflection: context.env.types.secrets
      }) as Reflection;
      reflection.name = "Secrets";

      const message = new capnp.Message();
      reflection.messageRoot = message.initRoot(SerializedTypes);
      reflection.dataBuffer = message.toArrayBuffer();

      context.env.used.secrets = reflection;
      await writeEnvReflection(context, context.env.used.secrets, "secrets");
    }

    return context.env.used.secrets;
  }

  const buffer = await readFileBuffer(filePath);
  const message = new capnp.Message(buffer, false);
  const messageRoot = message.getRoot(SerializedTypes);

  const reflection = resolveClassType(
    deserializeType(convertFromCapnp(messageRoot.types))
  );

  context.env.used.secrets = reflection;
  context.env.used.secrets.messageRoot = messageRoot;
  context.env.used.secrets.dataBuffer = buffer;

  return reflection;
}

/**
 * Writes the environment reflection data to the file system.
 *
 * @param context - The plugin context.
 * @param reflection - The reflection data to write.
 * @param name - The name of the reflection (either "env" or "secrets").
 */
export async function writeEnvReflection(
  context: EnvPluginContext,
  reflection: ReflectionClass<any>,
  name: EnvType = "env"
) {
  const serialized = reflection.serializeType();

  const message = new capnp.Message();
  const root = message.initRoot(SerializedTypes);

  convertToCapnp(serialized, root._initTypes(serialized.length));

  await writeFileBuffer(
    getEnvReflectionsPath(context, name),
    message.toArrayBuffer()
  );
}

/**
 * Writes the environment reflection data to the file system.
 *
 * @param context - The plugin context.
 * @param reflection - The reflection data to write.
 * @param name - The name of the reflection (either "env" or "secrets").
 */
export function writeEnvReflectionSync(
  context: EnvPluginContext,
  reflection: ReflectionClass<any>,
  name: EnvType = "env"
) {
  const serialized = reflection.serializeType();

  const message = new capnp.Message();
  const root = message.initRoot(SerializedTypes);

  convertToCapnp(serialized, root._initTypes(serialized.length));

  writeFileBufferSync(
    getEnvReflectionsPath(context, name),
    message.toArrayBuffer()
  );
}
