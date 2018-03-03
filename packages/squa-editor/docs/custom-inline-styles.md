# Custom Inline Styles

To define custom inline styles, you have to define your own `schema`, and your own `renderMark` and `tokenizeNode` functions.

If you would like to define an inline style for inline nodes you need a `schema` similar to this:

```jsx
const schema = {
  isInlineMark(markType) {
    return markType === "bold";
  }
};
```

If you would like to define an inline style for embed nodes you need a `schema` similar to this:

```jsx
const schema = {
  isEmbedMark(embedType, markType) {
    return embedType === "image" && markType === "alt";
  }
};
```

If you would like a mark to be rendered as an element you need a `renderMark` function similar to this:

```jsx
function renderMark(mark) {
  if (mark.type === "bold") {
    return {
      component: "b"
    };
  }
}
```

If you would like a mark to be rendered as a CSS class you need a `renderMark` function similar to this:

```jsx
function renderMark(mark) {
  if (mark.type === "bold") {
    return {
      className: "bold"
    };
  }
}
```

If you render a mark as an element you need a `tokenizeNode` function similar to this:

```jsx
function tokenizeNode(node) {
  const tokens = [];
  if (node.nodeName === "B") {
    tokens.push({
      type: "inline-style",
      payload: {
        bold: true
      }
    });
  }
  return tokens;
}
```

If you render a mark as a CSS class you need a `tokenizeNode` function similar to this:

```jsx
function tokenizeNode(node) {
  const tokens = [];
  if (node.classList && node.classList.contains("bold")) {
    tokens.push({
      type: "inline-style",
      payload: {
        bold: true
      }
    });
  }
  return tokens;
}
```
