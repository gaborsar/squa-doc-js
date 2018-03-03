export default function tokenizeNode(node, context) {
  const tokens = [];

  switch (node.nodeName) {
    case "UL":
      tokens.push({
        type: "wrapper-node",
        payload: {
          type: "unordered-list"
        }
      });
      break;

    case "OL":
      tokens.push({
        type: "wrapper-node",
        payload: {
          type: "ordered-list"
        }
      });
      break;

    case "PRE":
      tokens.push({
        type: "wrapper-node",
        payload: {
          type: "code"
        }
      });
      break;

    case "H1":
      tokens.push({
        type: "block-node",
        payload: {
          type: "heading-one"
        }
      });
      break;

    case "H2":
      tokens.push({
        type: "block-node",
        payload: {
          type: "heading-two"
        }
      });
      break;

    case "H3":
      tokens.push({
        type: "block-node",
        payload: {
          type: "heading-three"
        }
      });
      break;

    case "H4":
      tokens.push({
        type: "block-node",
        payload: {
          type: "heading-four"
        }
      });
      break;

    case "H5":
      tokens.push({
        type: "block-node",
        payload: {
          type: "heading-five"
        }
      });
      break;

    case "H6":
      tokens.push({
        type: "block-node",
        payload: {
          type: "heading-six"
        }
      });
      break;

    case "BLOCKQUOTE":
      tokens.push({
        type: "block-node",
        payload: {
          type: "blockquote"
        }
      });
      break;

    case "P":
      tokens.push({
        type: "block-node",
        payload: {
          type: "paragraph"
        }
      });
      break;

    case "LI":
      if (
        context.wrapper.type === "unordered-list" ||
        context.wrapper.type === "ordered-list"
      ) {
        tokens.push({
          type: "block-node",
          payload: {
            type: `${context.wrapper.type}-item`
          }
        });
      }
      break;

    case "DIV":
    case "BR":
      if (context.wrapper.type === "code") {
        tokens.push({
          type: "block-node",
          payload: {
            type: "code"
          }
        });
      }
      break;

    case "A":
      tokens.push({
        type: "inline-style",
        payload: {
          link: node.getAttribute("href")
        }
      });
      break;

    case "B":
    case "STRONG":
      tokens.push({
        type: "inline-style",
        payload: {
          bold: true
        }
      });
      break;

    case "I":
    case "EM":
      tokens.push({
        type: "inline-style",
        payload: {
          italic: true
        }
      });
      break;

    case "U":
      tokens.push({
        type: "inline-style",
        payload: {
          underline: true
        }
      });
      break;

    case "S":
    case "DEL":
      tokens.push({
        type: "inline-style",
        payload: {
          strikethrough: true
        }
      });
      break;

    case "CODE":
      tokens.push({
        type: "inline-style",
        payload: {
          code: true
        }
      });
      break;
  }

  if (node.classList) {
    for (let i = 0; i < node.classList.length; i++) {
      const className = node.classList.item(i);

      if (className.startsWith("ed-align-")) {
        tokens.push({
          type: "block-style",
          payload: {
            align: className.replace("ed-align-", "")
          }
        });
      } else if (className.startsWith("ed-indent-")) {
        tokens.push({
          type: "block-style",
          payload: {
            indent: parseInt(className.replace("ed-indent-", ""), 10)
          }
        });
      } else if (className.startsWith("ed-anchor-")) {
        tokens.push({
          type: "inline-style",
          payload: {
            anchor: className.replace("ed-anchor-", "")
          }
        });
      } else if (className.startsWith("ed-color-")) {
        tokens.push({
          type: "inline-style",
          payload: {
            color: className.replace("ed-color-", "")
          }
        });
      }
    }
  }

  return tokens;
}
