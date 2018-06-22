import isTextNode from "./isTextNode";
import isElementNode from "./isElementNode";
import isIgnoredNode from "./isIgnoredNode";
import isTableNode from "./isTableNode";
import isTableRowNode from "./isTableRowNode";
import isTableCellNode from "./isTableCellNode";
import isBlockNode from "./isBlockNode";
import isEmbedNode from "./isEmbedNode";
import isLineBreakNode from "./isLineBreakNode";

export default function getNodeLength(node) {
  if (isTextNode(node)) {
    return node.nodeValue.length;
  }

  if (isElementNode(node)) {
    if (isEmbedNode(node)) {
      return 1;
    }

    if (isIgnoredNode(node)) {
      return 0;
    }

    if (isLineBreakNode(node)) {
      return 1;
    }

    let length = 0;

    if (isTableNode(node)) {
      // compensate for the start and end characters of table nodes
      length += 2;
    } else if (
      isTableRowNode(node) ||
      isTableCellNode(node) ||
      isBlockNode(node)
    ) {
      // compensate for the start character of tabel row and table cell,
      // or the end character of block nodes
      length += 1;
    }

    for (const child of node.childNodes) {
      length += getNodeLength(child);
    }

    return length;
  }

  return 0;
}
