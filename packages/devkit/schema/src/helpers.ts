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
import {
  JsonSchema,
  JsonSchemaObject,
  JsonSchemaProperty,
  Schema
} from "./types";

/**
 * Extracts object properties from a JSON Schema object form.
 *
 * @remarks
 * This function returns an empty object if the schema is not an object form or if it has no properties.
 *
 * @param obj - The JSON Schema object form or a Schema wrapper to extract properties from.
 * @returns An object mapping property names to their corresponding JSON Schema fragments, including metadata.
 */
export function getProperties<
  T extends Record<string, any> = Record<string, any>
>(obj: Schema<T> | JsonSchema<T>): Record<string, JsonSchemaProperty<T>> {
  const properties: Record<string, JsonSchemaProperty<T>> = {};
  const schema: JsonSchema<T> = isSchema<T>(obj) ? obj.schema : obj;
  if (!isJsonSchemaObject<T>(schema) || !isSetObject(schema.properties)) {
    return properties;
  }

  for (const [key, value] of Object.entries(schema.properties)) {
    properties[key] = {
      ...value,
      name: key,
      nullable: isSchemaNullable<T>(value) || isPropertyOptional(schema, key)
    };
  }

  return properties;
}

/**
 * Returns object properties as an array.
 *
 * @remarks
 * This is a convenience function that extracts properties using `getProperties` and returns them as an array.
 *
 * @param obj - The JSON Schema object form or a Schema wrapper to extract properties from.
 * @returns An array of JSON Schema fragments representing the properties, each including metadata.
 */
export function getPropertiesList<
  T extends Record<string, any> = Record<string, any>
>(obj: Schema<T> | JsonSchema<T>): Array<JsonSchemaProperty<T>> {
  return Object.values(getProperties<T>(obj));
}

/**
 * Adds a property to a JSON Schema object form.
 *
 * @remarks
 * This function modifies the provided schema in place by adding a new property with the specified name and schema. It also updates the `required` array based on the `optional` flag of the property. If the property is marked as optional, it will be removed from the `required` array; otherwise, it will be added to it.
 *
 * @param obj - The JSON Schema object form or a Schema wrapper to which the property should be added.
 * @param name - The name of the property to add.
 * @param property - The JSON Schema fragment representing the property's schema, including metadata.
 * @throws Will throw an error if the provided schema is not an object form.
 */
export function addProperty<
  T extends Record<string, any> = Record<string, any>
>(
  obj: Schema<T> | JsonSchema<T>,
  name: string,
  property: JsonSchemaProperty<T>
): void {
  const schema = (isSchema<T>(obj) ? obj.schema : obj) as JsonSchemaObject<T>;
  if (!isJsonSchemaObject<T>(schema)) {
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
 *
 * @remarks
 * This function takes multiple JSON Schema objects or Schema wrappers and merges them into a single JSON Schema object. The merging process combines properties and metadata from all provided schemas, with later schemas in the arguments list taking precedence over earlier ones in case of conflicts. The resulting schema will include all unique properties and metadata from the input schemas.
 *
 * @param schemas - An array of JSON Schema objects or Schema wrappers to merge.
 * @returns A new JSON Schema object that is the result of merging all input schemas.
 */
export function mergeSchemas<
  T extends Record<string, any> = Record<string, any>
>(...schemas: (JsonSchema<T> | Schema<T>)[]): JsonSchema<T> {
  const result: JsonSchema<T> = {} as JsonSchema<T>;
  for (const schema of schemas) {
    const jsonSchema: JsonSchema<T> = isSchema<T>(schema)
      ? schema.schema
      : schema;
    if (!isJsonSchemaObject<T>(jsonSchema)) {
      continue;
    }

    defu(result, jsonSchema);
  }

  return result;
}
