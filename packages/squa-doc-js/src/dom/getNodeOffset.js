import isTableNode from "./isTableNode";
import isTableRowNode from "./isTableRowNode";
import isTableCellNode from "./isTableCellNode";
import isEmbedNode from "./isEmbedNode";
import isIgnoredNode from "./isIgnoredNode";
import getNodeLength from "./getNodeLength";

export default function getNodeOffset(parentNode, node) {
  let currentNode = node;
  let offset = 0;
  while (currentNode !== parentNode) {
    if (currentNode.previousSibling) {
      currentNode = currentNode.previousSibling;
      offset += getNodeLength(currentNode);
    } else {
      currentNode = currentNode.parentNode;
      if (
        isTableNode(currentNode) ||
        isTableRowNode(currentNode) ||
        isTableCellNode(currentNode)
      ) {
        // compensate for the start character of table, table row,
        // and table cell nodes
        offset += 1;
      } else if (isEmbedNode(currentNode) || isIgnoredNode(currentNode)) {
        offset = 0;
      }
    }
  }
  return offset;
}
