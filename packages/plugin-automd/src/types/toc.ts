export interface TOCOptions {
  /**
   * A slugify function to generate slugs for the headings.
   */
  slugify?: (str: string) => string;

  /**
   * The maximum depth of headings to include in the TOC.
   *
   * @defaultValue 6
   */
  maxDepth?: number;

  /**
   * Whether to include the first H1 heading in the TOC.
   */
  firstH1?: boolean;

  /**
   * The bullet character to use for list items in the TOC.
   *
   * @defaultValue "-"
   */
  bullets?: string;

  /**
   * A prefix to add to each heading in the TOC.
   */
  prefix?: string;

  /**
   * A filter function to determine which headings to include in the TOC.
   */
  filter?: (str: string, level: number) => boolean;
}
