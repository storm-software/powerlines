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
  childrenArray,
  code,
  computed,
  For,
  List,
  Show,
  splitProps
} from "@alloy-js/core";
import {
  ReflectionClass,
  ReflectionKind,
  ReflectionMethod,
  ReflectionProperty,
  stringifyType
} from "@powerlines/deepkit/vendor/type";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetObject } from "@stryke/type-checks";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import { Spacing } from "../../core/components/spacing";
import {
  useReflectionClass,
  useReflectionMethod,
  useReflectionPropertyContext
} from "../../core/contexts/reflection";
import {
  TSDoc,
  TSDocAttributesTags,
  TSDocParam,
  TSDocProps,
  TSDocReturns
} from "./tsdoc";

export interface TSDocReflectionClassProps<
  T extends Record<string, any> = Record<string, any>
> extends TSDocProps {
  reflection: ReflectionClass<T>;
}

/**
 * Generates a TSDoc documentation block for the given reflection class. This component will render the description of the reflection as the main content of the documentation block, and will render any additional attributes (such as title, alias, domain, permission, etc.) as tags in the documentation block. If there are child elements provided, they will be rendered as a list below the main content of the documentation block. This is useful for rendering additional details about the reflection that may not be included in the description, such as information about properties or methods of a class.
 */
export function TSDocReflectionClass<
  T extends Record<string, any> = Record<string, any>
>(props: TSDocReflectionClassProps<T>) {
  const [{ children, heading, reflection }, rest] = splitProps(props, [
    "heading",
    "children",
    "reflection"
  ]);

  if (!isSetObject(reflection)) {
    return null;
  }

  const title = computed(
    () => reflection.getTitle() || titleCase(reflection.getName())
  );
  const computedHeading = computed(
    () => heading || reflection.getDescription() || title.value
  );

  const alias = computed(() => reflection.getAlias());
  const domain = computed(() => reflection.getDomain());
  const permission = computed(() => reflection.getPermission());
  const readonly = computed(() => reflection.isReadonly());
  const internal = computed(() => reflection.isInternal());
  const runtime = computed(() => reflection.isRuntime());
  const ignore = computed(() => reflection.isIgnored());
  const hidden = computed(() => reflection.isHidden());

  if (
    !computedHeading.value ||
    (isSetString(computedHeading.value) && computedHeading.value.trim() === "")
  ) {
    return null;
  }

  const hasAttributes = computed(
    () =>
      isSetString(title.value) ||
      (!isUndefined(alias.value) && alias.value.length > 0) ||
      (!isUndefined(permission.value) && permission.value.length > 0) ||
      isSetString(domain.value) ||
      !isUndefined(readonly.value) ||
      !isUndefined(internal.value) ||
      !isUndefined(runtime.value) ||
      !isUndefined(ignore.value) ||
      !isUndefined(hidden.value)
  );

  return (
    <TSDoc
      {...rest}
      heading={
        isSetString(computedHeading.value)
          ? computedHeading.value.trim()
          : computedHeading.value
      }>
      <Show when={hasAttributes.value}>
        <TSDocAttributesTags
          title={title.value}
          alias={alias.value}
          domain={domain.value}
          permission={permission.value}
          readonly={readonly.value}
          internal={internal.value}
          runtime={runtime.value}
          ignore={ignore.value}
          hidden={hidden.value}
        />
      </Show>
      <Show
        when={
          !isUndefined(children) &&
          childrenArray(() => children).filter(Boolean).length > 0
        }>
        <Show when={hasAttributes.value}>
          <Spacing />
        </Show>
        <List>{childrenArray(() => children)}</List>
      </Show>
    </TSDoc>
  );
}

/**
 * Uses the `useReflectionClass` hook to retrieve the reflection class from the context, and then renders a `TSDocReflectionClass` component with the retrieved reflection class. This is a convenience component that allows you to easily render a TSDoc documentation block for the current reflection class without having to manually retrieve the reflection class from the context.
 */
export function TSDocContextClass<
  T extends Record<string, any> = Record<string, any>
>(props: TSDocProps) {
  const reflectionClass = useReflectionClass<T>();

  return (
    <Show when={isSetObject(reflectionClass.reflection)}>
      <TSDocReflectionClass
        {...props}
        reflection={reflectionClass.reflection}
      />
    </Show>
  );
}

export interface TSDocReflectionPropertyProps extends TSDocProps {
  reflection: ReflectionProperty;
  defaultValue?: any;
}

/**
 * Generates a TSDoc documentation block for the given reflection property. This component will render the description of the reflection as the main content of the documentation block, and will render any additional attributes (such as title, alias, domain, permission, etc.) as tags in the documentation block. If there are child elements provided, they will be rendered as a list below the main content of the documentation block. This is useful for rendering additional details about the reflection that may not be included in the description, such as information about parameters of a method or properties of a class.
 */
