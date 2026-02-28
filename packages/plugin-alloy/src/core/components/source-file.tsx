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
  getContext,
  Show,
  SourceDirectoryContext,
  SourceFileContext,
  SourceFileProps as SourceFilePropsExternal,
  splitProps,
  useContext,
  useFormatOptions
} from "@alloy-js/core";
import { appendPath } from "@stryke/path/append";
import defu from "defu";
import type { StoragePreset } from "powerlines";
import { ComponentProps } from "../../types/components";
import { useMeta } from "../contexts/meta";

export type SourceFileProps = SourceFilePropsExternal &
  ComponentProps & {
    /**
     * The storage preset for the output files.
     *
     * @remarks
     * If not specified, the output mode will be determined by the provided `output.mode` value.
     */
    storage?: StoragePreset;

    /**
     * The metadata associated with the source file.
     *
     * @remarks
     * The values stored in the metadata will be available in the rendering context.
     */
    meta?: Record<string, any>;
  };

/**
 * A base component representing a Powerlines generated source file.
 *
 * @param props - The properties for the source file.
 * @returns The rendered source file component.
 */
export function SourceFile(props: SourceFileProps) {
  const [{ children, meta, path, header, storage, filetype, reference }] =
    splitProps(props, [
      "children",
      "meta",
      "path",
      "header",
      "storage",
      "filetype",
      "reference"
    ]);

  const metadata = useMeta();
  const parentDirectory = useContext(SourceDirectoryContext)!;

  const sourceFile: SourceFileContext = {
    path: appendPath(path, parentDirectory.path),
    filetype,
    reference
  };
  parentDirectory?.addContent(sourceFile);

  const printOptions = useFormatOptions({
    printWidth: props.printWidth,
    tabWidth: props.tabWidth,
    useTabs: props.useTabs,
    insertFinalNewLine: props.insertFinalNewLine
  });

  const nodeContext = getContext()!;
  nodeContext.meta = defu(
    {
      sourceFile,
      printOptions
    },
    meta ?? {}
  );

  if (metadata) {
    metadata[sourceFile.path] = {
      storage,
      ...(meta ?? {})
    };
  }

  return (
    <SourceFileContext.Provider value={sourceFile}>
      <Show when={header !== undefined}>
        {header}
        <hbr />
      </Show>
      {children}
    </SourceFileContext.Provider>
  );
}
