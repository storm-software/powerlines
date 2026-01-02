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

import type { Children } from "@alloy-js/core";
import {
  code,
  For,
  Scope,
  Show,
  SourceDirectoryContext,
  splitProps,
  useContext,
  useScope
} from "@alloy-js/core";
import {
  getSourceDirectoryData,
  ImportStatements,
  PackageContext,
  SourceFileContext,
  TSModuleScope,
  useSourceFile
} from "@alloy-js/typescript";
import { appendPath } from "@stryke/path/append";
import { titleCase } from "@stryke/string-format/title-case";
import { isBoolean } from "@stryke/type-checks/is-boolean";
import { isString } from "@stryke/type-checks/is-string";
import { SingleLineComment } from "../../core/components/single-line-comment";
import { SourceFile, SourceFileProps } from "../../core/components/source-file";
import { usePowerlines } from "../../core/contexts/context";
import {
  ComponentProps,
  SourceFileHeaderProps,
  TypescriptFileImportItem,
  TypescriptFileImports
} from "../../types/components";

export type TypescriptFileProps = Omit<SourceFileProps, "filetype"> &
  ComponentProps & {
    hashbang?: Children | true;
    header?: Children;
    imports?: TypescriptFileImports;
    builtinImports?: TypescriptFileImports;
    export?: boolean | string;
    tsx?: boolean;
  };

/**
 * A base component representing a Powerlines generated Typescript source file.
 *
 * @param props - The properties for the source file.
 * @returns The rendered source file component.
 */
export function TypescriptFile(props: TypescriptFileProps) {
  const [{ children, path, imports, tsx, header, hashbang }, rest] = splitProps(
    props,
    ["children", "path", "imports", "tsx", "header", "hashbang"]
  );

  const directoryContext = useContext(SourceDirectoryContext)!;
  const sdData = getSourceDirectoryData(directoryContext);

  const modulePath = appendPath(path, directoryContext.path);
  const scope = new TSModuleScope(modulePath, useScope());
  sdData.modules.add(scope);

  const pkg = useContext(PackageContext);
  if (pkg) {
    pkg.scope.addModule(scope);
  }

  if (props.export) {
    if (pkg) {
      if (isBoolean(props.export)) {
        pkg.scope.addExport(modulePath, scope);
      } else {
        pkg.scope.addExport(props.export, scope);
      }
    }
  }

  return (
    <SourceFileContext.Provider
      value={{
        scope
      }}>
      <Scope value={scope}>
        <SourceFile
          {...rest}
          path={modulePath}
          header={
            header ?? (
              <TypescriptFileHeader hashbang={hashbang}>
                <TypescriptFileHeaderImports imports={imports} scope={scope} />
              </TypescriptFileHeader>
            )
          }
          filetype={tsx ? "tsx" : "typescript"}>
          {children}
        </SourceFile>
      </Scope>
    </SourceFileContext.Provider>
  );
}

export interface TypescriptFileHeaderProps extends SourceFileHeaderProps {
  header?: Children;
  hashbang?: Children | true;
}

/**
 * Renders the header for a Powerlines Typescript source file.
 *
 * @param props - The properties for the source file header.
 * @returns The rendered source file header.
 */
export function TypescriptFileHeader(props: TypescriptFileHeaderProps) {
  const {
    header,
    hashbang,
    disableEslint = true,
    disableBiome = true,
    disablePrettier = false,
    children
  } = props;

  const context = usePowerlines();

  return (
    <>
      <Show when={Boolean(hashbang)}>
        {hashbang === true
          ? code`#!/usr/bin/env ${
              context?.config.mode === "development"
                ? "-S NODE_OPTIONS=--enable-source-maps"
                : ""
            } node`
          : hashbang}
        <hbr />
      </Show>
      <Show when={Boolean(header)}>
        {header}
        <hbr />
      </Show>
      <hbr />
      <Show when={Boolean(disableEslint)}>
        <SingleLineComment variant="slash-star">
          {"eslint-disable"}
        </SingleLineComment>
        <hbr />
      </Show>
      <Show when={Boolean(disablePrettier)}>
        <SingleLineComment variant="slash-star">
          {"prettier-ignore"}
        </SingleLineComment>
        <hbr />
      </Show>
      <Show when={Boolean(disableBiome)}>
        <SingleLineComment>{"biome-ignore lint: disable"}</SingleLineComment>
        <hbr />
      </Show>
      <Show
        when={
          Boolean(disableEslint) ||
          Boolean(disablePrettier) ||
          Boolean(disableBiome)
        }>
        <hbr />
      </Show>
      <Show when={Boolean(children)}>
        <>
          {children}
          <hbr />
        </>
      </Show>
      <SingleLineComment>{code`Generated by ${
        titleCase(context?.config.framework) || "Powerlines"
      }`}</SingleLineComment>
      <hbr />
      <SingleLineComment>
        {code`NOTE: Do not edit this file manually - it will be overwritten automatically by the "prepare" command`}
      </SingleLineComment>
      <hbr />
    </>
  );
}

