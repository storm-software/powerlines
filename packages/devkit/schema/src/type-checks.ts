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

import type { StandardSchemaV1 } from "@standard-schema/spec";
import { isFunction, isSetObject, isSetString } from "@stryke/type-checks";
import type {
  FunctionArg as UntypedFunctionArg,
  InputObject as UntypedInputObject,
  Schema as UntypedSchema,
  TypeDescriptor as UntypedTypeDescriptor
} from "untyped";
import type { BaseSchema } from "valibot";
import { JSON_SCHEMA_PRIMITIVE_TYPES, JSON_SCHEMA_TYPES } from "./constants";
import {
  JsonSchema,
  JsonSchemaAllOf,
  JsonSchemaAny,
  JsonSchemaAnyOf,
  JsonSchemaArray,
  JsonSchemaBigint,
  JsonSchemaBoolean,
  JsonSchemaDate,
  JsonSchemaDecimal,
  JsonSchemaEnum,
  JsonSchemaInteger,
  JsonSchemaKeywords,
  JsonSchemaLiteral,
  JsonSchemaMap,
  JsonSchemaNativeEnum,
  JsonSchemaNever,
  JsonSchemaNull,
  JsonSchemaNullable,
  JsonSchemaNumber,
  JsonSchemaObject,
  JsonSchemaPrimitiveType,
  JsonSchemaPrimitiveUnion,
  JsonSchemaRecord,
  JsonSchemaRef,
  JsonSchemaSet,
  JsonSchemaString,
  JsonSchemaTuple,
  JsonSchemaType,
  JsonSchemaUndefined,
  JsonSchemaUnion,
  JsonSchemaUnknown,
  Schema,
  ExtractedSchema as SchemaWithSource
} from "./types";

const isSetNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isSetBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";
const isSchemaLikeValue = (value: unknown): boolean =>
  isSetObject(value) || isSetBoolean(value);

const isRecordOfSchemaLike = (
  value: unknown
): value is Record<string, unknown> =>
  isSetObject(value) &&
  Object.values(value).every(item => isSchemaLikeValue(item));

const isVocabularyMap = (value: unknown): value is Record<string, boolean> =>
  isSetObject(value) && Object.values(value).every(item => isSetBoolean(item));

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => isSetString(item));

const isRecordOfStringArrays = (
  value: unknown
): value is Record<string, string[]> =>
  isSetObject(value) && Object.values(value).every(item => isStringArray(item));

const JSON_SCHEMA_PRIMITIVE_TYPE_SET = new Set<JsonSchemaPrimitiveType>(
  JSON_SCHEMA_PRIMITIVE_TYPES
);
const JSON_SCHEMA_TYPE_SET = new Set<JsonSchemaType>(JSON_SCHEMA_TYPES);

/**
 * A helper type guard to check if a value is a JSON Schema primitive type.
 *
 * @param value - The value to check.
 * @returns True if the value is a JSON Schema primitive type, false otherwise.
 */
export function isJsonSchemaPrimitiveType(
  value: unknown
): value is JsonSchemaPrimitiveType {
  return (
    isSetString(value) &&
    JSON_SCHEMA_PRIMITIVE_TYPE_SET.has(value as JsonSchemaPrimitiveType)
  );
}

/**
 * A helper type guard to check if a value is a JSON Schema type.
 *
 * @param value - The value to check.
 * @returns True if the value is a JSON Schema type, false otherwise.
 */
export function isJsonSchemaType(value: unknown): value is JsonSchemaType {
  return (
    isSetString(value) && JSON_SCHEMA_TYPE_SET.has(value as JsonSchemaType)
  );
}

const DATE_FORMAT_SET = new Set([
  "date",
  "time",
  "date-time",
  "iso-time",
  "iso-date-time",
  "unix-time"
]);

const isSetBigint = (value: unknown): value is bigint =>
  typeof value === "bigint";

type UntypedJSType =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "function"
  | "object"
  | "any"
  | "array";

const UNTYPED_TYPE_NAME_SET = new Set<UntypedJSType>([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "function",
  "object",
  "any",
  "array"
]);

const isUntypedJSType = (value: unknown): value is UntypedJSType =>
  isSetString(value) && UNTYPED_TYPE_NAME_SET.has(value as UntypedJSType);

