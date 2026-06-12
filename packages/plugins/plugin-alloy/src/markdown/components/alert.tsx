/* -------------------------------------------------------------------

                   🗲 Storm Software - Powerlines

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

import { Children, code } from "@alloy-js/core";
import { Spacing } from "../../core/components/spacing";

export interface AlertProps {
  variant: "note" | "tip" | "important" | "warning" | "caution";
  children: Children;
}

/**
 * Renders an alert component for a markdown file.
 *
 * @see https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/
 * @see https://github.com/KeJunMao/vscode-markdown-alert
 */
export function Alert(props: AlertProps) {
  return (
    <>
      {code`> [!${props.variant.toUpperCase()}]`}
      <hbr />
      {code`> `}
      {props.children}
      <Spacing />
    </>
  );
}

export type AlertVariantProps = Omit<AlertProps, "variant">;

/**
 * Renders a Note alert component for a markdown file.
 *
 * @see https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/
 * @see https://github.com/KeJunMao/vscode-markdown-alert
 */
export function NoteAlert(props: AlertVariantProps) {
  return <Alert variant="note" {...props} />;
}

/**
 * Renders a Tip alert component for a markdown file.
 *
 * @see https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/
 * @see https://github.com/KeJunMao/vscode-markdown-alert
 */
export function TipAlert(props: AlertVariantProps) {
  return <Alert variant="tip" {...props} />;
}

/**
 * Renders an Important alert component for a markdown file.
 *
 * @see https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/
 * @see https://github.com/KeJunMao/vscode-markdown-alert
 */
export function ImportantAlert(props: AlertVariantProps) {
  return <Alert variant="important" {...props} />;
}

/**
 * Renders a Warning alert component for a markdown file.
 *
 * @see https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/
 * @see https://github.com/KeJunMao/vscode-markdown-alert
 */
export function WarningAlert(props: AlertVariantProps) {
  return <Alert variant="warning" {...props} />;
}

/**
 * Renders a Caution alert component for a markdown file.
 *
 * @see https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/
 * @see https://github.com/KeJunMao/vscode-markdown-alert
 */
export function CautionAlert(props: AlertVariantProps) {
  return <Alert variant="caution" {...props} />;
}
