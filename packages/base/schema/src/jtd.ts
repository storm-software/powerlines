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

import { isSetString } from "@stryke/type-checks";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { SomeJTDSchemaType } from "ajv/dist/types/jtd-schema";
import { JsonSchemaLike, JtdNumberType } from "./types";

/**
 * Maps a JSON Schema `format` annotation for integers to the closest JTD numeric type.
 *
 * @param format - The JSON Schema format hint to map.
 * @returns The matching JTD numeric type, or `undefined` if no exact match exists.
 */
function jsonSchemaIntegerFormatToJtd(
  format: string | undefined
): JtdNumberType | undefined {
  switch (format) {
    case "int8":
      return "int8";
    case "uint8":
      return "uint8";
    case "int16":
      return "int16";
    case "uint16":
      return "uint16";
    case "int32":
      return "int32";
    case "uint32":
      return "uint32";
    case undefined:
    default:
      return undefined;
  }
}

/**
 * Maps a JSON Schema `format` annotation for floating point numbers to the closest JTD numeric type.
 *
 * @param format - The JSON Schema format hint to map.
 * @returns The matching JTD numeric type, or `undefined` if no exact match exists.
 */
function jsonSchemaNumberFormatToJtd(
  format: string | undefined
): JtdNumberType | undefined {
  switch (format) {
    case "float":
    case "float32":
      return "float32";
    case "double":
    case "float64":
      return "float64";
    case undefined:
    default:
      return undefined;
  }
}

/**
 * Picks the smallest unsigned JTD integer type that can hold the provided bounds.
 *
 * @param minimum - The inclusive lower bound, when known.
 * @param maximum - The inclusive upper bound, when known.
 * @returns The narrowest unsigned JTD integer type that can represent the range, or `undefined` if the range cannot be expressed as an unsigned integer.
 */
function pickUnsignedIntegerType(
  minimum: number | undefined,
  maximum: number | undefined
): JtdNumberType | undefined {
  if (minimum === undefined || minimum < 0) {
    return undefined;
  }
  if (maximum === undefined) {
    return undefined;
  }
  if (maximum <= 0xff) {
    return "uint8";
  }
  if (maximum <= 0xffff) {
    return "uint16";
  }
  if (maximum <= 0xffffffff) {
    return "uint32";
  }
  return undefined;
}

/**
 * Picks the smallest signed JTD integer type that can hold the provided bounds.
 *
 * @param minimum - The inclusive lower bound, when known.
 * @param maximum - The inclusive upper bound, when known.
 * @returns The narrowest signed JTD integer type that can represent the range, or `undefined` if the range cannot be expressed as a signed integer.
 */
function pickSignedIntegerType(
  minimum: number | undefined,
  maximum: number | undefined
): JtdNumberType | undefined {
  if (
    minimum !== undefined &&
    maximum !== undefined &&
    minimum >= -0x80 &&
    maximum <= 0x7f
  ) {
    return "int8";
  }
  if (
    minimum !== undefined &&
    maximum !== undefined &&
    minimum >= -0x8000 &&
    maximum <= 0x7fff
  ) {
    return "int16";
  }
  return "int32";
}

/**
 * Tests whether the provided value is a non-null object that can be inspected as a JSON Schema fragment.
 *
 * @param value - The value to test.
 * @returns `true` if the value is a plain object suitable for JSON-Schema conversion.
 */
function isJsonSchemaLike(value: unknown): value is JsonSchemaLike {
  return isSetObject(value);
}

/**
 * Reads the JSON Schema `type` field as an array, normalising the single-string form.
 *
 * @param schema - The JSON Schema fragment to inspect.
 * @returns The list of JSON Schema type names declared on the fragment.
 */
function readTypes(schema: JsonSchemaLike): string[] {
  if (Array.isArray(schema.type)) {
    return schema.type;
  }
  if (typeof schema.type === "string") {
    return [schema.type];
  }
  return [];
}