const isUntypedTypeDescriptor = (
  value: unknown
): value is UntypedTypeDescriptor => {
  if (!isSetObject(value)) {
    return false;
  }

  const descriptor = value as Record<string, unknown>;
  if (
    descriptor.type !== undefined &&
    !(
      (isSetString(descriptor.type) && isUntypedJSType(descriptor.type)) ||
      (Array.isArray(descriptor.type) &&
        descriptor.type.every(item => isUntypedJSType(item)))
    )
  ) {
    return false;
  }

  if (descriptor.tsType !== undefined && !isSetString(descriptor.tsType)) {
    return false;
  }

  if (
    descriptor.markdownType !== undefined &&
    !isSetString(descriptor.markdownType)
  ) {
    return false;
  }

  if (
    descriptor.items !== undefined &&
    !(
      isUntypedTypeDescriptor(descriptor.items) ||
      (Array.isArray(descriptor.items) &&
        descriptor.items.every(item => isUntypedTypeDescriptor(item)))
    )
  ) {
    return false;
  }

  return true;
};

const isUntypedFunctionArg = (value: unknown): value is UntypedFunctionArg => {
  if (!isUntypedTypeDescriptor(value)) {
    return false;
  }

  const arg = value as Record<string, unknown>;
  if (arg.name !== undefined && !isSetString(arg.name)) {
    return false;
  }

  return arg.optional === undefined || typeof arg.optional === "boolean";
};

const isRecordOfUntypedSchema = (
  value: unknown
): value is Record<string, UntypedSchema> =>
  isSetObject(value) &&
  Object.values(value).every(item => isUntypedSchema(item));

const isArrayOf = <T>(
  value: unknown,
  predicate: (item: unknown) => item is T
): value is T[] => Array.isArray(value) && value.every(item => predicate(item));

const isTupleOfTwo = <A, B>(
  value: unknown,
  aPredicate: (item: unknown) => item is A,
  bPredicate: (item: unknown) => item is B
): value is [A, B] =>
  Array.isArray(value) &&
  value.length === 2 &&
  aPredicate(value[0]) &&
  bPredicate(value[1]);

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || isSetString(value);

const isOptionalBoolean = (value: unknown): value is boolean | undefined =>
  value === undefined || isSetBoolean(value);

const isOptionalNumber = (value: unknown): value is number | undefined =>
  value === undefined || isSetNumber(value);

const isOptionalBigint = (value: unknown): value is bigint | undefined =>
  value === undefined || isSetBigint(value);

const isOptionalJsonSchema = (
  value: unknown
): value is JsonSchema | undefined =>
  value === undefined || isJsonSchema(value);

const isOptionalJsonSchemaArray = (
  value: unknown
): value is JsonSchema[] | undefined =>
  value === undefined || isArrayOf(value, isJsonSchema);

const isOptionalPrimitiveTypeArray = (
  value: unknown
): value is JsonSchemaPrimitiveType[] | undefined =>
  value === undefined ||
  (Array.isArray(value) &&
    value.every(
      item =>
        isSetString(item) &&
        JSON_SCHEMA_PRIMITIVE_TYPE_SET.has(item as JsonSchemaPrimitiveType)
    ));

const isOptionalJsonSchemaTypeArray = (
  value: unknown
): value is JsonSchemaType[] | undefined =>
  value === undefined ||
  (Array.isArray(value) &&
    value.every(
      item =>
        isSetString(item) && JSON_SCHEMA_TYPE_SET.has(item as JsonSchemaType)
    ));

