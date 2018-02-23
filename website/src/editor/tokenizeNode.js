export default function tokenizeNode(node) {
  const tokens = [];

  if (node.classList) {
    for (let i = 0; i < node.classList.length; i++) {
      const className = node.classList.item(i);

      if (className === "checkable") {
        tokens.push({
          type: "block-node",
          payload: {
            type: "checkable"
          }
        });
      }

      if (className === "checked") {
        tokens.push({
          type: "block-style",
          payload: {
            checked: true
          }
        });
      }
    }
  }

  return tokens;
}
