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

import type { Context } from "@powerlines/core";
import { isTypeDefinition } from "@powerlines/core";
import { rolldownPlugin } from "@powerlines/deepkit/rolldown-plugin";
import { isType, stringifyType, Type } from "@powerlines/deepkit/vendor/type";
import { StandardJSONSchemaV1 } from "@standard-schema/spec";
import { murmurhash } from "@stryke/hash";
import { isStandardJsonSchema } from "@stryke/json";
import { joinPaths } from "@stryke/path/join";
import { isSetString } from "@stryke/type-checks";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import {
  extractJsonSchema as extractJsonSchemaZod,
  isZod3Type
} from "@stryke/zod";
import defu from "defu";
import type { BuildOptions } from "rolldown";
import * as z3 from "zod/v3";
import { getCacheDirectory, writeSchema } from "./persistence";
import { reflectionToJsonSchema } from "./reflection";
import { resolve } from "./resolve";
import {
  isExtractedSchema,
  isJsonSchema,
  isJsonSchemaObject,
  isSchema,
  isUntypedInput,
  isUntypedSchema
} from "./type-checks";
import {
  ExtractedSchema,
  JsonSchema,
  Schema,
  SchemaInput,
  SchemaInputVariant,
  SchemaSource,
  SchemaSourceInput,
  SchemaSourceVariant,
  TypeDefinitionReference,
  UntypedInputObject,
  UntypedSchema
} from "./types";

function convertNestedUntypedSchema(value: unknown): unknown {
  if (isUntypedSchema(value)) {
    return convertUntypedSchemaToJsonSchema(value);
  }

  if (isSetObject(value)) {
    if (isUntypedInput(value)) {
      return convertUntypedInputToJsonSchema(value);
    }

    const nested = value as Record<string, unknown>;
    if ("$schema" in nested && isUntypedSchema(nested.$schema)) {
      return convertUntypedSchemaToJsonSchema(nested.$schema);
    }
  }

  return value;
}

function convertNestedUntypedSchemaArray(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }

  return value.map(item => convertNestedUntypedSchema(item));
}

function convertUntypedSchemaToJsonSchema<T = unknown>(
  schema: UntypedSchema | Record<string, unknown>
): JsonSchema<T> {
  const source = schema as Record<string, unknown>;
  const jsonSchema: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(source)) {
    if (
      key === "tsType" ||
      key === "markdownType" ||
      key === "tags" ||
      key === "args" ||
      key === "resolve"
    ) {
      continue;
    }

    if (key === "id" && isSetString(value)) {
      jsonSchema.$id = value;
      continue;
    }

    if (
      key === "properties" ||
      key === "patternProperties" ||
      key === "dependentSchemas" ||
      key === "$defs" ||
      key === "definitions"
    ) {
      if (!isSetObject(value)) {
        jsonSchema[key] = value;
        continue;
      }

      jsonSchema[key] = Object.fromEntries(
        Object.entries(value).map(([propertyKey, propertyValue]) => [
          propertyKey,
          convertNestedUntypedSchema(propertyValue)
        ])
      );
      continue;
    }

    if (
      key === "items" ||
      key === "contains" ||
      key === "if" ||
      key === "then" ||
      key === "else" ||
      key === "not" ||
      key === "propertyNames" ||
      key === "additionalProperties" ||
      key === "unevaluatedProperties"
    ) {
      jsonSchema[key] = convertNestedUntypedSchema(value);
      continue;
    }

    if (key === "oneOf" || key === "anyOf" || key === "allOf") {
      jsonSchema[key] = convertNestedUntypedSchemaArray(value);
      continue;
    }

    jsonSchema[key] = value;
  }

  return jsonSchema as JsonSchema<T>;
}

