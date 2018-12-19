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
                <button value="heading-one" onClick={this.toggleBlockType}>
                    H1
                </button>
                <button value="heading-two" onClick={this.toggleBlockType}>
                    H2
                </button>
                <button value="left" onClick={this.toggleAlignment}>
                    Left
                </button>
                <button value="right" onClick={this.toggleAlignment}>
                    Right
                </button>
                <Editor value={this.state.value} onChange={this.onChange} />
            </div>
        );
    }

    toggleBlockType = event => {
        const attributes = this.state.value.getBlockAttributes();
        const value = event.target.value;
        this.onChange(
            this.state.value
                .change()
                .setBlockAttributes({
                    type: attributes.type === value ? null : value
                })
                .save()
        );
    };

    toggleAlignment = event => {
        const attributes = this.state.value.getBlockAttributes();
        const value = event.target.value;
        this.onChange(
            this.state.value
                .change()
                .setBlockAttributes({
                    align: attributes.align === value ? null : value
                })
                .save()
        );
    };

    onChange = ({ value }) => {
        this.setState({ value });
    };
}
```

The following block types are supported by default:

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

The following block formats are supported by default:

-   `align` - Alignment with the following values:
    -   `left`
    -   `right`
    -   `center`
    -   `justify`
-   `indent` - Indentation for the following block types:
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
                <button value="bold" onClick={this.toggleAttribute}>
                    bold
                </button>
                <button value="italic" onClick={this.toggleAttribute}>
                    italic
                </button>
                <button onClick={this.addLink}>link</button>
                <Editor value={this.state.value} onChange={this.onChange} />
            </div>
        );
    }

    toggleAttribute = event => {
        const attributes = this.state.value.getInlineAttributes();
        const value = event.target.value;
        this.onChange(
            this.state.value
                .change()
                .setInlineAttributes({
                    [value]: attributes[value] ? null : true
                })
                .save()
        );
    };

    addLink = event => {
        this.onChange(
            this.state.value
                .change()
                .setInlineAttributes({ link: window.promp() })
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
