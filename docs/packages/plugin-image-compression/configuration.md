---
title: Configure @powerlines/plugin-image-compression
description: Options for the imageCompression config block.
documentType: concept
---

# Configure @powerlines/plugin-image-compression

Set options on the `imageCompression` block of your Powerlines config. All options are optional unless stated.

```ts
import { defineConfig } from "powerlines/config";

export default defineConfig({
  imageCompression: {
    // see table below
  }
});
```

## Options

| Option | Type | Default |
| --- | --- | --- |
| `filter` | `string \| string[]` | — |
| `outputPath` | `string` | — |
| `svg` | `SvgOptions (svgo)` | — |
| `jpeg` | `JpegOptions (sharp)` | — |
| `jp2` | `Jp2Options (sharp)` | — |
| `jxl` | `JxlOptions (sharp)` | — |
| `png` | `PngOptions (sharp)` | — |
| `webp` | `WebpOptions (sharp)` | — |
| `gif` | `GifOptions (sharp)` | — |
| `avif` | `AvifOptions (sharp)` | — |
| `heif` | `HeifOptions (sharp)` | — |
| `tiff` | `TiffOptions (sharp)` | — |

Per-format option shapes come from `sharp` and `svgo`. See those libraries for valid fields. No defaults are stated in the plugin source.