function convertUntypedInputToJsonSchema<T = unknown>(
  input: UntypedInputObject
): JsonSchema<T> {
  const inputObject = input as Record<string, unknown>;
  const base = (
    isUntypedSchema(inputObject.$schema)
      ? convertUntypedSchemaToJsonSchema<T>(inputObject.$schema)
      : {}
  ) as JsonSchema<T>;
  const properties: Record<string, JsonSchema<T>> = {};

  for (const [key, value] of Object.entries(inputObject)) {
    if (key.startsWith("$")) {
      continue;
    }

    if (!isSetObject(value)) {
      continue;
    }

    if (isUntypedInput(value)) {
      properties[key] = convertUntypedInputToJsonSchema<T>(value);
      continue;
    }

    const nested = value as Record<string, unknown>;
    if ("$schema" in nested && isUntypedSchema(nested.$schema)) {
      properties[key] = convertUntypedSchemaToJsonSchema<T>(nested.$schema);
      continue;
    }

    if (isUntypedSchema(value)) {
      properties[key] = convertUntypedSchemaToJsonSchema<T>(value);
    }
  }

  if (!isJsonSchemaObject(base)) {
    throw new Error(
      `Failed to convert untyped input to JSON Schema. The base schema must be a valid JSON Schema object.`
    );
  }

  const baseProperties = isSetObject(base.properties)
    ? (base.properties as Record<string, JsonSchema<T>>)
    : {};
  const mergedProperties = {
    ...baseProperties,
    ...properties
  };

  return {
    ...base,
    type: base.type ?? "object",
    ...(Object.keys(mergedProperties).length > 0
      ? { properties: mergedProperties }
      : {})
  };
}

/**
 * Creates a hash string for a given schema definition input.
 */
export function extractHash<T = unknown>(
  variant: SchemaInputVariant,
  input: SchemaInput<T>
): string {
  if (isSetString(input)) {
    return murmurhash({ variant, input });
  } else if (isSetObject(input)) {
    if (isZod3Type(input)) {
      return murmurhash({ variant, input: input._def });
    } else if (isStandardJsonSchema(input)) {
      return murmurhash({ variant, input: input["~standard"] });
    } else if (isJsonSchema(input)) {
      return murmurhash({ variant, input });
    } else if (isUntypedInput(input)) {
      return murmurhash({
        variant,
        input: convertUntypedInputToJsonSchema(input)
      });
    } else if (isUntypedSchema(input)) {
      return murmurhash({
        variant,
        input: convertUntypedSchemaToJsonSchema(input)
      });
    } else if (isType(input)) {
      return murmurhash({ variant, input: stringifyType(input) });
    }
  }

  throw new Error(
    `Failed to create an input hash for the provided schema definition input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, or a reflected Deepkit Type object.`
  );
}

/**
 * Converts a reflected Deepkit {@link Type} into a JSON Schema (draft-07) representation.
 */
export function extractReflection<T = unknown>(
  reflection: Type
): JsonSchema<T> | undefined {
  if (!isType(reflection)) {
    return undefined;
  }

  return reflectionToJsonSchema<T>(reflection);
}

/**
 * Extracts a JSON Schema from Zod, Standard Schema, untyped, or JSON Schema inputs.
 */
export function extractJsonSchema<T = unknown>(
  schema: unknown
): JsonSchema<T> | undefined {
  if (
    isSetObject(schema) &&
    (isZod3Type(schema) ||
      isStandardJsonSchema(schema) ||
      isUntypedInput(schema) ||
      isUntypedSchema(schema))
  ) {
    if (isZod3Type(schema)) {
      return extractJsonSchemaZod(schema) as JsonSchema<T>;
    }
    if (isStandardJsonSchema(schema)) {
      return schema["~standard"].jsonSchema.input({
        target: "draft-2020-12"
      }) as JsonSchema<T>;
    }
    if (isUntypedInput(schema)) {
      return convertUntypedInputToJsonSchema<T>(schema);
    }
    if (isUntypedSchema(schema)) {
      return convertUntypedSchemaToJsonSchema<T>(schema);
    }
  } else if (isJsonSchema<T>(schema)) {
    return schema;
  }

  return undefined;
}

export function extractResolvedVariant(
  input: SchemaSourceInput
): SchemaSourceVariant {
  if (isSetObject(input)) {
    if (isZod3Type(input)) {
      return "zod3";
    } else if (isStandardJsonSchema(input)) {
      return "standard-schema";
    } else if (isJsonSchema(input)) {
      return "json-schema";
    } else if (isType(input)) {
      return "reflection";
    } else if (isUntypedInput(input) || isUntypedSchema(input)) {
      return "untyped";
    }
  }

  throw new Error(
    `Failed to determine the variant of the provided schema definition input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, a reflected Deepkit Type object, or an Untyped schema.`
  );
}

