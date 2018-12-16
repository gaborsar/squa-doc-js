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

const { value } = Value.createEmpty()
    .change()
    .insertText("Hello world!");

class App extends PureComponent {
    state = { value };

    onChange = ({ value }) => {
        this.setState({ value });
    };

    render() {
        return <Editor value={this.state.value} onChange={this.onChange} />;
    }
}
```

## Licence

GNU LGPLv3
