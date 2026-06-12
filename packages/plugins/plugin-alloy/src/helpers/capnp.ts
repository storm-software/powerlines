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

import type {
  GetPropertiesResult,
  JsonSchema,
  JsonSchemaAnyOf,
  JsonSchemaEnum,
  JsonSchemaLike,
  JsonSchemaNativeEnum,
  JsonSchemaObject
} from "@powerlines/schema";
import {
  getPropertiesList,
  isJsonSchemaAnyOf,
  isJsonSchemaArray,
  isJsonSchemaBigint,
  isJsonSchemaBoolean,
  isJsonSchemaDate,
  isJsonSchemaEnum,
  isJsonSchemaInteger,
  isJsonSchemaLiteral,
  isJsonSchemaMap,
  isJsonSchemaNativeEnum,
  isJsonSchemaNever,
  isJsonSchemaNull,
  isJsonSchemaNumber,
  isJsonSchemaObject,
  isJsonSchemaRecord,
  isJsonSchemaRef,
  isJsonSchemaSet,
  isJsonSchemaString,
  isJsonSchemaTuple,
  isJsonSchemaUndefined,
  isJsonSchemaUnion
} from "@powerlines/schema";
import { capnpc } from "@stryke/capnp/compile";
import { resolveOptions } from "@stryke/capnp/helpers";
import type { CapnpcOptions, CapnpcResult } from "@stryke/capnp/types";
import { toArray } from "@stryke/convert/to-array";
import { getUniqueBy } from "@stryke/helpers/get-unique";
import { StormJSON } from "@stryke/json";
import { joinPaths } from "@stryke/path/join";
import { camelCase } from "@stryke/string-format/camel-case";
import { getWords } from "@stryke/string-format/get-words";
import { pascalCase } from "@stryke/string-format/pascal-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isBigInt } from "@stryke/type-checks/is-bigint";
import { isNumber } from "@stryke/type-checks/is-number";
import { isString } from "@stryke/type-checks/is-string";
import defu from "defu";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { Context, PluginContext } from "powerlines";
import { getFileHeader } from "powerlines/utils";

/**
 * Compiles a Cap'n Proto schema into TypeScript definitions.
 *
 * @param context - The context containing the project and workspace information.
 * @param options - The options for compiling the schema.
 * @returns A promise that resolves to the compiled schema.
 */
export async function compile(
  context: Context,
  options: Partial<CapnpcOptions> = {}
): Promise<CapnpcResult> {
  const opts = defu(options, {
    ts: true,
    js: false,
    dts: false,
    schemas: joinPaths(context.artifactsPath, "schemas"),
    tsconfig: context.tsconfig,
    projectRoot: context.config.root,
    workspaceRoot: context.config.cwd,
    tty: true
  }) as Parameters<typeof resolveOptions>[0];

  const resolvedOptions = await resolveOptions(opts);
  if (!resolvedOptions) {
    throw new Error(
      `✖ No Cap'n Proto schema files found in the specified source paths: ${toArray(
        opts.schemas
      ).join(", ")}.`
    );
  }

  return capnpc(resolvedOptions);
}

/**
 * Converts any {@link ReflectionProperty} or {@link ReflectionParameter}'s value to string representation.
 *
 * @param property - The {@link ReflectionProperty} or {@link ReflectionParameter} containing the value to stringify.
 * @param value - The value to stringify.
 * @returns A string representation of the value.
 */
export function stringifyCapnpDefaultValue(
  property: GetPropertiesResult,
  value?: any
): string {
  return stringifyCapnpValue(property, value ?? property.default);
}

/**
 * Converts any {@link Type}'s actual value to string representation.
 *
 * @param type - The {@link Type} of the value to stringify.
 * @param value - The value to stringify.
 * @returns A string representation of the value.
 */
