/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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
import { camelCase } from "@stryke/string-format/camel-case";
import { list } from "@stryke/string-format/list";
import { isInteger, isObject, isSetArray, isString } from "@stryke/type-checks";
import { isBoolean } from "@stryke/type-checks/is-boolean";
import { isNull } from "@stryke/type-checks/is-null";
import { isNumber } from "@stryke/type-checks/is-number";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import standaloneCode from "ajv/dist/standalone";
import { getPropertiesList, isSchemaNullable, merge } from "./helpers";
import { getPrimarySchemaType } from "./metadata";
import {
  isJsonSchema,
  isJsonSchemaLiteral,
  isJsonSchemaObject,
  isJsonSchemaString
} from "./type-checks";
import { JsonSchema, JsonSchemaLike, JsonSchemaType } from "./types";
import { getValidator } from "./validate";

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

  if (isJsonSchemaObject(schema) && isSetString(schema.name)) {
    return schema.name;
  }

  const objectSchema = schema as JsonSchemaLike;

  if (isSetString(objectSchema.$ref)) {
    const match = /^#\/(?:definitions|\$defs)\/(.+)$/.exec(objectSchema.$ref);

    return match?.[1] ?? objectSchema.$ref;
  }

  if (isJsonSchemaLiteral(schema) && !isUndefined(schema.const)) {
    return JSON.stringify(
      isSetString(schema.const)
        ? schema.const.replaceAll(/^['"`]|['"`]$/g, "")
        : schema.const
    );
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
function readDeclaredTypes(schema: JsonSchemaLike): JsonSchemaType[] {
  const type = schema.type;
  if (Array.isArray(type)) {
    return [...type];
  }

  return type ? [type] : [];
}

/**
 * Generates a JavaScript expression that builds a path string for a child element.
 */
function childPath(pathExpr: string, segment: string): string {
  return `${pathExpr} + ${JSON.stringify(segment)}`;
}

export interface GenerateParserCodeOptions {
  /**
   * The name of the parser function to generate.
   *
   * @defaultValue "parse"
   */
  name?: string;

  /**
   * Whether to ignore `default` values in the schema when generating the parser code. By default, the generated code will apply default values for missing properties and root/array values. Set this option to `true` to disable default value application, causing the generated parser to treat missing values as validation errors instead.
   */
  ignoreDefaults?: boolean;
}

/**
 * Generates standalone parser code for a JSON Schema.
 *
 * @remarks
 * The generated `parse` function reads an arbitrary input value and converts it into the shape described by the schema. It walks the schema recursively to:
 * - Resolve local `$ref` pointers (`#/$defs/*` and `#/definitions/*`) into dedicated parser functions so recursive schemas are supported,
 * - If {@link GenerateParserCodeOptions.ignoreDefaults | options.ignoreDefaults} is not `true`, apply `default` values for object properties (and root/array values) that are missing from the input,
 * - Coerce primitive values to the declared type (for example `"42"` to `42` for an `integer` schema, or `1` to `true` for a `boolean` schema),
 * - Validate `const`, `enum`, `oneOf`/`anyOf` and `allOf` constraints, and
 * - Collect detailed, path-aware errors and throw a `Error` when the input cannot be converted into a valid value.
 *
 * @param schema - The JSON Schema to generate parser code for.
 * @param options - Options to customize the generated code. By default, the generated code will apply default values from the schema for missing properties and root/array values. Set `options.ignoreDefaults` to `true` to disable default value application.
 * @returns The generated standalone parser code as a string.
 */
export function generateParserCode(
  schema: JsonSchema,
  options: GenerateParserCodeOptions = {}
): string {
  const rootSchema =
    typeof schema === "boolean" ? schema : (schema as JsonSchemaLike);

  const definitions: Record<string, JsonSchema> =
    typeof rootSchema === "boolean"
      ? {}
      : {
          ...(
            rootSchema as {
              definitions?: Record<string, JsonSchema>;
            }
          ).definitions,
          ...rootSchema.$defs
        };

  const tempCounter = {} as Record<string, number>;
  function nextTemp(prefix: string): string {
    const id = tempCounter[prefix] ?? 0;
    tempCounter[prefix] = id + 1;

    return `${prefix}${id > 0 ? `${id}` : ""}`;
  }

  /**
   * Generates inline parsing statements for a schema fragment.
   */
  function generateStatements(
    fragment: JsonSchemaLike,
    valueExpr: string,
    pathExpr: string,
    targetVar: string,
    errorsVar = "errors"
  ): string[] {
    if (typeof fragment === "boolean") {
      return fragment
        ? [`${targetVar} = ${valueExpr};`]
        : [
            `${errorsVar}.push({ path: ${pathExpr}, failure: "No value is allowed at this location" });`,
            `${targetVar} = ${valueExpr};`
          ];
    }

    if (isSetString(fragment.$ref)) {
      const refName = resolveLocalRefName(fragment.$ref);
      if (refName && refName in definitions) {
        return [
          `${targetVar} = ${toParserIdentifier(
            refName
          )}(${valueExpr}, ${pathExpr}, ${errorsVar});`
        ];
      }

      // Unknown / external reference — pass the value through unchanged.
      return [`${targetVar} = ${valueExpr};`];
    }

    const valueVar = nextTemp(
      fragment.name ? `${camelCase(fragment.name)}Value` : "value"
    );
    const pathVar = nextTemp(
      fragment.name ? `${camelCase(fragment.name)}Path` : "path"
    );
    const lines: string[] = [
      `const ${valueVar} = ${valueExpr};`,
      `const ${pathVar} = ${pathExpr};`
    ];

    if (!options.ignoreDefaults && fragment.default !== undefined) {
      lines.push(
        `if (${valueVar} === undefined${
          fragment.type === "string"
            ? ` || ${valueVar} === ""`
            : fragment.type === "number" || fragment.type === "integer"
              ? ` || Number.isNaN(${valueVar})`
              : ""
        }) {`,
        `  ${targetVar} = ${JSON.stringify(fragment.default)};`,
        `} else {`
      );

      if (isSchemaNullable(fragment)) {
        lines.push(
          `  if (${valueVar} === null) {`,
          `    ${targetVar} = null;`,
          `  } else {`
        );
        lines.push(
          ...generateCoreStatements(
            fragment,
            valueVar,
            pathVar,
            targetVar,
            errorsVar
          )
        );
        lines.push(`  }`);
      } else {
        lines.push(
          ...generateCoreStatements(
            fragment,
            valueVar,
            pathVar,
            targetVar,
            errorsVar
          )
        );
      }

      lines.push(`}`);

      return lines;
    }

    lines.push(
      `if (${valueVar} === undefined) {`,
      `  ${errorsVar}.push({ path: ${pathVar}, failure: "A value is required" });`,
      `  ${targetVar} = ${valueVar};`,
      `} else {`
    );

    if (isSchemaNullable(fragment)) {
      lines.push(
        `  if (${valueVar} === null) {`,
        `    ${targetVar} = null;`,
        `  } else {`
      );
      lines.push(
        ...generateCoreStatements(
          fragment,
          valueVar,
          pathVar,
          targetVar,
          errorsVar
        )
      );
      lines.push(`  }`);
    } else {
      lines.push(
        ...generateCoreStatements(
          fragment,
          valueVar,
          pathVar,
          targetVar,
          errorsVar
        )
      );
    }

    lines.push(`}`);

    return lines;
  }

  /**
   * Generates inline parsing statements assuming `value` is already defined.
   */
  function generateCoreStatements(
    schema: JsonSchemaLike,
    valueVar: string,
    pathVar: string,
    targetVar: string,
    errorsVar: string
  ): string[] {
    const lines: string[] = [];
    if (schema.const !== undefined) {
      const constValue = JSON.stringify(schema.const);
      lines.push(
        `if (${schema.type === "string" ? valueVar : `JSON.stringify(${valueVar})`} !== ${constValue}) { ${
          errorsVar
        }.push({ path: ${pathVar}, failure: "Expected the constant value " + ${
          constValue
        } }); }`,
        `${targetVar} = ${constValue};`
      );

      return lines;
    }

    if (Array.isArray(schema.enum)) {
      const enumValues = JSON.stringify(schema.enum);
      lines.push(
        `if (!${enumValues}.some(allowed => JSON.stringify(allowed) === JSON.stringify(${
          valueVar
        }))) { ${errorsVar}.push({ path: ${
          pathVar
        }, failure: \`Expected one of: ${list(
          schema.enum.map(value => JSON.stringify(value)),
          {
            conjunction: "or"
          }
        )}, instead received: \${JSON.stringify(${valueVar})}\` }); }`,
        `${targetVar} = ${valueVar};`
      );

      return lines;
    }

    if (Array.isArray(schema.oneOf) || Array.isArray(schema.anyOf)) {
      const branches = schema.oneOf ?? schema.anyOf ?? [];
      const matchedVar = nextTemp(
        schema.name ? `${camelCase(schema.name)}Matched` : "matched"
      );

      lines.push(`let ${matchedVar} = false;`);

      for (const branch of branches) {
        const branchErrorsVar = nextTemp(
          schema.name ? `${camelCase(schema.name)}BranchErrors` : "branchErrors"
        );
        const branchResultVar = nextTemp(
          schema.name ? `${camelCase(schema.name)}BranchResult` : "branchResult"
        );

        lines.push(`if (!${matchedVar}) {`);
        lines.push(
          `  const ${branchErrorsVar}: { path: string; failure: string }[] = [];`,
          `  let ${branchResultVar};`
        );
        lines.push(
          ...generateStatements(
            branch,
            valueVar,
            pathVar,
            branchResultVar,
            branchErrorsVar
          )
        );
        lines.push(
          `  if (${branchErrorsVar}.length === 0) {`,
          `    ${targetVar} = ${branchResultVar};`,
          `    ${matchedVar} = true;`,
          `  }`,
          `}`
        );
      }

      lines.push(
        `if (!${matchedVar}) {`,
        `  ${errorsVar}.push({ path: ${pathVar}, failure: \`The provided value \${JSON.stringify(${valueVar})} does not match the allowed schemas\` });`,
        `  ${targetVar} = ${valueVar};`,
        `}`
      );

      return lines;
    }

    if (Array.isArray(schema.allOf)) {
      const { allOf, ...rest } = schema;
      const merged = merge(rest, ...allOf);
      lines.push(
        ...generateStatements(merged, valueVar, pathVar, targetVar, errorsVar)
      );

      return lines;
    }

    const declaredTypes = readDeclaredTypes(schema);
    const primaryType =
      getPrimarySchemaType(schema) ??
      declaredTypes.find(type => type !== "null") ??
      (schema.properties ? "object" : schema.items ? "array" : undefined);

    switch (primaryType) {
      case "object":
        lines.push(
          ...generateObjectStatements(
            schema,
            valueVar,
            pathVar,
            targetVar,
            errorsVar
          )
        );
        break;
      case "array":
        lines.push(
          ...generateArrayStatements(
            schema,
            valueVar,
            pathVar,
            targetVar,
            errorsVar
          )
        );
        break;
      case "string":
        lines.push(
          `if (typeof ${valueVar} === "string") {`,
          `  ${targetVar} = ${valueVar};`,
          `} else if (typeof ${valueVar} === "number" || typeof ${valueVar} === "boolean") {`,
          `  ${targetVar} = String(${valueVar});`,
          `} else {`,
          `  ${errorsVar}.push({ path: ${pathVar}, failure: "Expected a string value" });`,
          `  ${targetVar} = ${valueVar};`,
          `}`
        );
        break;
      case "integer":
        lines.push(
          `if (typeof ${valueVar} === "number" && Number.isInteger(${valueVar})) {`,
          `  ${targetVar} = ${valueVar};`,
          `} else if (typeof ${valueVar} === "string" && ${valueVar}.trim() !== "" && Number.isInteger(Number(${valueVar}))) {`,
          `  ${targetVar} = Number(${valueVar});`,
          `} else if (typeof ${valueVar} === "boolean") {`,
          `  ${targetVar} = ${valueVar} ? 1 : 0;`,
          `} else {`,
          `  ${errorsVar}.push({ path: ${pathVar}, failure: "Expected an integer value" });`,
          `  ${targetVar} = ${valueVar};`,
          `}`
        );
        break;
      case "number":
        lines.push(
          `if (typeof ${valueVar} === "number") {`,
          `  ${targetVar} = ${valueVar};`,
          `} else if (typeof ${valueVar} === "string" && ${valueVar}.trim() !== "" && !Number.isNaN(Number(${valueVar}))) {`,
          `  ${targetVar} = Number(${valueVar});`,
          `} else if (typeof ${valueVar} === "boolean") {`,
          `  ${targetVar} = ${valueVar} ? 1 : 0;`,
          `} else {`,
          `  ${errorsVar}.push({ path: ${pathVar}, failure: "Expected a number value" });`,
          `  ${targetVar} = ${valueVar};`,
          `}`
        );
        break;
      case "boolean":
        lines.push(
          `if (typeof ${valueVar} === "boolean") {`,
          `  ${targetVar} = ${valueVar};`,
          `} else if ((typeof ${valueVar} === "string" && (${valueVar}.toLowerCase() === "true" || ${valueVar}.toLowerCase() === "t" || ${valueVar}.toLowerCase() === "yes" || ${valueVar}.toLowerCase() === "y" || (!Number.isNaN(Number.parseInt(${valueVar})) && Number.parseInt(${valueVar}) > 0))) || (typeof ${valueVar} === "number" && ${valueVar} > 0)) {`,
          `  ${targetVar} = true;`,
          `} else if ((typeof ${valueVar} === "string" && (${valueVar}.toLowerCase() === "false" || ${valueVar}.toLowerCase() === "f" || ${valueVar}.toLowerCase() === "no" || ${valueVar}.toLowerCase() === "n" || (!Number.isNaN(Number.parseInt(${valueVar})) && Number.parseInt(${valueVar}) <= 0))) || (typeof ${valueVar} === "number" && ${valueVar} <= 0)) {`,
          `  ${targetVar} = false;`,
          `} else {`,
          `  ${errorsVar}.push({ path: ${pathVar}, failure: "Expected a boolean value" });`,
          `  ${targetVar} = ${valueVar};`,
          `}`
        );
        break;
      case "null":
        lines.push(
          `if (${valueVar} === null) {`,
          `  ${targetVar} = null;`,
          `} else {`,
          `  ${errorsVar}.push({ path: ${pathVar}, failure: "Expected a null value" });`,
          `  ${targetVar} = ${valueVar};`,
          `}`
        );
        break;
      case undefined:
      default:
        lines.push(`${targetVar} = ${valueVar};`);
        break;
    }

    return lines;
  }

  /**
   * Generates the parsing statements for an `object` schema, applying property defaults and recursing into each declared property.
   */
  function generateObjectStatements(
    schema: JsonSchemaLike,
    valueVar: string,
    pathVar: string,
    targetVar: string,
    errorsVar: string
  ): string[] {
    const type = stringifyType(schema);
    const lines: string[] = [
      `if (typeof ${valueVar} !== "object" || ${valueVar} === null || Array.isArray(${valueVar})) {`,
      `  ${errorsVar}.push({ path: ${pathVar}, failure: "Expected an object value" });`,
      `  ${targetVar} = ${valueVar};`,
      `} else {`
    ];

    const resultVar = nextTemp(
      type || schema.name ? `${camelCase(type || schema.name)}Schema` : "schema"
    );
    lines.push(`const ${resultVar} = {} as Record<string, any>`);

    if (isJsonSchemaObject(schema)) {
      const propertyNames = new Set<string>();
      for (const property of getPropertiesList(schema)) {
        propertyNames.add(property.name);

        let accessor!: string;
        if (isSetArray(property.alias)) {
          accessor = `(${property
            .alias!.map(alias => `${valueVar}[${JSON.stringify(alias)}]`)
            .join(` ${isJsonSchemaString(property) ? "||" : "??"} `)} ${
            isJsonSchemaString(property) ? "||" : "??"
          } ${valueVar}[${JSON.stringify(property.name)}])`;
          property.alias!.forEach(alias => propertyNames.add(alias));
        } else {
          accessor = `${valueVar}[${JSON.stringify(property.name)}]`;
        }

        const propertyPath = childPath(pathVar, `.${property.name}`);
        const propertyVar = nextTemp(
          property.name ? `${camelCase(property.name)}Property` : "property"
        );

        const missingBranch =
          property.default !== undefined
            ? `${resultVar}[${JSON.stringify(property.name)}] = ${JSON.stringify(
                property.default
              )};`
            : property.required
              ? `${errorsVar}.push({ path: ${propertyPath}, failure: "Required property is missing" });`
              : "";

        lines.push(
          `  if (${accessor} !== undefined) {`,
          `    let ${propertyVar};`
        );
        lines.push(
          ...generateStatements(
            property as JsonSchemaLike,
            accessor,
            propertyPath,
            propertyVar,
            errorsVar
          )
        );
        lines.push(
          `${resultVar}[${JSON.stringify(property.name)}] = ${propertyVar};`
        );
        if (missingBranch) {
          lines.push(`} else { ${missingBranch} }`);
        } else {
          lines.push("}");
        }
      }

      const additional = schema.additionalProperties;
      if (isJsonSchema(additional)) {
        const additionalVar = nextTemp(
          type || schema.name
            ? `${camelCase(type || schema.name)}AdditionalProperties`
            : "additionalProperties"
        );

        lines.push(
          `  for (const key of Object.keys(${valueVar})) {`,
          `    if (${JSON.stringify([...propertyNames])}.includes(key)) { continue; }`,
          `    let ${additionalVar};`
        );
        lines.push(
          ...generateStatements(
            additional,
            `${valueVar}[key]`,
            `${pathVar} + "." + key`,
            additionalVar,
            errorsVar
          )
        );
        lines.push(`${resultVar}[key] = ${additionalVar};`, `}`);
      } else if (additional !== false) {
        lines.push(
          `  for (const key of Object.keys(${valueVar})) {`,
          `    if (${JSON.stringify([...propertyNames])}.includes(key)) { continue; }`,
          `    ${resultVar}[key] = ${valueVar}[key];`,
          `}`
        );
      }
    }

    lines.push(`${targetVar} = ${resultVar};`, `}`);
    return lines;
  }

  /**
   * Generates the parsing statements for an `array` schema, recursing into each
   * item (supporting both list and tuple `items`/`prefixItems` forms).
   */
  function generateArrayStatements(
    schema: JsonSchemaLike,
    valueVar: string,
    pathVar: string,
    targetVar: string,
    errorsVar: string
  ): string[] {
    const lines: string[] = [
      `if (!Array.isArray(${valueVar})) {`,
      `  ${errorsVar}.push({ path: ${pathVar}, failure: "Expected an array value" });`,
      `  ${targetVar} = ${valueVar};`,
      `} else {`
    ];

    const resultVar = nextTemp(
      schema.name ? `${camelCase(schema.name)}Array` : "array"
    );
    lines.push(`const ${resultVar}: unknown[] = [];`);

    const tupleItems =
      schema.prefixItems ??
      (Array.isArray(schema.items) ? schema.items : undefined);

    if (tupleItems) {
      const listItems = !Array.isArray(schema.items) ? schema.items : undefined;
      lines.push(
        `  for (let index = 0; index < ${valueVar}.length; index += 1) {`,
        `    const item = ${valueVar}[index];`,
        `    let itemResult;`
      );

      tupleItems.forEach((item, index) => {
        lines.push(` ${index === 0 ? "if" : "else if"} (index === ${index}) {`);
        lines.push(
          ...generateStatements(
            item,
            "item",
            childPath(pathVar, `[${index}]`),
            "itemResult",
            errorsVar
          )
        );
        lines.push("}");
      });

      if (listItems) {
        lines.push("else {");
        lines.push(
          ...generateStatements(
            listItems as JsonSchemaLike,
            "item",
            `${pathVar} + "[" + index + "]"`,
            "itemResult",
            errorsVar
          )
        );
        lines.push("}");
      } else {
        lines.push("else { itemResult = item; }");
      }

      lines.push(
        `    ${resultVar}.push(itemResult);`,
        `  }`,
        `  ${targetVar} = ${resultVar};`,
        `}`
      );

      return lines;
    }

    const itemSchema = (schema.items ?? true) as JsonSchema;
    lines.push(
      `  for (let index = 0; index < ${valueVar}.length; index += 1) {`,
      `    const item = ${valueVar}[index];`,
      `    let itemResult;`
    );
    lines.push(
      ...generateStatements(
        itemSchema,
        "item",
        `${pathVar} + "[" + index + "]"`,
        "itemResult",
        errorsVar
      )
    );
    lines.push(
      `    ${resultVar}.push(itemResult);`,
      `  }`,
      `  ${targetVar} = ${resultVar};`,
      `}`
    );

    return lines;
  }

  const parserFunctions = Object.entries(definitions).map(
    ([name, definition]) =>
      `function ${toParserIdentifier(name)}(value, path, errors) {\nlet result;\n${generateStatements(
        definition,
        "value",
        "path",
        "result",
        "errors"
      ).join("\n")}\n\n  return result${
        definition.name ? ` as ${stringifyType(definition)}` : ""
      };\n}`
  );

  return `${parserFunctions.join("\n\n")}

/**
 * Safely parses an input value into the type described by the JSON Schema, returning an array of validation errors when the value cannot be converted into a valid result.
 *
 * @remarks
 * The parser applies default values for missing properties, coerces primitive values to the declared type, and returns an array of validation errors when the value cannot be converted into a valid result.
 *
 * @param value - The input value to parse.
 * @returns The parsed value conforming to the schema or an array of validation errors.
 */
export function ${options.name || "parse"}Safe(value: Record<string, unknown>)${
    schema.name ? `: ${stringifyType(schema)}` : ""
  } | { path: string; failure: string }[] {
  const errors: { path: string; failure: string }[] = [];

  let result;
  ${generateStatements(schema, "value", '"$"', "result", "errors").join("\n")}

  if (errors.length > 0) {
    return errors;
  }

  return result${schema.name ? ` as ${stringifyType(schema)}` : ""};
}

/**
 * Parses an input value into the type described by the JSON Schema, throwing an error if the value cannot be converted into a valid result.
 *
 * @remarks
 * The parser applies default values for missing properties, coerces primitive values to the declared type, and throws a {@link Error} (containing a detailed list of validation errors) when the value cannot be converted into a valid result.
 *
 * @param value - The input value to parse.
 * @returns The parsed value conforming to the schema.
 * @throws {Error} When the input value cannot be parsed into a valid result according to the schema. The error contains a detailed list of validation errors with their respective paths and failure messages.
 */
export function ${options.name || "parse"}(value: Record<string, unknown>)${
    schema.name ? `: ${stringifyType(schema)}` : ""
  } {
  const errors: { path: string; failure: string }[] = [];

  const result = ${options.name || "parse"}Safe(value);
  if (Array.isArray(result) && result.length > 0 && result.every(error => "path" in error && typeof error.path === "string" && error.path && "failure" in error && typeof error.failure === "string" && error.failure)) {
    throw new Error(\`The following validation errors occurred while parsing the ${
      schema.name ? `${schema.name} input` : "input value"
    }: \\n\${Object.entries(result.reduce((acc, error) => ((acc[error.path] ??= []).push(error.failure), acc), {} as Record<string, string[]>)).map(([path, failures]) => \`\${path.replace(/^\\$\\./, "") ? \`\${path.replace(/^\\$\\./, "")}: \\n\` : ""}\${failures.map(failure => \` - \${failure}\`).join("\\n")}\`).join("\\n")}\`);
  }

  return result${schema.name ? ` as ${stringifyType(schema)}` : ""};
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
  return `${generateValidationCode(
    schema,
    refsOrFuncts
  )}\n\n${generateParserCode(schema)}`;
}
