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
  code,
  For,
  MemberDeclaration,
  Name,
  Namekey,
  Refkey,
  Show,
  splitProps
} from "@alloy-js/core";
import {
  CallSignature,
  CallSignatureProps,
  CommonDeclarationProps,
  createMemberSymbol,
  createTypeAndValueSymbol,
  Declaration,
  TSSymbolFlags,
  TypeParameterDescriptor,
  TypeRefContext,
  useTSNamePolicy
} from "@alloy-js/typescript";
import { LexicalScope } from "../contexts";
import { MemberScope } from "../contexts/member-scope";
import { getCallSignatureProps } from "../helpers";
import { PropertyName } from "./property-name";
import { TSDoc, TSDocParams } from "./tsdoc";
import { TypeParameters } from "./type-parameters";

/**
 * Props for the ClassDeclaration component, which represents a TypeScript class declaration
 */
export interface ClassDeclarationProps extends CommonDeclarationProps {
  /**
   * An indication of whether this class is abstract
   */
  abstract?: boolean;

  /**
   * An optional class that this class extends. This will be rendered as an `extends` clause in the class declaration
   */
  extends?: Children;

  /**
   * Optional interfaces that this class implements. This will be rendered as an `implements` clause in the class declaration
   */
  implements?: Children[];

  /**
   * The generic type parameters of the class.
   */
  typeParameters?: TypeParameterDescriptor[] | string[];
}

/**
 * Create a TypeScript class declaration.
 *
 * @example
 * ```tsx
 * const myPetRefkey = refkey();
 * const Animal = refkey();
 * const staticMember = refkey();
 * const instanceMember = refkey();
 *
 * <ClassDeclaration name="Animal" refkey={Animal}>
 *   <ClassMember public static name="something" type="string" refkey={staticMember}>
 *     "hello"
 *   </ClassMember>
 *   <ClassMember public name="kind" type="string" />
 *   <ClassMember public name="name" type="string" refkey={instanceMember} />
 *   <ClassConstructor parameters="name: string">
 *     this.name = name;
 *   </ClassConstructor>
 * </ClassDeclaration>
 *
 * <VarDeclaration const name="myPet" refkey={myPetRefkey}>
 *   new {Animal}();
 * </VarDeclaration>
 *
 * {staticMember}; // Animal.something
 * <MemberReference path={[myPetRefkey, instanceMember]} /> // myPet.name
 * {memberRefkey(myPetRefkey, instanceMember)}
 * ```
 */
export function ClassDeclaration(props: ClassDeclarationProps) {
  const extendsPart = props.extends && <> extends {props.extends}</>;
  const implementsPart = props.implements && props.implements.length > 0 && (
    <>
      {" "}
      implements{" "}
      <For each={props.implements} comma space>
        {implement => implement}
      </For>
    </>
  );
  const sym = createTypeAndValueSymbol(props.name, {
    refkeys: props.refkey,
    export: props.export,
    default: props.default,
    metadata: props.metadata,
    hasInstanceMembers: true,
    namePolicy: useTSNamePolicy().for("class")
  });

  return (
    <>
      <Show when={Boolean(props.doc)}>
        <TSDoc heading={props.doc} />
      </Show>
      <Declaration symbol={sym} export={props.export} default={props.default}>
        <MemberScope ownerSymbol={sym}>
          {props.abstract && code`abstract `} class <Name />
          {props.typeParameters && (
            <TypeParameters parameters={props.typeParameters} />
          )}
          {extendsPart}
          {implementsPart} <Block>{props.children}</Block>
        </MemberScope>
      </Declaration>
    </>
  );
}

ClassDeclaration.TypeParameters = TypeParameters;

/**
 * Generates a TypeScript class member declaration for the given reflection class.
 */
export interface ClassMemberProps {
  name: string | Namekey;
  refkey?: Refkey;
  public?: boolean;
  private?: boolean;
  protected?: boolean;
  jsPrivate?: boolean;
  static?: boolean;
  abstract?: boolean;
  children?: Children;
  doc?: Children;
  nullish?: boolean;
}

/**
 * Generates a TypeScript class member declaration for the given reflection class.
 *
 * @param props - The properties of the class member, including its name, visibility, and other modifiers.
 * @returns A JSX element representing the class member declaration, which can be used within a ClassDeclaration component.
 */