/**
 * Builds a JTD `metadata` object from the JSON Schema annotation keywords found on a fragment.
 *
 * @param schema - The source JSON Schema fragment.
 * @returns A metadata bag suitable for attaching to a JTD form, or `undefined` if no annotations are present.
 */
function collectMetadata(
  schema: JsonSchemaLike
): Record<string, unknown> | undefined {
  const metadata: Record<string, unknown> = {};
  if (typeof schema.description === "string") {
    metadata.description = schema.description;
  }
  if (typeof schema.title === "string") {
    metadata.title = schema.title;
  }
  if (schema.default !== undefined) {
    metadata.default = schema.default;
  }
  if (Array.isArray(schema.examples) && schema.examples.length > 0) {
    metadata.examples = schema.examples;
  }
  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

/**
 * Attaches metadata and nullability flags to a JTD form, mutating and returning the form.
 *
 * @param form - The base JTD form to decorate.
 * @param schema - The source JSON Schema fragment from which annotations are read.
 * @param nullable - Whether the schema is nullable in JTD semantics.
 * @returns The decorated JTD form.
 */
function decorate(
  form: SomeJTDSchemaType,
  schema: JsonSchemaLike,
  nullable: boolean
): SomeJTDSchemaType {
  if (nullable) {
    (form as { nullable?: boolean }).nullable = true;
  }
  const metadata = collectMetadata(schema);
  if (metadata) {
    (form as { metadata?: Record<string, unknown> }).metadata = metadata;
  }
  return form;
}

/**
 * Determines whether the supplied list of JSON Schema types collapses to `null` only.
 *
 * @param types - The normalised list of JSON Schema type names.
 * @returns `true` if the only declared type is `null`.
 */
function isNullOnly(types: string[]): boolean {
  return types.length > 0 && types.every(t => t === "null");
}

/**
 * Splits a `null` declaration away from a list of JSON Schema types.
 *
 * @param types - The normalised list of JSON Schema type names.
 * @returns A tuple of `[nonNullTypes, nullable]` describing the remaining types and whether `null` was present.
 */
function stripNull(types: string[]): { types: string[]; nullable: boolean } {
  const nullable = types.includes("null");

  return { types: types.filter(t => t !== "null"), nullable };
}

/**
 * Converts a JSON Schema `enum` keyword to a JTD enum form, stringifying values when required.
 *
 * @param values - The raw enum values from the JSON Schema fragment.
 * @returns A JTD enum form, or `undefined` if the enum cannot be represented (e.g. empty list).
 */
function enumToJtd(values: readonly unknown[]): SomeJTDSchemaType | undefined {
  const strings = values
    .filter(v => v !== null && v !== undefined)
    .map(v => String(v));
  if (strings.length === 0) {
    return undefined;
  }
  return { enum: Array.from(new Set(strings)) };
}

/**
 * Selects the most appropriate JTD numeric `type` value for a JSON Schema integer fragment.
 *
 * @param schema - The integer JSON Schema fragment.
 * @returns The chosen JTD integer type.
 */
function pickIntegerJtdType(schema: JsonSchemaLike): JtdNumberType {
  const mapped = jsonSchemaIntegerFormatToJtd(schema.format);
  if (mapped) {
    return mapped;
  }
  const unsigned = pickUnsignedIntegerType(schema.minimum, schema.maximum);
  if (unsigned) {
    return unsigned;
  }
  return pickSignedIntegerType(schema.minimum, schema.maximum) ?? "int32";
}

/**
 * Selects the most appropriate JTD numeric `type` value for a JSON Schema number fragment.
 *
 * @param schema - The number JSON Schema fragment.
 * @returns The chosen JTD floating point type.
 */
function pickNumberJtdType(schema: JsonSchemaLike): JtdNumberType {
  return jsonSchemaNumberFormatToJtd(schema.format) ?? "float64";
}

/**
 * Selects the JTD string `type` value for a JSON Schema string fragment, mapping `format: "date-time"` to `timestamp`.
 *
 * @param schema - The string JSON Schema fragment.
 * @returns The chosen JTD string type.
 */
function pickStringJtdType(schema: JsonSchemaLike): "string" | "timestamp" {
  if (schema.format === "date-time") {
    return "timestamp";
  }
  return "string";
}

/**
 * Converts a JSON Schema object fragment into a JTD properties form.
 *
 * @param schema - The object JSON Schema fragment.
 * @param nullable - Whether the resulting JTD form should be nullable.
 * @returns The JTD properties form representing the object.
 */
function objectToJtd(
  schema: JsonSchemaLike,
  nullable: boolean
): SomeJTDSchemaType {
  const required = new Set(schema.required ?? []);
  const properties: Record<string, SomeJTDSchemaType> = {};
  const optionalProperties: Record<string, SomeJTDSchemaType> = {};

  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      const converted = jsonSchemaToJtd(value);
      if (!converted) {
        continue;
      }
      if (required.has(key)) {
        properties[key] = converted;
      } else {
        optionalProperties[key] = converted;
      }
    }
  }

  const hasProperties = Object.keys(properties).length > 0;
  const hasOptional = Object.keys(optionalProperties).length > 0;

  // JTD requires `values` form for open maps with a single value schema.
  // patternProperties / additionalProperties: object collapses to `values`
  // when there are no declared properties.
  if (
    !hasProperties &&
    !hasOptional &&
    isJsonSchemaLike(schema.additionalProperties)
  ) {
    const values = jsonSchemaToJtd(schema.additionalProperties);
    if (values) {
      return decorate({ values }, schema, nullable);
    }
  }
  if (!hasProperties && !hasOptional && schema.patternProperties) {
    const first = Object.values(schema.patternProperties)[0];
    if (first) {
      const values = jsonSchemaToJtd(first);
      if (values) {
        return decorate({ values }, schema, nullable);
      }
    }
  }

  const form: {
    properties?: Record<string, SomeJTDSchemaType>;
    optionalProperties?: Record<string, SomeJTDSchemaType>;
    additionalProperties?: boolean;
  } = {};

  if (hasProperties) {
    form.properties = properties;
  } else if (!hasOptional) {
    // JTD object form must have at least one of properties / optionalProperties.
    form.properties = {};
  }
  if (hasOptional) {
    form.optionalProperties = optionalProperties;
  }
  if (
    schema.additionalProperties === true ||
    isJsonSchemaLike(schema.additionalProperties) ||
    schema.patternProperties !== undefined
  ) {
    form.additionalProperties = true;
  }

  return decorate(form as SomeJTDSchemaType, schema, nullable);
}

