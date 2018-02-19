## Custom Block Nodes

To define custom block nodes, you have to define your own `renderBlock` function, and your own `tokenizeNode` function.

## Example

```jsx
import React, { PureComponent } from "react";
import Delta from "quill-delta";
import { Value, Editor } from "squa-editor";

function renderBlock(node) {
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

function tokenizeNode(node) {
  const tokens = [];
  switch (node.nodeName) {
    case "H1":
      tokens.push({
        block: {
          type: "heading-one"
        }
      });
      break;
    case "P":
      tokens.push({
        block: {
          type: "paragraph"
        }
      });
      break;
  }
  return tokens;
}

const contents = new Delta()
  .insert("Heading one")
  .insert("\n", {
    type: "heading-one"
  })
  .insert("Paragraph")
  .insert("\n", {
    type: "paragraph"
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
        renderBlock={renderBlock}
        tokenizeNode={tokenizeNode}
      />
    );
  }
}
```
