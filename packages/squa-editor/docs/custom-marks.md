# Custom Marks

To define custom marks, you have to define your own `schema`, your own `renderMark` function, and your own `tokenizeNode` function.

## Defining your own `schema`

If you would like to define a mark for block nodes you need a `schema` similar to this:

```jsx
const schema = {
  isBlockMark(markType) {
    if (markType === "align") {
      return true;
    }
  }
};
```

If you would like to define a mark for inline nodes you need a `schema` similar to this:

```jsx
const schema = {
  isInlineMark(markType) {
    if (markType === "bold") {
      return true;
    }
  }
};
```

If you would like to define a mark for embed nodes you need a `schema` similar to this:

```jsx
const schema = {
  isEmbedMark(embedType, markType) {
    if (embedType === "image" && markType === "alt") {
      return true;
    }
  }
};
```

## Defining your own `renderMark` function

If you would like your mark to be rendered as an element you need a `renderMark` function similar to this:

**Note:** Element based marks cannot be used with block nodes.

```jsx
function renderMark(mark) {
  if (mark.type === "bold") {
    return {
      component: "b"
    };
  }
}
```

If you would like your mark to be rendered as a CSS class you need a `renderMark` function similar to this:

```jsx
function renderMark(mark) {
  if (mark.type === "align") {
    return {
      className: `align-${mark.value}`
    };
  }
}
```

If you would like your mark to be rendered as an inline style you need a `renderMark` function similar to this:

```jsx
function renderMark(mark) {
  if (mark.type === "color") {
    return {
      style: {
        color: mark.value
      }
    };
  }
}
```

## Defining your own `tokenizeNode` function

If your mark rendered as an element you need a `tokenizeNode` function similar to this:

```jsx
function tokenizeNode(node) {
  const tokens = [];
  if (node.nodeName === "B") {
    tokens.push({
      inline: {
        bold: true
      }
    });
  }
  return tokens;
}
```

If your mark rendered as a CSS class you need a `tokenizeNode` function similar to this:

```jsx
function tokenizeNode(node) {
  const tokens = [];
  for (const className of node.classList) {
    if (className.startsWith("align-")) {
      tokens.push({
        block: {
          align: className.replace("align-", "")
        }
      });
    }
  }
  return tokens;
}
```

If your mark rendered as an inline style you need a `tokenizeNode` function similar to this:

```jsx
function tokenizeNode(node) {
  const tokens = [];
  if (node.style.color) {
    tokens.push({
      inline: {
        color: node.style.color
      }
    });
  }
  return tokens;
}
```

## Example

```jsx
import React, { PureComponent } from "react";
import Delta from "quill-delta";
import { Value, Editor } from "squa-editor";

const schema = {
  isInlineMark(markType) {
    if (markType === "bold") {
      return true;
    }
  }
};

function renderMark(mark) {
  if (mark.type === "bold") {
    return {
      component: "b"
    };
  }
}

function tokenizeNode(node) {
  const tokens = [];
  if (node.nodeName === "B") {
    tokens.push({
      inline: {
        bold: true
      }
    });
  }
  return tokens;
}

const contents = new Delta()
  .insert("foo", {
    bold: true
  })
  .insert("\n");

const value = Value.fromJSON({ schema, contents });

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { value };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Editor
        value={value}
        onChange={this.onChange}
        renderMark={renderMark}
        tokenizeNode={tokenizeNode}
      />
    );
  }
}
```
