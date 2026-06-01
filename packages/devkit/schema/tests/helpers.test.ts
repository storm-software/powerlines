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
} from "../src/helpers";

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

  it("merge recursively merges nested property schemas", () => {
    const merged = merge(
      {
        type: "object",
        properties: {
          id: { type: "string", description: "base desc" },
          age: { type: "number" }
        },
        required: ["id"]
      },
      {
        type: "object",
        properties: {
          id: { type: "string", title: "ID field" },
          name: { type: "string" }
        },
        required: ["name"]
      }
    ) as any;

    // Shared 'id' property should be recursively merged
    expect(merged.properties.id).toMatchObject({
      type: "string",
      description: "base desc",
      title: "ID field"
    });
    // Properties unique to each schema are preserved
    expect(merged.properties.age).toMatchObject({ type: "number" });
    expect(merged.properties.name).toMatchObject({ type: "string" });
    // required arrays are unioned
    expect(merged.required.sort()).toEqual(["id", "name"]);
  });

  it("merge recursively merges $defs", () => {
    const merged = merge(
      {
        type: "object",
        $defs: { Addr: { type: "object", properties: { street: { type: "string" } } } }
      },
      {
        type: "object",
        $defs: { Addr: { type: "object", properties: { city: { type: "string" } } } }
      }
    ) as any;

    expect(merged.$defs.Addr.properties).toMatchObject({
      street: { type: "string" },
      city: { type: "string" }
    });
  });

  it("merge concatenates allOf arrays", () => {
    const merged = merge(
      { allOf: [{ type: "object" }] },
      { allOf: [{ type: "string" }] }
    ) as any;

    expect(merged.allOf).toHaveLength(2);
    expect(merged.allOf[0]).toMatchObject({ type: "object" });
    expect(merged.allOf[1]).toMatchObject({ type: "string" });
  });

  it("merge recursively merges single-schema keywords like 'not'", () => {
    const merged = merge(
      { not: { type: "string", minLength: 1 } },
      { not: { type: "string", maxLength: 10 } }
    ) as any;

    expect(merged.not).toMatchObject({ type: "string", minLength: 1, maxLength: 10 });
  });

  it("merge returns empty object when given no schemas", () => {
    expect(merge()).toEqual({});
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
