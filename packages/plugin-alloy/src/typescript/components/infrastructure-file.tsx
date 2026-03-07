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

import { computed, splitProps } from "@alloy-js/core";
import { appendPath } from "@stryke/path/append";
import { hasFileExtension } from "@stryke/path/file-path-fns";
import { replacePath } from "@stryke/path/replace";
import defu from "defu";
import { usePowerlinesSafe } from "../../core/contexts/context";
import { TypescriptFile, TypescriptFileProps } from "./typescript-file";

export type InfrastructureFileProps = Omit<TypescriptFileProps, "path"> & {
  /**
   * The infrastructure module identifier.
   */
  id: string;
};

/**
 * A base component representing a Powerlines generated Typescript infrastructure file.
 *
 * @param props - The properties for the infrastructure file.
 * @returns The rendered infrastructure file component.
 */
export function InfrastructureFile(props: InfrastructureFileProps) {
  const [{ children, meta, id }, rest] = splitProps(props, [
    "children",
    "meta",
    "id"
  ]);

  const context = usePowerlinesSafe();
  const fullPath = computed(() =>
    context
      ? appendPath(
          hasFileExtension(id) ? "" : ".ts",
          replacePath(
            context.infrastructurePath,
            context.workspaceConfig.workspaceRoot
          )
        )
      : id
  );

  return (
    <TypescriptFile
      {...rest}
      path={fullPath.value}
      meta={defu(
        {
          kind: "infrastructure"
        },
        meta ?? {}
      )}>
      {children}
    </TypescriptFile>
  );
}
