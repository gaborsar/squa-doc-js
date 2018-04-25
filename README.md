# SquaDoc.js

A rich text editor for [React](https://github.com/facebook/react), built around [Quill's Delta](https://github.com/quilljs/delta) to provide collaborative capabilities.

Inspired by [Draft.js](https://github.com/facebook/draft-js), [Quill](https://github.com/quilljs/quill) and [Slate](https://github.com/ianstormtaylor/slate).

## Installation

```
npm install --save squa-doc-js
```

## Quickstart

```jsx
import React, { PureComponent } from "react";
import { Value, Editor } from "squa-doc-js";

const value = Value.createEmpty()
  .change()
  .insertText("Hello world!")
  .getValue();

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { value };
  }

  onChange = change => {
    this.setState({ value: change.getValue() });
  };

  render() {
    return <Editor value={this.state.value} onChange={this.onChange} />;
  }
}
```

## Licence

GNU LGPLv3
