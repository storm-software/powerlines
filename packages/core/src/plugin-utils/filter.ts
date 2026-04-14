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

import { toArray } from "@stryke/convert/to-array";
import { isAbsolutePath } from "@stryke/path/is-type";
import { resolve } from "node:path";
import picomatch from "picomatch";
import type { StringFilter, StringOrRegExp } from "unplugin";
import {
  NormalizedStringFilter,
  PluginFilter,
  TransformHookFilter
} from "../types/hooks";

const BACKSLASH_REGEX = /\\/g;
function normalize(path: string): string {
  return path.replace(BACKSLASH_REGEX, "/");
}

function getMatcherString(glob: string, cwd: string) {
  if (glob.startsWith("**") || isAbsolutePath(glob)) {
    return normalize(glob);
  }

  const resolved = resolve(cwd, glob);

  return normalize(resolved);
}

export function patternToIdFilter(pattern: StringOrRegExp): PluginFilter {
  if (pattern instanceof RegExp) {
    return (id: string) => {
      const normalizedId = normalize(id);
      const result = pattern.test(normalizedId);
      pattern.lastIndex = 0;
      return result;
    };
  }
  const cwd = process.cwd();
  const glob = getMatcherString(pattern, cwd);
  const matcher = picomatch(glob, { dot: true });

  return (id: string) => {
    const normalizedId = normalize(id);

    return matcher(normalizedId);
  };
}

export function patternToCodeFilter(pattern: StringOrRegExp): PluginFilter {
  if (pattern instanceof RegExp) {
    return (code: string) => {
      const result = pattern.test(code);
      pattern.lastIndex = 0;
      return result;
    };
  }
  return (code: string) => code.includes(pattern);
}

export function createFilter(
  exclude: PluginFilter[] | undefined,
  include: PluginFilter[] | undefined
): PluginFilter | undefined {
  if (!exclude && !include) {
    return;
  }

  return input => {
    if (exclude?.some(filter => filter(input))) {
      return false;
    }
    if (include?.some(filter => filter(input))) {
      return true;
    }
    return !(include && include.length > 0);
  };
}

export function normalizeFilter(filter: StringFilter): NormalizedStringFilter {
  if (typeof filter === "string" || filter instanceof RegExp) {
    return {
      include: [filter]
    };
  }
  if (Array.isArray(filter)) {
    return {
      include: filter
    };
  }
  return {
    exclude: filter.exclude ? toArray(filter.exclude) : undefined,
    include: filter.include ? toArray(filter.include) : undefined
  };
}

export function createIdFilter(
  filter: StringFilter | undefined
): PluginFilter | undefined {
  if (!filter) return;
  const { exclude, include } = normalizeFilter(filter);
  const excludeFilter = exclude?.map(patternToIdFilter);
  const includeFilter = include?.map(patternToIdFilter);

  return createFilter(excludeFilter, includeFilter);
}

export function createCodeFilter(
  filter: StringFilter | undefined
): PluginFilter | undefined {
  if (!filter) return;
  const { exclude, include } = normalizeFilter(filter);
  const excludeFilter = exclude?.map(patternToCodeFilter);
  const includeFilter = include?.map(patternToCodeFilter);

  return createFilter(excludeFilter, includeFilter);
}

export function createFilterForId(
  filter: StringFilter | undefined
): PluginFilter | undefined {
  const filterFunction = createIdFilter(filter);

  return filterFunction ? id => !!filterFunction(id) : undefined;
}

export function createFilterForTransform(
  idFilter: StringFilter | undefined,
  codeFilter: StringFilter | undefined
): TransformHookFilter | undefined {
  if (!idFilter && !codeFilter) return;
  const idFilterFunction = createIdFilter(idFilter);
  const codeFilterFunction = createCodeFilter(codeFilter);

  return (id, code) => {
    let fallback = true;
    if (idFilterFunction) {
      fallback &&= idFilterFunction(id);
    }
    if (!fallback) {
      return false;
    }

    if (codeFilterFunction) {
      fallback &&= codeFilterFunction(code);
    }
    return fallback;
  };
}
