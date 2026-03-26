![Powerlines' logo banner](https://public.storm-cdn.com/powerlines/banner-1280x320-dark.gif)

# Changelog for Powerlines - Core

## [0.12.1](https://github.com/storm-software/powerlines/releases/tag/core%400.12.1) (03/26/2026)

### Bug Fixes

- **core:** Added `isResovableId` to properly handle module Ids ([fc937282f](https://github.com/storm-software/powerlines/commit/fc937282f))

## [0.12.0](https://github.com/storm-software/powerlines/releases/tag/core%400.12.0) (03/25/2026)

### Miscellaneous

- **monorepo:** Update devenv config to use shared `ai` module ([c5e095dba](https://github.com/storm-software/powerlines/commit/c5e095dba))

### Features

- **core:** Run `organize-imports` prettier plugin on generated code ([5c04031a3](https://github.com/storm-software/powerlines/commit/5c04031a3))

## [0.11.0](https://github.com/storm-software/powerlines/releases/tag/core%400.11.0) (03/23/2026)

### Features

- **core:** Added resolve override options to apply to module resolver ([ec3bfca02](https://github.com/storm-software/powerlines/commit/ec3bfca02))

## [0.10.0](https://github.com/storm-software/powerlines/releases/tag/core%400.10.0) (03/22/2026)

### Features

- **core:** Added `clone` function to `Context` objects ([e5c62d8fd](https://github.com/storm-software/powerlines/commit/e5c62d8fd))

## [0.9.1](https://github.com/storm-software/powerlines/releases/tag/core%400.9.1) (03/22/2026)

### Bug Fixes

- **powerlines:** Resolve issue merging configuration prior to resolving ([bc26a3658](https://github.com/storm-software/powerlines/commit/bc26a3658))

## [0.9.0](https://github.com/storm-software/powerlines/releases/tag/core%400.9.0) (03/22/2026)

### Features

- **core:** Rename `typegen` to `types` to align with other CLI tools ([ab1696e65](https://github.com/storm-software/powerlines/commit/ab1696e65))

## [0.8.2](https://github.com/storm-software/powerlines/releases/tag/core%400.8.2) (03/19/2026)

### Bug Fixes

- **core:** Ensure `AnyUserConfig` output field is deeply partial ([b206710bc](https://github.com/storm-software/powerlines/commit/b206710bc))

## [0.8.1](https://github.com/storm-software/powerlines/releases/tag/core%400.8.1) (03/18/2026)

### Bug Fixes

- **powerlines:** Resolve issue copying build output and assets to copy directory ([2da6241e3](https://github.com/storm-software/powerlines/commit/2da6241e3))

## [0.8.0](https://github.com/storm-software/powerlines/releases/tag/core%400.8.0) (03/18/2026)

### Features

- **core:** Renamed `output.publish` to `output.copy` in options ([79c471b31](https://github.com/storm-software/powerlines/commit/79c471b31))
- **core:** Add `output.publish` config options ([5e932eb3b](https://github.com/storm-software/powerlines/commit/5e932eb3b))

## [0.7.0](https://github.com/storm-software/powerlines/releases/tag/core%400.7.0) (03/18/2026)

### Features

- **core:** Added `false` option to disable `publishPath` directory ([5b360830d](https://github.com/storm-software/powerlines/commit/5b360830d))

## [0.6.2](https://github.com/storm-software/powerlines/releases/tag/core%400.6.2) (03/18/2026)

### Bug Fixes

- **core:** Resolve issue resolving default export in config file ([009111638](https://github.com/storm-software/powerlines/commit/009111638))

## [0.6.1](https://github.com/storm-software/powerlines/releases/tag/core%400.6.1) (03/18/2026)

### Bug Fixes

- **core:** Fix issue resolving user configuration file ([d72b2d79f](https://github.com/storm-software/powerlines/commit/d72b2d79f))

## [0.6.0](https://github.com/storm-software/powerlines/releases/tag/core%400.6.0) (03/18/2026)

### Features

- **core:** Added support for resolver functions in configuration files ([b74d2025a](https://github.com/storm-software/powerlines/commit/b74d2025a))

## [0.5.3](https://github.com/storm-software/powerlines/releases/tag/core%400.5.3) (03/18/2026)

### Bug Fixes

- **core:** Resolve typing issues with hook names ([9f6b662d1](https://github.com/storm-software/powerlines/commit/9f6b662d1))

### Features

- **plugin-cloudflare:** Add logic use the `pulumi` provider and generate DNS records ([9575007c0](https://github.com/storm-software/powerlines/commit/9575007c0))
- **powerlines:** Rename `types` hook to `typegen` and add separate method in API ([636094b22](https://github.com/storm-software/powerlines/commit/636094b22))

## [0.5.0](https://github.com/storm-software/powerlines/releases/tag/core%400.5.0) (03/16/2026)

### Features

- **core:** Rename options from `output.outputPath` to `output.path` ([6e3fec8a1](https://github.com/storm-software/powerlines/commit/6e3fec8a1))

## [0.4.0](https://github.com/storm-software/powerlines/releases/tag/core%400.4.0) (03/14/2026)

### Features

- **core:** Added separate `typegen` configuration options ([1a8e296de](https://github.com/storm-software/powerlines/commit/1a8e296de))

## [0.3.4](https://github.com/storm-software/powerlines/releases/tag/core%400.3.4) (03/13/2026)

### Bug Fixes

- **core:** Update base plugin's tsdown build usage ([6c4660918](https://github.com/storm-software/powerlines/commit/6c4660918))

## [0.3.1](https://github.com/storm-software/powerlines/releases/tag/core%400.3.1) (03/12/2026)

### Bug Fixes

- **core:** Update `combinePlugins` helper to output a single plugin instance ([27fd1e750](https://github.com/storm-software/powerlines/commit/27fd1e750))

## [0.3.0](https://github.com/storm-software/powerlines/releases/tag/core%400.3.0) (03/12/2026)

### Features

- **core:** Added the `combinePlugins` helper utility ([e52b3d8c1](https://github.com/storm-software/powerlines/commit/e52b3d8c1))

## [0.2.23](https://github.com/storm-software/powerlines/releases/tag/core%400.2.23) (03/12/2026)

### Bug Fixes

- **monorepo:** Resolve build issues after `tsdown` upgrade ([509fff49b](https://github.com/storm-software/powerlines/commit/509fff49b))

## [0.2.20](https://github.com/storm-software/powerlines/releases/tag/core%400.2.20) (03/11/2026)

### Bug Fixes

- **core:** Resolve issue resolving prefixed virtual module ids ([bd5cf6fc5](https://github.com/storm-software/powerlines/commit/bd5cf6fc5))

## [0.2.17](https://github.com/storm-software/powerlines/releases/tag/core%400.2.17) (03/11/2026)

### Miscellaneous

- **monorepo:** Reformat workspace packages' source code ([4e6846b40](https://github.com/storm-software/powerlines/commit/4e6846b40))

### Bug Fixes

- **core:** Resolve issue applying filter to `load` hook ([894af83e3](https://github.com/storm-software/powerlines/commit/894af83e3))

## [0.2.15](https://github.com/storm-software/powerlines/releases/tag/core%400.2.15) (03/11/2026)

### Miscellaneous

- **core:** Added back logic to append prefix to resolved virtual module IDs ([1d29952e0](https://github.com/storm-software/powerlines/commit/1d29952e0))

### Bug Fixes

- **core:** Remove all prefix module resolution logic ([57f5efc46](https://github.com/storm-software/powerlines/commit/57f5efc46))

## [0.2.14](https://github.com/storm-software/powerlines/releases/tag/core%400.2.14) (03/10/2026)

### Bug Fixes

- **core:** Remove filter from `load` hook ([d02c2a541](https://github.com/storm-software/powerlines/commit/d02c2a541))

## [0.2.13](https://github.com/storm-software/powerlines/releases/tag/core%400.2.13) (03/09/2026)

### Bug Fixes

- **core:** Resolve issue replacing prefix in module resolution ([138e463be](https://github.com/storm-software/powerlines/commit/138e463be))

## [0.2.12](https://github.com/storm-software/powerlines/releases/tag/core%400.2.12) (03/09/2026)

### Bug Fixes

- **core:** Resolve issue prefixing resolved modules ([4cd8a42ee](https://github.com/storm-software/powerlines/commit/4cd8a42ee))

## [0.2.11](https://github.com/storm-software/powerlines/releases/tag/core%400.2.11) (03/09/2026)

### Bug Fixes

- **core:** Resolve issue wih invalid module prefix ([919a9ffdf](https://github.com/storm-software/powerlines/commit/919a9ffdf))

## [0.2.10](https://github.com/storm-software/powerlines/releases/tag/core%400.2.10) (03/09/2026)

### Miscellaneous

- **core:** Added logic to ensure prefix is applied in virtual module resolution ([2027d006e](https://github.com/storm-software/powerlines/commit/2027d006e))

## [0.2.8](https://github.com/storm-software/powerlines/releases/tag/core%400.2.8) (03/08/2026)

### Bug Fixes

- **powerlines:** Added extra logic to handle scenarios with duplicate file/folder names ([2e942e5cd](https://github.com/storm-software/powerlines/commit/2e942e5cd))

## [0.2.7](https://github.com/storm-software/powerlines/releases/tag/core%400.2.7) (03/08/2026)

### Bug Fixes

- **powerlines:** Fix resolution issue when folder and file have same name ([cb1ae9380](https://github.com/storm-software/powerlines/commit/cb1ae9380))

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
