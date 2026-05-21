---
name: powerlines-types
description: Use when the user wants to generate a Powerlines TypeScript declaration file.
---

Run the Powerlines `types` command to produce declaration outputs.

## When To Use

- User asks to generate TypeScript declaration files.
- User asks to refresh generated `d.ts` artifacts.

## Command

```bash
pnpm exec powerlines types --root <project-root>
```

If no explicit root is provided, run from the intended project directory and omit `--root`.
