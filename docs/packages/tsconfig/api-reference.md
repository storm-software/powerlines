---
title: Powerlines TypeScript config reference
description: Shipped config files, their extends chain, and their fields.
documentType: recipe
---

# Powerlines TypeScript config reference

Package: `@powerlines/tsconfig`. The package description is "A package containing shared TypeScript configuration files (tsconfig.json) used in Powerlines projects."

## Shipped files

The `exports` map and the `files` list agree on five JSON files. Each file is both the source (`src/*.json`) and the published path (`./<name>.json`):

| Path | Extends | Display name |
| --- | --- | --- |
| `@powerlines/tsconfig/base.json` | `@storm-software/tsconfig/base.json` | Powerlines - Base Configuration |
| `@powerlines/tsconfig/recommended.json` | `@storm-software/tsconfig/recommended.json` | Powerlines - Recommended Configuration |
| `@powerlines/tsconfig/strict.json` | `@storm-software/tsconfig/recommended.json` | Powerlines - Strict Configuration |
| `@powerlines/tsconfig/monorepo.json` | `@storm-software/tsconfig/recommended.json` | Powerlines - Monorepo Configuration |
| `@powerlines/tsconfig/deepkit.json` | `@storm-software/tsconfig/recommended.json` | Powerlines - Deepkit Configuration |

## Field reference

Only fields set in each shipped file are documented. See [configuration](configuration.md) for the per-file values.

- `base.json`: `verbatimModuleSyntax`, `strict`, `noPropertyAccessFromIndexSignature`, `lib`, `types`.
- `recommended.json`: `verbatimModuleSyntax`, `strict`, `noPropertyAccessFromIndexSignature`.
- `strict.json`: `verbatimModuleSyntax`, `noPropertyAccessFromIndexSignature`.
- `monorepo.json`: `target`, `declaration`, `declarationMap`, `skipLibCheck`, `allowJs`, `lib`, `module`, `moduleResolution`, `moduleDetection`, `verbatimModuleSyntax`, `strict`, `noPropertyAccessFromIndexSignature`, `types`, `resolveJsonModule`.
- `deepkit.json`: `verbatimModuleSyntax`, `strict`, `noPropertyAccessFromIndexSignature`, `reflection`, `reflectionLevel`.

## Gaps

- The parent configs in `@storm-software/tsconfig` were not inspected. Effective values for inherited fields such as `target`, `module`, and `strict` (where not set locally) are unknown.
- No tests or examples reference these files in this repo. Recommended usage per project type is inferred from file names and fields, not from verified examples.
