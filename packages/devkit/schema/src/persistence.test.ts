import { describe, expect, it, vi } from "vitest";
import {
  getCacheDirectory,
  getCacheFilePath,
  readSchema,
  readSchemaSafe,
  writeSchema
} from "./persistence";

describe("devkit/schema/src/persistence.ts", () => {
  it("builds cache paths from the context cache path", () => {
    const context = { cachePath: "/tmp/cache" } as any;

    expect(getCacheDirectory(context)).toBe("/tmp/cache/schemas");
    expect(getCacheFilePath(context, { type: "string" } as any)).toMatch(
      /^\/tmp\/cache\/schemas\/.+\.json$/
    );
  });

  it("writeSchema persists schema JSON to the cache file", async () => {
    const context = {
      cachePath: "/tmp/cache",
      fs: {
        write: vi.fn().mockResolvedValue(undefined)
      }
    } as any;

    await writeSchema(context, {
      variant: "json-schema",
      hash: "abc",
      schema: { type: "string" }
    } as any);

    expect(context.fs.write).toHaveBeenCalledTimes(1);
    expect(context.fs.write.mock.calls[0][1]).toBe('{"type":"string"}');
  });

  it("readSchemaSafe returns parsed schema when cache file exists", async () => {
    const context = {
      cachePath: "/tmp/cache",
      fs: {
        exists: vi.fn().mockResolvedValue(true),
        read: vi
          .fn()
          .mockResolvedValue('{"variant":"json-schema","hash":"h","schema":{"type":"string"}}')
      }
    } as any;

    await expect(readSchemaSafe(context, { type: "string" } as any)).resolves
      .toMatchObject({ variant: "json-schema", hash: "h" });
  });

  it("readSchema throws when schema is missing from cache", async () => {
    const context = {
      cachePath: "/tmp/cache",
      fs: {
        exists: vi.fn().mockResolvedValue(false),
        read: vi.fn()
      }
    } as any;

    await expect(readSchema(context, { type: "string" } as any)).rejects.toThrow(
      "does not exist in the cache"
    );
  });
});
