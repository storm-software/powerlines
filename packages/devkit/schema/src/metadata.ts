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

import { isSetString } from "@stryke/type-checks";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { JSON_SCHEMA_METADATA_KEYS } from "./constants";
import {
  JsonSchema,
  JsonSchemaMetadataKeywords,
  JsonSchemaPrimitiveType,
  JsonSchemaType
} from "./types";

interface JsonSchemaTypeView {
  type?: JsonSchemaType | readonly JsonSchemaType[];
}

/**
 * Applies Powerlines schema metadata onto a JSON Schema fragment.
 *
 * @param schema - The JSON Schema fragment to apply metadata to.
 * @param metadata - The Powerlines schema metadata to apply.
 * @returns A new JSON Schema fragment with the metadata applied.
 */
export function applyJsonSchemaMetadata(
  schema: JsonSchema,
  metadata: JsonSchemaMetadataKeywords | undefined
): JsonSchema {
  if (!metadata || !isSetObject(schema)) {
    return schema;
  }

  const result: JsonSchema = { ...schema };
  const mutableResult = result as Record<string, unknown>;
  for (const key of JSON_SCHEMA_METADATA_KEYS) {
    const value = metadata[key];
    if (value !== undefined && value !== null) {
      mutableResult[key] = value;
    }
  }

  return result;
}

/**
 * Normalizes the JSON Schema `type` keyword to a string array.
 *
 * @remarks
 * This function ensures that the `type` keyword of a JSON Schema fragment is always represented as an array of strings, even if it was originally defined as a single string. This normalization simplifies type checking and processing of JSON Schemas by providing a consistent format for the `type` information.
 *
 * @param schema - The JSON Schema fragment to read types from.
 * @returns An array of JSON Schema primitive type names defined in the `type` keyword, or an empty array if no valid types are found.
 */
export function readSchemaTypes(
  schema?: JsonSchema
): JsonSchemaPrimitiveType[] {
  if (!isSetObject(schema)) {
    return [];
  }

  const objectSchema = schema as JsonSchemaTypeView;

  if (Array.isArray(objectSchema.type)) {
    return objectSchema.type.filter(
      (type: JsonSchemaPrimitiveType): type is JsonSchemaPrimitiveType =>
        isSetString(type)
    );
  }
  if (
    isSetString(objectSchema.type) &&
    objectSchema.type !== "object" &&
    objectSchema.type !== "array"
  ) {
    return [objectSchema.type];
  }
  return [];
}

/**
 * Returns the primary non-null JSON Schema type name for a fragment.
 *
 * @param schema - The JSON Schema fragment to check.
 * @returns The primary non-null JSON Schema type name, or `undefined` if none is found.
 */
export function getPrimarySchemaType(
  schema?: JsonSchema
): JsonSchemaPrimitiveType | undefined {
  if (!isSetObject(schema)) {
    return undefined;
  }

  return readSchemaTypes(schema).find(type => type !== "null");
}
