declare module "markdown-toc" {
  interface Options {
    slugify?: (str: string) => string;
    maxdepth?: number;
    firsth1?: boolean;
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
