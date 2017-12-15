import combineTokenizers from "../parser/combineTokenizers";

export function tokenizeWrapperNode(node) {
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

export function tokenizeWrappedBlockNode(node, context) {
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

export function tokenizeBlockNode(node) {
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

export function tokenzieInlineNode(node) {
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

export function tokenizeClassList(node) {
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

export function tokenizeFigure(node, context) {
  const tokens = [];

  if (node.nodeName === "FIGURE") {
    let type;
    let value;
    let alt;
    let caption;

    for (const child of node.childNodes) {
      switch (child.nodeName) {
        case "IMG":
          type = "block-image";
          value = child.getAttribute("src");
          alt = child.getAttribute("alt");
          break;

        case "FIGCAPTION":
          caption = child.textContent;
          break;
      }
    }

    if (type && value) {
      let attributes = context.block;

      if (alt) {
        attributes = { ...attributes, alt };
      }

      if (caption) {
        attributes = { ...attributes, caption };
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

export function tokenizeInlineImage(node, context) {
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

export const tokenizeNode = combineTokenizers(
  tokenizeWrapperNode,
  tokenizeWrappedBlockNode,
  tokenizeBlockNode,
  tokenzieInlineNode,
  tokenizeClassList,
  tokenizeFigure,
  tokenizeInlineImage
);
