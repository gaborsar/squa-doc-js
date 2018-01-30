## Custom Inline Embeds

```jsx
import React, { PureComponent } from "react";
import { Delta, Value, Editor } from "squa-editor";

function isInlineEmbed(embedType) {
  if (embedType === "inline-image") {
    return true;
  }
}

function InlineImage(props) {
  return <img src={props.src} />;
}

function renderEmbed(node) {
  switch (node.type) {
    case "inline-image":
      return {
        component: InlineImage,
        props: { src: node.value["inline-image"] }
      };
  }
}

function tokenizeNode(node) {
  const tokens = [];
  switch (node.nodeName) {
    case "IMG":
      tokens.push({
        insert: { "inline-image": node.getAttribute("src") }
      });
      break;
  }
  return tokens;
}

const initialValue = Value.fromJSON({
  schema: { isInlineEmbed },
  contents: new Delta().insert({ "inline-image": "foo.png" }).insert("\n")
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
