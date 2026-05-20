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
  JsonSchemaLike,
  JsonSchemaObject,
  SchemaMetadata
} from "./types";

/**
 * Applies Powerlines schema metadata onto a JSON Schema fragment.
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
 */
export function isSchemaNullable(schema: JsonSchemaLike | undefined): boolean {
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
 */
export function isPropertyOptional(
  parent: JsonSchemaObject,
  propertyName: string
): boolean {
  const required = parent.required ?? [];

  return !required.includes(propertyName);
}

/**
 * Normalizes the JSON Schema `type` keyword to a string array.
 */
export function readSchemaTypes(schema: JsonSchemaLike): string[] {
  if (Array.isArray(schema.type)) {
    return schema.type.filter(isSetString);
  }
  if (isSetString(schema.type)) {
    return [schema.type];
  }
  return [];
}

/**
 * Returns the primary non-null JSON Schema type name for a fragment.
 */
export function getPrimarySchemaType(
  schema: JsonSchemaLike | undefined
): string | undefined {
  if (!isSetObject(schema)) {
    return undefined;
  }

  return readSchemaTypes(schema).find(type => type !== "null");
}
