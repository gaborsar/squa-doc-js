export default function getNodeLength(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue.length;
  }

  if (
    node.nodeType === Node.ELEMENT_NODE &&
    !node.hasAttribute("data-ignore")
  ) {
    if (
      node.hasAttribute("data-embed") ||
      node.nodeName === "BR" ||
      node.nodeName === "IMG"
    ) {
      return 1;
    }

    let length = 0;

    if (node.hasAttribute("data-block")) {
      length += 1;
    }

    for (const child of node.childNodes) {
      length += getNodeLength(child);
    }

    return length;
  }

  return 0;
}
