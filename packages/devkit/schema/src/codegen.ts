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

import { toBool } from "@stryke/convert/to-bool";
import { isInteger, isObject, isString } from "@stryke/type-checks";
import { isBoolean } from "@stryke/type-checks/is-boolean";
import { isNull } from "@stryke/type-checks/is-null";
import { isNumber } from "@stryke/type-checks/is-number";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import standaloneCode from "ajv/dist/standalone";
import { getPropertiesList, isSchemaNullable } from "./helpers";
import { getPrimarySchemaType } from "./metadata";
import { isJsonSchema, isJsonSchemaObject } from "./type-checks";
import { JsonSchema, JsonSchemaType } from "./types";
import { getValidator } from "./validate";

interface JsonSchemaObjectView {
  $ref?: string;
  type?: JsonSchemaType | readonly JsonSchemaType[];
  enum?: readonly unknown[];
  const?: unknown;
  items?: JsonSchema;
  properties?: Record<string, JsonSchema>;
  additionalProperties?: boolean | JsonSchema;
  required?: string[];
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
}

/**
 * Stringifies a value for generated TypeScript code.
 */
export function stringifyValue(
  value?: unknown,
  type?: JsonSchemaType | string
): string {
  return isUndefined(value)
    ? "undefined"
    : isNull(value)
      ? "null"
      : type === "boolean" || isBoolean(value)
        ? String(toBool(value))
        : type === "number" || isNumber(value)
          ? Number.parseFloat(String(value)).toLocaleString(undefined, {
              maximumFractionDigits: 20
            })
          : type === "integer"
            ? Number.parseInt(String(value)).toLocaleString()
            : type === "string" || type === "object" || type === "array"
              ? JSON.stringify(value)
              : String(value);
}

/**
 * Stringifies a JSON Schema fragment into a TypeScript-like type string.
 */
export function stringifyType(schema?: JsonSchema): string {
  if (!schema) {
    return "unknown";
  }

  if (typeof schema === "boolean") {
    return schema ? "unknown" : "never";
  }

  const objectSchema = schema as JsonSchemaObjectView;

  if (isSetString(objectSchema.$ref)) {
    const match = /^#\/(?:definitions|\$defs)\/(.+)$/.exec(objectSchema.$ref);

    return match?.[1] ?? objectSchema.$ref;
  }

  const primaryType = getPrimarySchemaType(schema);
  if (primaryType) {
    if (primaryType === "integer" || primaryType === "number") {
      return "number";
    }

    return primaryType;
  }

  if (objectSchema.type === "array" && Array.isArray(objectSchema.enum)) {
    const enumValues = objectSchema.enum as readonly unknown[];

    return enumValues
      .map((value: unknown) => JSON.stringify(value))
      .join(" | ");
  }

  if (objectSchema.const !== undefined) {
    return JSON.stringify(objectSchema.const);
  }

  if (objectSchema.type === "array" || objectSchema.items) {
    return `${stringifyType(objectSchema.items)}[]`;
  }

  if (
    objectSchema.type === "object" ||
    objectSchema.properties ||
    objectSchema.additionalProperties
  ) {
    if (isJsonSchema(objectSchema.additionalProperties)) {
      return `{ [key: string]: ${stringifyType(objectSchema.additionalProperties)} }`;
    }

    if (isJsonSchemaObject(objectSchema)) {
      const required = objectSchema.required ?? [];

      return `{ ${getPropertiesList(objectSchema)
        .map(property => {
          const suffix =
            !required.includes(property.name) || isSchemaNullable(property)
              ? `${!required.includes(property.name) ? "?" : ""}${isSchemaNullable(property) ? " | null" : ""}`
              : "";

          return `${property.name}${suffix}: ${stringifyType(property)}`;
        })
        .join(";\n")} }`;
    }
  }

  if (objectSchema.oneOf || objectSchema.anyOf) {
    return (objectSchema.oneOf ?? objectSchema.anyOf ?? [])
      .map(branch => stringifyType(branch))
      .join(" | ");
  }

  if (objectSchema.allOf) {
    return "object";
  }

  return "unknown";
}

/**
 * Returns a string type representation of a value based on its type and an optional JSON Schema primitive type hint.
 *
 * @param value - The value whose type is to be represented as a string.
 * @returns A string representation of the value's type, which may be influenced by the provided JSON Schema primitive type hint. The function handles various JavaScript types and formats them accordingly, including special handling for `undefined`, `null`, booleans, numbers (with formatting), strings, objects, and arrays. If a specific type hint is provided, it will take precedence in determining the string representation of the value.
 */
export function getJsonSchemaType(value?: unknown): JsonSchemaType | undefined {
  return isNull(value)
    ? "null"
    : isBoolean(value)
      ? "boolean"
      : isInteger(value)
        ? "integer"
        : isNumber(value)
          ? "number"
          : isString(value)
            ? "string"
            : isObject(value)
              ? "object"
              : Array.isArray(value)
                ? "array"
                : undefined;
}

/**
 * Generates standalone JSON Schema validation code using Ajv.
 */
export async function generateCode(
  schemas: JsonSchema,
  refsOrFuncts?: Parameters<typeof standaloneCode>[1]
) {
  const ajv = getValidator(schemas);

  return standaloneCode(ajv, refsOrFuncts);
}