const hasValidJsonSchemaKeywords = (
  schema: Record<string, unknown>
): boolean => {
  if (!isOptionalString(schema.$id)) {
    return false;
  }
  if (!isOptionalString(schema.$schema)) {
    return false;
  }
  if (
    schema.$vocabulary !== undefined &&
    !isVocabularyMap(schema.$vocabulary)
  ) {
    return false;
  }
  if (!isOptionalString(schema.$comment)) {
    return false;
  }
  if (!isOptionalString(schema.$anchor)) {
    return false;
  }
  if (schema.$defs !== undefined && !isRecordOfSchemaLike(schema.$defs)) {
    return false;
  }
  if (!isOptionalString(schema.$dynamicRef)) {
    return false;
  }
  if (!isOptionalString(schema.$dynamicAnchor)) {
    return false;
  }
  if (!isOptionalString(schema.name)) {
    return false;
  }
  if (!isOptionalString(schema.title)) {
    return false;
  }
  if (!isOptionalString(schema.description)) {
    return false;
  }
  if (!isOptionalString(schema.docs)) {
    return false;
  }
  if (schema.examples !== undefined && !Array.isArray(schema.examples)) {
    return false;
  }
  if (schema.alias !== undefined && !isStringArray(schema.alias)) {
    return false;
  }
  if (schema.tags !== undefined && !isStringArray(schema.tags)) {
    return false;
  }
  if (!isOptionalBoolean(schema.deprecated)) {
    return false;
  }
  if (!isOptionalBoolean(schema.hidden)) {
    return false;
  }
  if (!isOptionalBoolean(schema.ignore)) {
    return false;
  }
  if (!isOptionalBoolean(schema.internal)) {
    return false;
  }
  if (!isOptionalBoolean(schema.runtime)) {
    return false;
  }
  if (!isOptionalBoolean(schema.readOnly)) {
    return false;
  }
  if (!isOptionalBoolean(schema.writeOnly)) {
    return false;
  }

  if (!isOptionalJsonSchemaArray(schema.allOf)) {
    return false;
  }
  if (!isOptionalJsonSchemaArray(schema.anyOf)) {
    return false;
  }
  if (!isOptionalJsonSchemaArray(schema.oneOf)) {
    return false;
  }
  if (!isOptionalJsonSchema(schema.not)) {
    return false;
  }

  if (!isOptionalJsonSchema(schema.if)) {
    return false;
  }
  if (!isOptionalJsonSchema(schema.then)) {
    return false;
  }
  if (!isOptionalJsonSchema(schema.else)) {
    return false;
  }

  return true;
};

/**
 * Type guard for shared JSON Schema keyword groups.
 *
 * @param input - The value to check.
 * @returns True if the input is a JSON Schema keyword group, false otherwise.
 */
export function isJsonSchemaKeywords(
  input: unknown
): input is JsonSchemaKeywords {
  if (!isSetObject(input)) {
    return false;
  }

  return hasValidJsonSchemaKeywords(input as Record<string, unknown>);
}

/**
 * Type guard for generic JSON Schema objects with optional `$ref`.
 *
 * @param input - The value to check.
 * @returns True if the input is a generic JSON Schema object, false otherwise.
 */
export function isJsonSchemaAny(input: unknown): input is JsonSchemaAny {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return hasValidJsonSchemaKeywords(schema) && isOptionalString(schema.$ref);
}

/**
 * Type guard for JSON Schema array types.
 *
 * @param input - The value to check.
 * @returns True if the input is a JSON Schema array schema, false otherwise.
 */
export function isJsonSchemaArray(input: unknown): input is JsonSchemaArray {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (!hasValidJsonSchemaKeywords(schema) || schema.type !== "array") {
    return false;
  }

  return (
    isOptionalJsonSchemaArray(schema.prefixItems) &&
    isOptionalJsonSchema(schema.items) &&
    isOptionalJsonSchema(schema.contains) &&
    isOptionalNumber(schema.minItems) &&
    isOptionalNumber(schema.maxItems) &&
    isOptionalBoolean(schema.uniqueItems) &&
    isOptionalNumber(schema.minContains) &&
    isOptionalNumber(schema.maxContains) &&
    (schema.unevaluatedItems === undefined ||
      isSetBoolean(schema.unevaluatedItems) ||
      isJsonSchema(schema.unevaluatedItems))
  );
}

/**
 * Type guard for bigint-backed integer schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a bigint-backed integer schema, false otherwise.
 */
export function isJsonSchemaBigint(input: unknown): input is JsonSchemaBigint {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (
    !hasValidJsonSchemaKeywords(schema) ||
    schema.type !== "integer" ||
    schema.format !== "int64"
  ) {
    return false;
  }

  return (
    isOptionalBigint(schema.minimum) &&
    isOptionalBigint(schema.exclusiveMinimum) &&
    isOptionalBigint(schema.maximum) &&
    isOptionalBigint(schema.exclusiveMaximum) &&
    isOptionalBigint(schema.multipleOf) &&
    isOptionalBigint(schema.default) &&
    (schema.enum === undefined || isArrayOf(schema.enum, isSetBigint))
  );
}

/**
 * Type guard for boolean schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a boolean schema, false otherwise.
 */
