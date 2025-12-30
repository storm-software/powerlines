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

import { joinPaths } from "@stryke/path/join-paths";
import defu from "defu";
import { ResolvedEntryTypeDefinition } from "powerlines/types/resolved";
import { usePowerlines } from "../../core/contexts/context";
import { computed, splitProps } from "@powerlines/plugin-alloy/vendor";
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
    joinPaths(context?.entryPath || "./", `${path}${tsx ? ".tsx" : ".ts"}`)
  );

  return (
    <TypescriptFile
      {...rest}
      path={fullPath.value}
      meta={defu(meta ?? {}, {
        entry: {
          typeDefinition
        }
      })}>
      {children}
    </TypescriptFile>
  );
}
