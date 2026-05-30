import { describe, expect, it } from "vitest";
import {
  JSON_SCHEMA_METADATA_KEYS,
  JSON_SCHEMA_PRIMITIVE_TYPES,
  JSON_SCHEMA_TYPES,
  JsonSchemaTypeNames,
  VALID_SOURCE_FILE_EXTENSIONS
} from "./constants";

describe("JsonSchemaTypeNames", () => {
  it("has all standard JSON Schema type names", () => {
    expect(JsonSchemaTypeNames.STRING).toBe("string");
    expect(JsonSchemaTypeNames.NUMBER).toBe("number");
    expect(JsonSchemaTypeNames.INTEGER).toBe("integer");
    expect(JsonSchemaTypeNames.BOOLEAN).toBe("boolean");
    expect(JsonSchemaTypeNames.NULL).toBe("null");
    expect(JsonSchemaTypeNames.OBJECT).toBe("object");
    expect(JsonSchemaTypeNames.ARRAY).toBe("array");
  });
});

describe("JSON_SCHEMA_PRIMITIVE_TYPES", () => {
  it("is an array", () => {
    expect(Array.isArray(JSON_SCHEMA_PRIMITIVE_TYPES)).toBe(true);
  });

  it("contains string, number, integer, boolean, null", () => {
    expect(JSON_SCHEMA_PRIMITIVE_TYPES).toContain("string");
    expect(JSON_SCHEMA_PRIMITIVE_TYPES).toContain("number");
    expect(JSON_SCHEMA_PRIMITIVE_TYPES).toContain("integer");
    expect(JSON_SCHEMA_PRIMITIVE_TYPES).toContain("boolean");
    expect(JSON_SCHEMA_PRIMITIVE_TYPES).toContain("null");
  });

  it("does not contain object or array", () => {
    expect(JSON_SCHEMA_PRIMITIVE_TYPES).not.toContain("object");
    expect(JSON_SCHEMA_PRIMITIVE_TYPES).not.toContain("array");
  });
});

describe("JSON_SCHEMA_TYPES", () => {
  it("includes all primitive types plus object and array", () => {
    for (const type of JSON_SCHEMA_PRIMITIVE_TYPES) {
      expect(JSON_SCHEMA_TYPES).toContain(type);
    }
    expect(JSON_SCHEMA_TYPES).toContain("object");
    expect(JSON_SCHEMA_TYPES).toContain("array");
  });

  it("is larger than JSON_SCHEMA_PRIMITIVE_TYPES", () => {
    expect(JSON_SCHEMA_TYPES.length).toBeGreaterThan(
      JSON_SCHEMA_PRIMITIVE_TYPES.length
    );
  });
});

describe("JSON_SCHEMA_METADATA_KEYS", () => {
  it("is an array", () => {
    expect(Array.isArray(JSON_SCHEMA_METADATA_KEYS)).toBe(true);
  });

  it("contains common metadata keys", () => {
    expect(JSON_SCHEMA_METADATA_KEYS).toContain("title");
    expect(JSON_SCHEMA_METADATA_KEYS).toContain("description");
    expect(JSON_SCHEMA_METADATA_KEYS).toContain("deprecated");
    expect(JSON_SCHEMA_METADATA_KEYS).toContain("examples");
  });
});

describe("VALID_SOURCE_FILE_EXTENSIONS", () => {
  it("is an array", () => {
    expect(Array.isArray(VALID_SOURCE_FILE_EXTENSIONS)).toBe(true);
  });

  it("contains common TypeScript and JavaScript extensions", () => {
    expect(VALID_SOURCE_FILE_EXTENSIONS).toContain("ts");
    expect(VALID_SOURCE_FILE_EXTENSIONS).toContain("js");
    expect(VALID_SOURCE_FILE_EXTENSIONS).toContain("tsx");
    expect(VALID_SOURCE_FILE_EXTENSIONS).toContain("jsx");
  });

  it("contains config format extensions", () => {
    expect(VALID_SOURCE_FILE_EXTENSIONS).toContain("json");
    expect(VALID_SOURCE_FILE_EXTENSIONS).toContain("yaml");
    expect(VALID_SOURCE_FILE_EXTENSIONS).toContain("toml");
  });
});
