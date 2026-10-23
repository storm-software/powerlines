---
title: Powerlines TSDoc tag definitions
description: Compare base.json and recommended.json and their custom tags.
documentType: concept
---

# Powerlines TSDoc tag definitions

The package ships two JSON files. `recommended.json` extends two parents. `base.json` defines the Powerlines-specific tags.

## `base.json`

This file extends nothing. It defines two tags:

| Tag | Syntax kind | Rules |
| --- | --- | --- |
| `@runtime` | modifier | No extra rules. |
| `@domain` | block | `allowMultiple: false`. Use it at most once per comment. |

A modifier tag marks a declaration. A block tag holds a text section. `@domain` accepts a single section per doc comment.

## `recommended.json`

This file defines no tags of its own. Its `extends` array is:

```json
["@storm-software/tsdoc/recommended.json", "./base.json"]
```

It merges the shared Storm Software recommended tags with the Powerlines base tags. The Storm Software file was not inspected, so its tags are unknown.

## Precedence

TSDoc applies extended configs in order. Later entries override earlier ones. The local `./base.json` entry comes last, so Powerlines tags win on conflict. Conflict behavior was not verified against a TSDoc source. See gaps in [api-reference](api-reference.md).
