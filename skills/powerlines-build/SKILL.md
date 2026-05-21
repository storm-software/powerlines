---
name: powerlines-build
description: Use when the user wants to build a Powerlines project for production deployment.
---

Run the Powerlines `build` command to compile and generate production artifacts.

## When To Use

- User asks to build a project with Powerlines.
- User asks to generate build output before deploy.

## Command

```bash
pnpm exec powerlines build --root <project-root>
```

If no explicit root is provided, run from the intended project directory and omit `--root`.
