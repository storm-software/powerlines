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
import { getPropertiesList, isSchemaNullable, merge } from "./helpers";
import { getPrimarySchemaType } from "./metadata";
import { isJsonSchema, isJsonSchemaObject } from "./type-checks";
import { JsonSchema, JsonSchemaType } from "./types";
import { getValidator } from "./validate";

interface JsonSchemaObjectView {
  $ref?: string;
  type?: JsonSchemaType | readonly JsonSchemaType[];
  enum?: readonly unknown[];
  const?: unknown;
  default?: unknown;
  items?: JsonSchema | JsonSchema[];
  prefixItems?: JsonSchema[];
  properties?: Record<string, JsonSchema>;
  additionalProperties?: boolean | JsonSchema;
  required?: string[];
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  $defs?: Record<string, JsonSchema>;
  definitions?: Record<string, JsonSchema>;
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
    const items = Array.isArray(objectSchema.items)
      ? objectSchema.items[0]
      : objectSchema.items;

    return `${stringifyType(items)}[]`;
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
 * Resolves a local JSON Schema `$ref` (e.g. `#/$defs/Name`) to the referenced definition name.
 */
function resolveLocalRefName(ref: string): string | undefined {
  return /^#\/(?:definitions|\$defs)\/(.+)$/.exec(ref)?.[1];
}

/**
 * Converts an arbitrary definition name into a safe JavaScript identifier suffix.
 */
function toParserIdentifier(name: string): string {
  const cleaned = name.replace(/[^\w$]/gu, "_");

  return `parse_${/^\d/u.test(cleaned) ? `_${cleaned}` : cleaned}`;
}

/**
 * Returns the list of JSON Schema `type` keyword values declared on a fragment,
 * preserving `object` and `array` (which {@link readSchemaTypes} intentionally drops).
 */
function readDeclaredTypes(schema: JsonSchemaObjectView): JsonSchemaType[] {
  const type = schema.type;
  if (Array.isArray(type)) {
    return [...type];
  }

  return type ? [type as JsonSchemaType] : [];
}

/**
 * Generates a JavaScript expression that builds a path string for a child element.
 */
function childPath(pathExpr: string, segment: string): string {
  return `${pathExpr} + ${JSON.stringify(segment)}`;
}

/**
 * Generates standalone parser code for a JSON Schema.
 *
 * @remarks
 * The generated `parse` function reads an arbitrary input value and converts it
 * into the shape described by the schema. It walks the schema recursively to:
 *
 * - resolve local `$ref` pointers (`#/$defs/*` and `#/definitions/*`) into
 *   dedicated parser functions so recursive schemas are supported,
 * - apply `default` values for object properties (and root/array values) that
 *   are missing from the input,
 * - coerce primitive values to the declared type (for example `"42"` to `42`
 *   for an `integer` schema, or `1` to `true` for a `boolean` schema),
 * - validate `const`, `enum`, `oneOf`/`anyOf` and `allOf` constraints, and
 * - collect detailed, path-aware errors and throw a `ParserError` when the
 *   input cannot be converted into a valid value.
 *
 * @param schema - The JSON Schema to generate parser code for.
 * @returns The generated standalone parser code as a string.
 */
export function generateParserCode(schema: JsonSchema): string {
  const rootSchema =
    typeof schema === "boolean" ? schema : (schema as JsonSchemaObjectView);

  const definitions: Record<string, JsonSchema> =
    typeof rootSchema === "boolean"
      ? {}
      : { ...rootSchema.definitions, ...rootSchema.$defs };

  /**
   * Generates a JavaScript expression that parses `valueExpr` against `fragment`.
   * The expression has access to an in-scope mutable `errors` array.
   */
  function generateExpression(
    fragment: JsonSchema,
    valueExpr: string,
    pathExpr: string
  ): string {
    if (typeof fragment === "boolean") {
      return fragment
        ? valueExpr
        : `((value, path) => { errors.push({ path, message: "No value is allowed at this location" }); return value; })(${valueExpr}, ${pathExpr})`;
    }

    const view = fragment as JsonSchemaObjectView;

    if (isSetString(view.$ref)) {
      const refName = resolveLocalRefName(view.$ref);
      if (refName && refName in definitions) {
        return `${toParserIdentifier(refName)}(${valueExpr}, ${pathExpr}, errors)`;
      }

      // Unknown / external reference — pass the value through unchanged.
      return valueExpr;
    }

    return `((value, path) => {\n${generateBody(view)}\n})(${valueExpr}, ${pathExpr})`;
  }

  /**
   * Generates the body statements (including a terminating `return`) for the
   * arrow function produced by {@link generateExpression}.
   */
  function generateBody(view: JsonSchemaObjectView): string {
    const lines: string[] = [];
    const nullable = isSchemaNullable(view);

    if (view.default !== undefined) {
      lines.push(
        `if (value === undefined) { return ${JSON.stringify(view.default)}; }`
      );
    } else {
      lines.push(
        `if (value === undefined) { errors.push({ path, message: "A value is required" }); return value; }`
      );
    }

    if (nullable) {
      lines.push(`if (value === null) { return null; }`);
    }

    if (view.const !== undefined) {
      const constValue = JSON.stringify(view.const);
      lines.push(
        `if (JSON.stringify(value) !== ${JSON.stringify(constValue)}) { errors.push({ path, message: "Expected the constant value " + ${JSON.stringify(constValue)} }); }`,
        `return ${constValue};`
      );

      return lines.join("\n");
    }

    if (Array.isArray(view.enum)) {
      const enumValues = JSON.stringify(view.enum);
      lines.push(
        `if (!${enumValues}.some(allowed => JSON.stringify(allowed) === JSON.stringify(value))) { errors.push({ path, message: "Expected one of " + ${JSON.stringify(enumValues)} }); }`,
        `return value;`
      );

      return lines.join("\n");
    }

    if (Array.isArray(view.oneOf) || Array.isArray(view.anyOf)) {
      const branches = view.oneOf ?? view.anyOf ?? [];
      const branchFns = branches
        .map(
          branch =>
            `(value, path, errors) => (${generateExpression(branch, "value", "path")})`
        )
        .join(",\n");

      lines.push(
        `const branches = [\n${branchFns}\n];`,
        `for (const branch of branches) {`,
        `  const branchErrors = [];`,
        `  const branchResult = branch(value, path, branchErrors);`,
        `  if (branchErrors.length === 0) { return branchResult; }`,
        `}`,
        `errors.push({ path, message: "Value does not match any of the allowed schemas" });`,
        `return value;`
      );

      return lines.join("\n");
    }

    if (Array.isArray(view.allOf)) {
      const { allOf, ...rest } = view;
      const merged = merge(rest, ...allOf);
      lines.push(`return ${generateExpression(merged, "value", "path")};`);

      return lines.join("\n");
    }

    const declaredTypes = readDeclaredTypes(view);
    const primaryType =
      getPrimarySchemaType(view) ??
      declaredTypes.find(type => type !== "null") ??
      (view.properties ? "object" : view.items ? "array" : undefined);

    switch (primaryType) {
      case "object":
        lines.push(generateObjectBody(view));
        break;
      case "array":
        lines.push(generateArrayBody(view));
        break;
      case "string":
        lines.push(
          `if (typeof value === "string") { return value; }`,
          `if (typeof value === "number" || typeof value === "boolean") { return String(value); }`,
          `errors.push({ path, message: "Expected a string value" });`,
          `return value;`
        );
        break;
      case "integer":
        lines.push(
          `if (typeof value === "number" && Number.isInteger(value)) { return value; }`,
          `if (typeof value === "string" && value.trim() !== "" && Number.isInteger(Number(value))) { return Number(value); }`,
          `if (typeof value === "boolean") { return value ? 1 : 0; }`,
          `errors.push({ path, message: "Expected an integer value" });`,
          `return value;`
        );
        break;
      case "number":
        lines.push(
          `if (typeof value === "number") { return value; }`,
          `if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) { return Number(value); }`,
          `if (typeof value === "boolean") { return value ? 1 : 0; }`,
          `errors.push({ path, message: "Expected a number value" });`,
          `return value;`
        );
        break;
      case "boolean":
        lines.push(
          `if (typeof value === "boolean") { return value; }`,
          `if (value === "true" || value === 1) { return true; }`,
          `if (value === "false" || value === 0) { return false; }`,
          `errors.push({ path, message: "Expected a boolean value" });`,
          `return value;`
        );
        break;
      case "null":
        lines.push(
          `if (value === null) { return null; }`,
          `errors.push({ path, message: "Expected a null value" });`,
          `return value;`
        );
        break;
      case undefined:
      default:
        lines.push(`return value;`);
        break;
    }

    return lines.join("\n");
  }

  /**
   * Generates the parsing statements for an `object` schema, applying property
   * defaults and recursing into each declared property.
   */
  function generateObjectBody(view: JsonSchemaObjectView): string {
    const lines: string[] = [
      `if (typeof value !== "object" || value === null || Array.isArray(value)) { errors.push({ path, message: "Expected an object value" }); return value; }`,
      `const result = {};`
    ];

    const properties = isJsonSchemaObject(view) ? getPropertiesList(view) : [];
    const propertyNames = new Set<string>();

    for (const property of properties) {
      const name = property.name;
      propertyNames.add(name);

      const accessor = `value[${JSON.stringify(name)}]`;
      const propertyPath = childPath("path", `.${name}`);
      const propertyExpression = generateExpression(
        property,
        accessor,
        propertyPath
      );

      const missingBranch =
        property.default !== undefined
          ? `result[${JSON.stringify(name)}] = ${JSON.stringify(property.default)};`
          : property.required
            ? `errors.push({ path: ${propertyPath}, message: "Required property is missing" });`
            : ``;

      lines.push(
        `if (${accessor} !== undefined) {`,
        `  result[${JSON.stringify(name)}] = ${propertyExpression};`,
        `}${missingBranch ? ` else { ${missingBranch} }` : ``}`
      );
    }

    const additional = view.additionalProperties;
    if (isJsonSchema(additional)) {
      const additionalExpression = generateExpression(
        additional,
        `value[key]`,
        `path + "." + key`
      );

      lines.push(
        `for (const key of Object.keys(value)) {`,
        `  if (${JSON.stringify([...propertyNames])}.includes(key)) { continue; }`,
        `  result[key] = ${additionalExpression};`,
        `}`
      );
    } else if (additional !== false) {
      lines.push(
        `for (const key of Object.keys(value)) {`,
        `  if (${JSON.stringify([...propertyNames])}.includes(key)) { continue; }`,
        `  result[key] = value[key];`,
        `}`
      );
    }

    lines.push(`return result;`);

    return lines.join("\n");
  }

  /**
   * Generates the parsing statements for an `array` schema, recursing into each
   * item (supporting both list and tuple `items`/`prefixItems` forms).
   */
  function generateArrayBody(view: JsonSchemaObjectView): string {
    const lines: string[] = [
      `if (!Array.isArray(value)) { errors.push({ path, message: "Expected an array value" }); return value; }`
    ];

    const tupleItems =
      view.prefixItems ?? (Array.isArray(view.items) ? view.items : undefined);

    if (tupleItems) {
      const listItems = !Array.isArray(view.items) ? view.items : undefined;
      const itemExpressions = tupleItems.map(
        (item, index) =>
          `index === ${index} ? (${generateExpression(item, "item", childPath("path", `[${index}]`))})`
      );
      const fallbackExpression = listItems
        ? generateExpression(listItems, "item", `path + "[" + index + "]"`)
        : "item";

      lines.push(
        `return value.map((item, index) => ${itemExpressions.join(" : ")}${itemExpressions.length > 0 ? " : " : ""}${fallbackExpression});`
      );

      return lines.join("\n");
    }

    const itemSchema = (view.items ?? true) as JsonSchema;
    const itemExpression = generateExpression(
      itemSchema,
      "item",
      `path + "[" + index + "]"`
    );

    lines.push(`return value.map((item, index) => ${itemExpression});`);

    return lines.join("\n");
  }

  const parserFunctions = Object.entries(definitions).map(
    ([name, definition]) =>
      `function ${toParserIdentifier(name)}(value, path, errors) {\n  return ${generateExpression(definition, "value", "path")};\n}`
  );

  const rootExpression = generateExpression(schema, "value", '"$"');

  return `/**
 * Error thrown when an input value cannot be parsed into the type described by the JSON Schema.
 */
export class ParserError extends Error {
  constructor(errors) {
    super(
      "Failed to parse the provided value against the JSON Schema:\\n" +
        errors.map(error => "  - " + error.path + ": " + error.message).join("\\n")
    );

    this.name = "ParserError";
    this.errors = errors;
  }
}

${parserFunctions.join("\n\n")}

/**
 * Parses an input value into the type described by the JSON Schema.
 *
 * @remarks
 * The parser applies default values for missing properties, coerces primitive
 * values to the declared type, and throws a {@link ParserError} (containing
 * a detailed list of validation errors) when the value cannot be converted into
 * a valid result.
 *
 * @param value - The input value to parse.
 * @returns The parsed value conforming to the schema.
 */
export function parse(value) {
  const errors = [];
  const result = ${rootExpression};
  if (errors.length > 0) {
    throw new ParserError(errors);
  }

  return result;
}`;
}

/**
 * Generates standalone JSON Schema validation code using Ajv.
 *
 * @remarks
 * The generated code includes a validation function that can be used to validate data against the provided JSON Schema at runtime. The validation function will throw an error if the data does not conform to the schema, providing detailed information about the validation errors.
 *
 * @param schema - The JSON Schema to generate validation code for.
 * @param refsOrFuncts - Optional additional references or functions for Ajv's standalone code generation.
 * @returns The generated standalone validation code as a string.
 */
export function generateValidationCode(
  schema: JsonSchema,
  refsOrFuncts?: Parameters<typeof standaloneCode>[1]
) {
  return standaloneCode(getValidator(schema), refsOrFuncts);
}

/**
 * Generates standalone JavaScript code for validating and parsing data according to a JSON Schema.
 *
 * @remarks
 * The generated code includes:
 * - Validation code generated by Ajv for the provided JSON Schema, which can be used to validate data against the schema at runtime. The validation function will throw an error if the data does not conform to the schema, providing detailed information about the validation errors.
 * - Parsing code generated for the provided JSON Schema, which can be used to parse and validate data against the schema at runtime. The parsing function will apply default values specified in the schema if they are not present in the input data, throw an error if the input data does not conform to the schema (providing detailed information about the validation errors), and return the parsed data if it is valid according to the schema.
 *
 * @param schema - The JSON Schema to generate code for.
 * @param refsOrFuncts - Optional additional references or functions for Ajv's standalone code generation.
 * @returns The generated standalone validation and parsing code as a string.
 */
export function generateCode(
  schema: JsonSchema,
  refsOrFuncts?: Parameters<typeof standaloneCode>[1]
) {
  const validationCode = generateValidationCode(schema, refsOrFuncts);
  const parserCode = generateParserCode(schema);

  return `
/**
 * Validation code generated by Ajv for the provided JSON Schema. This code can be used to validate data against the schema at runtime. The validation function will throw an error if the data does not conform to the schema, providing detailed information about the validation errors.
 *
 * @see https://ajv.js.org/standalone.html
 */

${validationCode}

/**
 * Parsing code generated for the provided JSON Schema. This code can be used to parse and validate data against the schema at runtime. The parsing function will do the following:
 * - Apply default values specified in the schema if they are not present in the input data
 * - Throw an error if the input data does not conform to the schema, providing detailed information about the validation errors
 * - Return the parsed data if it is valid according to the schema
 */

${parserCode}
`;
}
