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

declare module "@asyncapi/generator" {
  import { AsyncAPISchema } from "@asyncapi/parser/esm/models/v3/asyncapi";

  export interface GeneratorOptions {
    templateParams?: Record<string, unknown>;
    entrypoint?: string;
    noOverwriteGlobs?: string[];
    disabledHooks?: Record<string, boolean | string | string[]>;
    output?: "fs" | "string";
    forceWrite?: boolean;
    install?: boolean;
    debug?: boolean;
    compile?: boolean;
    mapBaseUrlToFolder?: Record<string, string>;
    registry?: {
      url: string;
      auth?: string;
      token?: string;
    };
  }

  export class Generator {
    constructor(
      templateName: string,
      targetDir: string,
      options?: GeneratorOptions
    );

    generate(
      asyncapi: AsyncAPISchema | string,
      params?: Record<string, unknown>
    ): Promise<void>;
  }
}