export function isJsonSchemaBoolean(
  input: unknown
): input is JsonSchemaBoolean {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return (
    hasValidJsonSchemaKeywords(schema) &&
    schema.type === "boolean" &&
    isOptionalBoolean(schema.default)
  );
}

/**
 * Type guard for date/time schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a date or time schema, false otherwise.
 */
export function isJsonSchemaDate(input: unknown): input is JsonSchemaDate {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (!hasValidJsonSchemaKeywords(schema)) {
    return false;
  }

  if (schema.anyOf !== undefined) {
    return isArrayOf(schema.anyOf, isJsonSchemaDate);
  }

  if (schema.type !== "integer" && schema.type !== "string") {
    return false;
  }

  if (!isSetString(schema.format) || !DATE_FORMAT_SET.has(schema.format)) {
    return false;
  }

  return (
    isOptionalNumber(schema.minimum) &&
    isOptionalNumber(schema.maximum) &&
    (schema.default === undefined ||
      isSetString(schema.default) ||
      isSetNumber(schema.default))
  );
}

/**
 * Type guard for enum-constrained schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is an enum-constrained schema, false otherwise.
 */
export function isJsonSchemaEnum(input: unknown): input is JsonSchemaEnum {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (
    !hasValidJsonSchemaKeywords(schema) ||
    !isSetString(schema.type) ||
    !JSON_SCHEMA_PRIMITIVE_TYPE_SET.has(
      schema.type as JsonSchemaPrimitiveType
    ) ||
    !Array.isArray(schema.enum)
  ) {
    return false;
  }

  const typeName = schema.type as JsonSchemaPrimitiveType;
  const enumValues = schema.enum;
  const defaultValue = schema.default;

  if (typeName === "string") {
    return (
      enumValues.every(value => isSetString(value)) &&
      (defaultValue === undefined || isSetString(defaultValue))
    );
  }

  if (typeName === "number" || typeName === "integer") {
    return (
      enumValues.every(value => isSetNumber(value)) &&
      (defaultValue === undefined || isSetNumber(defaultValue))
    );
  }

  if (typeName === "boolean") {
    return (
      enumValues.every(value => isSetBoolean(value)) &&
      (defaultValue === undefined || isSetBoolean(defaultValue))
    );
  }

  return (
    typeName === "null" &&
    enumValues.every(value => value === null) &&
    (defaultValue === undefined || defaultValue === null)
  );
}

/**
 * Type guard for `allOf` composition schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is an `allOf` schema, false otherwise.
 */
export function isJsonSchemaAllOf(input: unknown): input is JsonSchemaAllOf {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (
    !hasValidJsonSchemaKeywords(schema) ||
    !isArrayOf(schema.allOf, isJsonSchema)
  ) {
    return false;
  }

  return (
    schema.unevaluatedProperties === undefined ||
    isSetBoolean(schema.unevaluatedProperties) ||
    isJsonSchema(schema.unevaluatedProperties)
  );
}

/**
 * Type guard for literal-value schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a literal-value schema, false otherwise.
 */
export function isJsonSchemaLiteral(
  input: unknown
): input is JsonSchemaLiteral {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (!hasValidJsonSchemaKeywords(schema) || !("const" in schema)) {
    return false;
  }

  return (
    schema.type === undefined ||
    (isSetString(schema.type) && isJsonSchemaType(schema.type)) ||
    isOptionalJsonSchemaTypeArray(schema.type)
  );
}

/**
 * Type guard for map tuple-array schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a map tuple-array schema, false otherwise.
 */
export function isJsonSchemaMap(input: unknown): input is JsonSchemaMap {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (
    !hasValidJsonSchemaKeywords(schema) ||
    schema.type !== "array" ||
    schema.maxItems !== 125 ||
    !isSetObject(schema.items)
  ) {
    return false;
  }

  const items = schema.items as Record<string, unknown>;

  return (
    items.type === "array" &&
    isTupleOfTwo(items.prefixItems, isJsonSchema, isJsonSchema) &&
    (items.items === undefined || items.items === false) &&
    items.minItems === 2 &&
    items.maxItems === 2
  );
}

/**
 * Type guard for native enum schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a native enum schema, false otherwise.
 */