export function stringifyCapnpValue(schema: JsonSchema, value: any): string {
  return isJsonSchemaString(schema) ||
    (isJsonSchemaLiteral(schema) && isString((schema as JsonSchemaLike).const))
    ? `"${String(value)}"`
    : isJsonSchemaEnum(schema) || isJsonSchemaNativeEnum(schema)
      ? `${camelCase(String(value))}`
      : isJsonSchemaArray(schema) && !isJsonSchemaMap(schema)
        ? StormJSON.stringify(value)
        : isJsonSchemaObject(schema) || isJsonSchemaRecord(schema)
          ? StormJSON.stringify(value).replaceAll("{", "(").replaceAll("}", ")")
          : String(value);
}

/**
 * Converts a ReflectionProperty's default value to a Cap'n Proto schema string representation.
 *
 * @param type - The TypeEnum to evaluate.
 * @returns A string representation of the property.
 */
export function getCapnpEnumTypes(
  schema: JsonSchema
): "Text" | "Float32" | null {
  const s = schema as JsonSchemaLike;
  if (!s.enum || !Array.isArray(s.enum)) {
    return null;
  }

  const values = s.enum.filter(v => v !== null && v !== undefined);
  if (values.length === 0) {
    return null;
  }

  const unique = getUniqueBy(values, v => (isString(v) ? "Text" : "Float32"));

  return unique.length > 0 && isString(unique[0]) ? "Text" : "Float32";
}

/**
 * Determines if a Type is a `Void` type in a Cap'n Proto schema.
 *
 * @param type - The Type to check.
 * @returns True if the Type is a `Void` type, false otherwise.
 */
export function isVoidType(schema: JsonSchema): boolean {
  return (
    isJsonSchemaNever(schema) ||
    isJsonSchemaNull(schema) ||
    isJsonSchemaUndefined(schema)
  );
}

/**
 * Converts a {@link TypeUnion} to an array of its underlying Cap'n Proto primitive type representation.
 *
 * @param type - The {@link TypeUnion} to convert.
 * @returns A string representation of the Cap'n Proto primitive type.
 */
export function getCapnpUnionTypes(schema: JsonSchema): JsonSchema[] {
  const s = schema as JsonSchemaLike;
  if (Array.isArray(s.anyOf)) {
    return s.anyOf;
  }
  if (Array.isArray(s.oneOf)) {
    return s.oneOf;
  }
  if (Array.isArray(s.type)) {
    return (s.type as string[]).map(t => ({ type: t }) as JsonSchema);
  }
  return [];
}

/**
 * Converts a {@link TypeUnion} to an array of its underlying Cap'n Proto primitive type representation.
 *
 * @param type - The {@link TypeUnion} to convert.
 * @returns An array of Cap'n Proto primitive types.
 */
export function isCapnpStringUnion(schema: JsonSchema): boolean {
  return getCapnpUnionTypes(schema).some(
    member =>
      isJsonSchemaString(member) ||
      (isJsonSchemaLiteral(member) &&
        isString((member as JsonSchemaLike).const))
  );
}

export const LARGE_BUFFER = 1024 * 1000000;
export type IOType = "overlapped" | "pipe" | "ignore" | "inherit";
export type StdioOptions =
  | IOType
  | Array<IOType | "ipc" | number | null | undefined>;

const execAsync = promisify(exec);

export async function generateCapnpId() {
  const { stdout } = await execAsync("capnp id", {
    windowsHide: true,
    maxBuffer: LARGE_BUFFER,
    killSignal: "SIGTERM"
  });

  return stdout;
}

export interface GenerateCapnpOptions {
  name?: string;
}

export async function generateCapnp(
  context: PluginContext,
  schema: JsonSchemaObject,
  options: GenerateCapnpOptions
) {
  const capnpId = await generateCapnpId();

  return `${capnpId.trim()};
${getFileHeader(context)
  .replace(/^\r*\n*/g, "")
  .replaceAll("//", "#")}
${generateCapnpStruct(schema, options)}
`.trim();
}

export interface GenerateCapnpStructOptions extends GenerateCapnpOptions {
  indexCounter?: () => number;
}

export function generateCapnpStruct(
  schema: JsonSchemaObject,
  options: GenerateCapnpStructOptions = {}
): string {
  const structName = options?.name || schema.title || schema.name || "Schema";

  return `${generateCapnpEnums(schema)}struct ${pascalCase(structName)} {
  # Struct definition for ${titleCase(structName)}.

  ${generateCapnpSchema(schema, options)}
}
`;
}

