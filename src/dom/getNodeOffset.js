import getNodeLength from "./getNodeLength";

export default function getNodeOffset(parentNode, node) {
  let offset = 0;
  while (node !== parentNode) {
    if (node.previousSibling) {
      node = node.previousSibling;
      offset += getNodeLength(node);
    } else {
      node = node.parentNode;
      if (node.hasAttribute("data-ignore") || node.hasAttribute("data-embed")) {
        offset = 0;
      }
    }
  }
  return offset;
}
