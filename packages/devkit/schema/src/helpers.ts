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

import { getUnique } from "@stryke/helpers/get-unique";
import { findFileExtensionSafe } from "@stryke/path/find";
import { isSetObject } from "@stryke/type-checks";
import { defu } from "defu";
import { VALID_SOURCE_FILE_EXTENSIONS } from "./constants";
import { readSchemaTypes } from "./metadata";
import { isJsonSchema, isJsonSchemaObject, isSchema } from "./type-checks";
import { JsonSchema, JsonSchemaLike, JsonSchemaObject, Schema } from "./types";

export type GetPropertiesResult = JsonSchema & {
  name: string;
  required: boolean;
  default?: unknown;
};

/**
 * Retrieves the JSON Schema from a Schema wrapper or returns the input if it's already a JSON Schema.
 *
 * @remarks
 * This function checks if the input is a Schema wrapper (an object with a `schema` property) and returns the `schema` if it is. If the input is already a JSON Schema, it returns it directly. This allows for flexibility in handling both raw JSON Schema objects and wrapped schemas without needing to check the type at every usage point.
 *
 * @param input - The input which can be either a Schema wrapper or a JSON Schema object.
 * @returns The JSON Schema object.
 * @throws Will throw a TypeError if the input is neither a valid Schema wrapper nor a valid JSON Schema object.
 */
export function getJsonSchema(input: Schema | JsonSchema): JsonSchema {
  const schema = isSchema(input) ? input.schema : input;
  if (!isJsonSchema(schema)) {
    throw new TypeError(
      `The provided input is not a valid JSON Schema: ${JSON.stringify(
        schema,
        null,
        2
      )}`
    );
  }

  return schema;
}

/**
 * Retrieves the JSON Schema in Object form from a Schema wrapper or returns the input if it's already a JSON Schema.
 *
 * @remarks
 * This function checks if the input is a Schema wrapper (an object with a `schema` property) and returns the `schema` if it is. If the input is already a JSON Schema object, it returns it directly. This allows for flexibility in handling both raw JSON Schema objects and wrapped schemas without needing to check the type at every usage point.
 *
 * @param input - The input which can be either a Schema wrapper or a JSON Schema object.
 * @returns The JSON Schema object.
 * @throws Will throw a TypeError if the input is neither a valid Schema wrapper nor a valid JSON Schema object.
 */
export function getJsonSchemaObject(
  input: Schema | JsonSchema
): JsonSchemaObject {
  const schema = getJsonSchema(input);
  if (!isJsonSchemaObject(schema)) {
    throw new TypeError(
      `The provided input is not a valid JSON Schema object: ${JSON.stringify(schema, null, 2)}`
    );
  }

  return schema;
}

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

  const schema = getJsonSchemaObject(obj);
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
  const schema = getJsonSchemaObject(obj);

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
 * Merges multiple JSON Schemas into one.
 *
 * @remarks
 * This function takes multiple JSON Schemas or Schema wrappers and merges them into a single JSON Schema object. The merging process combines properties and metadata from all provided schemas, with later schemas in the arguments list taking precedence over earlier ones in case of conflicts. The resulting schema will include all unique properties and metadata from the input schemas.
 *
 * @param schemas - An array of JSON Schemas or Schema wrappers to merge.
 * @returns A new JSON Schema that is the result of merging all input schemas.
 */
export function merge(...schemas: (JsonSchema | Schema)[]): JsonSchema {
  let result: JsonSchema = {};
  for (const schema of schemas.reverse()) {
    if (
      !(result as JsonSchemaLike).type ||
      (result as JsonSchemaLike).type === (schema as JsonSchemaLike).type
    ) {
      result = defu(result, getJsonSchema(schema)) as JsonSchema;
      if (isJsonSchemaObject(result)) {
        result.required = getUnique(result.required ?? []);
      }
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

/**
 * Checks if a given file name has a valid schema input file extension.
 *
 * @param fileName - The file name to check for a valid schema input extension.
 * @returns `true` if the file name has a valid schema input extension, otherwise `false`.
 */
export function isValidSchemaInputFile(fileName: string): boolean {
  return VALID_SOURCE_FILE_EXTENSIONS.includes(findFileExtensionSafe(fileName));
}
