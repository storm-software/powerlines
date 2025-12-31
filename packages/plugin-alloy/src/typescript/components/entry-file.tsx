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

/* eslint-disable @nx/enforce-module-boundaries */

import { computed, splitProps } from "@alloy-js/core";
import { appendPath } from "@stryke/path/append";
import { hasFileExtension } from "@stryke/path/file-path-fns";
import { replaceExtension } from "@stryke/path/replace";
import { isSet } from "@stryke/type-checks/is-set";
import defu from "defu";
import { ResolvedEntryTypeDefinition } from "powerlines/types/resolved";
import { usePowerlines } from "../../core/contexts/context";
import { TypescriptFile, TypescriptFileProps } from "./typescript-file";

export type EntryFileProps = TypescriptFileProps & {
  /**
   * Whether the file is a TSX file.
   *
   * @defaultValue false
   */
  tsx?: boolean;

  /**
   * Render metadata information about the entrypoint
   */
  typeDefinition?: ResolvedEntryTypeDefinition;
};

/**
 * A base component representing a Powerlines generated Typescript source file.
 *
 * @param props - The properties for the source file.
 * @returns The rendered source file component.
 */
export function EntryFile(props: EntryFileProps) {
  const [{ children, meta, tsx, path, typeDefinition }, rest] = splitProps(
    props,
    ["children", "meta", "tsx", "path", "typeDefinition"]
  );

  const context = usePowerlines();
  const fullPath = computed(() =>
    appendPath(
      `${
        !isSet(tsx) ? path : replaceExtension(path)
      }${hasFileExtension(path) && !isSet(tsx) ? "" : tsx ? ".tsx" : ".ts"}`,
      context.entryPath || "./"
    )
  );

  return (
    <TypescriptFile
      {...rest}
      path={fullPath.value}
      meta={defu(
        {
          kind: "entry"
        },
        meta ?? {},
        {
          typeDefinition
        }
      )}>
      {children}
    </TypescriptFile>
  );
}
