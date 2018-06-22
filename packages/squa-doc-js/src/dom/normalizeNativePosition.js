import isElementNode from "./isElementNode";
import isEmbedNode from "./isEmbedNode";
import isLineBreakNode from "./isLineBreakNode";
import isIgnoredNode from "./isIgnoredNode";
import isTableNode from "./isTableNode";
import isTableRowNode from "./isTableRowNode";
import isTableCellNode from "./isTableCellNode";
import getNodeLength from "./getNodeLength";

export default function normalizeNativePosition(node, offset) {
  if (isElementNode(node)) {
    if (isEmbedNode(node) || isLineBreakNode(node) || isIgnoredNode(node)) {
      return {
        node,
        offset: 0
      };
    }

    let length = 0;

    if (isTableNode(node) || isTableCellNode(node) || isTableRowNode(node)) {
      // Compensate for the start character of table, table row,
      // and table cell nodes
      length += 1;
    }

    for (let i = 0; i < offset; i++) {
      length += getNodeLength(node.childNodes[i]);
    }

    return {
      node,
      offset: length
    };
  }

  return { node, offset };
}
