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
import {
  InputObject as UntypedInputObject,
  Schema as UntypedSchema
} from "untyped";
import { JSON_SCHEMA_DATA_TYPES } from "./constants";
import { ExtractedSchema, JsonSchema, JsonSchemaObject, Schema } from "./types";

type JsonSchemaDataType = (typeof JSON_SCHEMA_DATA_TYPES)[number];

const JSON_SCHEMA_DATA_TYPE_SET = new Set<JsonSchemaDataType>(
  JSON_SCHEMA_DATA_TYPES
);

type SchemaKeywordValidator = (value: unknown) => boolean;

const isSetNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isSetBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

const isNonNegativeInteger = (value: unknown): value is number =>
  Number.isInteger(value) && (value as number) >= 0;

const isSchemaLikeValue = (value: unknown): boolean =>
  isSetObject(value) || isSetBoolean(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => isSetString(item));

const isRecordOfStringArrays = (
  value: unknown
): value is Record<string, string[]> =>
  isSetObject(value) && Object.values(value).every(item => isStringArray(item));

const TYPE_KEYWORD_VALIDATORS: Record<
  JsonSchemaDataType,
  Record<string, SchemaKeywordValidator>
> = {
  string: {
    minLength: isNonNegativeInteger,
    maxLength: isNonNegativeInteger,
    pattern: isSetString,
    format: isSetString,
    contentEncoding: isSetString,
    contentMediaType: isSetString
  },
  number: {
    minimum: isSetNumber,
    maximum: isSetNumber,
    exclusiveMinimum: isSetNumber,
    exclusiveMaximum: isSetNumber,
    multipleOf: isSetNumber
  },
  integer: {
    minimum: isSetNumber,
    maximum: isSetNumber,
    exclusiveMinimum: isSetNumber,
    exclusiveMaximum: isSetNumber,
    multipleOf: isSetNumber
  },
  boolean: {},
  array: {
    items: isSchemaLikeValue,
    prefixItems: Array.isArray,
    contains: isSchemaLikeValue,
    minItems: isNonNegativeInteger,
    maxItems: isNonNegativeInteger,
    uniqueItems: isSetBoolean,
    minContains: isNonNegativeInteger,
    maxContains: isNonNegativeInteger
  },
  object: {
    properties: isSetObject,
    patternProperties: isSetObject,
    additionalProperties: isSchemaLikeValue,
    required: isStringArray,
    minProperties: isNonNegativeInteger,
    maxProperties: isNonNegativeInteger,
    dependentRequired: isRecordOfStringArrays,
    dependentSchemas: isSetObject,
    propertyNames: isSchemaLikeValue,
    unevaluatedProperties: isSchemaLikeValue
  },
  null: {}
};

/**
 * Type guard for JSON Schema types.
 *
 * @remarks
 * This function checks if the input is a JSON Schema type, which is defined as having a `type` property or a `$ref` property. This is used to determine if a given input conforms to the structure of a JSON Schema definition that includes type information.
 *
 * @param input - The value to check.
 * @returns True if the input is a JSON Schema type, false otherwise.
 */
export function isJsonSchema<T = unknown>(
  input: unknown
): input is JsonSchema<T> {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  if ("$ref" in schema && isSetString(schema.$ref)) {
    return true;
  }

  if (!("type" in schema)) {
    return false;
  }

  const schemaTypes: JsonSchemaDataType[] = [];

  if (isSetString(schema.type)) {
    if (!JSON_SCHEMA_DATA_TYPE_SET.has(schema.type as JsonSchemaDataType)) {
      return false;
    }

    schemaTypes.push(schema.type as JsonSchemaDataType);
  } else if (Array.isArray(schema.type) && schema.type.length > 0) {
    if (
      !schema.type.every(
        schemaType =>
          isSetString(schemaType) &&
          JSON_SCHEMA_DATA_TYPE_SET.has(schemaType as JsonSchemaDataType)
      ) ||
      new Set(schema.type).size !== schema.type.length
    ) {
      return false;
    }

    schemaTypes.push(...(schema.type as JsonSchemaDataType[]));
  } else {
    return false;
  }

  const typeKeywordValidators = schemaTypes.flatMap(schemaType =>
    Object.entries(TYPE_KEYWORD_VALIDATORS[schemaType])
  );

  for (const [keyword, validator] of typeKeywordValidators) {
    if (keyword in schema && !validator(schema[keyword])) {
      return false;
    }
  }

  if (
    "minItems" in schema &&
    "maxItems" in schema &&
    isNonNegativeInteger(schema.minItems) &&
    isNonNegativeInteger(schema.maxItems) &&
    schema.minItems > schema.maxItems
  ) {
    return false;
  }

  if (
    "minLength" in schema &&
    "maxLength" in schema &&
    isNonNegativeInteger(schema.minLength) &&
    isNonNegativeInteger(schema.maxLength) &&
    schema.minLength > schema.maxLength
  ) {
    return false;
  }

  if (
    "minProperties" in schema &&
    "maxProperties" in schema &&
    isNonNegativeInteger(schema.minProperties) &&
    isNonNegativeInteger(schema.maxProperties) &&
    schema.minProperties > schema.maxProperties
  ) {
    return false;
  }

  return true;
}

