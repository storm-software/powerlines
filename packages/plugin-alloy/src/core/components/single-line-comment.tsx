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

import { ComponentProps } from "../../types/components";
import { Prose } from "@powerlines/plugin-alloy/vendor";

export type SingleLineCommentVariant =
  | "double-slash"
  | "triple-slash"
  | "slash-star"
  | "slash-star-star"
  | "markdown";

export interface SingleLineCommentProps extends ComponentProps {
  /**
   * The variant of the single line comment.
   *
   * @defaultValue "double-slash"
   */
  variant?: SingleLineCommentVariant;
}

/**
 * A single line comment block. The children are rendered as a prose element, which means that they
 * are broken into multiple lines
 */
export function SingleLineComment(props: SingleLineCommentProps) {
  const { variant = "double-slash", children } = props;

  const commentStart =
    variant === "slash-star"
      ? "/* "
      : variant === "slash-star-star"
        ? "/** "
        : variant === "triple-slash"
          ? "/// "
          : variant === "markdown"
            ? "<!-- "
            : "// ";

  return (
    <>
      {commentStart}
      <align string={commentStart}>
        <Prose>{children}</Prose>

        {variant === "slash-star" || variant === "slash-star-star"
          ? " */ "
          : variant === "markdown"
            ? " -->"
            : ""}
      </align>
    </>
  );
}
