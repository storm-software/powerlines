---
title: Powerlines TSDoc config reference
description: Shipped config files, extends chains, and tag definitions.
documentType: recipe
---

# Powerlines TSDoc config reference

Package: `@powerlines/tsdoc`. The package description is "A package containing shared TSDoc configuration files (tsdoc.json) used in Powerlines projects."

## Shipped files

The `exports` map and the `files` list agree on two JSON files:

| Path | Extends | Defines |
| --- | --- | --- |
| `@powerlines/tsdoc/base.json` | Nothing | `@runtime` modifier tag, `@domain` block tag (`allowMultiple: false`) |
| `@powerlines/tsdoc/recommended.json` | `@storm-software/tsdoc/recommended.json`, `./base.json` | Nothing of its own; merges both parents |

## Tag reference

Only tags defined in `base.json` are documented. Both use the TSDoc v0 schema (`https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json`).

- `@runtime` — `syntaxKind: "modifier"`. No `allowMultiple` setting.
- `@domain` — `syntaxKind: "block"`, `allowMultiple: false`.

## Gaps

- The parent config `@storm-software/tsdoc/recommended.json` was not inspected. Its tag definitions are unknown.
- No tests or examples reference these files in this repo. Real comment examples using `@runtime` and `@domain` were not found.
- Extends precedence between the two parents is stated from the array order in `recommended.json`. It was not verified against TSDoc resolution source.