export function isJsonSchemaNativeEnum(
  input: unknown
): input is JsonSchemaNativeEnum {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  const isValidType =
    schema.type === "string" ||
    schema.type === "number" ||
    (Array.isArray(schema.type) &&
      schema.type.length === 2 &&
      schema.type[0] === "string" &&
      schema.type[1] === "number");

  return (
    hasValidJsonSchemaKeywords(schema) &&
    isValidType &&
    Array.isArray(schema.enum) &&
    schema.enum.every(value => isSetString(value) || isSetNumber(value))
  );
}

/**
 * Type guard for impossible/never schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a never schema, false otherwise.
 */
export function isJsonSchemaNever(input: unknown): input is JsonSchemaNever {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return hasValidJsonSchemaKeywords(schema) && isJsonSchemaAny(schema.not);
}

/**
 * Type guard for `null` schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a null schema, false otherwise.
 */
export function isJsonSchemaNull(input: unknown): input is JsonSchemaNull {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return (
    hasValidJsonSchemaKeywords(schema) &&
    schema.type === "null" &&
    (schema.const === undefined || schema.const === null) &&
    (schema.enum === undefined ||
      (Array.isArray(schema.enum) && schema.enum.every(v => v === null))) &&
    (schema.default === undefined || schema.default === null)
  );
}

/**
 * Type guard for nullable schema unions.
 *
 * @param input - The value to check.
 * @returns True if the input is a nullable schema union, false otherwise.
 */
export function isJsonSchemaNullable(
  input: unknown
): input is JsonSchemaNullable {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (!hasValidJsonSchemaKeywords(schema)) {
    return false;
  }

  const anyOfBranch =
    schema.anyOf !== undefined &&
    Array.isArray(schema.anyOf) &&
    schema.anyOf.length === 2 &&
    isJsonSchema(schema.anyOf[0]) &&
    isJsonSchemaNull(schema.anyOf[1]);

  const typeBranch =
    Array.isArray(schema.type) &&
    schema.type.length === 2 &&
    ((schema.type[0] === "null" &&
      isSetString(schema.type[1]) &&
      schema.type[1] !== "null" &&
      JSON_SCHEMA_TYPE_SET.has(schema.type[1] as JsonSchemaType)) ||
      (schema.type[1] === "null" &&
        isSetString(schema.type[0]) &&
        schema.type[0] !== "null" &&
        JSON_SCHEMA_TYPE_SET.has(schema.type[0] as JsonSchemaType)));

  return anyOfBranch || typeBranch;
}

/**
 * Type guard for numeric schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a numeric schema, false otherwise.
 */
export function isJsonSchemaNumber(input: unknown): input is JsonSchemaNumber {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (
    !hasValidJsonSchemaKeywords(schema) ||
    (schema.type !== "number" && schema.type !== "integer")
  ) {
    return false;
  }

  return (
    isOptionalString(schema.format) &&
    isOptionalNumber(schema.minimum) &&
    isOptionalNumber(schema.exclusiveMinimum) &&
    isOptionalNumber(schema.maximum) &&
    isOptionalNumber(schema.exclusiveMaximum) &&
    isOptionalNumber(schema.multipleOf) &&
    isOptionalNumber(schema.default) &&
    (schema.enum === undefined || isArrayOf(schema.enum, isSetNumber))
  );
}

/**
 * Type guard for integer schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is an integer schema, false otherwise.
 */
export function isJsonSchemaInteger(
  input: unknown
): input is JsonSchemaInteger {
  return isJsonSchemaNumber(input) && input.type === "integer";
}

/**
 * Type guard for decimal schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a decimal schema, false otherwise.
 */
export function isJsonSchemaDecimal(
  input: unknown
): input is JsonSchemaDecimal {
  return isJsonSchemaNumber(input) && input.type === "number";
}

/**
 * Type guard for object schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is an object schema, false otherwise.
 */
