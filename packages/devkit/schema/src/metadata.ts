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

import { isSetString } from "@stryke/type-checks";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { JSON_SCHEMA_METADATA_KEYS } from "./constants";
import {
  JsonSchema,
  JsonSchemaObject,
  JsonSchemaPrimitiveType,
  SchemaMetadata
} from "./types";

/**
 * Applies Powerlines schema metadata onto a JSON Schema fragment.
 *
 * @param schema - The JSON Schema fragment to apply metadata to.
 * @param metadata - The Powerlines schema metadata to apply.
 * @returns A new JSON Schema fragment with the metadata applied.
 */
export function applySchemaMetadata<
  T = unknown,
  TMetadata extends SchemaMetadata = SchemaMetadata
>(schema: JsonSchema<T>, metadata: TMetadata | undefined): JsonSchema<T> {
  if (!metadata) {
    return schema;
  }

  const result: JsonSchema<T> = { ...schema };
  for (const key of JSON_SCHEMA_METADATA_KEYS) {
    const value = metadata[key];
    if (value !== undefined && value !== null) {
      result[key as keyof JsonSchema<T>] = value;
    }
  }

  return result;
}

/**
 * Returns whether a JSON Schema fragment accepts `null`.
 *
 * @remarks
 * This is true if the schema has `nullable: true` or if its `type` includes `"null"`.
 *
 * @param schema - The JSON Schema fragment to check.
 * @returns `true` if the schema accepts `null`, otherwise `false`.
 */
export function isSchemaNullable<T = unknown>(schema?: JsonSchema<T>): boolean {
  if (!isSetObject(schema)) {
    return false;
  }

  if (schema.nullable === true) {
    return true;
  }

  const types = readSchemaTypes(schema);

  return types.includes("null");
}

/**
 * Returns whether an object property is optional (not listed in `required`).
 *
 * @remarks
 * In JSON Schema, object properties are optional by default unless they are listed in the `required` array of the parent schema. This function checks whether a given property name is not included in the `required` array of its parent schema, indicating that it is optional.
 *
 * @param parent - The parent JSON Schema object containing the property.
 * @param propertyName - The name of the property to check for optionality.
 * @returns `true` if the property is optional, otherwise `false`.
 */
export function isPropertyOptional<
  T extends Record<string, any> = Record<string, any>
>(parent: JsonSchemaObject<T>, propertyName: string): boolean {
  const required = parent.required ?? [];

  return !required.includes(propertyName);
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
export function readSchemaTypes<T = unknown>(
  schema?: JsonSchema<T>
): JsonSchemaPrimitiveType[] {
  if (Array.isArray(schema?.type)) {
    return schema.type.filter(isSetString) as JsonSchemaPrimitiveType[];
  }
  if (isSetString(schema?.type)) {
    return [schema.type as JsonSchemaPrimitiveType];
  }
  return [];
}

/**
 * Returns the primary non-null JSON Schema type name for a fragment.
 *
 * @param schema - The JSON Schema fragment to check.
 * @returns The primary non-null JSON Schema type name, or `undefined` if none is found.
 */
export function getPrimarySchemaType<T = unknown>(
  schema?: JsonSchema<T>
): JsonSchemaPrimitiveType | undefined {
  if (!isSetObject(schema)) {
    return undefined;
  }

  return readSchemaTypes(schema).find(type => type !== "null");
}
