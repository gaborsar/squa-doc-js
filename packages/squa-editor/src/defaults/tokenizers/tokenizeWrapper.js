export default function tokenizeWrapper(node) {
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
  }

  return tokens;
}
