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
import { esbuildPlugin } from "@powerlines/deepkit/esbuild-plugin";
import { isType, stringifyType, Type } from "@powerlines/deepkit/vendor/type";
import { StandardJSONSchemaV1 } from "@standard-schema/spec";
import { murmurhash } from "@stryke/hash";
import {
  isJsonSchemaObjectType,
  isStandardJsonSchema,
  JsonSchemaType
} from "@stryke/json";
import { isSetString } from "@stryke/type-checks";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import {
  extractJsonSchema as extractJsonSchemaZod,
  isZod3Type
} from "@stryke/zod";
import defu from "defu";
import type { BuildOptions } from "esbuild";
import * as z3 from "zod/v3";
import { jsonSchemaToJtd } from "./jtd";
import { reflectionToJsonSchema } from "./reflection";
import { resolve } from "./resolve";
import {
  isExtractedSchema,
  isJTDSchema,
  isSchema,
  isUntypedInput,
  isUntypedSchema
} from "./type-checks";
import {
  ExtractedSchema,
  JsonSchemaLike,
  JTDSchemaType,
  Schema,
  SchemaInput,
  SchemaInputVariant,
  SchemaMetadata,
  SchemaSource,
  SchemaSourceInput,
  SchemaSourceVariant,
  TypeDefinitionReference,
  UntypedInputObject,
  UntypedSchema
} from "./types";

/**
 * Creates a hash string for a given schema definition input. The function checks the type of the input and generates a hash based on its content. If the input is a Zod schema, it hashes the JSON representation of its internal definition. If the input is a Standard JSON Schema, it hashes the JSON representation of its internal standard schema. If the input is already a JSON Schema object, it hashes its JSON representation directly. If the input is a reflected Deepkit Type object, it hashes its JSON representation. The resulting hash string can be used for caching or comparison purposes.
 */
export function extractHash(
  variant: SchemaInputVariant,
  input: SchemaInput
): string {
  if (isSetString(input)) {
    return murmurhash({ variant, input });
  } else if (isSetObject(input)) {
    if (isZod3Type(input)) {
      return murmurhash({ variant, input: input._def });
    } else if (isStandardJsonSchema(input)) {
      return murmurhash({ variant, input: input["~standard"] });
    } else if (isJsonSchemaObjectType(input)) {
      return murmurhash({ variant, input });
    } else if (isType(input)) {
      return murmurhash({ variant, input: stringifyType(input) });
    }
  }

  throw new Error(
    `Failed to create an input hash for the provided schema definition input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, or a reflected Deepkit Type object.`
  );
}

/**
 * Converts a reflected Deepkit {@link @powerlines/deepkit/vendor/type#Type} into a JSON Schema (draft-07) representation.
 *
 * @remarks
 * This function delegates to an internal recursive walker that handles the full set of Deepkit reflection kinds.
 *
 * @param reflection - The reflected Deepkit Type to convert.
 * @returns A JSON Schema (draft-07) fragment representing the type, or `undefined` when no schema could be produced.
 */
export function extractReflection<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(reflection: Type): JTDSchemaType<TMetadata> | undefined {
  if (!isType(reflection)) {
    return undefined;
  }

  return reflectionToJsonSchema<TMetadata>(reflection);
}

/**
 * Extracts a JSON Type Definition (RFC 8927) schema from a given schema definition, if possible.
 *
 * @remarks
 * This function checks if the provided input is a Zod schema, a Standard JSON Schema, or already a JSON Schema object, extracts a JSON Schema fragment via the appropriate adapter (Zod and Standard Schema produce draft-07 fragments), and then converts that fragment into a valid JTD form suitable for AJV's JTD validator.
 *
 * @param schema - The schema definition to extract from. This can be a Zod schema, a Standard JSON Schema, or a JSON Schema object.
 * @returns The extracted JTD schema if successful, otherwise undefined.
 */
export function extractJsonSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(schema: unknown): JTDSchemaType<TMetadata> | undefined {
  if (
    isSetObject(schema) &&
    (isZod3Type(schema) ||
      isStandardJsonSchema(schema) ||
      isJsonSchemaObjectType(schema) ||
      isUntypedInput(schema) ||
      isUntypedSchema(schema))
  ) {
    let jsonSchema: unknown;
    if (isZod3Type(schema)) {
      jsonSchema = extractJsonSchemaZod(schema);
    } else if (isStandardJsonSchema(schema)) {
      jsonSchema = schema["~standard"].jsonSchema.input({
        target: "draft-07"
      });
    } else if (isUntypedInput(schema)) {
      jsonSchema = schema.$schema;
    } else {
      jsonSchema = schema;
    }

    const jtd = jsonSchemaToJtd<TMetadata>(jsonSchema as JsonSchemaLike);
    if (jtd) {
      return jtd;
    }
  }

  return undefined;
}

