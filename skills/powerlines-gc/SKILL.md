---
name: powerlines-gc
description: Use when the user wants to run Powerlines garbage collection to prune environment directories.
---

Run the Powerlines `gc` command to remove selected environment path types.

## When To Use

- User asks to prune caches, temp files, logs, or data paths.
- User asks for `gc`, `prune`, or `garbage-collection`.

## Command

```bash
pnpm exec powerlines gc <type>
```

Valid `type` values: `data`, `cache`, `logs`, `temp`, `all`.

Aliases are also available: `prune`, `garbage-collection`.
