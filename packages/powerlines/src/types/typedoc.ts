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

import type {
  Event,
  ProjectReflection,
  Reflection,
  RenderTemplate,
  UrlMapping
} from "typedoc";
import type { NavigationItem } from "typedoc-plugin-markdown";

/**
 * Extends the RendererEvent from TypeDoc to expose navigation property.
 */
export interface MarkdownRendererEvent extends Event {
  readonly project: ProjectReflection;

  readonly outputDirectory: string;

  urls?: UrlMapping<Reflection>[];

  navigation: NavigationItem[];

  createPageEvent: <Model>(
    mapping: UrlMapping<Model>
  ) => [RenderTemplate<MarkdownPageEvent<Model>>, MarkdownPageEvent<Model>];
}

export interface MarkdownPageEvent<out Model = unknown> extends Event {
  project: ProjectReflection;

  filename: string;

  url: string;

  contents: string;

  pageHeadings: any;

  readonly model: Model;
}
