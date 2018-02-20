# Custom Block Styles

To define custom block styles, you have to define your own `schema`, and your own `blockStyleFn` and `tokenizeNode` functions.

If you would like to define a block style for block nodes you need a `schema` similar to this:

```jsx
const schema = {
  isBlockMark(markType) {
    if (markType === "align") {
      return true;
    }
  }
};
```

If you would like to define a block style for embed nodes you need a `schema` similar to this:

```jsx
const schema = {
  isEmbedMark(embedType, markType) {
    if (embedType === "image" && markType === "align") {
      return true;
    }
  }
};
```

Defining your own `blockStyleFn` function:

```jsx
function blockStyleFn(mark) {
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
  for (const className of node.classList) {
    if (className.startsWith("align-")) {
      tokens.push({
        type: "block-style",
        payload: {
          align: className.replace("align-", "")
        }
      });
    }
  }
  return tokens;
}
```
