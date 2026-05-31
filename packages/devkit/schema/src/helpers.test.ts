import { describe, expect, it } from "vitest";
import {
  addProperty,
  getJsonSchema,
  getJsonSchemaObject,
  getProperties,
  getPropertiesList,
  isPropertyOptional,
  isSchemaNullable,
  isValidSchemaInputFile,
  merge
} from "./helpers";

describe("devkit/schema/src/helpers.ts", () => {
  it("getJsonSchema and getJsonSchemaObject unwrap schema containers", () => {
    const wrapped = {
      variant: "json-schema",
      hash: "hash",
      schema: { type: "object", properties: { seed: { type: "string" } } }
    } as any;

    expect(getJsonSchema(wrapped)).toEqual(wrapped.schema);
    expect(getJsonSchemaObject(wrapped)).toEqual(wrapped.schema);
  });

  it("getProperties and getPropertiesList include property metadata", () => {
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number", default: 40 }
      },
      required: ["name"],
      default: { name: "Storm" }
    } as const;

    const properties = getProperties(schema as any);
    expect(properties.name.required).toBe(true);
    expect(properties.name.default).toBe("Storm");
    expect(properties.age.required).toBe(false);

    const list = getPropertiesList(schema as any);
    expect(list.map(item => item.name).sort()).toEqual(["age", "name"]);
  });

  it("addProperty mutates schema properties and required list", () => {
    const schema = {
      type: "object",
      properties: { seed: { type: "string" } },
      required: ["seed"]
    } as any;

    addProperty(schema, "enabled", { type: "boolean" });

    expect(schema.properties.enabled).toMatchObject({
      type: "boolean",
      name: "enabled"
    });
    expect(schema.required).toContain("enabled");
  });

  it("merge combines schema objects and deduplicates required properties", () => {
    const merged = merge(
      {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"]
      },
      {
        type: "object",
        properties: { name: { type: "string" } },
        required: ["name", "id"]
      }
    ) as any;

    expect(merged.properties).toMatchObject({
      id: { type: "string" },
      name: { type: "string" }
    });
    expect(merged.required.sort()).toEqual(["id", "name"]);
  });

  it("isSchemaNullable and isPropertyOptional return expected booleans", () => {
    expect(isSchemaNullable({ type: ["string", "null"] } as any)).toBe(true);
    expect(isSchemaNullable({ type: "string" } as any)).toBe(false);

    const parent = {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"]
    } as any;

    expect(isPropertyOptional(parent, "name")).toBe(false);
  });

  it("isValidSchemaInputFile validates supported extensions", () => {
    expect(isValidSchemaInputFile("schema.ts")).toBe(true);
    expect(isValidSchemaInputFile("schema.unknown")).toBe(false);
  });
});
