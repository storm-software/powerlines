/* -------------------------------------------------------------------

                   ⚡ Storm Software - Powerlines

 This code was released as part of the Powerlines project. Powerlines
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/powerlines.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/powerlines
 Documentation:            https://docs.stormsoftware.com/projects/powerlines
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/* eslint-disable @nx/enforce-module-boundaries */

import { DeepPartial } from "@stryke/types/base";
import { I18nextToolkitConfig } from "i18next-cli";
import { UserConfig } from "powerlines/types/config";
import { PluginContext } from "powerlines/types/context";
import { ResolvedConfig } from "powerlines/types/resolved";

export type I18NextPluginOptions = DeepPartial<I18nextToolkitConfig>;

export type I18NextPluginUserConfig = UserConfig & {
  i18next?: I18NextPluginOptions;
};

export type I18NextPluginResolvedConfig = ResolvedConfig & {
  i18next: Omit<I18nextToolkitConfig, "extract" | "types"> & {
    extract: Omit<
      I18nextToolkitConfig["extract"],
      "output" | "primaryLanguage" | "indentation"
    > &
      Required<
        Pick<
          I18nextToolkitConfig["extract"],
          "output" | "primaryLanguage" | "indentation"
        >
      >;
    types: Omit<
      NonNullable<I18nextToolkitConfig["types"]>,
      "input" | "output" | "enableSelector" | "indentation"
    > & {
      input?: string;
      output?: string;
      enableSelector: boolean | "optimize";
      indentation: number | string;
    };
  };
};

export type I18NextPluginContext<
  TResolvedConfig extends I18NextPluginResolvedConfig =
    I18NextPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
