export default function tokenizeInlineImage(node, context) {
  const tokens = [];

  if (node.nodeName === "IMG") {
    const value = node.getAttribute("src");
    const alt = node.getAttribute("alt");

    if (value) {
      let attributes = context.inline;

      if (alt) {
        attributes = { ...attributes, alt };
      }

      tokens.push({
        insert: {
          "inline-image": value
        },
        attributes
      });
    }
  }

  return tokens;
}
