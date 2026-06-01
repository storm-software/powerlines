import { describe, expect, it } from "vitest";
import {
  CLIENT_ENVIRONMENT,
  DEFAULT_ENVIRONMENT,
  GLOBAL_ENVIRONMENT,
  RSC_ENVIRONMENT,
  SERVER_ENVIRONMENT,
  SSR_ENVIRONMENT
} from "../../src/constants/environments";

describe("environment constants", () => {
  it("DEFAULT_ENVIRONMENT equals 'default'", () => {
    expect(DEFAULT_ENVIRONMENT).toBe("default");
  });

  it("GLOBAL_ENVIRONMENT equals '__global__'", () => {
    expect(GLOBAL_ENVIRONMENT).toBe("__global__");
  });

  it("CLIENT_ENVIRONMENT equals 'client'", () => {
    expect(CLIENT_ENVIRONMENT).toBe("client");
  });

  it("SERVER_ENVIRONMENT equals 'server'", () => {
    expect(SERVER_ENVIRONMENT).toBe("server");
  });

  it("SSR_ENVIRONMENT equals 'ssr'", () => {
    expect(SSR_ENVIRONMENT).toBe("ssr");
  });

  it("RSC_ENVIRONMENT equals 'rsc'", () => {
    expect(RSC_ENVIRONMENT).toBe("rsc");
  });
});
