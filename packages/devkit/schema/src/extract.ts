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
import {
  isJsonSchemaObjectType,
  isStandardJsonSchema,
  JsonSchemaType
} from "@stryke/json";
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
import { jtdToJsonSchema } from "./jtd";
import { getCacheDirectory, writeSchema } from "./persistence";
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
 * Creates a hash string for a given schema definition input.
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
 * Converts a reflected Deepkit {@link Type} into a JSON Schema (draft-07) representation.
 */
export function extractReflection<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(reflection: Type): JsonSchemaType | undefined {
  if (!isType(reflection)) {
    return undefined;
  }

  return reflectionToJsonSchema<TMetadata>(reflection);
}

/**
 * Extracts a JSON Schema from Zod, Standard Schema, untyped, or JSON Schema inputs.
 */
export function extractJsonSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(schema: unknown): JsonSchemaType | undefined {
  if (
    isSetObject(schema) &&
    (isZod3Type(schema) ||
      isStandardJsonSchema(schema) ||
      isJsonSchemaObjectType(schema) ||
      isUntypedInput(schema) ||
      isUntypedSchema(schema))
  ) {
    if (isZod3Type(schema)) {
      return extractJsonSchemaZod(schema) as JsonSchemaType;
    }
    if (isStandardJsonSchema(schema)) {
      return schema["~standard"].jsonSchema.input({
        target: "draft-2020-12"
      }) as JsonSchemaType;
    }
    if (isUntypedInput(schema)) {
      return schema.$schema as JsonSchemaType;
    }
    return schema as JsonSchemaType;
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

export function extractVariant(input: SchemaInput): SchemaInputVariant {
  if (isSetString(input) || isTypeDefinition(input)) {
    return "type-definition";
  }

  return extractResolvedVariant(input as SchemaSourceInput);
}

export async function extractSchemaSchema<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>
>(
  input: SchemaSourceInput,
  variant?: SchemaInputVariant
): Promise<JsonSchemaType> {
  if (isExtractedSchema<TMetadata>(input)) {
    return input.schema;
  }

  const resolvedVariant = variant ?? extractResolvedVariant(input);

  let schema: JsonSchemaType | undefined;
  if (
    resolvedVariant === "zod3" ||
    resolvedVariant === "json-schema" ||
    resolvedVariant === "standard-schema" ||
    resolvedVariant === "untyped"
  ) {
    schema = extractJsonSchema<TMetadata>(input);
  } else if (resolvedVariant === "reflection") {
    schema = extractReflection<TMetadata>(input as Type);
  } else if (resolvedVariant === "jtd-schema") {
    schema = jtdToJsonSchema<TMetadata>(input as JTDSchemaType<TMetadata>);
  }

  if (schema) {
    return schema;
  }

  throw new Error(
    `Failed to extract a valid schema from the provided input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, a JTD schema, an untyped schema, or a reflected Deepkit Type object.`
  );
}

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
    hash
  };
}

/**
 * Extracts and normalises a schema definition to JSON Schema.
 *
 * @see https://json-schema.org/
 * @see https://ajv.js.org/json-schema.html
 */
export async function extract<
  TMetadata extends Partial<SchemaMetadata> = Partial<SchemaMetadata>,
  TContext extends Context = Context
>(
  context: TContext,
  input: SchemaInput,
  options: Partial<BuildOptions> = {}
): Promise<Schema<TMetadata>> {
  if (isExtractedSchema<TMetadata>(input) || isSchema<TMetadata>(input)) {
    return input;
  }

  let result: Schema<TMetadata> | undefined;

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
        schema: JSON.parse(schema) as JsonSchemaType
      };
    }
  }

  result ??= await extractSchema<TMetadata>(context, input, options);
  if (!result?.schema) {
    throw new Error(
      `Failed to extract a valid schema from the provided input. The input must be a Zod schema, a Standard JSON Schema, a JSON Schema object, a JTD schema, an untyped schema, or a reflected Deepkit Type object.`
    );
  }

  if (context.config.skipCache !== true) {
    await writeSchema(context, result);
  }

  return result;
}
