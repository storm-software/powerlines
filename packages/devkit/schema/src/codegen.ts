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
import { isBoolean } from "@stryke/type-checks/is-boolean";
import { isNull } from "@stryke/type-checks/is-null";
import { isNumber } from "@stryke/type-checks/is-number";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import standaloneCode from "ajv/dist/standalone";
import { getPropertiesList } from "./helpers";
import { getPrimarySchemaType, isSchemaNullable } from "./metadata";
import { isJsonSchema, isJsonSchemaObject } from "./type-checks";
import { JsonSchema, JsonSchemaPrimitiveType } from "./types";
import { getValidator } from "./validate";

/**
 * Stringifies a value for generated TypeScript code.
 */
export function stringifyValue(
  value?: unknown,
  type?: JsonSchemaPrimitiveType | string
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
            : JSON.stringify(value);
}

/**
 * Stringifies a JSON Schema fragment into a TypeScript-like type string.
 */
export function stringifyType<T = unknown>(schema?: JsonSchema<T>): string {
  if (!schema) {
    return "unknown";
  }

  if (isSetString(schema.$ref)) {
    const match = /^#\/(?:definitions|\$defs)\/(.+)$/.exec(schema.$ref);

    return match?.[1] ?? schema.$ref;
  }

  const primaryType = getPrimarySchemaType(schema);
  if (primaryType) {
    if (primaryType === "integer" || primaryType === "number") {
      return "number";
    }

    return primaryType;
  }

  if (schema.type === "array" && Array.isArray(schema.enum)) {
    return schema.enum.map(value => JSON.stringify(value)).join(" | ");
  }

  if (schema.const !== undefined) {
    return JSON.stringify(schema.const);
  }

  if (schema.type === "array" || schema.items) {
    const items = Array.isArray(schema.items) ? schema.items[0] : schema.items;

    return `${stringifyType(items)}[]`;
  }

  if (
    schema.type === "object" ||
    schema.properties ||
    schema.additionalProperties
  ) {
    if (isJsonSchema(schema.additionalProperties)) {
      return `{ [key: string]: ${stringifyType(schema.additionalProperties)} }`;
    }

    if (isJsonSchemaObject(schema)) {
      return `{ ${getPropertiesList(schema as JsonSchema<Record<string, any>>)
        .map(property => {
          const suffix =
            schema.required?.includes(property.name) || property.nullable
              ? `${property.optional ? "?" : ""}${property.nullable ? " | null" : ""}`
              : "";

          return `${property.name}${suffix}: ${stringifyType(property)}`;
        })
        .join(";\n")} }`;
    }
  }

  if (schema.oneOf || schema.anyOf) {
    return ((schema.oneOf ?? schema.anyOf ?? []) as JsonSchema<T>[])
      .map(branch => stringifyType(branch))
      .join(" | ");
  }

  if (schema.allOf) {
    return "object";
  }

  return "unknown";
}

/**
 * Generates standalone JSON Schema validation code using Ajv.
 */
export async function generateCode<T = unknown>(
  schemas: JsonSchema<T>,
  refsOrFuncts?: Parameters<typeof standaloneCode>[1]
) {
  const ajv = getValidator(schemas);

  return standaloneCode(ajv, refsOrFuncts);
}

/**
 * A helper function to determine if a JSON Schema fragment is nullable, for use in code generation.
 *
 * @param schema - The JSON Schema fragment to check.
 * @returns `true` if the schema is nullable, otherwise `false`. A schema is considered nullable if it has `nullable: true` or if its `type` includes `"null"`.
 */
export function isNullableSchema(schema?: JsonSchema): boolean {
  return isSchemaNullable(schema);
}
