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

import { code, computed, Prose, Show, splitProps } from "@alloy-js/core";
import { titleCase } from "@stryke/string-format/title-case";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import { ComponentProps } from "../../types/components";
import {
  MarkdownTableColumnContextInterface,
  MarkdownTableContext,
  MarkdownTableContextInterface,
  useMarkdownTable
} from "../contexts/markdown-table";

export interface MarkdownTableProps<
  T extends Record<string, any> = Record<string, any>
> extends ComponentProps {
  /**
   * An optional array of column definitions. If not provided, columns will be inferred from the keys of the first data object.
   *
   * @remarks
   * This prop allows you to explicitly define the columns of the markdown table, including their order, alignment, and width. If this prop is not provided, the component will attempt to infer the columns from the keys of the first object in the `data` array. Each column definition should include the `name` of the column (which corresponds to a key in the data objects), an optional `align` property to specify text alignment (left, right, or center), and an optional `width` property to specify the width of the column in characters.
   */
  columns?: MarkdownTableColumnContextInterface<T>[];

  /**
   * An array of data objects to be rendered in the markdown table. Each object should have keys corresponding to the column names.
   *
   * @remarks
   * This prop is required and should contain an array of objects representing the rows of the markdown table. Each object should have keys that correspond to the `name` properties defined in the `columns` prop (or inferred from the first object if `columns` is not provided). The values of these keys will be rendered in the respective columns of the table. If the `data` array is empty, the component will render nothing.
   */
  data: T[];
}

/**
 * Component that provides a context for rendering markdown tables.
 */
export function MarkdownTable<
  T extends Record<string, any> = Record<string, any>
>(props: MarkdownTableProps<T>) {
  const [{ children, columns, data }] = splitProps(props, [
    "children",
    "columns",
    "data"
  ]);

  if (data.length === 0) {
    return null;
  }

  const cols = computed(() =>
    columns && columns.length > 0
      ? columns
      : Object.keys(data[0] ?? {}).map((name: string, index: number) => ({
          index,
          name,
          align: "left" as const,
          width: 20
        }))
  );

  return (
    <MarkdownTableContext.Provider
      value={
        { columns: cols.value, data } as MarkdownTableContextInterface<
          Record<string, any>
        >
      }>
      <Show when={Boolean(children)}>{children}</Show>
    </MarkdownTableContext.Provider>
  );
}

export type MarkdownTableColumnProps = ComponentProps &
  Partial<Pick<MarkdownTableColumnContextInterface, "align">> &
  Required<Pick<MarkdownTableColumnContextInterface, "name">> & {
    width?: number;
  };

/**
 * Component that provides a context for rendering markdown tables.
 */
export function MarkdownTableColumn(props: MarkdownTableColumnProps) {
  const [{ children, width, align, name }] = splitProps(props, [
    "children",
    "width",
    "align",
    "name"
  ]);

  const tableContext = useMarkdownTable();
  const columnRef = computed(() =>
    tableContext?.columns.find(c => c.name === name)
  );

  const indexRef = computed(() => columnRef.value?.index ?? 0);
  const alignRef = computed(() => columnRef.value?.align ?? align ?? "left");
  const widthRef = computed(() => columnRef.value?.width ?? width ?? 20);

  const textLength = computed(() => {
    const content = children ? children.toString() : "";

    return content.length;
  });

  return (
    <Prose>
      <Show when={indexRef.value === 0}>{"|"}</Show>
      <Show when={Boolean(children)}>
        <Prose>{code`${
          alignRef.value === "left"
            ? " ".repeat(widthRef.value - textLength.value - 1)
            : " "
        }${children}${
          alignRef.value === "right"
            ? " ".repeat(widthRef.value - textLength.value - 1)
            : " "
        }`}</Prose>
      </Show>
      {"|"}
    </Prose>
  );
}

/**
 * Component that provides a context for rendering markdown tables.
 */
export function MarkdownTableColumnHeader(props: MarkdownTableColumnProps) {
  const [{ children, name }, rest] = splitProps(props, ["children", "name"]);

  return (
    <>
      <MarkdownTableColumn {...rest} name={name}>
        <Show
          fallback={titleCase(name, {
            useDescriptions: false
          })}
          when={!isUndefined(children)}>
          {children}
        </Show>
      </MarkdownTableColumn>
    </>
  );
}
