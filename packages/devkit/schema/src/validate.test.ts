import { describe, expect, it } from "vitest";
import { getValidator, getValidatorFunction } from "./validate";

describe("devkit/schema/src/validate.ts", () => {
  const schema = {
    $id: "example",
    type: "object",
    properties: {
      name: { type: "string" }
    },
    required: ["name"]
  } as const;

  it("getValidator returns an Ajv instance that can compile schemas", () => {
    const validator = getValidator(schema as any);

    expect(typeof validator.compile).toBe("function");
    expect(validator.validateSchema(schema)).toBe(true);
  });

  it("getValidatorFunction validates input values", () => {
    const validate = getValidatorFunction(schema as any);

    expect(validate({ name: "Storm" })).toBe(true);
    expect(validate({})).toBe(false);
  });
});
