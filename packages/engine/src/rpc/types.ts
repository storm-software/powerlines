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

import type { GenericSchema, InferInput } from "valibot";

/** Valibot schema array for validating function arguments */
export type RpcArgsSchema = readonly GenericSchema[];
/** Valibot schema for validating function return value */
export type RpcReturnSchema = GenericSchema;

/** Infers TypeScript tuple type from Valibot schema array */
export type InferArgsType<S extends RpcArgsSchema | undefined> =
  S extends readonly []
    ? []
    : S extends readonly [infer H, ...infer T]
      ? H extends GenericSchema
        ? T extends readonly GenericSchema[]
          ? [InferInput<H>, ...InferArgsType<T>]
          : never
        : never
      : never;

/** Infers TypeScript return type from Valibot return schema */
export type InferReturnType<S extends RpcReturnSchema | undefined> =
  S extends RpcReturnSchema ? InferInput<S> : void;

/**
 * RPC function definition with optional dump support.
 */
export type RpcFunctionDefinition<
  TName extends string,
  TArgs extends any[] = [],
  TReturns = void,
  TArgsSchema extends RpcArgsSchema | undefined = undefined,
  TReturnSchema extends RpcReturnSchema | undefined = undefined
> = [TArgsSchema, TReturnSchema] extends [undefined, undefined]
  ? {
      /**
       * Function name (unique identifier)
       */
      name: TName;

      /**
       * Valibot schema array for validating function arguments
       */
      args?: TArgsSchema;

      /**
       * Valibot schema for validating function return value
       */
      returns?: TReturnSchema;

      /**
       * Declares whether this function's args/return are JSON-serializable
       * (no Map/Set/Date/BigInt/cycles/class instances/undefined/Symbol/Function).
       *
       * - `true` — wire and dump use strict `JSON.stringify`; misshapen
       *   values throw `DF0019` at the call site. Required for `agent`.
       * - `false` (default) — `structured-clone-es` round-trips fancy
       *   types. Cannot be `agent`-exposed (registration throws `DF0018`).
       */
      jsonSerializable?: boolean;

      /**
       * Function implementation (required if setup doesn't provide one)
       */
      handler: (...args: TArgs) => TReturns;
    }
  : {
      /**
       * Function name (unique identifier)
       */
      name: TName;

      /**
       * Valibot schema array for validating function arguments
       */
      args?: TArgsSchema;

      /**
       * Valibot schema for validating function return value
       */
      returns?: TReturnSchema;

      /**
       * Declares whether this function's args/return are JSON-serializable
       * (no Map/Set/Date/BigInt/cycles/class instances/undefined/Symbol/Function).
       *
       * - `true` — wire and dump use strict `JSON.stringify`; misshapen
       *   values throw `DF0019` at the call site. Required for `agent`.
       * - `false` (default) — `structured-clone-es` round-trips fancy
       *   types. Cannot be `agent`-exposed (registration throws `DF0018`).
       */
      jsonSerializable?: boolean;

      /** Function implementation (required if setup doesn't provide one) */
      handler?: (
        ...args: InferArgsType<TArgsSchema>
      ) => InferReturnType<TReturnSchema>;
    };

export type RpcFunctionDefinitionAny = RpcFunctionDefinition<
  string,
  any,
  any,
  any,
  any
>;
