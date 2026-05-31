import { describe, expect, it } from "vitest";
import {
  generateCode,
  getJsonSchemaType,
  stringifyType,
  stringifyValue
} from "./codegen";

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
    expect(stringifyType()).toBe("unknown");
    expect(stringifyType(true)).toBe("unknown");
    expect(stringifyType(false)).toBe("unknown");
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
});