/**
 * Converts a JSON Schema array fragment into a JTD elements form.
 *
 * @param schema - The array JSON Schema fragment.
 * @param nullable - Whether the resulting JTD form should be nullable.
 * @returns The JTD elements form representing the array.
 */
function arrayToJtd(
  schema: JsonSchemaLike,
  nullable: boolean
): SomeJTDSchemaType {
  let elementSchema: JsonSchemaLike | undefined;
  if (Array.isArray(schema.items)) {
    // Tuple form — JTD has no native tuple support. Best effort: collapse to
    // the union (anyOf) of the tuple member schemas; if there is only one
    // distinct shape, fall back to using it directly.
    elementSchema = schema.items[0];
  } else if (schema.items) {
    elementSchema = schema.items;
  }

  const elements = elementSchema ? jsonSchemaToJtd(elementSchema) : {};

  return decorate({ elements: elements ?? {} }, schema, nullable);
}

/**
 * Attempts to detect and emit a JTD discriminator form from a JSON Schema `oneOf` or `anyOf` fragment.
 *
 * @param schemas - The list of candidate JSON Schema fragments.
 * @param nullable - Whether the resulting JTD form should be nullable.
 * @returns A discriminator form when every branch shares a single tag property, otherwise `undefined`.
 */
function tryDiscriminator(
  schemas: readonly JsonSchemaLike[],
  nullable: boolean
): SomeJTDSchemaType | undefined {
  if (schemas.length < 2) {
    return undefined;
  }

  let candidateKey: string | undefined;
  const mapping: Record<string, SomeJTDSchemaType> = {};

  for (const branch of schemas) {
    if (!isJsonSchemaLike(branch) || !branch.properties) {
      return undefined;
    }
    const constantTags = Object.entries(branch.properties).filter(
      ([, value]) =>
        isJsonSchemaLike(value) &&
        (typeof value.const === "string" ||
          (Array.isArray(value.enum) &&
            value.enum.length === 1 &&
            typeof value.enum[0] === "string"))
    );
    if (constantTags.length === 0) {
      return undefined;
    }
    const [tagKey, tagSchema] = constantTags[0]!;
    if (!candidateKey) {
      candidateKey = tagKey;
    } else if (candidateKey !== tagKey) {
      return undefined;
    }
    const tag =
      typeof tagSchema.const === "string"
        ? tagSchema.const
        : (tagSchema.enum?.[0] as string);

    // Remove the discriminator property from the branch before converting,
    // as JTD's mapping schemas describe the remainder of the object.
    const { [tagKey]: _omit, ...restProperties } = branch.properties;
    const restRequired = (branch.required ?? []).filter(k => k !== tagKey);
    const branchSchema: JsonSchemaLike = {
      ...branch,
      properties: restProperties,
      required: restRequired
    };
    const branchForm = jsonSchemaToJtd(branchSchema);
    if (!branchForm || !isSetObject(branchForm) || "ref" in branchForm) {
      return undefined;
    }
    mapping[tag] = branchForm;
  }

  if (!candidateKey) {
    return undefined;
  }
  const form: SomeJTDSchemaType = {
    discriminator: candidateKey,
    mapping
  };
  if (nullable) {
    (form as { nullable?: boolean }).nullable = true;
  }
  return form;
}

