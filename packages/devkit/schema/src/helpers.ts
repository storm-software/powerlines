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
 * Keywords whose values are a flat record of named JSON Schema fragments.
 * Each child schema is merged recursively with its counterpart.
 */
const SCHEMA_RECORD_KEYWORDS = new Set([
  "properties",
  "patternProperties",
  "$defs",
  "definitions",
  "dependentSchemas"
]);

/**
 * Keywords whose value is a single JSON Schema fragment that should be
 * recursively merged when both sides define it.
 */
const SCHEMA_SINGLE_KEYWORDS = new Set([
  "if",
  "then",
  "else",
  "not",
  "contains",
  "items",
  "additionalProperties",
  "unevaluatedProperties",
  "propertyNames",
  "unevaluatedItems"
]);

/**
 * Keywords whose values are arrays of JSON Schema fragments that should be
 * concatenated (rather than overridden) during a merge.
 */
const SCHEMA_ARRAY_CONCAT_KEYWORDS = new Set(["allOf", "anyOf", "oneOf"]);

/**
 * Recursively merges two JSON Schema fragments. `override` wins for any scalar
 * key that both schemas define, while structured keywords are handled
 * specially:
 *
 * - `properties`, `patternProperties`, `$defs`, `definitions`,
 *   `dependentSchemas` — each matching child schema is merged recursively.
 * - `allOf`, `anyOf`, `oneOf` — arrays are concatenated.
 * - `if`, `then`, `else`, `not`, `contains`, `items`,
 *   `additionalProperties`, `unevaluatedProperties`, `propertyNames`,
 *   `unevaluatedItems` — merged recursively when both sides are schemas.
 * - `required` — arrays are unioned and deduplicated.
 */
function mergeTwo(base: JsonSchema, override: JsonSchema): JsonSchema {
  const baseObj = base as Record<string, unknown>;
  const result: Record<string, unknown> = { ...baseObj };

  for (const [key, overrideValue] of Object.entries(
    override as Record<string, unknown>
  )) {
    const baseValue = result[key];

    if (key === "required") {
      result[key] = getUnique([
        ...(Array.isArray(baseValue) ? (baseValue as string[]) : []),
        ...(Array.isArray(overrideValue) ? (overrideValue as string[]) : [])
      ]);
    } else if (
      SCHEMA_RECORD_KEYWORDS.has(key) &&
      isSetObject(baseValue) &&
      isSetObject(overrideValue)
    ) {
      const merged: Record<string, unknown> = {
        ...(baseValue as Record<string, unknown>)
      };
      for (const [childKey, childOverride] of Object.entries(
        overrideValue as Record<string, unknown>
      )) {
        const childBase = merged[childKey];
        merged[childKey] =
          isJsonSchema(childBase) && isJsonSchema(childOverride)
            ? mergeTwo(childBase, childOverride)
            : childOverride;
      }
      result[key] = merged;
    } else if (
      SCHEMA_ARRAY_CONCAT_KEYWORDS.has(key) &&
      Array.isArray(baseValue) &&
      Array.isArray(overrideValue)
    ) {
      result[key] = [
        ...(baseValue as JsonSchema[]),
        ...(overrideValue as JsonSchema[])
      ];
    } else if (
      SCHEMA_SINGLE_KEYWORDS.has(key) &&
      isJsonSchema(baseValue) &&
      isJsonSchema(overrideValue)
    ) {
      result[key] = mergeTwo(baseValue, overrideValue);
    } else {
      result[key] = overrideValue;
    }
  }

  return result;
}

/**
 * Merges multiple JSON Schemas into one.
 *
 * @remarks
 * This function takes multiple JSON Schemas or Schema wrappers and merges them
 * into a single JSON Schema object. Later schemas in the argument list take
 * precedence over earlier ones for scalar conflicts.
 *
 * Structured keywords are merged recursively:
 * - Named child schemas (`properties`, `$defs`, etc.) are merged
 *   per-property via recursive calls to `merge`.
 * - Composition arrays (`allOf`, `anyOf`, `oneOf`) are concatenated.
 * - Single-schema keywords (`if`, `then`, `else`, `not`, `items`, etc.)
 *   are merged recursively when both sides define them.
 * - `required` arrays are unioned and deduplicated.
 *
 * @param schemas - An array of JSON Schemas or Schema wrappers to merge.
 * @returns A new JSON Schema that is the result of merging all input schemas.
 */
export function merge(...schemas: (JsonSchema | Schema)[]): JsonSchema {
  const jsonSchemas = schemas.map(s => getJsonSchema(s));
  if (jsonSchemas.length === 0) {
    return {};
  }

  return jsonSchemas.reduce((acc, schema) => {
    const accType = (acc as JsonSchemaLike).type;
    const schemaType = (schema as JsonSchemaLike).type;

    if (accType && schemaType && accType !== schemaType) {
      // Incompatible types — the later schema wins entirely.
      return schema;
    }

    return mergeTwo(acc, schema);
  });
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
