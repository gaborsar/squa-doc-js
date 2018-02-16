## Custom Event Handlers

```jsx
import React, { PureComponent } from "react";
import Delta from "quill-delta";
import { Value, Editor } from "squa-editor";

function onKeyDown(change, event) {
  // ctrl + M = Enter
  if (event.ctrlKey && event.keyCode === 77) {
    event.preventDefault();
    change
      .delete()
      .insertText("\n")
      .save();
    return true;
  }
}

const initialValue = Value.fromJSON({
  contents: new Delta().insert("Hello world!\n")
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
      <Editor value={value} onChange={this.onChange} onKeyDown={onKeyDown} />
    );
  }
}
```
