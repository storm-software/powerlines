---
title: Use a Powerlines TSDoc config
description: Point tsdoc.json at one shipped config.
documentType: getting-started
---

# Use a Powerlines TSDoc config

Create a `tsdoc.json` file in your project that extends the shipped config:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/tsdoc/v0/tsdoc.schema.json",
  "extends": ["@powerlines/tsdoc/recommended.json"]
}
```

Use `recommended.json` for most projects. It includes the Powerlines base tags plus the shared Storm Software recommended tags. Use `base.json` when you want only the Powerlines tags.

## Result

TSDoc accepts the `@runtime` and `@domain` tags defined in `base.json`, plus whatever tags the extended Storm Software config defines.

## Notes

- The `extends` value is an array of config paths. This matches the shape used in the shipped `recommended.json`.
- The Storm Software parent config was not inspected. Its tags are unknown. See gaps in [api-reference](api-reference.md).
