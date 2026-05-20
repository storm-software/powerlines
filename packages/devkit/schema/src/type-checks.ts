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

import { isJsonSchemaObjectType } from "@stryke/json";
import {
  isFunction,
  isObject,
  isSetObject,
  isSetString
} from "@stryke/type-checks";
import { JsonSchemaType } from "@stryke/json/types";
import {
  InputObject as UntypedInputObject,
  Schema as UntypedSchema
} from "untyped";
import {
  ExtractedSchema,
  JsonSchemaObjectType,
  ObjectSchema,
  Schema,
  SchemaMetadata
} from "./types";

/**
 * Type guard for JSON Schema object forms.
 */
export function isJsonSchemaObject<
  TMetadata extends SchemaMetadata = SchemaMetadata
>(input: unknown): input is JsonSchemaObjectType<TMetadata> {
  return (
    isJsonSchemaObjectType(input) &&
    (input.type === "object" || isObject(input.properties))
  );
}

/**
 * Type guard for legacy JTD-shaped schemas (still accepted as input).
 */
export function isJTDSchemaObject<
  TMetadata extends SchemaMetadata = SchemaMetadata
>(input: unknown): input is JsonSchemaObjectType<TMetadata> {
  if (!isSetObject(input)) {
    return false;
  }

  if (isJsonSchemaObject<TMetadata>(input)) {
    return true;
  }

  return (
    ("properties" in input && isObject(input.properties)) ||
    ("optionalProperties" in input && isObject(input.optionalProperties))
  );
}

/**
 * Type guard for JSON Schema fragments (including legacy JTD input shapes).
 */
export function isJTDSchema<TMetadata extends SchemaMetadata = SchemaMetadata>(
  input: unknown
): input is JsonSchemaType {
  if (!isSetObject(input)) {
    return false;
  }

  if (isJsonSchemaObjectType(input)) {
    return true;
  }

  return (
    isJTDSchemaObject<TMetadata>(input) ||
    "elements" in input ||
    "values" in input ||
    "ref" in input ||
    ("type" in input &&
      isSetString(input.type) &&
      !["object", "array", "string", "number", "integer", "boolean", "null"].includes(
        input.type
      )) ||
    "enum" in input ||
    ("discriminator" in input &&
      isSetString(input.discriminator) &&
      "mapping" in input &&
      isObject(input.mapping))
  );
}

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

export function isSchema<TMetadata extends SchemaMetadata = SchemaMetadata>(
  input: unknown
): input is Schema<TMetadata> {
  return (
    isSetObject(input) &&
    "schema" in input &&
    isJsonSchemaObjectType(input.schema) &&
    "variant" in input &&
    isSetString(input.variant) &&
    "hash" in input &&
    isSetString(input.hash)
  );
}

export function isExtractedSchema<
  TMetadata extends SchemaMetadata = SchemaMetadata
>(input: unknown): input is ExtractedSchema<TMetadata> {
  return (
    isSchema<TMetadata>(input) &&
    "source" in input &&
    isSetObject(input.source) &&
    "schema" in input.source &&
    "variant" in input.source &&
    isSetString(input.source.variant)
  );
}

export function isObjectSchema<
  TMetadata extends SchemaMetadata = SchemaMetadata
>(input: unknown): input is ObjectSchema<TMetadata> {
  return isSchema<TMetadata>(input) && isJsonSchemaObject<TMetadata>(input.schema);
}
