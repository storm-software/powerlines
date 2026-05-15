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

import { isJsonSchemaObjectType } from "@stryke/json/schema";
import { isFunction, isSetObject, isSetString } from "@stryke/type-checks";
import { JTDSchemaType } from "ajv/dist/types/jtd-schema";
import {
  InputObject as UntypedInputObject,
  Schema as UntypedSchema
} from "untyped";
import { ExtractedSchema, Schema, SchemaMetadata } from "./types";

/**
 * Type guard to check if a given input is a [JSON Type Definition (JTD) schema object](https://tools.ietf.org/html/rfc8927). This function verifies that the input is a non-null object, contains a `jtd` property that is set to `true`, and has a `schema` property that is a JSON Schema (draft-07) object. If all these conditions are met, the function returns `true`, indicating that the input is a valid JTD schema; otherwise, it returns `false`.
 *
 * @param input - The input to check for being a [JTD schema](https://tools.ietf.org/html/rfc8927).
 * @returns `true` if the input is a [JTD schema](https://tools.ietf.org/html/rfc8927), otherwise `false`.
 */
export function isJTDSchema<TMetadata extends SchemaMetadata = SchemaMetadata>(
  input: unknown
): input is JTDSchemaType<TMetadata> {
  return isJsonSchemaObjectType(input) && "jtd" in input && input.jtd === true;
}

/**
 * Type guard to check if a given input is an [untyped](https://github.com/unjs/untyped) {@link UntypedSchema | Schema} object. This function verifies that the input is a non-null object whose optional metadata properties (`id`, `title`, `description`, `$schema`, `tsType`, `markdownType`, `type`, `required`, `tags`, `args`, `properties`, and `resolve`) - when present - match the shapes declared by `untyped`'s [`Schema`](https://github.com/unjs/untyped/blob/main/src/types.ts) interface.
 *
 * @param input - The input to check for being an [untyped](https://github.com/unjs/untyped) schema.
 * @returns `true` if the input is an [untyped](https://github.com/unjs/untyped) schema, otherwise `false`.
 */
export function isUntypedSchema(input: unknown): input is UntypedSchema {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if ("id" in schema && !isSetString(schema.id)) {
    return false;
  }
  if ("title" in schema && !isSetString(schema.title)) {
    return false;
  }
  if ("description" in schema && !isSetString(schema.description)) {
    return false;
  }
  if ("$schema" in schema && !isSetString(schema.$schema)) {
    return false;
  }
  if ("tsType" in schema && !isSetString(schema.tsType)) {
    return false;
  }
  if ("markdownType" in schema && !isSetString(schema.markdownType)) {
    return false;
  }
  if (
    "type" in schema &&
    !isSetString(schema.type) &&
    !Array.isArray(schema.type)
  ) {
    return false;
  }
  if ("required" in schema && !Array.isArray(schema.required)) {
    return false;
  }
  if ("tags" in schema && !Array.isArray(schema.tags)) {
    return false;
  }
  if ("args" in schema && !Array.isArray(schema.args)) {
    return false;
  }
  if ("properties" in schema && !isSetObject(schema.properties)) {
    return false;
  }
  if ("resolve" in schema && !isFunction(schema.resolve)) {
    return false;
  }

  return true;
}

/**
 * Type guard to check if a given input is an [untyped](https://github.com/unjs/untyped) {@link UntypedInputObject | InputObject}. This function verifies that the input is a non-null object and that any `untyped`-reserved `$`-prefixed properties have the expected shape: `$schema` (when present) must satisfy {@link isUntypedSchema} and `$resolve` (when present) must be a function. See `untyped`'s [`InputObject`](https://github.com/unjs/untyped/blob/main/src/types.ts) interface for the canonical definition.
 *
 * @param input - The input to check for being an [untyped](https://github.com/unjs/untyped) input object.
 * @returns `true` if the input is an [untyped](https://github.com/unjs/untyped) input object, otherwise `false`.
 */
export function isUntypedInput(input: unknown): input is UntypedInputObject {
  if (!isSetObject(input)) {
    return false;
  }

  const inputObject = input as Record<string, unknown>;
  if ("$schema" in inputObject && !isUntypedSchema(inputObject.$schema)) {
    return false;
  }
  if ("$resolve" in inputObject && !isFunction(inputObject.$resolve)) {
    return false;
  }

  return true;
}

/**
 * Type guard to check if a given input is a {@link Schema} object. This function verifies that the input is a non-null object, contains a `schema` property that is a JSON Schema (draft-07) object, contains an `input` property that is a non-null object, and has a `variant` property that is one of the allowed schema variants ("json-schema", "standard-schema", "zod3", or "reflection"). If all these conditions are met, the function returns `true`, indicating that the input is a valid {@link Schema}; otherwise, it returns `false`.
 *
 * @param input - The input to check for being a {@link Schema}.
 * @returns `true` if the input is a {@link Schema}, otherwise `false`.
 */
export function isSchema<TMetadata extends SchemaMetadata = SchemaMetadata>(
  input: unknown
): input is Schema<TMetadata> {
  return (
    isSetObject(input) &&
    "schema" in input &&
    isJTDSchema(input.schema) &&
    "input" in input &&
    isSetObject(input.input) &&
    "variant" in input &&
    isSetString(input.variant)
  );
}

/**
 * Type guard to check if a given input is a {@link ExtractedSchema} object. This function verifies that the input is a non-null object, contains a `schema` property that is a JSON Schema (draft-07) object, contains an `input` property that is a non-null object, and has a `variant` property that is one of the allowed schema variants ("json-schema", "standard-schema", "zod3", or "reflection"). If all these conditions are met, the function returns `true`, indicating that the input is a valid {@link ExtractedSchema}; otherwise, it returns `false`.
 *
 * @param input - The input to check for being a {@link ExtractedSchema}.
 * @returns `true` if the input is a {@link ExtractedSchema}, otherwise `false`.
 */
export function isExtractedSchema<
  TMetadata extends SchemaMetadata = SchemaMetadata
>(input: unknown): input is ExtractedSchema<TMetadata> {
  return (
    isSchema<TMetadata>(input) &&
    "source" in input &&
    isSetObject(input.source) &&
    "schema" in input.source &&
    isJTDSchema(input.source.schema) &&
    "variant" in input.source &&
    isSetString(input.source.variant)
  );
}
