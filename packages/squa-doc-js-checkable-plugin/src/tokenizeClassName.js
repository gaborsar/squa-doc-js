export default function tokenizeNode(className) {
  const tokens = [];

  switch (className) {
    case "checkable":
      tokens.push({
        type: "block-node",
        payload: {
          type: "checkable"
        }
      });
      break;

    case "checked":
      tokens.push({
        type: "block-style",
        payload: {
          checked: true
        }
      });
      break;
  }

  return tokens;
}
