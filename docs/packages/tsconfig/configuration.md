---
title: Choose a Powerlines TypeScript config
description: Compare the five shipped configs and their compiler options.
documentType: concept
---

# Choose a Powerlines TypeScript config

Each file sets `extends`, `display`, and `compilerOptions`. Only the fields set in each file are listed here. Inherited fields come from `@storm-software/tsconfig` and were not inspected.

## `base.json`

Extends `@storm-software/tsconfig/base.json`.

- `verbatimModuleSyntax: false`
- `strict: true`
- `noPropertyAccessFromIndexSignature: false`
- `lib: ["ESNext"]`
- `types: ["node"]`

Use it as the minimal base for Powerlines projects.

## `recommended.json`

Extends `@storm-software/tsconfig/recommended.json`.

- `verbatimModuleSyntax: true`
- `strict: true`
- `noPropertyAccessFromIndexSignature: false`

Use it as the default for most projects. It enables `verbatimModuleSyntax` on top of the base behavior.

## `strict.json`

Extends `@storm-software/tsconfig/recommended.json`.

- `verbatimModuleSyntax: true`
- `noPropertyAccessFromIndexSignature: true`

Use it when you want indexed access to require explicit checks. It does not set `strict` itself; that value is inherited.

## `monorepo.json`

Extends `@storm-software/tsconfig/recommended.json`.

- `target: "esnext"`
- `declaration: true`
- `declarationMap: true`
- `skipLibCheck: true`
- `allowJs: true`
- `lib: ["ESNext", "DOM", "DOM.Iterable", "DOM.AsyncIterable"]`
- `module: "ESNext"`
- `moduleResolution: "Bundler"`
- `moduleDetection: "force"`
- `verbatimModuleSyntax: true`
- `strict: true`
- `noPropertyAccessFromIndexSignature: false`
- `types: ["node"]`
- `resolveJsonModule: true`

Use it for packages inside a monorepo. It enables declarations, bundler-style module resolution, and DOM libraries.

## `deepkit.json`

Extends `@storm-software/tsconfig/recommended.json`.

- `verbatimModuleSyntax: false`
- `strict: true`
- `noPropertyAccessFromIndexSignature: false`
- `reflection: true`
- `reflectionLevel: "minimal"`

Use it for Deepkit projects. Reflection stays enabled with a minimal level. `verbatimModuleSyntax` is off because Deepkit reflection needs runtime type imports.
