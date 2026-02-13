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
  Block,
  Children,
  childrenArray,
  computed,
  createSymbol,
  createSymbolSlot,
  effect,
  emitSymbol,
  findUnkeyedChildren,
  For,
  MemberDeclaration,
  Name,
  Namekey,
  Refkey,
  Show,
  splitProps,
  takeSymbols
} from "@alloy-js/core";
import {
  CommonDeclarationProps,
  Declaration,
  ensureTypeRefContext,
  TSOutputSymbol,
  TSSymbolFlags,
  TypeParameterDescriptor,
  useTSLexicalScope,
  useTSMemberScope,
  useTSNamePolicy
} from "@alloy-js/typescript";
import {
  ReflectionClass,
  ReflectionProperty,
  stringifyType
} from "@powerlines/deepkit/vendor/type";
import { pascalCase } from "@stryke/string-format/pascal-case";
import { isString } from "@stryke/type-checks/is-string";
import {
  ReflectionClassContext,
  ReflectionPropertyContext
} from "../../core/contexts/reflection";
import { ComponentProps } from "../../types/components";
import { MemberScope } from "../contexts/member-scope";
import { PropertyName } from "./property-name";
import { TSDoc } from "./tsdoc";
import {
  TSDocReflectionClass,
  TSDocReflectionProperty
} from "./tsdoc-reflection";
import { TypeParameters } from "./type-parameters";

export interface InterfaceDeclarationProps<
  T extends Record<string, any> = Record<string, any>
>
  extends CommonDeclarationProps, ComponentProps {
  /**
   * A base type that this interface extends. This can be used to represent inheritance
   */
  extends?: Children;

  /**
   * The generic type parameters of the interface.
   */
  typeParameters?: TypeParameterDescriptor[] | string[];

  /**
   * The reflection class that describes the properties of this interface.
   *
   * @remarks
   * This is used to generate the members of the interface based on the properties of the reflection class.
   */
  reflection?: ReflectionClass<T>;

  /**
   * A default value for this interface.
   *
   * @remarks
   * This is used when the interface is used as a type for a variable declaration, to provide an initial value for the variable.
   */
  defaultValue?: Partial<T>;
}

export interface InterfaceDeclarationPropertyProps
  extends Omit<InterfaceMemberProps, "name">, ComponentProps {
  property: ReflectionProperty;
}

export interface InterfaceExpressionProps {
  children?: Children;
}

export const InterfaceExpression = ensureTypeRefContext(
  function InterfaceExpression(props: InterfaceExpressionProps) {
    const scope = useTSLexicalScope();
    const symbol = createSymbol(TSOutputSymbol, "", undefined, {
      transient: true,
      binder: scope?.binder
    });

    emitSymbol(symbol);

    return (
      <group>
        <MemberScope ownerSymbol={symbol}>
          <Block>{props.children}</Block>
        </MemberScope>
      </group>
    );
  }
);

export interface InterfaceMemberPropsBase {
  type?: Children;
  children?: Children;
  readonly?: boolean;
  doc?: Children;
  refkey?: Refkey | Refkey[];
}
export interface InterfacePropertyMemberProps extends InterfaceMemberPropsBase {
  name: string | Namekey;
  optional?: boolean;
  nullish?: boolean;
}

export interface InterfaceIndexerMemberProps extends InterfaceMemberPropsBase {
  indexer: Children;
}

export type InterfaceMemberProps =
  | InterfacePropertyMemberProps
  | InterfaceIndexerMemberProps;

/**
 * Create a TypeScript interface member.
 *
 * An interface member can either provide a `name` prop to create a named
 * property, or an `indexer` prop to define an indexer for the interface.
 *
 * The type of the member can be provided either as the `type` prop or as the
 * children of the component.
 */
export function InterfaceMember(props: InterfaceMemberProps) {
  const type = props.type ?? props.children;
  const readonly = props.readonly ? "readonly " : "";

  if ("indexer" in props) {
    return (
      <>
        <Show when={Boolean(props.doc)}>
          <TSDoc heading={props.doc} />
        </Show>
        {readonly}[{props.indexer}]: {type}
      </>
    );
  }

  const optionality = props.optional ? "?" : "";
  const scope = useTSMemberScope();
  const sym = createSymbol(
    TSOutputSymbol,
    props.name,
    scope.ownerSymbol.staticMembers,
    {
      refkeys: props.refkey,
      tsFlags:
        TSSymbolFlags.TypeSymbol |
        ((props.nullish ?? props.optional)
          ? TSSymbolFlags.Nullish
          : TSSymbolFlags.None),
      namePolicy: useTSNamePolicy().for("interface-member"),
      binder: scope.binder
    }
  );

  const taken = takeSymbols();

  effect(() => {
    if (taken.size > 1) return;
    const symbol = Array.from(taken)[0];
    if (symbol?.isTransient) {
      symbol.moveMembersTo(sym);
    }
  });

  return (
    <MemberDeclaration symbol={sym}>
      <Show when={Boolean(props.doc)}>
        <TSDoc heading={props.doc} />
      </Show>
      {readonly}
      <PropertyName />
      {optionality}: {type}
    </MemberDeclaration>
  );
}

