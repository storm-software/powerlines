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
import { readSchemaTypes } from "./metadata";
import { isJsonSchemaObject, isSchema } from "./type-checks";
import { JsonSchema, JsonSchemaObject, Schema } from "./types";

export type GetPropertiesResult = JsonSchema & {
  name: string;
  required: boolean;
  default?: unknown;
};

/**
 * Extracts object properties from a JSON Schema object form.
 *
 * @remarks
 * This function returns an empty object if the schema is not an object form or if it has no properties.
 *
 * @param obj - The JSON Schema object form or a Schema wrapper to extract properties from.
 * @returns An object mapping property names to their corresponding JSON Schema fragments, including metadata.
 */
export function getProperties(
  obj: Schema | JsonSchemaObject
): Record<
  string,
  JsonSchema & { name: string; required: boolean; default?: unknown }
> {
  const properties: Record<
    string,
    JsonSchema & { name: string; required: boolean; default?: unknown }
  > = {};
  const schema: JsonSchema = isSchema(obj) ? obj.schema : obj;
  if (!isJsonSchemaObject(schema)) {
    return properties;
  }

  if (!isSetObject(schema.properties)) {
    return properties;
  }

  for (const [key, value] of Object.entries(schema.properties)) {
    const propertySchema: Record<string, unknown> = {};

    if (typeof value !== "boolean") {
      Object.assign(propertySchema, value);
    }

    properties[key] = {
      ...propertySchema,
      name: key,
      required: !isPropertyOptional(schema, key),
      default: schema.default?.[key] ?? propertySchema.default
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
export function getPropertiesList(obj: Schema | JsonSchemaObject) {
  return Object.values(getProperties(obj));
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
export function addProperty(
  obj: Schema | JsonSchemaObject,
  name: string,
  property: JsonSchema
): void {
  const schema = (isSchema(obj) ? obj.schema : obj) as JsonSchemaObject;
  if (!isJsonSchemaObject(schema)) {
    throw new Error("Cannot add property to non-object schema");
  }

  schema.properties ??= {};
  schema.required ??= [];

  schema.properties[name] = { ...property, name };
  if (!schema.required.includes(name)) {
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
export function mergeSchemas(...schemas: (JsonSchema | Schema)[]): JsonSchema {
  const result: JsonSchema = {};
  for (const schema of schemas) {
    const jsonSchema: JsonSchema = isSchema(schema) ? schema.schema : schema;
    if (!isJsonSchemaObject(jsonSchema)) {
      continue;
    }

    defu(result, jsonSchema);
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
export function isSchemaNullable(schema?: JsonSchema): boolean {
  if (!isSetObject(schema)) {
    return false;
  }

  if ((schema as { nullable?: true }).nullable === true) {
    return true;
  }

  return readSchemaTypes(schema).includes("null");
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
export function isPropertyOptional(
  parent: JsonSchemaObject,
  propertyName: string
): boolean {
  if (!parent.properties?.[propertyName]) {
    throw new Error(
      `The property "${propertyName}" does not exist in the parent schema.`
    );
  }

  return !(parent.required ?? []).includes(propertyName);
}
