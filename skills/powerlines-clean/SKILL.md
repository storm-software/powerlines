---
name: powerlines-clean
description: Use when the user wants to clean Powerlines build artifacts and temporary files.
---

Run the Powerlines `clean` command to remove generated outputs and temporary files.

## When To Use

- User asks to clean a Powerlines project.
- User needs a fresh state before re-building.

## Command

```bash
pnpm exec powerlines clean --root <project-root>
```

If no explicit root is provided, run from the intended project directory and omit `--root`.