export function generateCapnpInterface(
  schema: JsonSchemaObject,
  options: GenerateCapnpStructOptions = {}
): string {
  const interfaceName =
    options?.name || schema.title || schema.name || "Schema";

  return `${generateCapnpEnums(schema)}interface ${pascalCase(interfaceName)} {
  # Interface definition for ${titleCase(interfaceName)}.

  ${generateCapnpSchema(schema, options)}
}
`;
}

function formatEnumName(name: string) {
  return pascalCase(`${name}_Type`);
}

function generateCapnpEnums(schema: JsonSchemaObject): string {
  const props = getPropertiesList(schema);
  const enums = props
    .filter(
      prop =>
        !(prop as JsonSchemaLike).ignore &&
        (isJsonSchemaEnum(prop) ||
          isJsonSchemaNativeEnum(prop) ||
          ((isJsonSchemaUnion(prop) || isJsonSchemaAnyOf(prop)) &&
            getCapnpUnionTypes(prop).filter(
              t =>
                isJsonSchemaLiteral(t) &&
                (isString((t as JsonSchemaLike).const) ||
                  isNumber((t as JsonSchemaLike).const))
            ).length === 1))
    )
    .sort((a, b) =>
      (a.readOnly && b.readOnly) || (!a.readOnly && !b.readOnly)
        ? b.name.localeCompare(a.name)
        : a.readOnly
          ? 1
          : -1
    );
  if (enums.length === 0) {
    return "";
  }

  return `${enums
    .map(prop =>
      generateCapnpEnumSchema(
        prop as unknown as
          | JsonSchemaEnum
          | JsonSchemaNativeEnum
          | JsonSchemaAnyOf,
        formatEnumName(prop.name)
      )
    )
    .join("\n\n")}

`;
}

export function generateCapnpSchema(
  schema: JsonSchemaObject,
  options: GenerateCapnpStructOptions = {}
): string {
  let index = 0;
  const indexCounter: () => number = options?.indexCounter ?? (() => index++);

  const props = getPropertiesList(schema);
  const filteredProps = props
    .filter(prop => !(prop as JsonSchemaLike).ignore)
    .sort((a, b) =>
      (a.readOnly && b.readOnly) || (!a.readOnly && !b.readOnly)
        ? b.name.localeCompare(a.name)
        : a.readOnly
          ? 1
          : -1
    );

  const hasMap = props.some(prop => isJsonSchemaMap(prop));
  const hasDate = props.some(prop => isJsonSchemaDate(prop));

  return `${filteredProps
    .map(prop => generateCapnpPropertySchema(prop, indexCounter))
    .join(" \n\n\t")}${
    hasMap
      ? `
  struct Map(Key, Value) {
    entries @0 :List(Entry);

    struct Entry {
      key @0 :Key;
      value @1 :Value;
    }
  }`
      : ""
  }${
    hasDate
      ? `
  struct Date {
    # A standard Gregorian calendar date.

    year @0 :Int16;
    # The year - Must include the century.
    # Negative value indicates BC.

    month @1 :UInt8; # The month, 1-12

    day @2 :UInt8; # The day of the month, 1-30

    hour @3 :UInt8;    # The hour of the day, 0-23

    minute @4 :UInt8;  # The minute of the hour, 0-59

    second @5 :UInt8;  # The second of the minute, 0-59

    millisecond @6 :UInt16; # Milliseconds of the second, 0-999
  }`
      : ""
  }`;
}

function generateCapnpPropertyComment(prop: GetPropertiesResult) {
  const result = getWords(
    prop.description ||
      `A schema property for ${titleCase(prop.title || prop.name)} field.`,
    {
      relaxed: true
    }
  )
    .reduce((ret, word) => {
      let length = ret.length;
      if (ret.includes("\n")) {
        length = ret.substring(ret.lastIndexOf("\n") + 1).length;
      }

      const current = word.trim();
      if (length + current.length > 60) {
        ret += `\n\t# ${current}`;
      } else {
        ret += ` ${current}`;
      }
      return ret;
    }, "")
    .trim();
  if (result.length > 0) {
    return `\t# ${result}`;
  }

  return "";
}

