# Custom Block Nodes

To define custom block nodes, you have to define your own `blockRenderFn` and `tokenizeNode` functions.

Defining your own `blockRenderFn` function:

```jsx
function blockRenderFn(node) {
  switch (node.type) {
    case "heading-one":
      return {
        component: "h1"
      };
    case "paragraph":
      return {
        component: "p"
      };
  }
}
```

Defining your own `tokenizeNode` function:

```jsx
function tokenizeNode(node) {
  const tokens = [];
  switch (node.nodeName) {
    case "H1":
      tokens.push({
        type: "block-node",
        payload: {
          type: "heading-one"
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
  }
  return tokens;
}
```
