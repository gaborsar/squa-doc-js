import getNodeLength from "./getNodeLength";

export default function normalizeNativePosition(node, offset) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    if (
      node.hasAttribute("data-ignore") ||
      node.hasAttribute("data-embed") ||
      node.nodeName === "BR" ||
      node.nodeName === "IMG"
    ) {
      return { node, offset: 0 };
    }

    let length = 0;

    for (let i = 0; i < offset; i++) {
      length += getNodeLength(node.childNodes[i]);
    }

    return { node, offset: length };
  }

  return { node, offset };
}
