export default function tokenizeBlock(node, context) {
  const tokens = [];

  switch (node.nodeName) {
    case "LI":
      if (context.wrapper.type === "unordered-list") {
        tokens.push({
          type: "block-node",
          payload: {
            type: "unordered-list-item"
          }
        });
      } else if (context.wrapper.type === "ordered-list") {
        tokens.push({
          type: "block-node",
          payload: {
            type: "ordered-list-item"
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

    case "P":
      tokens.push({
        type: "block-node",
        payload: {
          type: "paragraph"
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
  }

  return tokens;
}
