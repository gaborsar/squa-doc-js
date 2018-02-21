# Custom Embed Nodes

To define custom embed nodes, you have to define your own `schema`, and your own `embedRenderFn` and `tokenizeNode` functions.

If you would like to define a block level embed node you need a `schema` similar to this:

```jsx
const schema = {
  isBlockEmbed(embedType) {
    if (embedType === "block-image") {
      return true;
    }
  }
};
```

If you would like to define an inline level embed node you need a `schema` similar to this:

```jsx
const schema = {
  isInlineEmbed(embedType) {
    if (embedType === "inline-image") {
      return true;
    }
  }
};
```

Defining your own `embedRenderFn` function:

```jsx
function embedRenderFn(node) {
  if (node.type === "inline-image") {
    return {
      component: "img",
      props: {
        src: node.value["inline-image"]
      }
    };
  }
}
```

Defining you own `tokenizeNode` function:

```jsx
function tokenizeNode(node) {
  const tokens = [];
  if (node.nodeName === "IMG") {
    tokens.push({
      type: "inline-embed",
      payload: {
        "inline-image": node.getAttribute("src")
      }
    });
  }
  return tokens;
}
```
