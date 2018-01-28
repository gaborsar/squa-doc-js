## Custom Marks

## Custom Inline Embeds

```jsx
import React, { PureComponent } from "react";
import { Delta, Value, Editor } from "squa-editor";

function isInlineMark(markType) {
  if (markType === "bold" || markType === "italic") {
    return true;
  }
}

function renderMark(mark) {
  switch (mark.type) {
    case "bold":
      return { component: "b" };
    case "italic":
      return { component: "i" };
  }
}

function tokenizeNode(node) {
  const tokens = [];
  switch (node.nodeName) {
    case "B":
      tokens.push({ inline: { bold: true } });
      break;
    case "I":
      tokens.push({ inline: { italic: true } });
      break;
  }
  return tokens;
}

const initialValue = Value.fromJSON({
  schema: { isInlineMark },
  contents: new Delta()
    .insert("foo", { bold: true })
    .insert("bar", { italic: true })
    .insert("\n")
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
        renderMark={renderMark}
        tokenizeNode={tokenizeNode}
      />
    );
  }
}
```
