import { describe, expect, it } from "vitest";
import {
  isJsonSchema,
  isJsonSchemaAllOf,
  isJsonSchemaAny,
  isJsonSchemaAnyOf,
  isJsonSchemaArray,
  isJsonSchemaBigint,
  isJsonSchemaBoolean,
  isJsonSchemaDate,
  isJsonSchemaDecimal,
  isJsonSchemaEnum,
  isJsonSchemaInteger,
  isJsonSchemaKeywords,
  isJsonSchemaLiteral,
  isJsonSchemaMap,
  isJsonSchemaNativeEnum,
  isJsonSchemaNever,
  isJsonSchemaNull,
  isJsonSchemaNullable,
  isJsonSchemaNumber,
  isJsonSchemaObject,
  isJsonSchemaPrimitiveType,
  isJsonSchemaPrimitiveUnion,
  isJsonSchemaRecord,
  isJsonSchemaRef,
  isJsonSchemaSet,
  isJsonSchemaString,
  isJsonSchemaTuple,
  isJsonSchemaType,
  isJsonSchemaUndefined,
  isJsonSchemaUnion,
  isJsonSchemaUnknown,
  isNullOnlyJsonSchema,
  isSchema,
  isSchemaObject,
  isSchemaWithSource,
  isStandardSchema,
  isUntypedInput,
  isUntypedInputStrict,
  isUntypedSchema,
  isUntypedSchemaStrict,
  isValibotSchema
} from "../src/type-checks";

describe("json schema and source type guards", () => {
  it("validates primitive type guard outputs", () => {
    expect(isJsonSchemaPrimitiveType("string")).toBe(true);
    expect(isJsonSchemaPrimitiveType("object")).toBe(false);

    expect(isJsonSchemaType("object")).toBe(true);
    expect(isJsonSchemaType("nope")).toBe(false);
  });

  it("validates structural json-schema guard outputs", () => {
    expect(isJsonSchemaKeywords({ title: "x" })).toBe(true);
    expect(isJsonSchemaAny({ $ref: "#/foo" })).toBe(true);
    expect(isJsonSchemaArray({ type: "array", items: { type: "string" } })).toBe(
      true
    );
    expect(
      isJsonSchemaBigint({
        type: "integer",
        format: "int64",
        enum: [1n],
        default: 1n
      })
    ).toBe(true);
    expect(isJsonSchemaBoolean({ type: "boolean", default: true })).toBe(true);
    expect(isJsonSchemaDate({ type: "string", format: "date-time" })).toBe(true);
    expect(isJsonSchemaEnum({ type: "string", enum: ["a"], default: "a" })).toBe(
      true
    );
    expect(isJsonSchemaAllOf({ allOf: [{ type: "string" }] })).toBe(true);
    expect(isJsonSchemaLiteral({ const: "x" })).toBe(true);
    expect(
      isJsonSchemaMap({
        type: "array",
        maxItems: 125,
        items: {
          type: "array",
          prefixItems: [{ type: "string" }, { type: "number" }],
          items: false,
          minItems: 2,
          maxItems: 2
        }
      })
    ).toBe(true);
    expect(
      isJsonSchemaNativeEnum({ type: ["string", "number"], enum: ["A", 1] })
    ).toBe(true);
    expect(isJsonSchemaNever({ not: { type: "string" } })).toBe(true);
    expect(isJsonSchemaNull({ type: "null", enum: [null], default: null })).toBe(
      true
    );
    expect(isJsonSchemaNullable({ type: ["null", "string"] })).toBe(true);
    expect(isJsonSchemaNumber({ type: "number", minimum: 0 })).toBe(true);
    expect(isJsonSchemaInteger({ type: "integer", minimum: 0 })).toBe(true);
    expect(isJsonSchemaDecimal({ type: "number" })).toBe(true);
    expect(
      isJsonSchemaObject({ type: "object", properties: { name: { type: "string" } } })
    ).toBe(true);
    expect(isJsonSchemaString({ type: "string", minLength: 1 })).toBe(true);
    expect(
      isJsonSchemaSet({ type: "array", uniqueItems: true, items: { type: "string" } })
    ).toBe(true);
    expect(
      isJsonSchemaRecord({
        type: "object",
        patternProperties: { ".*": { type: "string" } }
      })
    ).toBe(true);
    expect(
      isJsonSchemaTuple({ type: "array", prefixItems: [{ type: "string" }] })
    ).toBe(true);
    expect(isJsonSchemaUndefined({ not: { type: "string" } })).toBe(true);
    expect(isJsonSchemaPrimitiveUnion({ type: ["string", "number"] })).toBe(true);
    expect(isJsonSchemaUnion({ anyOf: [{ type: "string" }, { type: "number" }] })).toBe(
      true
    );
    expect(isJsonSchemaUnknown({ title: "Any" })).toBe(true);
    expect(isJsonSchemaAnyOf({ anyOf: [{ type: "string" }] })).toBe(true);
    expect(isJsonSchemaRef({ $ref: "#/defs/User" })).toBe(true);
    expect(isJsonSchema({ type: "string" })).toBe(true);
    expect(isNullOnlyJsonSchema({ type: "null" })).toBe(true);
  });

  it("returns false for invalid inputs", () => {
    expect(isJsonSchemaArray({ type: "array", items: 123 })).toBe(false);
    expect(isJsonSchemaBigint({ type: "integer", format: "int64", enum: [1] })).toBe(
      false
    );
    expect(isJsonSchemaEnum({ type: "string", enum: [1] })).toBe(false);
    expect(isJsonSchemaMap({ type: "array", maxItems: 10 })).toBe(false);
    expect(isJsonSchemaObject({ type: "object", required: [1] })).toBe(false);
    expect(isJsonSchemaRef({})).toBe(false);
  });
});

describe("standard, valibot, schema, and untyped guards", () => {
  it("validates standard and valibot schema outputs", () => {
    const standard = {
      "~standard": {
        version: 1,
        validate: () => true
      }
    };

    expect(isStandardSchema(standard)).toBe(true);

    const valibotLike = {
      ...standard,
      kind: "schema",
      type: "string",
      async: false,
      reference: () => "ref",
      expects: "string",
      "~run": () => ({})
    };

    expect(isValibotSchema(valibotLike)).toBe(true);
  });

  it("validates schema container outputs", () => {
    const schema = {
      variant: "json-schema",
      hash: "hash",
      schema: { type: "object", properties: { seed: { type: "string" } } }
    };
    const schemaWithSource = {
      ...schema,
      source: {
        variant: "json-schema",
        hash: "source-hash",
        schema: { type: "object", properties: { seed: { type: "string" } } }
      }
    };

    expect(isSchema(schema)).toBe(true);
    expect(isSchemaWithSource(schemaWithSource)).toBe(true);
    expect(isSchemaObject(schema)).toBe(true);
  });

  it("validates untyped guard outputs, including strict variants", () => {
    const untypedOnlySchema = {
      type: "bigint",
      tsType: "bigint"
    };

    expect(isUntypedSchema(untypedOnlySchema)).toBe(true);
    expect(isUntypedSchemaStrict(untypedOnlySchema)).toBe(false);

    const untypedInput = {
      $schema: {
        type: "bigint"
      },
      $resolve: () => "ok"
    };

    expect(isUntypedInput(untypedInput)).toBe(true);
    expect(isUntypedInputStrict(untypedInput)).toBe(false);

    const jsonSchemaLike = {
      type: "string"
    };

    expect(isUntypedSchema(jsonSchemaLike)).toBe(true);
    expect(isUntypedSchemaStrict(jsonSchemaLike)).toBe(false);
  });
});
