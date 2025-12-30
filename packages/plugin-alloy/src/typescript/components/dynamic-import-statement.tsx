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

import { VarDeclaration, VarDeclarationProps } from "@alloy-js/typescript";
import { code } from "@powerlines/plugin-alloy/vendor";

export interface DynamicImportStatementProps extends Omit<
  VarDeclarationProps,
  "initializer"
> {
  /**
   * The path of the module to import.
   */
  importPath: string;

  /**
   * The name of the export to import from the module.
   *
   * @defaultValue "default"
   */
  exportName?: string;
}

/**
 * Generates a dynamic import statement for a given module path and export name.
 *
 * @example
 * ```tsx
 * <DynamicImportStatement importPath="./my-module" exportName="myExport" const={true} name="myVar" />
 * // const myVar = await import("./my-module").then(m => m.myExport);
 * ```
 *
 * @param props - The properties for the dynamic import statement.
 * @returns A `VarDeclaration` component representing the dynamic import statement.
 */
export function DynamicImportStatement(props: DynamicImportStatementProps) {
  const {
    importPath,
    exportName = "default",
    const: isConst = true,
    ...rest
  } = props;

  return (
    <VarDeclaration
      const={isConst}
      {...rest}
      initializer={code`await import("${importPath}").then(m => m.${exportName});`}></VarDeclaration>
  );
}
