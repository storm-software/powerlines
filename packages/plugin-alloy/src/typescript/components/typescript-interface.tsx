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
  InterfaceDeclaration,
  InterfaceDeclarationProps,
  InterfaceMember,
  InterfaceMemberProps
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
import { computed, For, splitProps } from "@powerlines/plugin-alloy/vendor";
import {
  TSDocReflectionClass,
  TSDocReflectionProperty
} from "./tsdoc-reflection";

export interface TypeScriptInterfaceProps<
  T extends Record<string, any> = Record<string, any>
>
  extends InterfaceDeclarationProps, ComponentProps {
  reflection: ReflectionClass<T>;
  defaultValue?: Partial<T>;
}

export interface TypescriptInterfacePropertyProps
  extends Omit<InterfaceMemberProps, "name">, ComponentProps {
  property: ReflectionProperty;
}

/**
 * Generates a TypeScript interface for the given reflection class.
 */
export function TypeScriptInterface<
  T extends Record<string, any> = Record<string, any>
>(props: TypeScriptInterfaceProps<T>) {
  const [{ name, reflection }, rest] = splitProps(props, [
    "name",
    "reflection"
  ]);

  const interfaceName = computed(() =>
    pascalCase(
      (isString(name) ? name : name.toString()) || reflection.getName()
    )
  );

  const properties = reflection
    .getProperties()
    .filter(item => !item.isIgnored())
    .sort((a, b) =>
      (a.isReadonly() && b.isReadonly()) || (!a.isReadonly() && !b.isReadonly())
        ? a.getNameAsString().localeCompare(b.getNameAsString())
        : a.isReadonly()
          ? 1
          : -1
    );

  return (
    <ReflectionClassContext.Provider
      value={{
        reflection
      }}>
      <TSDocReflectionClass />
      <InterfaceDeclaration export={true} name={interfaceName.value} {...rest}>
        <For each={properties} doubleHardline={true} semicolon={true}>
          {prop => <TypescriptInterfaceProperty property={prop} />}
        </For>
      </InterfaceDeclaration>
    </ReflectionClassContext.Provider>
  );
}

/**
 * Generates a TypeScript interface property for the given reflection class.
 */
export function TypescriptInterfaceProperty(
  props: TypescriptInterfacePropertyProps
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
