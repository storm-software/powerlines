/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import { computed, splitProps } from "@alloy-js/core";
import {
  TypescriptFile,
  TypescriptFileHeader,
  TypescriptFileHeaderImports,
  type TypescriptFileProps
} from "@power-plant/alloy-js/typescript/components/typescript-file";
import {
  TSDocModule,
  type TSDocModuleProps
} from "@power-plant/alloy-js/typescript/components/tsdoc";
import { hasFileExtension } from "@stryke/path/file-path-fns";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import { isSet } from "@stryke/type-checks/is-set";
import { usePowerlinesSafe } from "../../core/contexts/context";

export type BuiltinFileProps = Omit<TypescriptFileProps, "path"> &
  Omit<TSDocModuleProps, "name"> & {
    /**
     * The runtime module identifier.
     *
     * @remarks
     * This value will be included after the \`storm:\` prefix in the import statement.
     */
    id: string;

    /**
     * The description for the builtin module.
     */
    description?: string;

    /**
     * Whether the file is a TSX file.
     *
     * @defaultValue false
     */
    tsx?: boolean;

    /**
     * Whether the file is internal and should not be included in the public API documentation.
     *
     * @defaultValue false
     */
    internal?: boolean;
  };

/**
 * A base component representing a Powerlines generated Typescript source file.
 *
 * @param props - The properties for the source file.
 * @returns The rendered source file component.
 */
export function BuiltinFile(props: BuiltinFileProps) {
  const [
    { children, imports, builtinImports, id, description, tsx, internal },
    rest
  ] = splitProps(props, [
    "children",
    "imports",
    "builtinImports",
    "id",
    "description",
    "tsx",
    "internal"
  ]);

  const context = usePowerlinesSafe();
  const path = computed(() =>
    replacePath(
      `${!isSet(tsx) ? id : replaceExtension(id)}${
        hasFileExtension(id) && !isSet(tsx) ? "" : tsx ? ".tsx" : ".ts"
      }`,
      context?.builtinsPath
    )
  );

  return (
    <TypescriptFile
      header={
        <TypescriptFileHeader
          header={<TSDocModule name={id}>{description}</TSDocModule>}>
          <TypescriptFileHeaderImports
            imports={imports}
            builtinImports={builtinImports}
          />
        </TypescriptFileHeader>
      }
      meta={{
        kind: "builtin",
        extension: tsx ? "tsx" : "ts",
        id: replaceExtension(id),
        internal
      }}
      {...rest}
      path={path.value}>
      {children}
    </TypescriptFile>
  );
}
