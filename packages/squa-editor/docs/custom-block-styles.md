# Custom Block Styles

To define custom block styles, you have to define your own `schema`, and your own `renderMark` and `tokenizeNode` functions.

If you would like to define a block style for block nodes you need a `schema` similar to this:

```jsx
const schema = {
  isBlockMark(markType) {
    return markType === "align";
  }
};
```

If you would like to define a block style for embed nodes you need a `schema` similar to this:

```jsx
const schema = {
  isEmbedMark(embedType, markType) {
    return embedType === "image" && markType === "align";
  }
};
```

Defining your own `renderMark` function:

```jsx
function renderMark(mark) {
  if (mark.type === "align") {
    return {
      className: `align-${mark.value}`
    };
  }
}
```

Defining your own `tokenizeNode` function:

```jsx
function tokenizeNode(node) {
  const tokens = [];
  if (node.classList) {
    for (let i = 0; i < node.classList.length; i++) {
      const className = node.classList.item(i);
      if (className.startsWith("align-")) {
        tokens.push({
          type: "block-style",
          payload: {
            align: className.replace("align-", "")
          }
        });
      }
    }
  }
  return tokens;
}
```
