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
import { appendExtension, appendPath } from "@stryke/path/append";
import {
  findFileExtensionSafe,
  hasFileExtension
} from "@stryke/path/file-path-fns";
import { replaceExtension, replacePath } from "@stryke/path/replace";
import defu from "defu";
import { usePowerlinesSafe } from "../../core/contexts/context";
import { SourceFile, SourceFileProps } from "./source-file";

export type InfrastructureFileProps = Omit<SourceFileProps, "path"> & {
  /**
   * The infrastructure module identifier.
   */
  id: string;

  /**
   * The extension for the infrastructure file. This is used to determine the file extension if the `id` does not already include one.
   *
   * @remarks
   * If none is provided, the file extension will be determined by the {@link SourceFileProps.filetype | filetype} property.
   */
  extension?: string;
};

/**
 * A base component representing a Powerlines generated infrastructure file.
 *
 * @param props - The properties for the infrastructure file.
 * @returns The rendered infrastructure file component.
 */
export function InfrastructureFile(props: InfrastructureFileProps) {
  const [{ children, meta, id, extension, filetype: _filetype }, rest] =
    splitProps(props, ["children", "meta", "id", "extension", "filetype"]);

  const context = usePowerlinesSafe();
  const filetype = computed(
    () =>
      _filetype ||
      extension?.replace(/^\.*/, "") ||
      (hasFileExtension(id) ? findFileExtensionSafe(id) : "")
  );
  const path = computed(() => {
    const value = context
      ? appendPath(
          id,
          replacePath(context.infrastructurePath, context.config.cwd)
        )
      : id;

    return appendExtension(replaceExtension(value), filetype.value);
  });

  return (
    <SourceFile
      {...rest}
      filetype={filetype.value}
      path={path.value}
      meta={defu(
        {
          kind: "infrastructure"
        },
        meta ?? {}
      )}>
      {children}
    </SourceFile>
  );
}