const BaseInterfaceDeclaration = ensureTypeRefContext(
  function InterfaceDeclaration(props: InterfaceDeclarationProps) {
    const ExprSlot = createSymbolSlot();

    const children = childrenArray(() => props.children);

    const extendsPart = props.extends ? <> extends {props.extends}</> : "";
    const filteredChildren = findUnkeyedChildren(children);
    const currentScope = useTSLexicalScope();

    const binder = currentScope?.binder;
    const sym = createSymbol(TSOutputSymbol, props.name, currentScope.types, {
      refkeys: props.refkey,
      default: props.default,
      export: props.export,
      metadata: props.metadata,
      tsFlags: TSSymbolFlags.TypeSymbol,
      namePolicy: useTSNamePolicy().for("interface"),
      binder
    });

    effect(() => {
      if (ExprSlot.ref.value) {
        const takenSymbols = ExprSlot.ref.value;
        for (const symbol of takenSymbols) {
          // ignore non-transient symbols (likely not the result of an expression).
          if (symbol.isTransient) {
            symbol.moveMembersTo(sym);
          }
        }
      }
    });

    return (
      <>
        <Show when={Boolean(props.doc)}>
          <TSDoc heading={props.doc} />
        </Show>
        <Declaration {...props} nameKind="interface" kind="type" symbol={sym}>
          interface <Name />
          {props.typeParameters && (
            <TypeParameters parameters={props.typeParameters} />
          )}
          {extendsPart}{" "}
          <ExprSlot>
            <InterfaceExpression>{filteredChildren}</InterfaceExpression>
          </ExprSlot>
        </Declaration>
      </>
    );
  }
);

/**
 * Generates a TypeScript interface for the given reflection class.
 */
export function InterfaceDeclaration<
  T extends Record<string, any> = Record<string, any>
>(props: InterfaceDeclarationProps<T>) {
  const [{ name, reflection, doc }, rest] = splitProps(props, [
    "name",
    "reflection",
    "doc"
  ]);

  const interfaceName = computed(() =>
    pascalCase(
      (isString(name) ? name : name.toString()) || reflection?.getName()
    )
  );

  const properties = computed(() =>
    reflection
      ? reflection
          .getProperties()
          .filter(item => !item.isIgnored())
          .sort((a, b) =>
            (a.isReadonly() && b.isReadonly()) ||
            (!a.isReadonly() && !b.isReadonly())
              ? a.getNameAsString().localeCompare(b.getNameAsString())
              : a.isReadonly()
                ? 1
                : -1
          )
      : []
  );

  return (
    <Show
      when={properties.value.length > 0}
      fallback={
        <BaseInterfaceDeclaration {...props} name={interfaceName.value} />
      }>
      <ReflectionClassContext.Provider
        value={{
          reflection: reflection!
        }}>
        <TSDocReflectionClass heading={doc} />
        <BaseInterfaceDeclaration
          export={true}
          name={interfaceName.value}
          {...rest}>
          <For each={properties} doubleHardline={true} semicolon={true}>
            {prop => <InterfaceDeclarationProperty property={prop} />}
          </For>
        </BaseInterfaceDeclaration>
      </ReflectionClassContext.Provider>
    </Show>
  );
}

/**
 * Generates a TypeScript interface property for the given reflection class.
 */
export function InterfaceDeclarationProperty(
  props: InterfaceDeclarationPropertyProps
) {
  const [{ property }, rest] = splitProps(props, ["property"]);

  return (
    <ReflectionPropertyContext.Provider value={property}>
      <TSDocReflectionProperty />
      <InterfaceMember
        name={property.getNameAsString()}
        readonly={property.isReadonly()}
        optional={property.isOptional()}
        nullish={property.isNullable()}
        type={stringifyType(property.getType())}
        {...rest}
      />
    </ReflectionPropertyContext.Provider>
  );
}
