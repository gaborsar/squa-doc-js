## Custom Block Embeds

```jsx
import React, { PureComponent } from "react";
import { Delta, Value, Editor } from "squa-editor";

function isBlockEmbed(embedType) {
  if (embedType === "block-image") {
    return true;
  }
}

function BlockImage(props) {
  return <img src={props.src} />;
}

function renderEmbed(node) {
  switch (node.type) {
    case "block-image":
      return {
        component: BlockImage,
        props: { src: node.value["block-image"] }
      };
  }
}

function tokenizeNode(node) {
  const tokens = [];
  switch (node.nodeName) {
    case "IMG":
      tokens.push({
        insert: { "block-image": node.getAttribute("src") }
      });
      break;
  }
  return tokens;
}

const initialValue = Value.fromJSON({
  schema: { isBlockEmbed },
  contents: new Delta().insert({ "block-image": "foo.png" }).insert("\n")
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
        renderEmbed={renderEmbed}
        tokenizeNode={tokenizeNode}
      />
    );
  }
}
```