function generateCapnpPropertySchema(
  prop: GetPropertiesResult,
  indexCounter: () => number
): string {
  const propName = prop.name;
  const defaultStr =
    prop.default !== undefined ? ` = ${stringifyCapnpDefaultValue(prop)}` : "";

  if (isJsonSchemaUnion(prop) || isJsonSchemaAnyOf(prop)) {
    const unionTypes = getCapnpUnionTypes(prop);
    if (unionTypes.length === 0) {
      return `${camelCase(propName)} @${indexCounter()} :Void;
${generateCapnpPropertyComment(prop)}`;
    } else if (
      unionTypes.filter(
        t =>
          isJsonSchemaLiteral(t) &&
          (isString((t as JsonSchemaLike).const) ||
            isNumber((t as JsonSchemaLike).const))
      ).length === 1
    ) {
      return `${camelCase(propName)} @${indexCounter()} :${formatEnumName(propName)}${defaultStr};
${generateCapnpPropertyComment(prop)}`;
    } else {
      return `${camelCase(propName)} :union {
${unionTypes
  .map(t => {
    const typeName = getJsonSchemaCapnpTypeName(t);

    return `   ${typeName} @${indexCounter()} :${generateCapnpPrimitive(t)};`;
  })
  .join("\n")}
  }
${generateCapnpPropertyComment(prop)}`;
    }
  } else if (isJsonSchemaMap(prop)) {
    const keySchema = prop.items?.prefixItems?.[0];
    const valueSchema = prop.items?.prefixItems?.[1];

    return `${camelCase(propName)} @${indexCounter()} :Map(${
      keySchema ? generateCapnpPrimitive(keySchema) : "Data"
    }, ${valueSchema ? generateCapnpPrimitive(valueSchema) : "Data"})${defaultStr};
${generateCapnpPropertyComment(prop)}`;
  } else if (isJsonSchemaDate(prop)) {
    return `${camelCase(propName)} @${indexCounter()} :Data${defaultStr};
${generateCapnpPropertyComment(prop)}`;
  } else if (isJsonSchemaSet(prop) || isJsonSchemaTuple(prop)) {
    const itemSchema = (prop as unknown as JsonSchemaLike).items as
      | JsonSchema
      | undefined;

    return `${camelCase(propName)} @${indexCounter()} :List(${
      itemSchema ? generateCapnpPrimitive(itemSchema) : "Data"
    })${defaultStr};
${generateCapnpPropertyComment(prop)}`;
  } else if (isJsonSchemaArray(prop)) {
    const itemSchema = (prop as unknown as JsonSchemaLike).items as
      | JsonSchema
      | undefined;

    return `${camelCase(propName)} @${indexCounter()} :List(${
      itemSchema ? generateCapnpPrimitive(itemSchema) : "Data"
    })${defaultStr};
${generateCapnpPropertyComment(prop)}`;
  } else if (isJsonSchemaRef(prop)) {
    const refName = prop.$ref.split("/").pop() || prop.$ref;

    return `${camelCase(propName)} @${indexCounter()} :${pascalCase(refName)}${defaultStr};
${generateCapnpPropertyComment(prop)}`;
  } else if (isJsonSchemaObject(prop) || isJsonSchemaRecord(prop)) {
    const typeName = prop.title || propName;

    return `${camelCase(propName)} @${indexCounter()} :${pascalCase(typeName)}${generateCapnpStruct(
      prop as unknown as JsonSchemaObject,
      {
        name: pascalCase(typeName)
      }
    )}${defaultStr};
${generateCapnpPropertyComment(prop)}`;
  } else if (isJsonSchemaEnum(prop) || isJsonSchemaNativeEnum(prop)) {
    return `${camelCase(propName)} @${indexCounter()} :${pascalCase(propName)}${defaultStr};
${generateCapnpPropertyComment(prop)}`;
  }

  return `${camelCase(propName)} @${indexCounter()} :${generateCapnpPrimitive(prop)}${defaultStr};
${generateCapnpPropertyComment(prop)}`;
}

