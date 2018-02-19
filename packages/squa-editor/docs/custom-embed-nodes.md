## Custom Embed Nodes

To define custom embed nodes, you have to define your own `schema`, your own `renderEmbed` function, and your own `tokenizeNode` function.

## Defining your own `schema`

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

## Example

```jsx
import React, { PureComponent } from "react";
import Delta from "quill-delta";
import { Value, Editor } from "squa-editor";

const schema = {
  isInlineEmbed(embedType) {
    if (embedType === "inline-image") {
      return true;
    }
  }
};

function renderEmbed(node) {
  if (node.type === "inline-image") {
    return {
      component: "img",
      props: {
        src: node.value["inline-image"]
      }
    };
  }
}

function tokenizeNode(node) {
  const tokens = [];
  if (node.nodeName === "IMG") {
    tokens.push({
      insert: {
        "inline-image": node.getAttribute("src")
      }
    });
  }
  return tokens;
}

const contents = new Delta()
  .insert({
    "inline-image": "foo.png"
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
        renderEmbed={renderEmbed}
        tokenizeNode={tokenizeNode}
      />
    );
  }
}
```
