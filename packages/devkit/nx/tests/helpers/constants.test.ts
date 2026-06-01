import { describe, expect, it } from "vitest";
import { CONFIG_INPUTS } from "../../src/helpers/constants";

describe("CONFIG_INPUTS", () => {
  it("is an array", () => {
    expect(Array.isArray(CONFIG_INPUTS)).toBe(true);
  });

  it("contains entries for common config file formats", () => {
    const allInputs = CONFIG_INPUTS.join("\n");
    expect(allInputs).toContain(".json");
    expect(allInputs).toContain(".yaml");
    expect(allInputs).toContain(".toml");
    expect(allInputs).toContain(".ts");
  });

  it("all entries use {framework} placeholder", () => {
    for (const input of CONFIG_INPUTS) {
      expect(input).toContain("{framework}");
    }
  });

  it("all entries start with {projectRoot}/", () => {
    for (const input of CONFIG_INPUTS) {
      expect(input).toMatch(/^\{projectRoot\}\//);
    }
  });

  it("has more than 10 entries", () => {
    expect(CONFIG_INPUTS.length).toBeGreaterThan(10);
  });
});
