import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { describe, expect, it } from "vitest";
import { reflectionToJsonSchema } from "./reflection";

describe("devkit/schema/src/reflection.ts", () => {
  it("maps simple primitive reflections", () => {
    expect(
      reflectionToJsonSchema({
        kind: ReflectionKind.string,
        typeName: "string"
      } as any)
    ).toMatchObject({ type: "string", name: "string" });

    expect(
      reflectionToJsonSchema({
        kind: ReflectionKind.boolean,
        typeName: "boolean"
      } as any)
    ).toMatchObject({ type: "boolean", name: "boolean" });
  });

  it("maps arrays and tuples", () => {
    expect(
      reflectionToJsonSchema({
        kind: ReflectionKind.array,
        typeName: "List",
        type: { kind: ReflectionKind.number, typeName: "number" }
      } as any)
    ).toMatchObject({ type: "array", items: { type: "number" } });

    expect(
      reflectionToJsonSchema({
        kind: ReflectionKind.tuple,
        typeName: "Pair",
        types: [
          { type: { kind: ReflectionKind.string, typeName: "string" } },
          { type: { kind: ReflectionKind.number, typeName: "number" } }
        ]
      } as any)
    ).toMatchObject({
      type: "array",
      minItems: 2,
      maxItems: 2
    });
  });

  it("returns undefined for never reflections", () => {
    expect(
      reflectionToJsonSchema({ kind: ReflectionKind.never, typeName: "never" } as any)
    ).toBeUndefined();
  });
});
