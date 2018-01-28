## Custom Event Handlers

```jsx
import React, { PureComponent } from "react";
import { Delta, Value, Editor } from "squa-editor";

const KEY_M = 77;

function onKeyDown(change, event) {
  if (event.keyCode === KEY_M && event.ctrlKey) {
    event.preventDefault();
    change
      .delete()
      .insertText("\n")
      .save();
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
