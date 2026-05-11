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

declare module "@graphql-codegen/cli" {
  import {
    CodegenContext,
    YamlCliFlags
  } from "@graphql-codegen/cli/typings/config.js";

  export function generate(
    input:
      | CodegenContext
      | (import("@graphql-codegen/plugin-helpers").Types.Config & {
          cwd?: string;
        }),
    saveToFile?: boolean
  ): Promise<import("@graphql-codegen/plugin-helpers").Types.FileOutput[]>;

  export function loadContext(
    cliFlags?: Partial<import("@graphql-codegen/cli").YamlCliFlags>
  ): Promise<CodegenContext | void>;

  export function updateContextWithCliFlags(
    context: CodegenContext,
    cliFlags: Partial<import("@graphql-codegen/cli").YamlCliFlags>
  ): void;

  export type { CodegenContext, YamlCliFlags };
}
