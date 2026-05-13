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

import type { PluginContext } from "@powerlines/core";
import { isTypeDefinition } from "@powerlines/core";
import { esbuildPlugin } from "@powerlines/deepkit/esbuild-plugin";
import { isType, Type } from "@powerlines/deepkit/vendor/type";
import type { JsonSchema7Type } from "@stryke/json";
import { isJsonSchema7ObjectType, isStandardJsonSchema } from "@stryke/json";
import { isSetString } from "@stryke/type-checks";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { extractJsonSchema7, isZod3Type } from "@stryke/zod";
import defu from "defu";
import type { BuildOptions } from "esbuild";
import { isSchemaDefinition } from "./is-schema-definition";
import { reflectionToJsonSchema } from "./reflection";
import { resolve } from "./resolve";
import {
  SchemaDefinition,
  SchemaDefinitionInput,
  SchemaDefinitionParameter
} from "./types";

/**
 * Converts a reflected Deepkit {@link @powerlines/deepkit/vendor/type#Type} into a JSON Schema (draft-07) representation.
 *
 * @remarks
 * This function delegates to an internal recursive walker that handles the full set of Deepkit reflection kinds.
 *
 * @param reflection - The reflected Deepkit Type to convert.
 * @returns A JSON Schema (draft-07) fragment representing the type, or `undefined` when no schema could be produced.
 */
export function extractReflection(
  reflection: Type
): JsonSchema7Type | undefined {
  if (!isType(reflection)) {
    return undefined;
  }

  return reflectionToJsonSchema(reflection);
}

/**
 * Extracts a JSON Schema object from a given schema definition, if possible.
 *
 * @remarks
 * This function checks if the provided schema is a Zod schema, a Standard JSON Schema, or already a JSON Schema object. If it is a Zod schema, it extracts the corresponding JSON Schema. If it is a Standard JSON Schema, it retrieves the input JSON Schema targeting draft-07. Finally, it checks if the resulting JSON Schema is an object type and returns it if so.
 *
 * @param schema - The schema definition to extract the JSON Schema from. This can be a Zod schema, a Standard JSON Schema, or a JSON Schema object.
 * @returns The extracted JSON Schema (draft-07) object if successful, otherwise undefined.
 */
export function extractJsonSchema(
  schema: unknown
): JsonSchema7Type | undefined {
  if (
    isSetObject(schema) &&
    (isZod3Type(schema) ||
      isStandardJsonSchema(schema) ||
      isJsonSchema7ObjectType(schema))
  ) {
    let jsonSchema: JsonSchema7Type;
    if (isZod3Type(schema)) {
      jsonSchema = extractJsonSchema7(schema);
    } else if (isStandardJsonSchema(schema)) {
      jsonSchema = schema["~standard"].jsonSchema.input({
        target: "draft-07"
      });
    } else {
      jsonSchema = schema;
    }

    if (isJsonSchema7ObjectType(jsonSchema)) {
      return jsonSchema;
    }
  }

  return undefined;
}

/**
 * Extracts a schema definition from a given input object, which can be a Zod schema, a Standard JSON Schema, a JSON Schema object, or a reflected Deepkit Type object. The function checks the type of the input and attempts to extract the corresponding schema based on its variant. If the input is a Zod schema, it extracts the JSON Schema using the `extractJsonSchema` function. If the input is a Standard JSON Schema, it retrieves the JSON Schema targeting draft-07. If the input is already a JSON Schema object, it uses it directly. If the input is a reflected Deepkit Type object, it extracts the schema using the `extractReflection` function. The function returns a `SchemaDefinition` containing the extracted schema and its variant if successful; otherwise, it throws an error.
 *
 * @param input - The input object to extract the schema definition from.
 * @returns A `SchemaDefinition` containing the extracted schema and its variant if successful.
 * @throws An error if the input does not contain a valid schema definition.
 */
export function extractSchema(input: SchemaDefinitionInput): SchemaDefinition {
  if (isSetObject(input)) {
    if (isZod3Type(input)) {
      const schema = extractJsonSchema(input);
      if (schema) {
        return {
          schema,
          variant: "zod3",
          input
        };
      }
    } else if (isStandardJsonSchema(input)) {
      const schema = extractJsonSchema(input);
      if (schema) {
        return {
          schema,
          variant: "standard-schema",
          input
        };
      }
    } else if (isJsonSchema7ObjectType(input)) {
      const schema = extractJsonSchema(input);
      if (schema) {
        return {
          schema,
          variant: "json-schema",
          input
        };
      }
    } else if (isType(input)) {
      const schema = extractReflection(input);
      if (schema) {
        return {
          schema,
          variant: "reflection",
          input
        };
      }
    }
  }

  throw new Error(
    `Failed to extract a valid schema from the provided input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, or a reflected Deepkit Type object.`
  );
}

/**
 * Resolves the provided entry points to their corresponding type definitions. The function accepts an array of entry points, which can be strings (file paths) or type definition objects. It processes each entry point, resolving file paths and glob patterns to find matching files. For each resolved file, it creates a type definition object and resolves it using the `resolveInput` function. The function returns an array of resolved entry type definitions.
 *
 * @example
 * ```ts
 * const schema = await extract(context, "./schemas/*.ts");
 * ```
 *
 * @param context - The plugin context used for resolving the schema definition input.
 * @param input - The schema definition input to extract the JSON Schema from. This can be a Zod schema, a Standard JSON Schema, a JSON Schema object, or a TypeScript type definition.
 * @param options - Optional overrides for the ESBuild configuration used during resolution.
 * @returns A promise that resolves to a SchemaDefinition containing the extracted JSON Schema and its variant, or the bytecode if JSON Schema extraction is not possible.
 */
export async function extract<TContext extends PluginContext = PluginContext>(
  context: TContext,
  input: SchemaDefinitionParameter,
  options: Partial<BuildOptions> = {}
): Promise<SchemaDefinition> {
  if (isSchemaDefinition(input)) {
    return input;
  }

  let inputObject = input as SchemaDefinitionInput;
  if (isSetString(input) || isTypeDefinition(input)) {
    inputObject = await resolve<SchemaDefinitionInput>(
      context,
      input,
      defu(options, {
        plugins: [
          esbuildPlugin(context, {
            reflection: "default",
            level: "all"
          })
        ]
      })
    );
  }

  return extractSchema(inputObject);
}
