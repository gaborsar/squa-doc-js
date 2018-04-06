# Custom Event Handlers

You can customize the behavior of the editor using the following event handlers:

## onChange

This function is called after every `change` event.

```jsx
onChange: (change: Change) => void
```

## onKeyDown

This function is called after every `keyDown` event, before the default handler of the editor. You can prevent the default handler by returning `true` from this function.

```jsx
onKeyDown: (change: Change, event: KeyboardEvent) => boolean;
```

## Example

```jsx
import React, { PureComponent } from "react";
import Delta from "quill-delta";
import { Value, Editor } from "squa-doc-js";

function onKeyDown(change, event) {
  // ctrl + m = Enter
  if (event.ctrlKey && event.key === "m") {
    event.preventDefault();
    change
      .delete()
      .insertText("\n")
      .save();
    return true;
  } else {
    return false;
  }
}

const contents = new Delta().insert("Hello world!\n");
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
      <Editor value={value} onChange={this.onChange} onKeyDown={onKeyDown} />
    );
  }
}
```