/**
 * Type guard for JSON Schema object forms.
 *
 * @remarks
 * This function checks if the input is a JSON Schema object type, which is defined as having a `type` property equal to "object" or having a `properties` object. This is used to determine if a given input conforms to the structure of a JSON Schema object definition.
 *
 * @param input - The value to check.
 * @returns True if the input is a JSON Schema object type, false otherwise.
 */
export function isJsonSchemaObject<
  T extends Record<string, any> = Record<string, any>
>(input: unknown): input is JsonSchemaObject<T> {
  return (
    isJsonSchemaObjectType(input) &&
    (input.type === "object" || isObject(input.properties))
  );
}

/**
 * Type guard for JSON Schemas that only accept `null`.
 *
 * @remarks
 * This function checks if the input is a JSON Schema that exclusively accepts the `null` type. It verifies that the input is a valid JSON Schema and that its `type` property is set to "null". This is useful for identifying schemas that are specifically designed to allow only `null` values.
 *
 * @param input - The value to check.
 * @returns True if the input is a JSON Schema that only accepts `null`, false otherwise.
 */
export function isNullOnlyJsonSchema(
  input: unknown
): input is JsonSchema<null> {
  return isJsonSchema(input) && input.type === "null";
}

/**
 * Type guard for untyped schema objects.
 *
 * @remarks
 * This function checks if the input is an untyped schema object, which is defined as having certain properties that are commonly found in untyped schema definitions. This includes properties such as `id`, `title`, `description`, `$schema`, `tsType`, `markdownType`, `type`, `required`, `tags`, `args`, `properties`, and `resolve`. The function verifies that these properties, if present, conform to the expected types (e.g., strings for certain properties, arrays for others). This type guard is used to determine if a given input can be treated as an untyped schema object within the context of the Powerlines schema system.
 *
 * @param input - The value to check.
 * @returns True if the input is an untyped schema object, false otherwise.
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
 * Type guard for untyped input objects.
 *
 * @remarks
 * This function checks if the input is an untyped input object, which is defined as having certain properties that are commonly found in untyped input definitions. This includes properties such as `$schema` and `$resolve`. The function verifies that these properties, if present, conform to the expected types (e.g., objects for `$schema`, functions for `$resolve`). This type guard is used to determine if a given input can be treated as an untyped input object within the context of the Powerlines schema system.
 *
 * @param input - The value to check.
 * @returns True if the input is an untyped input object, false otherwise.
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
 * Type guard for Powerlines Schema objects.
 *
 * @param input - The value to check.
 * @returns True if the input is a Powerlines Schema object, false otherwise.
 */
export function isSchema<T = unknown>(input: unknown): input is Schema<T> {
  return (
    isSetObject(input) &&
    "schema" in input &&
    isJsonSchema(input.schema) &&
    "variant" in input &&
    isSetString(input.variant) &&
    "hash" in input &&
    isSetString(input.hash)
  );
}

export function isExtractedSchema<T = unknown>(
  input: unknown
): input is ExtractedSchema<T> {
  return (
    isSchema<T>(input) &&
    "source" in input &&
    isSetObject(input.source) &&
    "schema" in input.source &&
    "variant" in input.source &&
    isSetString(input.source.variant)
  );
}