export function isJsonSchemaObject(input: unknown): input is JsonSchemaObject {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return (
    hasValidJsonSchemaKeywords(schema) &&
    schema.type === "object" &&
    (schema.properties === undefined ||
      isRecordOfSchemaLike(schema.properties)) &&
    (schema.patternProperties === undefined ||
      isRecordOfSchemaLike(schema.patternProperties)) &&
    (schema.additionalProperties === undefined ||
      isSetBoolean(schema.additionalProperties) ||
      isJsonSchema(schema.additionalProperties)) &&
    (schema.required === undefined || isStringArray(schema.required)) &&
    (schema.unevaluatedProperties === undefined ||
      isSetBoolean(schema.unevaluatedProperties) ||
      isJsonSchema(schema.unevaluatedProperties)) &&
    (schema.dependencies === undefined ||
      (isSetObject(schema.dependencies) &&
        Object.values(schema.dependencies).every(
          item => isStringArray(item) || isJsonSchema(item)
        ))) &&
    (schema.dependentRequired === undefined ||
      isRecordOfStringArrays(schema.dependentRequired)) &&
    (schema.dependentSchemas === undefined ||
      isRecordOfSchemaLike(schema.dependentSchemas)) &&
    isOptionalNumber(schema.minProperties) &&
    isOptionalNumber(schema.maxProperties) &&
    (schema.primaryKey === undefined || isStringArray(schema.primaryKey)) &&
    isOptionalString(schema.databaseSchema)
  );
}

/**
 * Type guard for string schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a string schema, false otherwise.
 */
export function isJsonSchemaString(input: unknown): input is JsonSchemaString {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return (
    hasValidJsonSchemaKeywords(schema) &&
    schema.type === "string" &&
    isOptionalNumber(schema.minLength) &&
    isOptionalNumber(schema.maxLength) &&
    isOptionalString(schema.pattern) &&
    isOptionalString(schema.format) &&
    isOptionalString(schema.default) &&
    (schema.enum === undefined || isArrayOf(schema.enum, isSetString)) &&
    isOptionalString(schema.contentMediaType) &&
    isOptionalString(schema.contentEncoding) &&
    isOptionalString(schema.contentSchema)
  );
}

/**
 * Type guard for set-like array schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a set-like array schema, false otherwise.
 */
export function isJsonSchemaSet(input: unknown): input is JsonSchemaSet {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return (
    hasValidJsonSchemaKeywords(schema) &&
    schema.type === "array" &&
    schema.uniqueItems === true &&
    isOptionalJsonSchemaArray(schema.prefixItems) &&
    isOptionalJsonSchema(schema.items) &&
    isOptionalJsonSchema(schema.contains) &&
    isOptionalNumber(schema.minItems) &&
    isOptionalNumber(schema.maxItems) &&
    isOptionalNumber(schema.minContains) &&
    isOptionalNumber(schema.maxContains) &&
    (schema.unevaluatedItems === undefined ||
      isSetBoolean(schema.unevaluatedItems) ||
      isJsonSchema(schema.unevaluatedItems))
  );
}

/**
 * Type guard for record schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a record schema, false otherwise.
 */
export function isJsonSchemaRecord(input: unknown): input is JsonSchemaRecord {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return (
    hasValidJsonSchemaKeywords(schema) &&
    schema.type === "object" &&
    (schema.patternProperties === undefined ||
      isRecordOfSchemaLike(schema.patternProperties)) &&
    (schema.additionalProperties === undefined ||
      isSetBoolean(schema.additionalProperties) ||
      isJsonSchema(schema.additionalProperties)) &&
    isOptionalJsonSchema(schema.propertyNames)
  );
}

/**
 * Type guard for tuple schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a tuple schema, false otherwise.
 */
export function isJsonSchemaTuple(input: unknown): input is JsonSchemaTuple {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return (
    hasValidJsonSchemaKeywords(schema) &&
    schema.type === "array" &&
    isArrayOf(schema.prefixItems, isJsonSchema) &&
    isOptionalNumber(schema.minItems) &&
    isOptionalNumber(schema.maxItems) &&
    isOptionalJsonSchema(schema.items) &&
    isOptionalJsonSchema(schema.contains) &&
    isOptionalBoolean(schema.uniqueItems) &&
    isOptionalNumber(schema.minContains) &&
    isOptionalNumber(schema.maxContains) &&
    (schema.unevaluatedItems === undefined ||
      isSetBoolean(schema.unevaluatedItems) ||
      isJsonSchema(schema.unevaluatedItems))
  );
}

/**
 * Type guard for undefined-representing schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is an undefined-representing schema, false otherwise.
 */
export function isJsonSchemaUndefined(
  input: unknown
): input is JsonSchemaUndefined {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return (
    hasValidJsonSchemaKeywords(schema) &&
    isJsonSchemaAny(schema.not) &&
    (schema.default === undefined || schema.default === undefined)
  );
}

