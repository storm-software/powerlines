/* -------------------------------------------------------------------

                   ⚡ Storm Software - Powerlines

 This code was released as part of the Powerlines project. Powerlines
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/powerlines.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/powerlines
 Documentation:            https://docs.stormsoftware.com/projects/powerlines
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { getBinaryTargetForCurrentPlatform } from "@prisma/get-platform";
import prismaSchemaWasm from "@prisma/prisma-schema-wasm";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { match } from "ts-pattern";
import {
  GeneratorConfig,
  GetSchemaOptions,
  GetSchemaResponse,
  PrismaSchema
} from "../types/prisma";

async function resolveBinaryTargets(generator: GeneratorConfig) {
  for (const binaryTarget of generator.binaryTargets) {
    // load the binaryTargets from the env var
    if (binaryTarget.fromEnvVar && process.env[binaryTarget.fromEnvVar]) {
      const value = JSON.parse(process.env[binaryTarget.fromEnvVar]!);

      if (Array.isArray(value)) {
        generator.binaryTargets = value.map(v => ({
          fromEnvVar: null,
          value: v
        }));
        await resolveBinaryTargets(generator); // resolve again if we have native
      } else {
        binaryTarget.value = value;
      }
    }

    // resolve native to the current platform
    if (binaryTarget.value === "native") {
      binaryTarget.value = await getBinaryTargetForCurrentPlatform();
      binaryTarget.native = true;
    }
  }

  if (generator.binaryTargets.length === 0) {
    generator.binaryTargets = [
      {
        fromEnvVar: null,
        value: await getBinaryTargetForCurrentPlatform(),
        native: true
      }
    ];
  }
}

/**
 * Retrieves the Prisma schema using the provided options.
 *
 * @param options - The options to customize the schema retrieval.
 * @returns The Prisma schema.
 */
export async function getSchema(
  options: GetSchemaOptions
): Promise<PrismaSchema> {
  const configEither = pipe(
    E.tryCatch(
      () => {
        if (process.env.FORCE_PANIC_QUERY_ENGINE_GET_CONFIG) {
          prismaSchemaWasm.debug_panic();
        }

        const params = JSON.stringify({
          prismaSchema: options.datamodel,
          datasourceOverrides: {},
          ignoreEnvVarErrors: options.ignoreEnvVarErrors ?? false,
          env: process.env
        });

        const data = prismaSchemaWasm.get_config(params);

        return data;
      },
      e => ({
        type: "wasm-error" as const,
        reason: "(get-config wasm)",
        error: e as Error
      })
    ),
    E.map(result => ({ result })),
    E.chainW(({ result }) =>
      // NOTE: this should never fail, as we expect returned values to be valid JSON-serializable strings
      E.tryCatch(
        () => JSON.parse(result) as GetSchemaResponse,
        e => ({
          type: "parse-json" as const,
          reason: "Unable to parse JSON",
          error: e as Error
        })
      )
    ),
    E.chainW(response => {
      if (response.errors.length > 0) {
        return E.left({
          type: "validation-error" as const,
          reason: "(get-config wasm)",
          error: response.errors
        });
      }
      return E.right(response.config);
    })
  );

  if (E.isRight(configEither)) {
    const { right: data } = configEither;

    for (const generator of data.generators) {
      await resolveBinaryTargets(generator);
    }

    return Promise.resolve(data);
  }

  throw match(configEither.left)
    .with({ type: "wasm-error" }, e => {
      return new Error(
        `Prisma get-config Wasm runtime error: ${e.error.message}`
      );
    })
    .with({ type: "validation-error" }, e => {
      return new Error(
        `Prisma get-config validation error: ${e.error
          .map(err => err.message)
          .join(", ")}`
      );
    })
    .otherwise(e => {
      return new Error(
        `Prisma get-config unknown error: ${e.reason} - ${e.error.message}`
      );
    });
}
