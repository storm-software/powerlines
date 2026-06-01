import { describe, expect, it } from "vitest";
import {
  generateCode,
  generateParserCode,
  generateValidationCode,
  getJsonSchemaType,
  stringifyType,
  stringifyValue
} from "../src/codegen";

describe("devkit/schema/src/codegen.ts", () => {
  it("stringifyValue serializes primitives and structured values", () => {
    expect(stringifyValue(undefined)).toBe("undefined");
    expect(stringifyValue(null)).toBe("null");
    expect(stringifyValue("true", "boolean")).toBe("true");
    expect(stringifyValue("12.5", "number")).toBe("12.5");
    expect(stringifyValue("12", "integer")).toBe("12");
    expect(stringifyValue({ ok: true }, "object")).toBe('{"ok":true}');
  });

  it("stringifyType converts common schema variants to type strings", () => {
    const asSchema = (value: unknown): Parameters<typeof stringifyType>[0] =>
      value as Parameters<typeof stringifyType>[0];

    expect(stringifyType()).toBe("unknown");
    expect(stringifyType(asSchema(true))).toBe("unknown");
    expect(stringifyType(asSchema(false))).toBe("unknown");
    expect(stringifyType({ $ref: "#/$defs/Example" })).toBe("Example");
    expect(stringifyType({ type: "array", items: { type: "string" } })).toBe(
      "string[]"
    );
    expect(
      stringifyType({ type: "object", properties: { name: { type: "string" } } })
    ).toContain("name?");
    expect(
      stringifyType({ anyOf: [{ type: "string" }, { type: "number" }] })
    ).toBe("string | number");
  });

  it("getJsonSchemaType infers json-schema type names from runtime values", () => {
    expect(getJsonSchemaType(null)).toBe("null");
    expect(getJsonSchemaType(true)).toBe("boolean");
    expect(getJsonSchemaType(1)).toBe("integer");
    expect(getJsonSchemaType(1.5)).toBe("number");
    expect(getJsonSchemaType("x")).toBe("string");
    expect(getJsonSchemaType({})).toBe("object");
    expect(getJsonSchemaType([])).toBe("object");
    expect(getJsonSchemaType(Symbol("x"))).toBeUndefined();
  });

  it("generateCode returns standalone validation code", async () => {
    const code = await generateCode({
      $id: "example",
      type: "object",
      properties: { name: { type: "string" } }
    });

    expect(typeof code).toBe("string");
    expect(code).toContain("validate");
  });

  it("generateValidationCode returns standalone validator source", () => {
    const code = generateValidationCode({
      $id: "example",
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"]
    });

    expect(typeof code).toBe("string");
    expect(code).toContain("validate");
    expect(code).toContain("must");
  });

  /**
   * Evaluates standalone parser source into a callable `parse` function.
   */
  const compileParserSource = (source: string): ((value: unknown) => unknown) => {
    const executable = source.replace(/^export /gmu, "");

    // eslint-disable-next-line no-new-func
    return new Function(`${executable}\nreturn parse;`)() as (
      value: unknown
    ) => unknown;
  };

  it("generateParserCode returns standalone parser source", () => {
    const code = generateParserCode({
      $id: "example",
      type: "object",
      properties: { name: { type: "string" } }
    });

    expect(typeof code).toBe("string");
    expect(code).toContain("export class ParserError");
    expect(code).toContain("export function parse");
  });

  it("generateParserCode parser handles coercion and defaults", () => {
    const parse = compileParserSource(
      generateParserCode({
        $id: "example",
        type: "object",
        properties: {
          count: { type: "integer" },
          active: { type: "boolean" },
          label: { type: "string", default: "untitled" }
        },
        required: ["count"]
      })
    );

    expect(parse({ count: "7", active: "true" })).toEqual({
      count: 7,
      active: true,
      label: "untitled"
    });
  });

  /**
   * Extracts the generated standalone parser from {@link generateCode} output
   * and evaluates it into a callable `parse` function.
   */
  const compileParser = async (
    schema: Parameters<typeof generateCode>[0]
  ): Promise<(value: unknown) => unknown> => {
    const code = await generateCode(schema);
    const parserStart = code.indexOf("export class ParserError");
    const parserSource = parserStart >= 0 ? code.slice(parserStart) : "";

    return compileParserSource(parserSource);
  };

  it("generateCode includes both validator and parser sections", async () => {
    const schema = {
      $id: "example",
      type: "object",
      properties: { name: { type: "string" } }
    } as const;

    const code = await generateCode(schema);
    expect(code).toContain(generateValidationCode(schema));
    expect(code).toContain(generateParserCode(schema));
  });

  it("generateCode parser coerces primitives and applies defaults", async () => {
    const parse = await compileParser({
      $id: "example",
      type: "object",
      properties: {
        name: { type: "string", default: "anonymous" },
        age: { type: "integer" },
        active: { type: "boolean" }
      },
      required: ["age"]
    });

    expect(parse({ age: "42", active: "true" })).toEqual({
      name: "anonymous",
      age: 42,
      active: true
    });
  });

  it("generateCode parser throws for input that cannot be converted", async () => {
    const parse = await compileParser({
      $id: "example",
      type: "object",
      properties: { age: { type: "integer" } },
      required: ["age"]
    });

    expect(() => parse({})).toThrowError(/Required property is missing/u);
    expect(() => parse({ age: "not-a-number" })).toThrowError(
      /Expected an integer value/u
    );
  });

  it("generateCode parser resolves local $ref definitions", async () => {
    const parse = await compileParser({
      $id: "example",
      type: "object",
      properties: { child: { $ref: "#/$defs/Child" } },
      $defs: {
        Child: {
          type: "object",
          properties: { count: { type: "integer" } }
        }
      }
    });

    expect(parse({ child: { count: "7" } })).toEqual({ child: { count: 7 } });
  });
});
