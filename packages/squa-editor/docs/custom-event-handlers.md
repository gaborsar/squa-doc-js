# Custom Event Handlers

You can customize the behaviour of the editor using the following event handlers:

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

## afterKeyDownBackspace

This function is called after every `keyDownBacksapce` event, after the default handler of the editor.

```jsx
afterKeyDownBackspace: (change: Change, event: KeyboardEvent) => void;
```

## afterKeyDownDelete

This function is called after every `keyDownDelete` event, after the default handler of the editor.

```jsx
afterKeyDownDelete: (change: Change, event: KeyboardEvent) => void;
```

## afterKeyDownEnter

This function is called after every `keyDownEnter` event, after the default handler of the editor.

```jsx
afterKeyDownEnter: (change: Change, event: KeyboardEvent) => void;
```

## Example

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
