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

    render() {
        return <Editor value={this.state.value} onChange={this.onChange} />;
    }

    onChange = ({ value }) => {
        this.setState({ value });
    };
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

## API Basics

### Formatting blocks

```jsx
import React, { PureComponent } from "react";
import { Value, Editor } from "squa-doc-js";

const { value } = Value.createEmpty()
    .change()
    .insertText("Hello, World!");

class App extends PureComponent {
    state = { value };

    render() {
        return (
            <div>
                <button value="heading-one" onClick={this.handleBlockTypeClick}>
                    H1
                </button>
                <button value="heading-two" onClick={this.handleBlockTypeClick}>
                    H2
                </button>
                <Editor value={this.state.value} onChange={this.onChange} />
            </div>
        );
    }

    handleBlockTypeClick = event => {
        this.onChange(
            this.state.value
                .change()
                .toggleBlockAttribute("type", event.target.value)
                .save()
        );
    };

    onChange = ({ value }) => {
        this.setState({ value });
    };
}
```

The following block formats are supported by default:

-   `type`
    -   `heading-one`
    -   `heading-two`
    -   `heading-three`
    -   `heading-four`
    -   `heading-five`
    -   `heading-six`
    -   `unordered-list-item`
    -   `ordered-list-item`
    -   `paragraph`
    -   `blockquote`
    -   `code`
-   `align`
    -   `left`
    -   `right`
    -   `center`
    -   `justify`
-   `indent` - Available for the following types:
    -   `unordered-list-item`
    -   `ordered-list-item`

### Formatting text and inline embed elements

```jsx
import React, { PureComponent } from "react";
import { Value, Editor } from "squa-doc-js";

const { value } = Value.createEmpty()
    .change()
    .insertText("Hello, World!");

class App extends PureComponent {
    state = { value };

    render() {
        return (
            <div>
                <button value="bold" onClick={this.handleInlineFormatClick}>
                    bold
                </button>
                <button value="italic" onClick={this.handleInlineFormatClick}>
                    italic
                </button>
                <button onClick={this.handleLinkClick}>link</button>
                <Editor value={this.state.value} onChange={this.onChange} />
            </div>
        );
    }

    handleInlineFormatClick = event => {
        this.onChange(
            this.state.value
                .change()
                .toggleInlineAttribute(event.target.value, true)
                .save()
        );
    };

    handleLinkClick = event => {
        this.onChange(
            this.state.value
                .change()
                .setInlineAttribute("link", window.prompt())
                .save()
        );
    };

    onChange = ({ value }) => {
        this.setState({ value });
    };
}
```

The following inline attributes are supported by default:

-   `anchor`
-   `link`
-   `color`
    -   `silver`
    -   `gray`
    -   `maroon`
    -   `red`
    -   `purple`
    -   `fuchsia`
    -   `green`
    -   `lime`
    -   `olive`
    -   `yellow`
    -   `navy`
    -   `blue`
    -   `teal`
    -   `aqua`
-   `bold`
-   `italic`
-   `underline`
-   `strikethrough`
-   `code`

## Licence

GNU LGPLv3
