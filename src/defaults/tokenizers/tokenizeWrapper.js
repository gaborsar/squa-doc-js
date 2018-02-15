export default function tokenizeWrapper(node) {
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
