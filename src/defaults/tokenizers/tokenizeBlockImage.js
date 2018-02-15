import findChildNode from "../../dom/findChildNode";
import isImageNode from "../../dom/isImageNode";
import isFigcaptionNode from "../../dom/isFigcaptionNode";

export default function tokenizeBlockImage(node, context) {
  const tokens = [];

  if (node.nodeName === "FIGURE") {
    let type;
    let value;
    let alt;
    let caption;

    const img = findChildNode(node, isImageNode);

    if (img) {
      type = "block-image";
      value = img.getAttribute("src");
      alt = img.getAttribute("alt");
    }

    const figcaption = findChildNode(node, isFigcaptionNode);

    if (figcaption) {
      caption = figcaption.textContent;
    }

    if (type && value) {
      let attributes = context.block;

      if (alt) {
        attributes = {
          ...attributes,
          alt
        };
      }

      if (caption) {
        attributes = {
          ...attributes,
          caption
        };
      }

      tokens.push({
        insert: {
          [type]: value
        },
        attributes
      });
    }
  }

  return tokens;
}
