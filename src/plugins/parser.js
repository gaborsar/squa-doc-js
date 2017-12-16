import findChildNode from "../dom/findChildNode";
import isImageNode from "../dom/isImageNode";
import isFigcaptionNode from "../dom/isFigcaptionNode";
import combineTokenizers from "../parser/combineTokenizers";

function tokenizeFigure(node, context) {
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
        attributes = { ...attributes, alt };
      }

      if (caption) {
        attributes = { ...attributes, caption };
      }

      return {
        insert: {
          [type]: value
        },
        attributes
      };
    }
  }
}

function tokenizeInlineImage(node, context) {
  if (node.nodeName === "IMG") {
    const value = node.getAttribute("src");
    const alt = node.getAttribute("alt");

    if (value) {
      let attributes = context.inline;

      if (alt) {
        attributes = { ...attributes, alt };
      }

      return {
        insert: {
          "inline-image": value
        },
        attributes
      };
    }
  }
}

function tokenizeWrapperNode(node) {
  const tokens = [];

  switch (node.nodeName) {
    case "UL":
      tokens.push({
        wrapper: {
          type: "unordered-list"
        }
      });
      break;

    case "OL":
      tokens.push({
        wrapper: {
          type: "ordered-list"
        }
      });
      break;

    case "PRE":
      tokens.push({
        wrapper: {
          type: "code"
        }
      });
      break;
  }

  return tokens;
}

function tokenizeWrappedBlockNode(node, context) {
  const tokens = [];

  switch (node.nodeName) {
    case "LI":
      if (context.wrapper.type === "unordered-list") {
        tokens.push({
          block: {
            type: "unordered-list-item"
          }
        });
      } else if (context.wrapper.type === "ordered-list") {
        tokens.push({
          block: {
            type: "ordered-list-item"
          }
        });
      }
      break;

    case "DIV":
    case "BR":
      if (context.wrapper.type === "code") {
        tokens.push({
          block: {
            type: "code"
          }
        });
      }
      break;
  }

  return tokens;
}

function tokenizeBlockNode(node) {
  const tokens = [];

  switch (node.nodeName) {
    case "H1":
      tokens.push({
        block: {
          type: "heading-one"
        }
      });
      break;

    case "H2":
      tokens.push({
        block: {
          type: "heading-two"
        }
      });
      break;

    case "H3":
      tokens.push({
        block: {
          type: "heading-three"
        }
      });
      break;

    case "H4":
      tokens.push({
        block: {
          type: "heading-four"
        }
      });
      break;

    case "H5":
      tokens.push({
        block: {
          type: "heading-five"
        }
      });
      break;

    case "H6":
      tokens.push({
        block: {
          type: "heading-six"
        }
      });
      break;

    case "P":
      tokens.push({
        block: {
          type: "paragraph"
        }
      });
      break;

    case "BLOCKQUOTE":
      tokens.push({
        block: {
          type: "blockquote"
        }
      });
      break;
  }

  return tokens;
}

function tokenzieInlineNode(node) {
  const tokens = [];

  switch (node.nodeName) {
    case "A":
      tokens.push({
        inline: {
          link: node.getAttribute("href")
        }
      });
      break;

    case "B":
    case "STRONG":
      tokens.push({
        inline: {
          bold: true
        }
      });
      break;

    case "I":
    case "EM":
      tokens.push({
        inline: {
          italic: true
        }
      });
      break;

    case "U":
      tokens.push({
        inline: {
          underline: true
        }
      });
      break;

    case "CODE":
      tokens.push({
        inline: {
          code: true
        }
      });
      break;
  }

  return tokens;
}

function tokenizeClassList(node) {
  const tokens = [];

  for (let i = 0; i < node.classList.length; i++) {
    const className = node.classList.item(i);

    if (className.startsWith("ed-align-")) {
      tokens.push({
        block: {
          align: className.replace("ed-align-", "")
        }
      });
    } else if (className.startsWith("ed-indent-")) {
      tokens.push({
        block: {
          indent: parseInt(className.replace("ed-indent-", ""), 10)
        }
      });
    } else if (className.startsWith("ed-anchor-")) {
      tokens.push({
        inline: {
          anchor: className.replace("ed-anchor-", "")
        }
      });
    }
  }

  return tokens;
}

export const tokenizeNode = combineTokenizers(
  tokenizeFigure,
  tokenizeInlineImage,
  tokenizeWrapperNode,
  tokenizeWrappedBlockNode,
  tokenizeBlockNode,
  tokenzieInlineNode,
  tokenizeClassList
);
