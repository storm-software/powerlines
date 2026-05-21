---
name: powerlines-lint
description: Use when the user wants to lint a Powerlines project's source code.
---

Run the Powerlines `lint` command to check project source code quality and style.

## When To Use

- User asks to lint with Powerlines.
- User asks to validate style and syntax before build or deploy.

## Command

```bash
pnpm exec powerlines lint --root <project-root>
```

If no explicit root is provided, run from the intended project directory and omit `--root`.
