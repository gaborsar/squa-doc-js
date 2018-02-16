import isTextNode from "./isTextNode";
import isElementNode from "./isElementNode";
import isIgnoredNode from "./isIgnoredNode";
import isBlockNode from "./isBlockNode";
import isEmbedNode from "./isEmbedNode";
import isLineBreakNode from "./isLineBreakNode";
import isImageNode from "./isImageNode";

export default function getNodeLength(node) {
  if (isTextNode(node)) {
    return node.nodeValue.length;
  }

  if (isElementNode(node) && !isIgnoredNode(node)) {
    if (isEmbedNode(node) || isLineBreakNode(node) || isImageNode(node)) {
      return 1;
    }

    let length = 0;

    if (isBlockNode(node)) {
      length += 1;
    }

    for (const child of node.childNodes) {
      length += getNodeLength(child);
    }

    return length;
  }

  return 0;
}