/**
 * Type guard for primitive-union schema variants.
 *
 * @param input - The value to check.
 * @returns True if the input is a primitive-union schema variant, false otherwise.
 */
export function isJsonSchemaPrimitiveUnion(
  input: unknown
): input is JsonSchemaPrimitiveUnion {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (!hasValidJsonSchemaKeywords(schema)) {
    return false;
  }

  if (
    isSetString(schema.type) &&
    JSON_SCHEMA_PRIMITIVE_TYPE_SET.has(schema.type as JsonSchemaPrimitiveType)
  ) {
    if (schema.enum === undefined) {
      return true;
    }

    if (!Array.isArray(schema.enum)) {
      return false;
    }

    if (schema.type === "string") {
      return (
        schema.enum.every(value => isSetString(value)) &&
        (schema.default === undefined || isSetString(schema.default))
      );
    }

    if (schema.type === "number") {
      return (
        schema.enum.every(value => isSetNumber(value)) &&
        (schema.default === undefined || isSetNumber(schema.default))
      );
    }

    if (schema.type === "boolean") {
      return (
        schema.enum.every(value => isSetBoolean(value)) &&
        (schema.default === undefined || isSetBoolean(schema.default))
      );
    }

    if (schema.type === "integer") {
      if (schema.format !== "int64") {
        return false;
      }

      return (
        schema.enum.every(value => isSetBigint(value)) &&
        (schema.default === undefined || isSetBigint(schema.default))
      );
    }

    return (
      schema.type === "null" &&
      schema.enum.every(value => value === null) &&
      (schema.default === undefined || schema.default === null)
    );
  }

  return isOptionalPrimitiveTypeArray(schema.type) && schema.type !== undefined;
}

/**
 * Type guard for union schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a union schema, false otherwise.
 */
export function isJsonSchemaUnion(input: unknown): input is JsonSchemaUnion {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return (
    hasValidJsonSchemaKeywords(schema) &&
    (isJsonSchemaPrimitiveUnion(schema) || isJsonSchemaAnyOf(schema))
  );
}

/**
 * Type guard for permissive unknown schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a permissive unknown schema, false otherwise.
 */
export function isJsonSchemaUnknown(
  input: unknown
): input is JsonSchemaUnknown {
  return isJsonSchemaAny(input);
}

/**
 * Type guard for `anyOf` composition schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is an `anyOf` schema, false otherwise.
 */
export function isJsonSchemaAnyOf(input: unknown): input is JsonSchemaAnyOf {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return (
    hasValidJsonSchemaKeywords(schema) && isArrayOf(schema.anyOf, isJsonSchema)
  );
}

/**
 * Type guard for reference schemas.
 *
 * @param input - The value to check.
 * @returns True if the input is a reference schema, false otherwise.
 */
export function isJsonSchemaRef(input: unknown): input is JsonSchemaRef {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;

  return hasValidJsonSchemaKeywords(schema) && isSetString(schema.$ref);
}

/**
 * Type guard for Standard Schema V1 objects.
 *
 * @param input - The value to check.
 * @returns True if the input is a Standard Schema V1 object, false otherwise.
 */
export function isStandardSchema(input: unknown): input is StandardSchemaV1 {
  if (!isSetObject(input)) {
    return false;
  }

  const schema = input as Record<string, unknown>;
  if (!isSetObject(schema["~standard"])) {
    return false;
  }

  const standard = schema["~standard"] as Record<string, unknown>;

  return standard.version === 1 && isFunction(standard.validate);
}

/**
 * Type guard for Valibot BaseSchema objects.
 *
 * @param input - The value to check.
 * @returns True if the input is a Valibot BaseSchema, false otherwise.
 */
export function isValibotSchema(
  input: unknown
): input is BaseSchema<any, any, any> {
  if (!isSetObject(input) || !isStandardSchema(input)) {
    return false;
  }

  const schema = input as unknown as Record<string, unknown>;

  return (
    schema.kind === "schema" &&
    isSetString(schema.type) &&
    isSetBoolean(schema.async) &&
    isFunction(schema.reference) &&
    isSetString(schema.expects) &&
    isFunction(schema["~run"])
  );
}