export function ClassMember(props: ClassMemberProps) {
  let tsFlags = TSSymbolFlags.None;
  if (props.nullish) {
    tsFlags |= TSSymbolFlags.Nullish;
  }

  const sym = createMemberSymbol(props.name, props, {
    refkeys: props.refkey,
    tsFlags,
    namePolicy: useTSNamePolicy().for("class-member-data")
  });

  return (
    <>
      <Show when={Boolean(props.doc)}>
        <TSDoc heading={props.doc} />
      </Show>
      <MemberDeclaration symbol={sym}>
        {props.public && "public "}
        {props.private && "private "}
        {props.protected && "protected "}
        {props.abstract && "abstract "}
        {props.static && "static "}
        {props.children}
      </MemberDeclaration>
    </>
  );
}

/**
 * Props for a class field, which is a specific type of class member that represents a property of the class.
 */
export interface ClassFieldProps extends ClassMemberProps {
  name: string;
  type?: Children;
  optional?: boolean;
  children?: Children;
  isPrivateMember?: boolean;
}

/**
 * Generates a TypeScript class field declaration for the given reflection class.
 *
 * @param props - The properties of the class field, including its name, type, optionality, and other modifiers.
 * @returns A JSX element representing the class field declaration, which can be used within a ClassDeclaration component.
 */
export function ClassField(props: ClassFieldProps) {
  const optionality = props.optional ? "?" : "";
  const typeSection = props.type && (
    <>
      {optionality}: <TypeRefContext>{props.type}</TypeRefContext>
    </>
  );
  const initializerSection = props.children && <> = {props.children}</>;
  const nullish = props.nullish ?? props.optional;

  return (
    <ClassMember {...props} nullish={nullish}>
      <PropertyName
        private={props.isPrivateMember}
        name={props.isPrivateMember ? props.name : undefined}
      />
      {typeSection}
      {initializerSection}
    </ClassMember>
  );
}

/**
 * Props for a class field, which is a specific type of class member that represents a property of the class.
 */
export interface ClassPropertyProps extends ClassMemberProps {
  name: string;
  type?: Children;
  children?: Children;
}

/**
 * Generates a TypeScript class property setter declaration for the given reflection class.
 *
 * @param props - The properties of the class property, including its name, type, and other modifiers.
 * @returns A JSX element representing the class property setter declaration, which can be used within a ClassDeclaration component.
 */
export function ClassPropertySet(props: ClassPropertyProps) {
  return (
    <>
      <ClassMember {...props}>
        {" set "}
        <PropertyName name={props.name} />
        <LexicalScope>
          <CallSignature
            parameters={[
              {
                name: "value",
                type: <TypeRefContext>{props.type}</TypeRefContext>
              }
            ]}
          />{" "}
          <Block>{props.children}</Block>
        </LexicalScope>
      </ClassMember>
    </>
  );
}

/**
 * Generates a TypeScript class property getter declaration for the given reflection class.
 *
 * @param props - The properties of the class property, including its name, type, and other modifiers.
 * @returns A JSX element representing the class property getter declaration, which can be used within a ClassDeclaration component.
 */
export function ClassPropertyGet(props: ClassPropertyProps) {
  return (
    <ClassMember {...props}>
      {" get "}
      <PropertyName name={props.name} />
      <LexicalScope>
        <CallSignature
          returnType={<TypeRefContext>{props.type}</TypeRefContext>}
        />{" "}
        <Block>{props.children}</Block>
      </LexicalScope>
    </ClassMember>
  );
}

/**
 * Props for a class method, which is a specific type of class member that represents a function defined within the class.
 */
export interface ClassMethodProps extends ClassMemberProps, CallSignatureProps {
  async?: boolean;
  children?: Children;
}

/**
 * Generates a TypeScript class method declaration for the given reflection class.
 *
 * @param props - The properties of the class method, including its name, visibility, and other modifiers.
 * @returns A JSX element representing the class method declaration, which can be used within a ClassDeclaration component.
 */
export function ClassMethod(props: ClassMethodProps) {
  const callProps = getCallSignatureProps(props);
  const [_, rest] = splitProps(props, ["doc"]);

  return (
    <>
      <Show when={Boolean(props.doc)}>
        <TSDoc heading={props.doc}>
          {Array.isArray(rest.parameters) && (
            <TSDocParams parameters={rest.parameters} />
          )}
        </TSDoc>
      </Show>
      <ClassMember {...rest}>
        {props.async && "async "}
        <PropertyName />
        <LexicalScope>
          <CallSignature {...callProps} /> <Block>{props.children}</Block>
        </LexicalScope>
      </ClassMember>
    </>
  );
}
