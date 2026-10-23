---
title: Troubleshoot the Powerlines CLI
description: Fix missing binaries, root mistakes, and slow or full disks with repository-supported commands.
documentType: recipe
---

# Troubleshooting

## Binary not found

Symptom: `powerlines: command not found`.

Fix in order:

```bash
pnpm exec powerlines --help
```

```bash
nx build cli
```

```bash
ls dist/bin.mjs
```

Reason: the `bin` field points at `./dist/bin.mjs`. A fresh checkout has no `dist/` directory. Build it with `nx build cli`.

## `create` reports a missing root

Symptom: the `create` command fails or prompts for a path.

Fix: pass the required root explicitly.

```bash
powerlines create --root <new-project-dir>
```

Reason: `CreateOptions.root` is the only required option in the nine command files. Other commands default to the current directory.

## Command runs in the wrong directory

Symptom: output lands in the wrong folder, or the tool reports missing files.

Fix: pass `--root` with an explicit path.

```bash
powerlines build --root <project-dir>
```

Reason: every command except `gc` forwards `root` to the engine. An omitted `root` means the current working directory.

## Disk is full or builds feel slow

Symptom: low disk space or stale caches.

Fix: remove one group first, then everything when safe.

```bash
powerlines gc cache
```

```bash
powerlines gc all
```

Reason: `gc` removes `engine.context.envPaths` entries with `removeDirectory`. Available paths vary by OS and project configuration.

## Lint or test failures while contributing

Symptom: a pull request check fails on style or unit tests.

Fix with the repository-supported commands from the CLI README:

```bash
nx lint cli
```

```bash
nx test cli
```

## Get more help

Open the per-command page for your command:

```bash
powerlines help <command>
```

The `docs` URL template in `shell-shock.config.ts` also publishes each command at `https://docs.stormsoftware.com/projects/powerlines/reference/cli/{command}`.

Support channels from the README: [contact](https://stormsoftware.com/contact) and [GitHub discussions](https://github.com/storm-software/powerlines/discussions). Report bugs with a reproducible command, the CLI version, and the Node.js version.

## Gaps (not in CLI source)

- No exit-code table exists in the command files.
- No log file locations exist in the command files.
- No error-message catalog exists in the command files or tests.
