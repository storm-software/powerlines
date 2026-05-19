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
import { isUndefined } from "@stryke/type-checks/is-undefined";
import type { Options } from "ajv";
import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone";
import { getProperties } from "./helpers";
import { JTDSchemaType, JTDType } from "./types";

/**
 * Stringifies a value as a string.
 *
 * @remarks
 * This function is used to convert a value into a string representation that can be used in generated code, such as default values in TypeScript declarations. It handles different types of values, including booleans, numbers, and strings, and formats them appropriately. For example, boolean values are converted to "true" or "false", numbers are formatted with locale-specific separators, and strings are JSON-stringified with escaped quotes. The function also takes into account the type of the value when stringifying, allowing for specific formatting based on the type (e.g., different handling for integers vs. floats). This ensures that the generated code is both accurate and readable.
 *
 * @param value - The value to stringify.
 * @returns A string representation of the value.
 */
export function stringifyValue(value?: unknown, type?: JTDType): string {
  return isUndefined(value)
    ? "undefined"
    : isNull(value)
      ? "null"
      : type === "boolean" || isBoolean(value)
        ? String(toBool(value))
        : type && type.startsWith("float")
          ? Number.parseFloat(String(value)).toLocaleString(undefined, {
              maximumFractionDigits: 20
            })
          : (type && ["int", "uint"].some(prefix => type.startsWith(prefix))) ||
              isNumber(value)
            ? Number.parseInt(String(value)).toLocaleString()
            : type === "timestamp"
              ? `"${new Date(String(value)).toISOString()}"`
              : JSON.stringify(
                  String(value).replaceAll('"', '\\"'),
                  undefined,
                  2
                );
}

/**
 * Stringifies a JTD schema type into a string representation. This function takes a JTD schema type as input and returns a string that represents the type in a human-readable format. It handles various JTD schema constructs, such as references, primitive types, enums, arrays, objects, and discriminated unions. The resulting string can be used for documentation, error messages, or any context where a textual representation of the schema type is needed. The function recursively processes nested schemas to ensure that complex types are accurately represented in the output string.
 *
 * @param schema - The JTD schema type to stringify.
 * @returns A string representation of the JTD schema type.
 */
export function stringifyType(schema?: JTDSchemaType): string {
  if (!schema) {
    return "unknown";
  }

  if ("ref" in schema) {
    return schema.ref;
  }

  if ("type" in schema) {
    return ["float", "uint", "int"].some(prefix =>
      schema.type.startsWith(prefix)
    )
      ? "number"
      : schema.type === "timestamp"
        ? "string"
        : schema.type;
  }

  if ("enum" in schema) {
    return schema.enum.map(value => JSON.stringify(value)).join(" | ");
  }

  if ("elements" in schema) {
    return `${stringifyType(schema.elements)}[]`;
  }

  if ("values" in schema) {
    return `{ [key: string]: ${stringifyType(schema.values)} }`;
  }

  if ("properties" in schema || "optionalProperties" in schema) {
    return `{ ${Object.entries(getProperties(schema))
      .map(([key, value]) => {
        return `${key}${value.optional ? "?" : ""}: ${stringifyType(value)}`;
      })
      .join(";\n")} }`;
  }

  if ("discriminator" in schema) {
    return "object";
  }

  return "unknown";
}

/**
 * Generates standalone validation code for the provided JSON schemas using the Ajv library. This function takes an array of JSON schemas and an optional set of references or functions, and returns a string containing the generated validation code. The generated code can be used to validate data against the provided schemas without requiring the Ajv library at runtime, making it suitable for use in environments where minimizing dependencies is important.
 *
 * @param schemas - An array of JSON schemas to generate validation code for. Each schema should be a valid JSON schema object that defines the structure and constraints of the data to be validated.
 * @param refsOrFuncts - An optional parameter that can be either an object containing schema references or a function that returns such an object. This parameter allows you to provide additional schemas that may be referenced by the main schemas, or to define custom functions that can be used in the generated validation code. If not provided, the function will generate code based solely on the provided schemas.
 * @returns A promise that resolves to a string containing the generated standalone validation code.
 */
export async function generateCode(
  schemas: Options["schemas"],
  refsOrFuncts?: Parameters<typeof standaloneCode>[1]
) {
  return standaloneCode(
    new Ajv({
      jtd: true,
      schemas,
      code: { source: true, esm: true }
    }),
    refsOrFuncts
  );
}
