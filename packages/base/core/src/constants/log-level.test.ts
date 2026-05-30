import { describe, expect, it } from "vitest";
import {
  LOG_CATEGORIES,
  LOG_CATEGORIES_ARRAY,
  LOG_LEVELS,
  LogCategories,
  LogLevels
} from "./log-level";

describe("LogLevels", () => {
  it("has all expected log level keys", () => {
    expect(LogLevels).toHaveProperty("SILENT");
    expect(LogLevels).toHaveProperty("ERROR");
    expect(LogLevels).toHaveProperty("WARN");
    expect(LogLevels).toHaveProperty("INFO");
    expect(LogLevels).toHaveProperty("DEBUG");
    expect(LogLevels).toHaveProperty("TRACE");
  });

  it("has correct string values for each level", () => {
    expect(LogLevels.SILENT).toBe("silent");
    expect(LogLevels.ERROR).toBe("error");
    expect(LogLevels.WARN).toBe("warn");
    expect(LogLevels.INFO).toBe("info");
    expect(LogLevels.DEBUG).toBe("debug");
    expect(LogLevels.TRACE).toBe("trace");
  });
});

describe("LOG_LEVELS", () => {
  it("is an array containing all log level values", () => {
    expect(Array.isArray(LOG_LEVELS)).toBe(true);
    expect(LOG_LEVELS).toContain("silent");
    expect(LOG_LEVELS).toContain("error");
    expect(LOG_LEVELS).toContain("warn");
    expect(LOG_LEVELS).toContain("info");
    expect(LOG_LEVELS).toContain("debug");
    expect(LOG_LEVELS).toContain("trace");
  });
});

describe("LogCategories", () => {
  it("has all expected category keys", () => {
    expect(LogCategories).toHaveProperty("GENERAL");
    expect(LogCategories).toHaveProperty("FS");
    expect(LogCategories).toHaveProperty("PERFORMANCE");
    expect(LogCategories).toHaveProperty("CONFIG");
    expect(LogCategories).toHaveProperty("PLUGINS");
    expect(LogCategories).toHaveProperty("HOOKS");
    expect(LogCategories).toHaveProperty("SCHEMA");
    expect(LogCategories).toHaveProperty("ENV");
    expect(LogCategories).toHaveProperty("RPC");
  });

  it("has correct string values", () => {
    expect(LogCategories.GENERAL).toBe("general");
    expect(LogCategories.FS).toBe("fs");
    expect(LogCategories.CONFIG).toBe("config");
    expect(LogCategories.PLUGINS).toBe("plugins");
  });
});

describe("LOG_CATEGORIES_ARRAY", () => {
  it("contains all category values", () => {
    expect(Array.isArray(LOG_CATEGORIES_ARRAY)).toBe(true);
    expect(LOG_CATEGORIES_ARRAY.length).toBeGreaterThan(0);
    expect(LOG_CATEGORIES_ARRAY).toContain("general");
    expect(LOG_CATEGORIES_ARRAY).toContain("config");
  });
});

describe("LOG_CATEGORIES", () => {
  it("is an array of category strings", () => {
    expect(Array.isArray(LOG_CATEGORIES)).toBe(true);
    expect(LOG_CATEGORIES).toContain("general");
  });
});
