import { describe, expect, it, vi } from "vitest";
import {
  bundleReferences,
  extract,
  extractHash,
  extractJsonSchema,
  extractReflection,
  extractResolvedVariant,
  extractSchema,
  extractSchemaWithSource,
  extractSource,
  extractVariant
} from "../src/extract";

describe("devkit/schema/src/extract.ts", () => {
  it("bundleReferences rewrites internal document references", () => {
    const bundled = bundleReferences({
      $id: "https://example.dev/root.json",
      $defs: {
        User: {
          $id: "#/defs/user",
          type: "object",
          properties: {
            name: { type: "string" }
          }
        }
      },
      properties: {
        user: { $ref: "#/defs/user" }
      },
      type: "object"
    } as any) as any;

    expect(bundled.properties.user.$ref).toContain("#");
  });

  it("extractHash creates deterministic hashes for the same input", () => {
    const schema = { type: "string" } as any;

    const hashOne = extractHash("json-schema", schema);
    const hashTwo = extractHash("json-schema", schema);

    expect(hashOne).toBe(hashTwo);
    expect(hashOne.length).toBeGreaterThan(0);
  });

  it("extractReflection and extractJsonSchema return expected schema outputs", () => {
    expect(extractReflection({} as any)).toBeUndefined();
    expect(extractJsonSchema({ type: "string" })).toEqual({ type: "string" });
  });

  it("extractResolvedVariant and extractVariant classify inputs", () => {
    expect(extractResolvedVariant({ type: "string" } as any)).toBe(
      "json-schema"
    );
    expect(extractVariant("./schema.ts#default")).toBe("file-reference");
  });

  it("extractSource wraps schema with source metadata", () => {
    const source = extractSource("json-schema", { type: "number" } as any);

    expect(source.variant).toBe("json-schema");
    expect(source.schema).toEqual({ type: "number" });
    expect(source.hash.length).toBeGreaterThan(0);
  });

  it("extractSchema bundles direct JSON Schema input", async () => {
    await expect(extractSchema({ type: "object", properties: {} } as any)).resolves
      .toEqual({ type: "object", properties: {} });
  });

  it("extractSchemaWithSource and extract return normalized schema payloads", async () => {
    const context = {
      cachePath: "/tmp/cache",
      config: {
        skipCache: true
      },
      fs: {
        existsSync: vi.fn().mockReturnValue(false),
        read: vi.fn(),
        write: vi.fn()
      }
    } as any;

    const withSource = await extractSchemaWithSource(context, {
      type: "string"
    } as any);
    expect(withSource.variant).toBe("json-schema");
    expect(withSource.schema).toEqual({ type: "string" });
    expect(withSource.source.variant).toBe("json-schema");

    const extracted = await extract(context, { type: "string" } as any);
    expect(extracted.variant).toBe("json-schema");
    expect(extracted.schema).toEqual({ type: "string" });
    expect(extracted.hash.length).toBeGreaterThan(0);
  });
});
