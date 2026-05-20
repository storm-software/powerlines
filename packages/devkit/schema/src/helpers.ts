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

import { isSetObject } from "@stryke/type-checks";
import { defu } from "defu";
import { isPropertyOptional, isSchemaNullable } from "./metadata";
import { isJsonSchemaObject, isSchema } from "./type-checks";
import { JsonSchema, JsonSchemaLike, Schema } from "./types";

/**
 * Extracts object properties from a JSON Schema object form.
 */
export function getProperties<T = unknown>(
  obj: Schema<Record<string, T>> | JsonSchema<Record<string, T>>
): Record<string, T> {
  const properties: Record<string, T> = {};
  const schema: JsonSchema<Record<string, T>> = isSchema<Record<string, T>>(obj)
    ? obj.schema
    : obj;
  if (!isJsonSchemaObject(schema) || !isSetObject(schema.properties)) {
    return properties;
  }

  for (const [key, value] of Object.entries(schema.properties)) {
    properties[key] = {
      ...value,
      name: key,
      optional: isPropertyOptional(schema, key),
      nullable: isSchemaNullable(value as JsonSchemaLike)
    } as T;
  }

  return properties;
}

/**
 * Returns object properties as an array.
 */
export function getPropertiesList<T = unknown>(
  obj: Schema<Record<string, T>> | JsonSchema<Record<string, T>>
): Array<T> {
  return Object.values(getProperties<T>(obj));
}

/**
 * Adds a property to a JSON Schema object form.
 */
export function addProperty<T = unknown>(
  obj: Schema<Record<string, T>> | JsonSchema<Record<string, T>>,
  name: string,
  property: JsonSchema
) {
  const schema: JsonSchema<Record<string, T>> = isSchema<Record<string, T>>(obj)
    ? obj.schema
    : obj;
  if (!isJsonSchemaObject(schema)) {
    throw new Error("Cannot add property to non-object schema");
  }

  schema.properties ??= {};
  schema.required ??= [];

  schema.properties[name] = { ...property, name };
  if (property?.optional) {
    schema.required = schema.required.filter(key => key !== name);
  } else if (!schema.required.includes(name)) {
    schema.required.push(name);
  }

  if (schema.required.length === 0) {
    delete schema.required;
  }
}

/**
 * Merges multiple JSON Schema object forms into one.
 */
export function mergeSchemas<T = unknown>(
  ...schemas: (JsonSchema<T> | Schema<T>)[]
): JsonSchema<T> {
  const result: JsonSchema<T> = {} as JsonSchema<T>;
  for (const schema of schemas) {
    const jsonSchema: JsonSchema<T> = isSchema<T>(schema)
      ? schema.schema
      : schema;
    if (!isJsonSchemaObject(jsonSchema)) {
      continue;
    }

    defu(result, jsonSchema);
  }

  return result;
}