/**
 * Converts a JSON Schema fragment (draft-07 style, as produced by `zod-to-json-schema`, Standard Schema, etc.) into a valid JSON Type Definition (RFC 8927) schema.
 *
 * Unsupported JSON Schema keywords (`pattern`, `const`, `minItems`, `maxItems`, `uniqueItems`, etc.) are dropped — JTD intentionally omits these. Annotation keywords (`description`, `title`, `default`, `examples`) are preserved under the JTD `metadata` field.
 *
 * @param schema - The JSON Schema fragment to convert.
 * @returns A valid JTD form, or `undefined` if the input cannot be represented.
 */
export function jsonSchemaToJtd(
  schema: JsonSchemaLike | undefined | null
): SomeJTDSchemaType | undefined {
  if (!isJsonSchemaLike(schema)) {
    return undefined;
  }

  // $ref → JTD ref form. The pointer must reference `#/definitions/<name>`.
  if (isSetString(schema.$ref)) {
    const match = /^#\/(?:definitions|\$defs)\/(.+)$/.exec(schema.$ref);
    if (match) {
      return { ref: match[1]! };
    }
  }

  // allOf — fold member schemas together via shallow merge before converting.
  if (Array.isArray(schema.allOf) && schema.allOf.length > 0) {
    const merged = schema.allOf.reduce<JsonSchemaLike>(
      (acc, current) => mergeJsonSchema(acc, current),
      {}
    );
    const { allOf: _allOf, ...rest } = schema;

    return jsonSchemaToJtd(mergeJsonSchema(merged, rest));
  }

  const rawTypes = readTypes(schema);
  const { types: nonNullTypes, nullable: typeIsNullable } = stripNull(rawTypes);
  const nullable = Boolean(schema.nullable) || typeIsNullable;

  // Pure null type → JTD has no first-class null form, emit empty + nullable.
  if (isNullOnly(rawTypes)) {
    return decorate({}, schema, true);
  }

  // Enum form.
  if (Array.isArray(schema.enum)) {
    const enumForm = enumToJtd(schema.enum);
    if (enumForm) {
      return decorate(enumForm, schema, nullable);
    }
  }

  // const → enum of one (only valid when value is a string in JTD).
  if (isSetString(schema.const)) {
    return decorate({ enum: [schema.const] }, schema, nullable);
  }

  // anyOf / oneOf — try to detect a discriminated union, otherwise collapse.
  const union = schema.oneOf ?? schema.anyOf;
  if (Array.isArray(union) && union.length > 0) {
    const branches = union.filter(isJsonSchemaLike);
    const onlyNullBranches = branches.filter(b =>
      readTypes(b).includes("null")
    );
    const nonNullBranches = branches.filter(
      b => !isNullOnly(readTypes(b)) && readTypes(b).join() !== "null"
    );
    const unionNullable = nullable || onlyNullBranches.length > 0;

    if (nonNullBranches.length === 1) {
      const collapsed = jsonSchemaToJtd(nonNullBranches[0]);
      if (collapsed) {
        return decorate(collapsed, schema, unionNullable);
      }
    }

    const discriminated = tryDiscriminator(nonNullBranches, unionNullable);
    if (discriminated) {
      const metadata = collectMetadata(schema);
      if (metadata) {
        (discriminated as { metadata?: Record<string, unknown> }).metadata =
          metadata;
      }
      return discriminated;
    }

    // No safe JTD equivalent: emit empty schema (matches any value) with
    // metadata to preserve provenance.
    const fallback = decorate({}, schema, unionNullable);
    const metadata =
      (fallback as { metadata?: Record<string, unknown> }).metadata ?? {};
    metadata.jsonSchemaUnion = union;
    (fallback as { metadata?: Record<string, unknown> }).metadata = metadata;
    return fallback;
  }

  // Object form — `type: "object"` or implicit via `properties`.
  if (
    nonNullTypes.includes("object") ||
    schema.properties ||
    schema.patternProperties ||
    isJsonSchemaLike(schema.additionalProperties)
  ) {
    const result = objectToJtd(schema, nullable);
    const definitions = schema.definitions ?? schema.$defs;
    if (definitions && Object.keys(definitions).length > 0) {
      const converted: Record<string, SomeJTDSchemaType> = {};
      for (const [key, value] of Object.entries(definitions)) {
        const def = jsonSchemaToJtd(value);
        if (def) {
          converted[key] = def;
        }
      }
      if (Object.keys(converted).length > 0) {
        (
          result as { definitions?: Record<string, SomeJTDSchemaType> }
        ).definitions = converted;
      }
    }
    return result;
  }

  if (nonNullTypes.includes("array")) {
    return arrayToJtd(schema, nullable);
  }

  // Scalar types.
  if (nonNullTypes.length === 1) {
    const t = nonNullTypes[0]!;
    if (t === "string") {
      return decorate({ type: pickStringJtdType(schema) }, schema, nullable);
    }
    if (t === "boolean") {
      return decorate({ type: "boolean" }, schema, nullable);
    }
    if (t === "integer") {
      return decorate({ type: pickIntegerJtdType(schema) }, schema, nullable);
    }
    if (t === "number") {
      return decorate({ type: pickNumberJtdType(schema) }, schema, nullable);
    }
  }

  // Mixed scalar types (e.g. ["string", "number"]) — emit empty schema since
  // JTD has no native union of primitives.
  if (nonNullTypes.length > 1) {
    return decorate({}, schema, nullable);
  }

  // No type info — empty (any) schema, possibly nullable.
  return decorate({}, schema, nullable);
}

/**
 * Shallow-merges two JSON Schema fragments, combining `required` arrays and `properties` maps.
 *
 * @param left - The base schema fragment.
 * @param right - The schema fragment to merge into the base.
 * @returns A merged schema fragment. Neither input is mutated.
 */
function mergeJsonSchema(
  left: JsonSchemaLike,
  right: JsonSchemaLike
): JsonSchemaLike {
  const merged: JsonSchemaLike = { ...left, ...right };
  if (left.properties || right.properties) {
    merged.properties = {
      ...(left.properties ?? {}),
      ...(right.properties ?? {})
    };
  }
  if (left.required || right.required) {
    merged.required = Array.from(
      new Set([...(left.required ?? []), ...(right.required ?? [])])
    );
  }
  return merged;
}
