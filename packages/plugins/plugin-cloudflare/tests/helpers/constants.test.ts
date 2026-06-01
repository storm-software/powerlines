import { describe, expect, it } from "vitest";
import { PATH_TO_DEPLOY_CONFIG } from "../../src/helpers/constants";

describe("cloudflare helpers constants", () => {
  it("PATH_TO_DEPLOY_CONFIG is a string", () => {
    expect(typeof PATH_TO_DEPLOY_CONFIG).toBe("string");
  });

  it("PATH_TO_DEPLOY_CONFIG points to a json file", () => {
    expect(PATH_TO_DEPLOY_CONFIG).toMatch(/\.json$/);
  });

  it("PATH_TO_DEPLOY_CONFIG contains wrangler in the path", () => {
    expect(PATH_TO_DEPLOY_CONFIG).toContain("wrangler");
  });
});