export function generateCapnpEnumSchema(
  schema: JsonSchemaEnum | JsonSchemaNativeEnum | JsonSchemaAnyOf,
  name: string
): string {
  if (isJsonSchemaAnyOf(schema)) {
    const enumValues = (schema.anyOf || [])
      .filter(
        t =>
          isJsonSchemaLiteral(t) &&
          (isString((t as JsonSchemaLike).const) ||
            isNumber((t as JsonSchemaLike).const))
      )
      .map(t => (t as JsonSchemaLike).const as string | number);

    return generateCapnpEnumSchema(
      {
        type: enumValues.some(v => isString(v)) ? "string" : "number",
        enum: enumValues
      },
      name
    );
  }

  let index = 0;
  const indexCounter: () => number = () => index++;

  const enumType = getCapnpEnumTypes(schema);
  if (!enumType) {
    return "";
  }

  const values = (schema.enum || []).filter(
    v => v !== null && v !== undefined
  ) as (string | number)[];
  const schemaTitle = (schema as JsonSchemaLike).title;

  return `enum ${pascalCase(name)} {
${values
  .map(
    value =>
      `    ${
        enumType === "Text" && value
          ? camelCase(String(value))
          : `${schemaTitle ? `${camelCase(schemaTitle)}_` : ""}${value || ""}`
      } @${indexCounter()};`
  )
  .join("\n")}
  }`;
}

/**
 * Generates a string representation of Cap'n Proto primitive types from a Deepkit Type.
 *
 * @param type - The Deepkit Type to convert.
 * @returns A string representation of the Cap'n Proto primitive type.
 */
/**
 * Generates a string representation of Cap'n Proto primitive types from a JSON Schema.
 *
 * @param schema - The JSON Schema to convert.
 * @returns A string representation of the Cap'n Proto primitive type.
 */
export function generateCapnpPrimitive(schema: JsonSchema): string {
  if (
    isJsonSchemaNever(schema) ||
    isJsonSchemaNull(schema) ||
    isJsonSchemaUndefined(schema)
  ) {
    return "Void";
  }
  if (isJsonSchemaDate(schema)) {
    return "Date";
  }
  if (isJsonSchemaSet(schema)) {
    const itemSchema = (schema as JsonSchemaLike).items as
      | JsonSchema
      | undefined;

    return `List(${itemSchema ? generateCapnpPrimitive(itemSchema) : "Data"})`;
  }
  if (isJsonSchemaBigint(schema)) {
    return "UInt64";
  }
  if (isJsonSchemaNumber(schema) || isJsonSchemaInteger(schema)) {
    return "Float64";
  }
  if (isJsonSchemaString(schema)) {
    return "Text";
  }
  if (isJsonSchemaBoolean(schema)) {
    return "Bool";
  }
  if (isJsonSchemaLiteral(schema)) {
    const constVal = (schema as JsonSchemaLike).const;
    if (isNumber(constVal)) return "Float64";
    if (isBigInt(constVal)) return "UInt64";
    if (isString(constVal)) return "Text";
    if (typeof constVal === "boolean") return "Bool";
  }
  return "Data";
}

/**
 * Returns a descriptive Cap'n Proto field name for a JSON Schema member in a union.
 *
 * @param schema - The JSON Schema union member.
 * @returns A camelCase name suitable for use as a Cap'n Proto union field label.
 */
function getJsonSchemaCapnpTypeName(schema: JsonSchema): string {
  const s = schema as JsonSchemaLike;
  if (s.title || s.name) return camelCase(String(s.title || s.name));
  if (s.type) {
    return camelCase(
      Array.isArray(s.type) ? String(s.type[0]) : String(s.type)
    );
  }
  if ("const" in s) {
    if (isString(s.const)) return "string";
    if (isNumber(s.const)) return "number";
    if (typeof s.const === "boolean") return "bool";
    if (isBigInt(s.const)) return "bigInt";
  }
  if (s.anyOf) return "union";
  return "data";
}
