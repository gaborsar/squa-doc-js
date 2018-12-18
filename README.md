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
    .insertText("Hello, World!");

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

Creating a `Value` from a `Delta`, and converting a `Value` to a `Delta`:

```js
import Delta from "quill-delta";
import { Value } from "squa-doc-js";

const value = Value.fromDelta(new Delta().insert("Hello, World!\n"));
const delta = value.toDelta();
```

Creating a `Value` from `JSON`, and converting a `Value` to `JSON`:

```js
import { Value } from "squa-doc-js";

const value = Value.fromJSON([{ insert: "Hello, World!\n" }]);
const data = value.toJSON();
```

Creating a `Value` from `HTML`, and getting the editor's contents as `HTML`:

```js
import { Value } from "squa-doc-js";

const value = Value.fromHTML("<p>Hello, World!</p>");

// you can get the HTML contents with document.querySelector
// or with a react reference
const data = document.querySelector(".SquaDocJs-document").innerHTML;
```

## Licence

GNU LGPLv3
