import {
  isUntypedInput,
  isUntypedInputStrict,
  isUntypedSchema,
  isUntypedSchemaStrict
} from "./type-checks";
import { describe, expect, it } from "vitest";

describe("untyped type guards", () => {
  it("accepts a fully shaped untyped schema", () => {
    const schema = {
      type: "object",
      tsType: "Record<string, string>",
      markdownType: "object",
      id: "example",
      title: "Example",
      description: "Example schema",
      $schema: "example-schema",
      required: ["name"],
      tags: ["alpha", "beta"],
      args: [
        {
          name: "name",
          type: "string",
          optional: true,
          tsType: "string"
        }
      ],
      properties: {
        name: {
          type: "string",
          tsType: "string",
          markdownType: "name"
        }
      },
      returns: {
        type: "string",
        tsType: "string"
      },
      resolve: () => "ok"
    };

    expect(isUntypedSchema(schema)).toBe(true);
  });

  it("rejects schemas with invalid nested property schemas", () => {
    const schema = {
      type: "object",
      properties: {
        invalid: {
          type: "definitely-not-a-jstype"
        }
      }
    };

    expect(isUntypedSchema(schema)).toBe(false);
  });

  it("rejects schemas with invalid args or returns descriptors", () => {
    const invalidArgsSchema = {
      type: "object",
      args: [
        {
          name: "count",
          type: "number",
          optional: "yes"
        }
      ]
    };

    const invalidReturnsSchema = {
      type: "object",
      returns: {
        type: ["string", "not-a-valid-type"]
      }
    };

    expect(isUntypedSchema(invalidArgsSchema)).toBe(false);
    expect(isUntypedSchema(invalidReturnsSchema)).toBe(false);
  });

  it("rejects untyped inputs with invalid $schema values", () => {
    const input = {
      $schema: {
        type: "object",
        properties: {
          child: {
            type: "invalid"
          }
        }
      },
      $resolve: () => "ok"
    };

    expect(isUntypedInput(input)).toBe(false);
  });

  it("accepts untyped inputs with a valid schema and resolver", () => {
    const input = {
      $schema: {
        type: "object",
        properties: {
          child: {
            type: "string"
          }
        }
      },
      $default: {
        child: "value"
      },
      $resolve: () => "ok",
      child: "value"
    };

    expect(isUntypedInput(input)).toBe(true);
  });

  it("strict untyped schema rejects JsonSchema overlap values", () => {
    const jsonSchemaLike = {
      type: "string"
    };

    expect(isUntypedSchema(jsonSchemaLike)).toBe(true);
    expect(isUntypedSchemaStrict(jsonSchemaLike)).toBe(false);
  });

  it("strict untyped schema accepts untyped-only schema values", () => {
    const untypedOnlySchema = {
      type: "bigint",
      tsType: "bigint"
    };

    expect(isUntypedSchemaStrict(untypedOnlySchema)).toBe(true);
  });

  it("strict untyped input rejects JsonSchema overlap values", () => {
    const jsonSchemaLikeInput = {
      type: "object",
      properties: {
        name: { type: "string" }
      }
    };

    expect(isUntypedInput(jsonSchemaLikeInput)).toBe(true);
    expect(isUntypedInputStrict(jsonSchemaLikeInput)).toBe(false);
  });

  it("strict untyped input rejects nested $schema JsonSchema overlap", () => {
    const input = {
      $schema: {
        type: "string"
      },
      value: "ok"
    };

    expect(isUntypedInput(input)).toBe(true);
    expect(isUntypedInputStrict(input)).toBe(false);
  });

  it("strict untyped input accepts untyped-only nested $schema", () => {
    const input = {
      $schema: {
        type: "bigint"
      },
      value: 1n
    };

    expect(isUntypedInputStrict(input)).toBe(true);
  });
});
