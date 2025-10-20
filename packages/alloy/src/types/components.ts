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

import type { Context } from "@alloy-js/core";
import type { Children } from "@alloy-js/core/jsx-runtime";
import type { SourceFileContext } from "@alloy-js/typescript";
import { ResolvedEntryTypeDefinition } from "powerlines/types/resolved";
import type { OutputModeType } from "powerlines/types/vfs";

export interface CopyOutputFile {
  kind: "file";
  path: string;
  sourcePath: string;

  /**
   * The format of the output files
   *
   * @remarks
   * If not specified, the output mode will be determined by the provided \`output.mode\` value.
   */
  mode?: OutputModeType;
}

export interface WriteOutputFile {
  kind: "file" | "entry" | "builtin";
  path: string;
  contents: string;
  filetype: string;

  /**
   * The format of the output files
   *
   * @remarks
   * If not specified, the output mode will be determined by the provided \`output.mode\` value.
   */
  mode?: OutputModeType;
}

export type OutputFile =
  | (WriteOutputFile & { kind: "file" })
  | (WriteOutputFile & {
      kind: "entry";
      typeDefinition?: ResolvedEntryTypeDefinition;
    })
  | (WriteOutputFile & { kind: "builtin"; id: string })
  | CopyOutputFile;

export interface OutputDirectory {
  kind: "directory";
  path: string;
  contents: (OutputDirectory | OutputFile)[];
}

export interface RenderEntryContext {
  typeDefinition: ResolvedEntryTypeDefinition;
}

export interface RenderBuiltinContext {
  id: string;
}

export interface RenderOutputContext {
  mode?: OutputModeType;
}

export interface CopyFileOutputContext {
  path?: string;
  sourcePath?: string;
}

export interface RenderContext extends Context {
  meta?: {
    copyFile?: CopyFileOutputContext;

    /**
     * The current context for the built-in module.
     */
    builtin?: RenderBuiltinContext;

    /**
     * The current context for the application entrypoint file being rendered.
     */
    entry?: RenderEntryContext;

    /**
     * The current context for output rendering.
     */
    output?: RenderOutputContext;
  } & Record<string, any>;
}

/**
 * A type that represents the props of a component that can have children.
 */
export interface ComponentProps {
  children?: Children;
}

/**
 * A type that requires the `children` prop in a component.
 */
export type ComponentPropsWithChildren = Omit<ComponentProps, "children"> &
  Required<Pick<ComponentProps, "children">>;

export interface BuiltinSourceFileContext extends SourceFileContext {
  /**
   * The runtime module identifier.
   */
  id: string;
}

export interface ReflectionOverrideInterface<T> {
  name?: string | Children;
  type?: string | Children;
  extends?: string | false;
  defaultValue?: Partial<T>;
}

export interface TypescriptFileImportItem {
  name: string;
  default?: boolean;
  alias?: string;
  type?: boolean;
}

export type TypescriptFileImports = Record<
  string,
  null | Array<TypescriptFileImportItem | string>
>;

export interface SourceFileHeaderProps extends ComponentProps {
  /**
   * If true, disables the ESLint directive at the top of the file.
   *
   * @defaultValue true
   */
  disableEslint?: boolean;

  /**
   * If true, disables the Biome directive at the top of the file.
   *
   * @defaultValue true
   */
  disableBiome?: boolean;

  /**
   * If true, disables the Prettier directive at the top of the file.
   *
   * @defaultValue false
   */
  disablePrettier?: boolean;
}
