import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Context } from "../../src/types/context";
import type { VirtualFileMetadata } from "../../src/types/fs";
import { VirtualFileSystem } from "../../src/lib/vfs";

vi.mock("../../src/lib/utilities/format", () => ({ format: vi.fn() }));

describe("VirtualFileSystem.getMetadata", () => {
  let metadata: VirtualFileMetadata;
  let vfs: VirtualFileSystem;

  beforeEach(() => {
    const logger = { trace: vi.fn() };
    const context = {
      artifactsPath: "/workspace/.powerlines",
      builtinsPath: "/workspace/.powerlines/builtins",
      config: {
        framework: { name: "powerlines" },
        output: { path: "/workspace/dist", storage: "fs" },
        skipCache: true
      },
      debug: vi.fn(),
      entryPath: "/workspace/.powerlines/entry.ts",
      extendLogger: vi.fn(() => logger),
      trace: vi.fn()
    } as unknown as Context;

    metadata = {
      id: "powerlines:test-file",
      properties: {},
      timestamp: Date.now(),
      type: "normal"
    };
    vfs = VirtualFileSystem.createSync(context);
    vfs.ids["/workspace/src/test-file.ts"] = metadata.id;
    vfs.metadata[metadata.id] = metadata;
  });

  it("returns metadata by file path without resolving the module", () => {
    const resolveSync = vi.spyOn(vfs, "resolveSync");

    expect(vfs.getMetadata("/workspace/src/test-file.ts")).toBe(metadata);
    expect(resolveSync).not.toHaveBeenCalled();
  });

  it("returns metadata by file ID without resolving the module", () => {
    const resolveSync = vi.spyOn(vfs, "resolveSync");

    expect(vfs.getMetadata(metadata.id)).toBe(metadata);
    expect(resolveSync).not.toHaveBeenCalled();
  });

  it("returns undefined when metadata does not exist", () => {
    expect(vfs.getMetadata("/workspace/src/missing.ts")).toBeUndefined();
  });
});
