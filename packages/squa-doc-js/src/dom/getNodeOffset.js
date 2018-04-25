import isIgnoredNode from "./isIgnoredNode";
import isEmbedNode from "./isEmbedNode";
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
      if (isIgnoredNode(currentNode) || isEmbedNode(currentNode)) {
        offset = 0;
      }
    }
  }
  return offset;
}
