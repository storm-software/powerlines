import { describe, expect, it } from "vitest";
import {
  applyJsonSchemaMetadata,
  getPrimarySchemaType,
  readSchemaTypes
} from "./metadata";

describe("devkit/schema/src/metadata.ts", () => {
  it("applyJsonSchemaMetadata copies known metadata fields", () => {
    const schema = { type: "string" } as const;
    const result = applyJsonSchemaMetadata(schema as any, {
      title: "Name",
      description: "User name",
      tags: ["user"]
    } as any);

    expect(result).toMatchObject({
      type: "string",
      title: "Name",
      description: "User name",
      tags: ["user"]
    });
  });

  it("readSchemaTypes normalizes scalar and array type declarations", () => {
    expect(readSchemaTypes({ type: "string" } as any)).toEqual(["string"]);
    expect(readSchemaTypes({ type: ["string", "null"] } as any)).toEqual([
      "string",
      "null"
    ]);
    expect(readSchemaTypes({ type: "object" } as any)).toEqual([]);
  });

  it("getPrimarySchemaType returns first non-null type", () => {
    expect(getPrimarySchemaType({ type: ["null", "number"] } as any)).toBe(
      "number"
    );
    expect(getPrimarySchemaType({ type: "null" } as any)).toBeUndefined();
  });
});
