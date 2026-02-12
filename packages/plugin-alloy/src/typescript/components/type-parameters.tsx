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

import {
  Children,
  createSymbolSlot,
  For,
  Indent,
  onCleanup,
  Show,
  SymbolSlot,
  taggedComponent
} from "@alloy-js/core";
import {
  createValueSymbol,
  FunctionTypeParameterDescriptor,
  ParameterDescriptor,
  TSOutputSymbol,
  TSSymbolFlags,
  TypeParameterDescriptor,
  TypeRefContext,
  useTSNamePolicy
} from "@alloy-js/typescript";

/** Props for type parameters */
export interface TypeParametersProps {
  /** Parameters */
  parameters?: TypeParameterDescriptor[] | string[];
  /** Jsx Children */
  children?: Children;
}

interface DeclaredTypeParameterDescriptor extends Omit<
  TypeParameterDescriptor,
  "name"
> {
  symbol: TSOutputSymbol;
}

interface DeclaredParameterDescriptor extends Omit<
  ParameterDescriptor,
  "name"
> {
  symbol: TSOutputSymbol;
  TypeSlot: SymbolSlot;
}

interface DeclaredFunctionTypeParameterDescriptor extends Omit<
  FunctionTypeParameterDescriptor,
  "name"
> {
  symbol: TSOutputSymbol;
  TypeSlot: SymbolSlot;
}

const typeParametersTag = Symbol("type-parameters");

function typeParameter(param: DeclaredTypeParameterDescriptor) {
  return (
    <group>
      {param.symbol.name}
      <Show when={!!param.extends}>
        {" "}
        extends
        <indent>
          {" "}
          <TypeRefContext>{param.extends}</TypeRefContext>
        </indent>
      </Show>
      <Show when={!!param.default}>
        {" = "}
        <TypeRefContext>{param.default}</TypeRefContext>
      </Show>
    </group>
  );
}

/**
 * Represent type parameters
 *
 * @example
 * ```ts
 * <A, B extends string>
 * ```
 */
export const TypeParameters = taggedComponent(
  typeParametersTag,
  function TypeParameters(props: TypeParametersProps) {
    if (props.children) {
      return props.children;
    }

    if (!props.parameters) {
      return undefined;
    }

    const typeParameters = normalizeAndDeclareParameters(props.parameters);

    onCleanup(() => {
      for (const param of typeParameters) {
        param.symbol.delete();
      }
    });

    return (
      <>
        {"<"}
        <group>
          <Indent softline>
            <For each={typeParameters} comma line>
              {param => typeParameter(param as DeclaredTypeParameterDescriptor)}
            </For>
            <ifBreak>,</ifBreak>
          </Indent>
        </group>
        {">"}
      </>
    );
  }
);

function normalizeAndDeclareParameters(
  parameters: FunctionTypeParameterDescriptor[] | string[],
  flags?: TSSymbolFlags
): DeclaredTypeParameterDescriptor[];
function normalizeAndDeclareParameters(
  parameters: TypeParameterDescriptor[] | string[],
  flags?: TSSymbolFlags
): DeclaredFunctionTypeParameterDescriptor[];
function normalizeAndDeclareParameters(
  parameters: ParameterDescriptor[] | string[],
  flags?: TSSymbolFlags
): DeclaredParameterDescriptor[];
function normalizeAndDeclareParameters(
  parameters: string[],
  flags?: TSSymbolFlags
): DeclaredParameterDescriptor[] | DeclaredTypeParameterDescriptor[];
function normalizeAndDeclareParameters(
  parameters:
    | ParameterDescriptor[]
    | FunctionTypeParameterDescriptor[]
    | TypeParameterDescriptor[]
    | string[],
  flags: TSSymbolFlags = TSSymbolFlags.ParameterSymbol
): DeclaredParameterDescriptor[] | DeclaredTypeParameterDescriptor[] {
  const namePolicy = useTSNamePolicy();
  if (parameters.length === 0) {
    return [];
  }
  if (typeof parameters[0] === "string") {
    return (parameters as string[]).map(paramName => {
      const name = namePolicy.getName(paramName, "parameter");
      const TypeSlot = createSymbolSlot();
      const symbol = createValueSymbol(name, { type: TypeSlot.firstSymbol });

      return { refkeys: symbol.refkeys, symbol, TypeSlot };
    });
  } else {
    return (parameters as ParameterDescriptor[]).map(param => {
      const nullishFlag =
        (param.nullish ?? param.optional)
          ? TSSymbolFlags.Nullish
          : TSSymbolFlags.None;
      const TypeSlot = createSymbolSlot();
      const symbol = createValueSymbol(param.name, {
        refkeys: param.refkey,
        tsFlags: flags | nullishFlag,
        metadata: param.metadata,
        type: TypeSlot.firstSymbol,
        namePolicy: namePolicy.for("parameter")
      });

      return {
        ...param,
        symbol,
        TypeSlot
      };
    });
  }
}
