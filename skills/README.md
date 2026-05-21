# Powerlines Agent Skills Collection

This directory is a distributable Agent Skills collection for Powerlines CLI workflows.

## Install From This Repository

List available skills:

npx skills add storm-software/powerlines --list

Install all Powerlines CLI skills:

npx skills add storm-software/powerlines --skill '*'

Install specific skills:

npx skills add storm-software/powerlines --skill powerlines-build --skill powerlines-lint

Install to specific agents:

npx skills add storm-software/powerlines --skill '*' --agent github-copilot --agent claude-code

## Included Skills

- powerlines-build
- powerlines-clean
- powerlines-deploy
- powerlines-docs
- powerlines-gc
- powerlines-lint
- powerlines-create
- powerlines-prepare
- powerlines-types

Each skill folder contains a SKILL.md file following the Agent Skills specification:
https://agentskills.io/specification