/**
 * Type guard for JSON Schema types.
 *
 * @remarks
 * This function checks if the input is a JSON Schema type, which is defined as having a `type` property or a `$ref` property. This is used to determine if a given input conforms to the structure of a JSON Schema definition that includes type information.
 *
 * @param input - The value to check.
 * @returns True if the input is a JSON Schema type, false otherwise.
 */
export function isJsonSchema(input: unknown): input is JsonSchema {
  return (
    isJsonSchemaString(input) ||
    isJsonSchemaInteger(input) ||
    isJsonSchemaDecimal(input) ||
    isJsonSchemaBigint(input) ||
    isJsonSchemaBoolean(input) ||
    isJsonSchemaDate(input) ||
    isJsonSchemaEnum(input) ||
    isJsonSchemaLiteral(input) ||
    isJsonSchemaNativeEnum(input) ||
    isJsonSchemaNull(input) ||
    isJsonSchemaArray(input) ||
    isJsonSchemaObject(input) ||
    isJsonSchemaRecord(input) ||
    isJsonSchemaTuple(input) ||
    isJsonSchemaUnion(input) ||
    isJsonSchemaUndefined(input) ||
    isJsonSchemaRef(input) ||
    isJsonSchemaNever(input) ||
    isJsonSchemaMap(input) ||
    isJsonSchemaAny(input) ||
    isJsonSchemaNullable(input) ||
    isJsonSchemaAllOf(input) ||
    isJsonSchemaUnknown(input) ||
    isJsonSchemaSet(input)
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
export function isNullOnlyJsonSchema(input: unknown): input is JsonSchemaNull {
  return isJsonSchemaNull(input);
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
  if (!isUntypedTypeDescriptor(schema)) {
    return false;
  }
  if ("id" in schema && !isSetString(schema.id)) {
    return false;
  }
  if ("resolve" in schema && !isFunction(schema.resolve)) {
    return false;
  }
  if ("properties" in schema && !isRecordOfUntypedSchema(schema.properties)) {
    return false;
  }
  if ("required" in schema && !isStringArray(schema.required)) {
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
  if ("tags" in schema && !isStringArray(schema.tags)) {
    return false;
  }
  if (
    "args" in schema &&
    (!Array.isArray(schema.args) ||
      !schema.args.every(item => isUntypedFunctionArg(item)))
  ) {
    return false;
  }
  if ("returns" in schema && !isUntypedTypeDescriptor(schema.returns)) {
    return false;
  }

  return true;
}

/**
 * Strict type guard for untyped schema objects.
 *
 * @remarks
 * This guard narrows values to the Untyped schema model while explicitly
 * rejecting values that are also valid JSON Schema instances.
 *
 * @param input - The value to check.
 * @returns True if the input is an untyped schema and not a JSON Schema.
 */
export function isUntypedSchemaStrict(input: unknown): input is UntypedSchema {
  return isUntypedSchema(input) && !isJsonSchema(input);
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
 * Strict type guard for untyped input objects.
 *
 * @remarks
 * This guard narrows values to the Untyped input-object model while
 * explicitly rejecting values that are valid JSON Schema objects.
 *
 * @param input - The value to check.
 * @returns True if the input is an untyped input object and not JSON Schema.
 */
export function isUntypedInputStrict(
  input: unknown
): input is UntypedInputObject {
  if (!isUntypedInput(input) || isJsonSchema(input)) {
    return false;
  }

  const inputObject = input as Record<string, unknown>;
  if (
    "$schema" in inputObject &&
    inputObject.$schema !== undefined &&
    !isUntypedSchemaStrict(inputObject.$schema)
  ) {
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
export function isSchema(input: unknown): input is Schema {
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

/**
 * Type guard for extracted schema objects that include source information.
 *
 * @param input - The value to check.
 * @returns True if the input is a SchemaWithSource object, false otherwise.
 */
export function isSchemaWithSource(input: unknown): input is SchemaWithSource {
  return (
    isSchema(input) &&
    "source" in input &&
    isSetObject(input.source) &&
    "schema" in input.source &&
    "variant" in input.source &&
    isSetString(input.source.variant)
  );
}

/**
 * Type guard for Powerlines Schemas that are in Object form.
 *
 * @param input - The value to check.
 * @returns True if the input is a Powerlines Schema object in Object form, false otherwise.
 */
export function isSchemaObject(
  input: unknown
): input is Schema<JsonSchemaObject> {
  return isSchema(input) && isJsonSchemaObject(input.schema);
}