export function extractVariant<T = unknown>(
  input: SchemaInput<T>
): SchemaInputVariant {
  if (isSetString(input) || isTypeDefinition(input)) {
    return "type-definition";
  }

  return extractResolvedVariant(input as SchemaSourceInput);
}

export async function extractSchemaSchema<T = unknown>(
  input: SchemaSourceInput,
  variant?: SchemaInputVariant
): Promise<JsonSchema<T>> {
  if (isExtractedSchema<T>(input)) {
    return input.schema;
  }

  const resolvedVariant = variant ?? extractResolvedVariant(input);

  let schema: JsonSchema<T> | undefined;
  if (
    resolvedVariant === "zod3" ||
    resolvedVariant === "json-schema" ||
    resolvedVariant === "standard-schema" ||
    resolvedVariant === "untyped"
  ) {
    schema = extractJsonSchema<T>(input);
  } else if (resolvedVariant === "reflection") {
    schema = extractReflection(input as Type);
  }

  if (schema) {
    return schema;
  }

  throw new Error(
    `Failed to extract a valid schema from the provided input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, an untyped schema, or a reflected Deepkit Type object.`
  );
}

export function extractSource(
  variant: SchemaSourceVariant,
  input: SchemaSourceInput
): SchemaSource {
  if (variant === "zod3") {
    return {
      hash: extractHash(variant, input),
      variant: "zod3",
      schema: input as z3.ZodTypeAny
    };
  } else if (variant === "untyped") {
    return {
      hash: extractHash(variant, input),
      variant: "untyped",
      schema: input as UntypedInputObject | UntypedSchema
    };
  } else if (variant === "standard-schema") {
    return {
      hash: extractHash(variant, input),
      variant: "standard-schema",
      schema: input as StandardJSONSchemaV1
    };
  } else if (variant === "json-schema") {
    return {
      hash: extractHash(variant, input),
      variant: "json-schema",
      schema: input as JsonSchema
    };
  } else if (variant === "reflection") {
    return {
      hash: extractHash(variant, input),
      variant: "reflection",
      schema: input as Type
    };
  }

  throw new Error(
    `Failed to extract source information from the provided input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, an untyped schema, or a reflected Deepkit Type object.`
  );
}

/**
 * Extracts a JSON Schema from a given schema definition input, which can be a Zod schema, a Standard JSON Schema, a JSON Schema object, an untyped schema, or a reflected Deepkit Type object. If the input is a type definition reference (e.g. a file path with an export), it will be resolved and bundled using ESBuild to obtain the actual schema definition before extraction.
 *
 * @example
 * ```ts
 * // Resolve a schema definition from a file path
 * const schema1 = await extract(context, "./schemas.ts#MySchema");
 * // Resolve a schema definition from a JSON Schema object
 * const schema2 = await extract(context, schemaObject);
 * // Resolve a schema definition from a Zod schema
 * const schema3 = await extract(context, zodSchema);
 * // Resolve a schema definition from a reflected Deepkit Type object
 * const schema4 = await extract(context, reflectionType);
 * ```
 *
 * @see https://github.com/colinhacks/zod
 * @see https://standardschema.dev/json-schema#what-schema-libraries-support-this-spec
 * @see https://json-schema.org/
 * @see https://ajv.js.org/json-type-definition.html
 * @see https://deepkit.io/en/documentation/runtime-types/reflection
 *
 * @param context - The context object providing access to the file system and cache path.
 * @param input - The schema definition input to extract, which can be a Zod schema, a Standard JSON Schema, a JSON Schema object, an untyped schema, or a reflected Deepkit Type object. If the input is a string or a type definition reference, it will be resolved and bundled to obtain the actual schema definition before extraction.
 * @param options - Optional overrides for the ESBuild configuration used during extraction. This can include custom plugins, loaders, or other build options to control how the schema definition is resolved and bundled when the input is a type definition reference.
 * @returns A promise that resolves to the extracted and normalized schema as a JSON Schema object. The function will attempt to extract a valid JSON Schema from the provided input, and if successful, it will return the schema. If the extraction process fails or if the input is not a valid schema definition, it will throw an error indicating the failure.
 */
