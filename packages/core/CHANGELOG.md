![Powerlines' logo banner](https://public.storm-cdn.com/powerlines/banner-1280x320-dark.gif)

# Changelog for Powerlines - Core

## [0.2.3](https://github.com/storm-software/powerlines/releases/tag/core%400.2.3) (03/07/2026)

### Features

- **plugin-pulumi:** Added support for passing resource `Output` to next `deployPulumi` hook ([4f4870588](https://github.com/storm-software/powerlines/commit/4f4870588))

## [0.2.2](https://github.com/storm-software/powerlines/releases/tag/core%400.2.2) (03/07/2026)

### Bug Fixes

- **core:** Resolve issue with augmented module import for `Config` type ([a7bd02817](https://github.com/storm-software/powerlines/commit/a7bd02817))

## [0.2.0](https://github.com/storm-software/powerlines/releases/tag/core%400.2.0) (03/06/2026)

### Miscellaneous

- **powerlines:** Ensure frozen artifact files have the correct header message ([f0b140130](https://github.com/storm-software/powerlines/commit/f0b140130))

### Features

- **core:** Added `infrastructure` type for generated files ([1adbd7615](https://github.com/storm-software/powerlines/commit/1adbd7615))

## [0.1.10](https://github.com/storm-software/powerlines/releases/tag/core%400.1.10) (03/06/2026)

### Miscellaneous

- **core:** Handle prefix option in resolver better ([dfa38be38](https://github.com/storm-software/powerlines/commit/dfa38be38))

## [0.1.8](https://github.com/storm-software/powerlines/releases/tag/core%400.1.8) (03/04/2026)

### Features

- **powerlines:** Added the `overwrite` option to disable updating previous artifacts ([54d89860f](https://github.com/storm-software/powerlines/commit/54d89860f))

## [0.1.6](https://github.com/storm-software/powerlines/releases/tag/core%400.1.6) (03/03/2026)

### Bug Fixes

- **monorepo:** Upgrade `stryke` utilities and update package usage ([46624b666](https://github.com/storm-software/powerlines/commit/46624b666))

## [0.1.4](https://github.com/storm-software/powerlines/releases/tag/core%400.1.4) (03/02/2026)

### Miscellaneous

- **core:** Added logic/option to prefix resolved modules in unplugin ([3b63c27ce](https://github.com/storm-software/powerlines/commit/3b63c27ce))

## [0.1.3](https://github.com/storm-software/powerlines/releases/tag/core%400.1.3) (03/01/2026)

### Bug Fixes

- **powerlines:** Added missing `constants` exports ([2045b7d8f](https://github.com/storm-software/powerlines/commit/2045b7d8f))

## [0.1.0](https://github.com/storm-software/powerlines/releases/tag/core%400.1.0) (03/01/2026)

### Features

- **core:** Ensure plugins augment core types and added `constants` export ([a0cd9f364](https://github.com/storm-software/powerlines/commit/a0cd9f364))

## [0.0.12](https://github.com/storm-software/powerlines/releases/tag/core%400.0.12) (03/01/2026)

### Bug Fixes

- **core:** Simplify and resolve issues with `input` configuration's typing ([5a4db0afe](https://github.com/storm-software/powerlines/commit/5a4db0afe))

## [0.0.11](https://github.com/storm-software/powerlines/releases/tag/core%400.0.11) (03/01/2026)

### Miscellaneous

- **core:** Ensure `package.json` config parsing uses camel-case ([0e11307f2](https://github.com/storm-software/powerlines/commit/0e11307f2))

## [0.0.10](https://github.com/storm-software/powerlines/releases/tag/core%400.0.10) (03/01/2026)

### Bug Fixes

- **core:** Resolve issue with excluding package from base plugin bundles ([93c5effa2](https://github.com/storm-software/powerlines/commit/93c5effa2))

## [0.0.8](https://github.com/storm-software/powerlines/releases/tag/core%400.0.8) (03/01/2026)

### Bug Fixes

- **core:** Publish core package separately to deduplicate reused code ([08dda6fce](https://github.com/storm-software/powerlines/commit/08dda6fce))

## [0.0.7](https://github.com/storm-software/powerlines/releases/tag/core%400.0.7) (03/01/2026)

### Bug Fixes

- **nx:** Additional updates to resolve plugin resolution issue ([4b69f83c1](https://github.com/storm-software/powerlines/commit/4b69f83c1))

## [0.0.6](https://github.com/storm-software/powerlines/releases/tag/core%400.0.6) (02/28/2026)

### Bug Fixes

- **powerlines:** Resolve issue with `package.json` exports list ([db1258c87](https://github.com/storm-software/powerlines/commit/db1258c87))

## [0.0.4](https://github.com/storm-software/powerlines/releases/tag/core%400.0.4) (02/28/2026)

### Miscellaneous

- **powerlines:** Move `formatPackageJson` to `plugin-utils` exports ([8152af211](https://github.com/storm-software/powerlines/commit/8152af211))
- **powerlines:** Clean up build plugin peer dependency versions ([c9c7d0c1f](https://github.com/storm-software/powerlines/commit/c9c7d0c1f))

## [0.0.2](https://github.com/storm-software/powerlines/releases/tag/core%400.0.2) (02/27/2026)

### Features

- **powerlines:** Update package structure for better single responsibility ([6c69d6846](https://github.com/storm-software/powerlines/commit/6c69d6846))
