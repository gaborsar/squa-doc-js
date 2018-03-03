export default function tokenizeNode(node) {
  const tokens = [];

  if (node.nodeName === "FIGURE") {
    const img = node.childNodes[0];
    const figcaption = node.childNodes[1];

    if (img && img.nodeName === "IMG" && img.hasAttribute("src")) {
      tokens.push({
        type: "block-embed",
        payload: {
          "block-image": img.getAttribute("src")
        }
      });

      if (img.hasAttribute("alt")) {
        tokens.push({
          type: "block-style",
          payload: {
            alt: img.getAttribute("alt")
          }
        });
      }

      if (figcaption) {
        tokens.push({
          type: "block-style",
          payload: {
            caption: figcaption.textContent
          }
        });
      }
    }
  }

  return tokens;
}
