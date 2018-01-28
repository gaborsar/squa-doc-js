## Custom Wrappers

```jsx
import React, { PureComponent } from "react";
import { Delta, Value, Editor } from "squa-editor";

function renderWrapper(node) {
  switch (node.type) {
    case "unordered-list-item":
      return { component: "ul" };
    case "ordered-list-item":
      return { component: "ol" };
  }
}

function renderBlock(node) {
  switch (node.type) {
    case "unordered-list-item":
      return { component: "li" };
    case "ordered-list-item":
      return { component: "li" };
  }
}

function tokenizeNode(node) {
  const tokens = [];
  switch (node.nodeName) {
    case "UL":
      tokens.push({
        wrapper: { type: "unordered-list" }
      });
      break;
    case "OL":
      tokens.push({
        wrapper: { type: "ordered-list" }
      });
      break;
    case "LI":
      if (context.wrapper.type === "unordered-list") {
        tokens.push({
          block: { type: "unordered-list-item" }
        });
      } else if (context.wrapper.type === "ordered-list") {
        tokens.push({
          block: { type: "ordered-list-item" }
        });
      }
      break;
  }
  return tokens;
}

const initialValue = Value.fromJSON({
  contents: new Delta()
    .insert("First unordered list item")
    .insert("\n", { type: "unordered-list-item" })
    .insert("Second unordered list item")
    .insert("\n", { type: "unordered-list-item" })
    .insert("Third unordered list item")
    .insert("\n", { type: "unordered-list-item" })
    .insert("First ordered list item")
    .insert("\n", { type: "ordered-list-item" })
    .insert("Second ordered list item")
    .insert("\n", { type: "ordered-list-item" })
    .insert("Third ordered list item")
    .insert("\n", { type: "ordered-list-item" })
});

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: initialValue };
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
