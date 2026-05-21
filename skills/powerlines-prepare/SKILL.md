---
name: powerlines-prepare
description: Use when the user wants to generate required Powerlines build and deployment artifacts.
---

Run the Powerlines `prepare` command to pre-generate artifacts needed by later stages.

## When To Use

- User asks to prepare artifacts.
- User needs pre-build or pre-deploy setup output.

## Command

```bash
pnpm exec powerlines prepare --root <project-root>
```

If no explicit root is provided, run from the intended project directory and omit `--root`.
