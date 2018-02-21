# Custom Wrapper Nodes

To define custom wrapper nodes, you have to define your own `blockRenderFn` and `tokenizeNode` functions.

Defining your own `blockRenderFn` function:

```jsx
function blockRenderFn(node) {
  switch (node.type) {
    case "unordered-list-item":
      return {
        wrapper: "ul",
        component: "li"
      };
    case "ordered-list-item":
      return {
        wrapper: "ol",
        component: "li"
      };
  }
}
```

Defining your own `tokenizeNode` function:

```jsx
function tokenizeNode(node, context) {
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
    case "LI":
      if (context.wrapper.type === "unordered-list") {
        tokens.push({
          type: "block-node",
          payload: {
            type: "unordered-list-item"
          }
        });
      } else {
        tokens.push({
          type: "block-node",
          payload: {
            type: "ordered-list-item"
          }
        });
      }
      break;
  }
  return tokens;
}
```