export async function extractSchema<T = unknown>(
  context: Context,
  input: SchemaInput,
  options: Partial<BuildOptions> = {}
): Promise<ExtractedSchema<T>> {
  if (isExtractedSchema<T>(input)) {
    return input;
  }

  if (isSchema<T>(input)) {
    return {
      ...input,
      source: {
        hash: extractHash("json-schema", input.schema),
        variant: "json-schema",
        schema: input.schema
      }
    };
  }

  let source: SchemaSource;

  const variant = extractVariant(input);
  const hash = extractHash(variant, input);

  if (variant === "type-definition") {
    const resolved = await resolve<SchemaSourceInput>(
      context,
      input as TypeDefinitionReference,
      defu(options, {
        plugins: [
          rolldownPlugin(context, {
            reflection: "default",
            level: "all"
          })
        ]
      })
    );

    source = extractSource(extractResolvedVariant(resolved), resolved);
  } else if (
    [
      "json-schema",
      "standard-schema",
      "zod3",
      "untyped",
      "reflection"
    ].includes(variant)
  ) {
    source = extractSource(variant, input as SchemaSourceInput);
  } else {
    throw new Error(
      `Invalid schema definition input "${
        variant
      }". The variant must be one of "type-definition", "json-schema", "standard-schema", "zod3", "untyped", or "reflection".`
    );
  }

  return {
    variant,
    source,
    schema: await extractSchemaSchema<T>(source.schema, source.variant),
    hash
  };
}

/**
 * Extracts a JSON Schema from a given schema definition input, which can be a Zod schema, a Standard JSON Schema, a JSON Schema object, an untyped schema, or a reflected Deepkit Type object. If the input is a type definition reference (e.g. a file path with an export), it will be resolved and bundled using ESBuild to obtain the actual schema definition before extraction.
 *
 * @example
 * ```ts
 * // Resolve a schema definition from a file path
 * const schema1 = await extract(context, "./schemas.ts#MySchema");
 * // Resolve a schema definition from a JSON Schema object
 * const schema2 = await extract(context, schemaObject);
 * // Resolve a schema definition from a Zod schema
 * const schema3 = await extract(context, zodSchema);
 * // Resolve a schema definition from a reflected Deepkit Type object
 * const schema4 = await extract(context, reflectionType);
 * ```
 *
 * @see https://github.com/colinhacks/zod
 * @see https://standardschema.dev/json-schema#what-schema-libraries-support-this-spec
 * @see https://json-schema.org/
 * @see https://ajv.js.org/json-type-definition.html
 * @see https://deepkit.io/en/documentation/runtime-types/reflection
 * @see https://github.com/unjs/untyped
 * @see https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
 *
 * @param context - The context object providing access to the file system and cache path.
 * @param input - The schema definition input to extract, which can be a Zod schema, a Standard JSON Schema, a JSON Schema object, an untyped schema, or a reflected Deepkit Type object.
 * @param options - Optional overrides for the ESBuild configuration used during extraction.
 * @returns A promise that resolves to the extracted and normalized schema as a JSON Schema object.
 * @throws Will throw an error if the input is not a valid schema definition or if the extraction process fails to produce a valid schema.
 */
export async function extract<T = unknown>(
  context: Context,
  input: SchemaInput,
  options: Partial<BuildOptions> = {}
): Promise<Schema<T>> {
  if (isExtractedSchema<T>(input) || isSchema<T>(input)) {
    return input;
  }

  let result: Schema<T> | undefined;

  const variant = extractVariant(input);
  const hash = extractHash(variant, input);

  const cacheFilePath = joinPaths(getCacheDirectory(context), `${hash}.json`);
  if (
    context.config.skipCache !== true &&
    context.fs.existsSync(cacheFilePath)
  ) {
    const schema = await context.fs.read(cacheFilePath);
    if (schema) {
      result = {
        variant,
        hash,
        schema: JSON.parse(schema) as JsonSchema<T>
      };
    }
  }

  result ??= await extractSchema<T>(context, input, options);
  if (!result?.schema) {
    throw new Error(
      `Failed to extract a valid schema from the provided input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, an untyped schema, or a reflected Deepkit Type object.`
    );
  }

  if (context.config.skipCache !== true) {
    await writeSchema(context, result);
  }

  return result;
}
