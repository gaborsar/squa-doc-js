## Custom Wrapper Nodes

To define custom wrapper nodes, you have to define your own `renderWrapper` function, potentially your own `renderBlock` function, and your own `tokenizeNode` function.

## Example

```jsx
import React, { PureComponent } from "react";
import Delta from "quill-delta";
import { Value, Editor } from "squa-editor";

function renderWrapper(node) {
  switch (node.type) {
    case "unordered-list-item":
      return {
        component: "ul"
      };
    case "ordered-list-item":
      return {
        component: "ol"
      };
  }
}

function renderBlock(node) {
  switch (node.type) {
    case "unordered-list-item":
    case "ordered-list-item":
      return {
        component: "li"
      };
  }
}

function tokenizeNode(node, context) {
  const tokens = [];
  switch (node.nodeName) {
    case "UL":
      tokens.push({
        wrapper: {
          type: "unordered-list"
        }
      });
      break;
    case "OL":
      tokens.push({
        wrapper: {
          type: "ordered-list"
        }
      });
      break;
    case "LI":
      if (context.wrapper.type === "unordered-list") {
        tokens.push({
          block: { type: "unordered-list-item" }
        });
      } else {
        tokens.push({
          block: { type: "ordered-list-item" }
        });
      }
      break;
  }
  return tokens;
}

const contents = new Delta()
  .insert("First unordered list item")
  .insert("\n", {
    type: "unordered-list-item"
  })
  .insert("Second unordered list item")
  .insert("\n", {
    type: "unordered-list-item"
  })
  .insert("Third unordered list item")
  .insert("\n", {
    type: "unordered-list-item"
  })
  .insert("First ordered list item")
  .insert("\n", {
    type: "ordered-list-item"
  })
  .insert("Second ordered list item")
  .insert("\n", {
    type: "ordered-list-item"
  })
  .insert("Third ordered list item")
  .insert("\n", {
    type: "ordered-list-item"
  });

const value = Value.fromJSON({ contents });

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
        renderWrapper={renderWrapper}
        renderBlock={renderBlock}
        tokenizeNode={tokenizeNode}
      />
    );
  }
}
```
