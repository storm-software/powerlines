import { describe, expect, it } from "vitest";
import {
  DEVTOOLS_CONNECTION_META_FILENAME,
  DEVTOOLS_DEFAULT_PORT,
  DEVTOOLS_DIRNAME,
  DEVTOOLS_DOCK_IMPORTS_FILENAME,
  DEVTOOLS_DOCK_IMPORTS_VIRTUAL_ID,
  DEVTOOLS_MOUNT_PATH,
  DEVTOOLS_MOUNT_PATH_NO_TRAILING_SLASH,
  DEVTOOLS_RPC_DUMP_DIRNAME,
  DEVTOOLS_RPC_DUMP_MANIFEST_FILENAME
} from "./devtools";

describe("devtools constants", () => {
  it("DEVTOOLS_DEFAULT_PORT is a positive number", () => {
    expect(typeof DEVTOOLS_DEFAULT_PORT).toBe("number");
    expect(DEVTOOLS_DEFAULT_PORT).toBeGreaterThan(0);
  });

  it("DEVTOOLS_MOUNT_PATH starts with /", () => {
    expect(DEVTOOLS_MOUNT_PATH).toBe("/.devtools/");
  });

  it("DEVTOOLS_MOUNT_PATH_NO_TRAILING_SLASH does not end with /", () => {
    expect(DEVTOOLS_MOUNT_PATH_NO_TRAILING_SLASH).toBe("/.devtools");
    expect(DEVTOOLS_MOUNT_PATH_NO_TRAILING_SLASH).not.toMatch(/\/$/);
  });

  it("DEVTOOLS_DIRNAME is 'devtools'", () => {
    expect(DEVTOOLS_DIRNAME).toBe("devtools");
  });

  it("DEVTOOLS_CONNECTION_META_FILENAME is a valid filename", () => {
    expect(typeof DEVTOOLS_CONNECTION_META_FILENAME).toBe("string");
    expect(DEVTOOLS_CONNECTION_META_FILENAME).toMatch(/\.json$/);
  });

  it("DEVTOOLS_RPC_DUMP_MANIFEST_FILENAME ends with .json", () => {
    expect(DEVTOOLS_RPC_DUMP_MANIFEST_FILENAME).toMatch(/\.json$/);
  });

  it("DEVTOOLS_DOCK_IMPORTS_FILENAME is a js file", () => {
    expect(DEVTOOLS_DOCK_IMPORTS_FILENAME).toMatch(/\.js$/);
  });

  it("DEVTOOLS_DOCK_IMPORTS_VIRTUAL_ID starts with /", () => {
    expect(DEVTOOLS_DOCK_IMPORTS_VIRTUAL_ID).toMatch(/^\//);
  });

  it("DEVTOOLS_RPC_DUMP_DIRNAME is 'rpc-dump'", () => {
    expect(DEVTOOLS_RPC_DUMP_DIRNAME).toBe("rpc-dump");
  });
});