export interface TypescriptFileHeaderImportsProps extends SourceFileHeaderProps {
  imports?: TypescriptFileImports;
  builtinImports?: TypescriptFileImports;
  scope?: TSModuleScope;
}

/**
 * Renders the header for a Powerlines Typescript source file.
 *
 * @param props - The properties for the source file header.
 * @returns The rendered source file header.
 */
export function TypescriptFileHeaderImports(
  props: TypescriptFileHeaderImportsProps
) {
  const { imports, builtinImports } = props;

  const context = usePowerlines();
  const sourceFile = useSourceFile();

  const scope = props.scope ?? sourceFile.scope;

  return (
    <Show
      when={
        scope.importedModules.size > 0 ||
        (!!builtinImports && Object.keys(builtinImports).length > 0) ||
        (!!imports && Object.keys(imports).length > 0)
      }>
      <Show when={!!imports && Object.keys(imports).length > 0}>
        <For each={Object.entries(imports ?? {})}>
          {([module, normalImports]) => {
            return code`import ${
              normalImports === null
                ? ""
                : ` from ${
                    (
                      normalImports.filter(
                        i => !isString(i) && i.default
                      ) as TypescriptFileImportItem[]
                    )
                      .map(i => (i.alias ? i.alias : i.name))
                      .join(", ") +
                    (normalImports.filter(i => !isString(i) && i.default)
                      .length > 0 &&
                    normalImports.filter(i => isString(i) || !i.default)
                      .length > 0
                      ? ", "
                      : "") +
                    (normalImports.filter(i => isString(i) || !i.default)
                      .length > 0
                      ? `{ ${normalImports
                          .map(i =>
                            isString(i)
                              ? i
                              : i.alias
                                ? `${i.name} as ${i.alias}`
                                : i.name
                          )
                          .join(", ")} }`
                      : "")
                  } `
            } "${module}";`;
          }}
        </For>
      </Show>
      <Show when={builtinImports && Object.keys(builtinImports).length > 0}>
        <For
          each={Object.entries(
            (builtinImports ?? {}) as Record<
              string,
              null | Array<TypescriptFileImportItem | string>
            >
          )}>
          {([builtinModule, builtinImports]) =>
            code`import ${
              builtinImports === null
                ? ""
                : ` from ${
                    (
                      builtinImports.filter(
                        i => !isString(i) && i.default
                      ) as TypescriptFileImportItem[]
                    )
                      .map(i => (i.alias ? i.alias : i.name))
                      .join(", ") +
                    (builtinImports.filter(i => !isString(i) && i.default)
                      .length > 0 &&
                    builtinImports.filter(i => isString(i) || !i.default)
                      .length > 0
                      ? ", "
                      : "") +
                    (builtinImports.filter(i => isString(i) || !i.default)
                      .length > 0
                      ? `{ ${builtinImports
                          .map(i =>
                            isString(i)
                              ? i
                              : i.alias
                                ? `${i.name} as ${i.alias}`
                                : i.name
                          )
                          .join(", ")} }`
                      : "")
                  } `
            } "${
              builtinModule.includes(":")
                ? builtinModule
                : `${context.config.output.builtinPrefix}:${builtinModule}`
            }";`
          }
        </For>
      </Show>
      <Show when={scope.importedModules.size > 0}>
        <ImportStatements records={scope.importedModules} />
      </Show>
      <hbr />
    </Show>
  );
}