export function TSDocReflectionProperty(props: TSDocReflectionPropertyProps) {
  const [{ children, reflection, defaultValue }, rest] = splitProps(props, [
    "children",
    "reflection",
    "defaultValue"
  ]);

  if (!isSetObject(reflection)) {
    return null;
  }

  const hasAttributes = computed(
    () =>
      isSetString(reflection.getTitle()) ||
      (!isUndefined(reflection.getAlias()) &&
        reflection.getAlias().length > 0) ||
      (!isUndefined(reflection.getPermission()) &&
        reflection.getPermission().length > 0) ||
      isSetString(reflection.getDomain()) ||
      !isUndefined(reflection.isReadonly()) ||
      !isUndefined(reflection.isInternal()) ||
      !isUndefined(reflection.isRuntime()) ||
      !isUndefined(reflection.isIgnored()) ||
      !isUndefined(reflection.isHidden()) ||
      (reflection.hasDefault() && !isUndefined(reflection.getDefaultValue()))
  );

  return (
    <TSDoc heading={reflection.getDescription()} {...rest}>
      <Show when={hasAttributes.value}>
        <TSDocAttributesTags
          type={reflection}
          title={reflection.getTitle()}
          alias={reflection.getAlias()}
          domain={reflection.getDomain()}
          permission={reflection.getPermission()}
          readonly={reflection.isReadonly()}
          internal={reflection.isInternal()}
          runtime={reflection.isRuntime()}
          ignore={reflection.isIgnored()}
          hidden={reflection.isHidden()}
          defaultValue={defaultValue ?? reflection.getDefaultValue()}
        />
      </Show>
      <Show
        when={
          !isUndefined(children) &&
          childrenArray(() => children).filter(Boolean).length > 0
        }>
        <Show when={hasAttributes.value}>
          <Spacing />
        </Show>
        <List>{childrenArray(() => children)}</List>
      </Show>
    </TSDoc>
  );
}

/**
 * Uses the `useReflectionProperty` hook to retrieve the reflection property from the context, and then renders a `TSDocReflectionProperty` component with the retrieved reflection property. This is a convenience component that allows you to easily render a TSDoc documentation block for the current reflection property without having to manually retrieve the reflection property from the context.
 */
export function TSDocContextProperty(props: TSDocProps) {
  const reflection = useReflectionPropertyContext();

  return (
    <Show when={isSetObject(reflection)}>
      <TSDocReflectionProperty
        {...props}
        reflection={reflection.property}
        defaultValue={reflection.defaultValue}
      />
    </Show>
  );
}

export interface TSDocReflectionMethodProps extends TSDocProps {
  reflection: ReflectionMethod;
}

/**
 * Generates a TSDoc documentation block for the given reflection method. This component will render the description of the reflection as the main content of the documentation block, and will render any additional attributes (such as title, alias, domain, permission, etc.) as tags in the documentation block. If there are child elements provided, they will be rendered as a list below the main content of the documentation block. Additionally, this component will render information about the parameters and return type of the method, if available.
 */
export function TSDocReflectionMethod(props: TSDocReflectionMethodProps) {
  const [{ children, reflection }, rest] = splitProps(props, [
    "children",
    "reflection"
  ]);

  if (!isSetObject(reflection)) {
    return null;
  }

  const heading = computed(
    () =>
      reflection.getDescription() ||
      (isString(reflection.getName())
        ? code`${String(reflection.getName())} method definition`
        : undefined)
  );

  return (
    <TSDoc heading={heading.value} {...rest}>
      <TSDocAttributesTags
        title={reflection.getTitle()}
        alias={reflection.getAlias()}
        domain={reflection.getDomain()}
        permission={reflection.getPermission()}
        readonly={reflection.isReadonly()}
        internal={reflection.isInternal()}
        runtime={reflection.isRuntime()}
        ignore={reflection.isIgnored()}
        hidden={reflection.isHidden()}
      />
      <Show
        when={Boolean(children) && childrenArray(() => children).length > 0}>
        <List>{childrenArray(() => children)}</List>
      </Show>
      <Show when={reflection.getParameters().length > 0}>
        <Spacing />
        <For each={reflection.getParameters()} hardline ender={<hbr />}>
          {param => (
            <TSDocParam
              name={param.getName()}
              optional={param.isOptional()}
              defaultValue={
                param.hasDefault() ? param.getDefaultValue() : undefined
              }>
              <Show
                when={Boolean(param.parameter.description)}
                fallback={code`A parameter to provide a ${param.getName()} value to the function.`}>
                {param.parameter.description}
              </Show>
            </TSDocParam>
          )}
        </For>
      </Show>
      <Show when={reflection.getReturnType().kind !== ReflectionKind.void}>
        <Spacing />
        <TSDocReturns>
          {code`The return value of the function, which is of type ${stringifyType(
            reflection.getReturnType()
          )}.`}
        </TSDocReturns>
      </Show>
    </TSDoc>
  );
}

/**
 * Uses the `useReflectionMethod` hook to retrieve the reflection method from the context, and then renders a `TSDocReflectionMethod` component with the retrieved reflection method. This is a convenience component that allows you to easily render a TSDoc documentation block for the current reflection method without having to manually retrieve the reflection method from the context.
 */
export function TSDocContextMethod(props: TSDocProps) {
  const reflection = useReflectionMethod();

  return (
    <Show when={isSetObject(reflection)}>
      <TSDocReflectionMethod {...props} reflection={reflection} />
    </Show>
  );
}
