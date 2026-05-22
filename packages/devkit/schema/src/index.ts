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

declare module "zod" {
  interface GlobalMeta {
    id?: string;
    title?: string;
    description?: string;
    docs?: string;
    alias?: string[];
    tags?: string[];
    deprecated?: boolean;
    hidden?: boolean;
    ignore?: boolean;
    internal?: boolean;
    runtime?: boolean;
    examples?: unknown[];
    readOnly?: boolean;
    writeOnly?: boolean;
    contentEncoding?: string;
    contentMediaType?: string;
    contentSchema?: string;
    [keyword: string]: unknown;
  }
}

export * from "./bundle";
export * from "./codegen";
export * from "./constants";
export * from "./extract";
export * from "./helpers";
export * from "./metadata";
export * from "./persistence";
export * from "./reflection";
export * from "./resolve";
export * from "./type-checks";
export * from "./types";
