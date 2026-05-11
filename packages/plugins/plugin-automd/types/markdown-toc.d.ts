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

declare module "markdown-toc" {
  interface Options {
    slugify?: (str: string) => string;
    maxdepth?: number;
    first1?: boolean;
    bullets?: string;
    prefix?: string;
    filter?: (str: string, level: number) => boolean;
  }

  interface Entry {
    content: string;
    slug: string;
    lvl: number;
    i: number;
  }

  interface Result {
    content: string;
    tokens: Entry[];
  }

  function toc(input: string, options?: Options): Result;

  export default toc;
}
