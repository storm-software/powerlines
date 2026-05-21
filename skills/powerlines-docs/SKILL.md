---
name: powerlines-docs
description: Use when the user wants to generate project documentation with Powerlines.
---

Run the Powerlines `docs` command to generate documentation from project sources.

## When To Use

- User asks to generate docs.
- User asks to refresh generated documentation after code changes.

## Command

```bash
pnpm exec powerlines docs --root <project-root>
```

If no explicit root is provided, run from the intended project directory and omit `--root`.