/**
 * Extracts a schema definition from a given input object, which can be a Zod schema, a Standard JSON Schema, a JSON Schema object, or a reflected Deepkit Type object. The function checks the type of the input and attempts to extract the corresponding schema based on its variant. If the input is a Zod schema, it extracts the JSON Schema using the `extractJsonSchema` function. If the input is a Standard JSON Schema, it retrieves the JSON Schema targeting draft-07. If the input is already a JSON Schema object, it uses it directly. If the input is a reflected Deepkit Type object, it extracts the schema using the `extractReflection` function. The function returns a `Schema` containing the extracted schema and its variant if successful; otherwise, it throws an error.
 *
 * @param input - The input object to extract the schema definition from.
 * @returns A `Schema` containing the extracted schema and its variant if successful.
 * @throws An error if the input does not contain a valid schema definition.
 */
export function extractResolvedVariant(
  input: SchemaSourceInput
): SchemaSourceVariant {
  if (isSetObject(input)) {
    if (isZod3Type(input)) {
      return "zod3";
    } else if (isStandardJsonSchema(input)) {
      return "standard-schema";
    } else if (isJTDSchema(input)) {
      return "jtd-schema";
    } else if (isJsonSchemaObjectType(input)) {
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

/**
 * Extracts a schema definition from a given input object, which can be a Zod schema, a Standard JSON Schema, a JSON Schema object, a reflected Deepkit Type object, or an Untyped schema. The function checks the type of the input and attempts to extract the corresponding schema based on its variant. If the input is a Zod schema, it extracts the JSON Schema using the `extractJsonSchema` function. If the input is a Standard JSON Schema, it retrieves the JSON Schema targeting draft-07. If the input is already a JSON Schema object, it uses it directly. If the input is a reflected Deepkit Type object, it extracts the schema using the `extractReflection` function. The function returns a `Schema` containing the extracted schema and its variant if successful; otherwise, it throws an error.
 *
 * @param input - The input object to extract the schema definition from.
 * @returns A `Schema` containing the extracted schema and its variant if successful.
 * @throws An error if the input does not contain a valid schema definition.
 */
export function extractVariant(input: SchemaInput): SchemaInputVariant {
  if (isSetString(input) || isTypeDefinition(input)) {
    return "type-definition";
  }

  return extractResolvedVariant(input as SchemaSourceInput);
}

/**
 * Extracts a JSON Schema object from a given schema definition input. The input can be a Zod schema, a Standard JSON Schema, a JSON Schema object, or a reflected Deepkit Type object. The function checks the type of the input and attempts to extract the corresponding JSON Schema based on its variant. If the input is a Zod schema, it extracts the JSON Schema using the `extractJsonSchema` function. If the input is a Standard JSON Schema, it retrieves the JSON Schema targeting draft-07. If the input is already a JSON Schema object, it uses it directly. If the input is a reflected Deepkit Type object, it extracts the schema using the `extractReflection` function. The function returns the extracted JSON Schema if successful; otherwise, it throws an error.
 *
 * @param input - The schema definition input to extract the JSON Schema from. This can be a Zod schema, a Standard JSON Schema, a JSON Schema object, or a TypeScript type definition.
 * @param variant - The variant of the schema definition to extract.
 * @returns The extracted JSON Schema if successful.
 * @throws An error if the input does not contain a valid schema definition.
 */
export async function extractSchemaSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(
  input: SchemaSourceInput,
  variant?: SchemaInputVariant
): Promise<JTDSchemaType<TMetadata>> {
  if (isExtractedSchema<TMetadata>(input)) {
    return input.schema;
  }

  const resolvedVariant = variant ?? extractResolvedVariant(input);

  let schema: JTDSchemaType<TMetadata> | undefined;
  if (
    resolvedVariant === "zod3" ||
    resolvedVariant === "json-schema" ||
    resolvedVariant === "standard-schema" ||
    resolvedVariant === "untyped"
  ) {
    const jsonSchema = extractJsonSchema<TMetadata>(input);
    if (jsonSchema) {
      schema = jsonSchemaToJtd<TMetadata>(jsonSchema);
    }
  } else if (resolvedVariant === "reflection") {
    schema = extractReflection<TMetadata>(input as Type);
  } else if (resolvedVariant === "jtd-schema") {
    schema = input as JTDSchemaType<TMetadata>;
  }

  if (schema) {
    return schema;
  }

  throw new Error(
    `Failed to extract a valid schema from the provided input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, a JTD schema, an untyped schema, or a reflected Deepkit Type object.`
  );
}

/**
 * Extracts a schema definition from a given input object, which can be a Zod schema, a Standard JSON Schema, a JSON Schema object, a JTD schema, an untyped schema, or a reflected Deepkit Type object. The function checks the type of the input and attempts to extract the corresponding schema based on its variant. If the input is a Zod schema, it extracts the JSON Schema using the `extractJsonSchema` function. If the input is a Standard JSON Schema, it retrieves the JSON Schema targeting draft-07. If the input is already a JSON Schema object, it uses it directly. If the input is a reflected Deepkit Type object, it extracts the schema using the `extractReflection` function. The function returns a `Schema` containing the extracted schema and its variant if successful; otherwise, it throws an error.
 *
 * @param variant - The variant of the schema definition to extract.
 * @param input - The input object to extract the schema definition from.
 * @returns A `Schema` containing the extracted schema and its variant if successful.
 * @throws An error if the input does not contain a valid schema definition.
 */
export function extractSource<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(variant: SchemaSourceVariant, input: SchemaSourceInput): SchemaSource {
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
      schema: input as JsonSchemaType
    };
  } else if (variant === "reflection") {
    return {
      hash: extractHash(variant, input),
      variant: "reflection",
      schema: input as Type
    };
  } else if (variant === "jtd-schema") {
    return {
      hash: extractHash(variant, input),
      variant: "jtd-schema",
      schema: input as JTDSchemaType<TMetadata>
    };
  }

  throw new Error(
    `Failed to extract source information from the provided input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, a JTD schema, an untyped schema, or a reflected Deepkit Type object.`
  );
}

/**
 * Resolves the provided entry points to their corresponding type definitions. The function accepts an array of entry points, which can be strings (file paths) or type definition objects. It processes each entry point, resolving file paths and glob patterns to find matching files. For each resolved file, it creates a type definition object and resolves it using the `resolveInput` function. The function returns an array of resolved entry type definitions.
 *
 * @example
 * ```ts
 * // Resolve a schema definition from a file path
 * const schema1 = await extractSchema(context, "./schemas.ts#MySchema");
 * // Resolve a schema definition from a JSON Schema object
 * const schema2 = await extractSchema(context, schemaObject);
 * // Resolve a schema definition from a Zod schema
 * const schema3 = await extractSchema(context, zodSchema);
 * // Resolve a schema definition from a reflected Deepkit Type object
 * const schema4 = await extractSchema(context, reflectionType);
 * ```
 *
 * @param context - The plugin context used for resolving the schema definition input.
 * @param input - The schema definition input to extract the JSON Schema from. This can be a Zod schema, a Standard JSON Schema, a JSON Schema object, or a TypeScript type definition.
 * @param options - Optional overrides for the ESBuild configuration used during resolution.
 * @returns A promise that resolves to a {@link ExtractedSchema} containing the extracted JSON Schema and its variant, or the bytecode if JSON Schema extraction is not possible.
 */
export async function extractSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>,
  TContext extends Context = Context
>(
  context: TContext,
  input: SchemaInput,
  options: Partial<BuildOptions> = {}
): Promise<ExtractedSchema<TMetadata>> {
  if (isExtractedSchema<TMetadata>(input)) {
    return input;
  }

  if (isSchema<TMetadata>(input)) {
    return {
      ...input,
      source: {
        hash: extractHash("jtd-schema", input.schema),
        variant: "jtd-schema",
        schema: input.schema
      }
    };
  }

  let source: SchemaSource;

  const variant = extractVariant(input);
  if (variant === "type-definition") {
    const resolved = await resolve<SchemaSourceInput>(
      context,
      input as TypeDefinitionReference,
      defu(options, {
        plugins: [
          esbuildPlugin(context, {
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
      "jtd-schema",
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
      }". The variant must be one of "type-definition", "json-schema", "jtd-schema", "standard-schema", "zod3", "untyped", or "reflection".`
    );
  }

  return {
    variant,
    source,
    schema: await extractSchemaSchema<TMetadata>(source.schema, source.variant),
    hash: extractHash(variant, input)
  };
}

/**
 * Resolves the provided entry points to their corresponding type definitions. The function accepts an array of entry points, which can be strings (file paths) or type definition objects. It processes each entry point, resolving file paths and glob patterns to find matching files. For each resolved file, it creates a type definition object and resolves it using the `resolveInput` function. The function returns an array of resolved entry type definitions.
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
 * @param context - The {@link Context | context} used for resolving the {@link Schema | schema} definition input.
 * @param input - The input object or string to extract the {@link Schema | schema} from. This can be {@link TypeDefinitionReference | a string that references a Typescript module}, a [Zod v3 schema](https://github.com/colinhacks/zod), any type that adheres to [the Standard JSON Schema specification](https://standardschema.dev/json-schema#what-schema-libraries-support-this-spec), a [JSON Schema object](https://json-schema.org/), a [JTD schema object](https://ajv.js.org/json-type-definition.html), an [untyped schema](https://github.com/unjs/untyped), or a [TypeScript type reflection](https://deepkit.io/en/documentation/runtime-types/reflection).
 * @param options - Optional overrides for the [ESBuild configuration](https://esbuild.github.io/api/#general-options) used during resolution.
 * @returns A promise that resolves to a {@link Schema | schema} object parsed from the input.
 */
export async function extract<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>,
  TContext extends Context = Context
>(
  context: TContext,
  input: SchemaInput,
  options: Partial<BuildOptions> = {}
): Promise<Schema<TMetadata>> {
  const result = await extractSchema<TMetadata>(context, input, options);

  return result;
}
