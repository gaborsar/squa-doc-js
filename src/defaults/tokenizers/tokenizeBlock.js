export default function tokenizeBlock(node, context) {
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
