import getNodeLength from "./getNodeLength";

export default function getNativePosition(node, offset) {
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    const childLength = getNodeLength(child);

    if (child.nodeType === Node.TEXT_NODE) {
      if (offset <= childLength) {
        return { node: child, offset };
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.hasAttribute("data-ignore")) {
        if (offset === 0) {
          return { node, offset: i };
        }
      } else if (
        child.hasAttribute("data-embed") ||
        child.nodeName === "BR" ||
        child.nodeName === "IMG"
      ) {
        if (offset === 0) {
          return { node, offset: i };
        }
      } else if (
        child.hasAttribute("data-wrapper") ||
        child.hasAttribute("data-block")
      ) {
        if (offset < childLength) {
          return getNativePosition(child, offset);
        }
      } else {
        if (offset <= childLength) {
          return getNativePosition(child, offset);
        }
      }
    }

    offset -= childLength;
  }

  return { node, offset: node.childNodes.length };
}
