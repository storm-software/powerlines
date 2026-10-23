---
title: Extend a Powerlines TypeScript config
description: Point tsconfig.json at one shipped config and override fields.
documentType: getting-started
---

# Extend a Powerlines TypeScript config

Set the `extends` field in your `tsconfig.json` to one shipped file:

```json
{
  "extends": "@powerlines/tsconfig/recommended.json"
}
```

Use `recommended.json` for most projects. Use `strict.json` for stricter checks, `monorepo.json` for workspace packages, `deepkit.json` for Deepkit reflection, and `base.json` for the minimal base.

## Result

TypeScript applies the shared compiler options. Your local `compilerOptions` override the shared values. Only set the fields you need to change.

## Notes

- The import path is the package subpath, for example `@powerlines/tsconfig/strict.json`. TypeScript resolves it through the `exports` map.
- Inherited fields come from `@storm-software/tsconfig`. That package was not inspected. See gaps in [api-reference](api-reference.md).
