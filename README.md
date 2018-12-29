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

const value = Value.fromDelta({
    contents: new Delta().insert("Hello, World!\n")
});

const delta = value.toDelta();
```

Creating a `Value` from `JSON`, and converting a `Value` to `JSON`:

```js
import { Value } from "squa-doc-js";

const value = Value.fromJSON({
    contents: [{ insert: "Hello, World!\n" }]
});

const data = value.toJSON();
```

Creating a `Value` from `HTML`, and getting the editor's contents as `HTML`:

```js
import { Value } from "squa-doc-js";

const value = Value.fromHTML({
    contents: "<p>Hello, World!</p>"
});

// you can get the HTML contents with document.querySelector
// or with a react reference
const data = document.querySelector(".SquaDocJs-document").innerHTML;
```

## API basics

### Formatting blocks

```jsx
import React, { PureComponent } from "react";
import { Value, Editor } from "squa-doc-js";

class App extends PureComponent {
    state = { value: Value.createEmpty() };
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

class App extends PureComponent {
    state = { value: Value.createEmpty() };
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

## Customization

### Schema

The editor uses an object called schema to validate embed elements and styles. Therefore, the first step to have custom embed elements or styles is to define your own schema. For example, you can define a custom inline style like this:

```js
import Delta from "quill-delta";
import { NodeType, Value, Editor } from "squa-doc-js";

const schema = {
    isInlineMark(name) {
        return name === "highlight";
    }
};

const value = Value.fromDelta({
    schema,
    contents: new Delta().insert("foo", { highlight: true })
});
```

Customs schemas have to implement the following interface:

```ts
{
    isBlockEmbed?: (embedName: string) => boolean;
    isInlineEmbed?: (embedName: string) => boolean;
    isTableMark?: (markName: string) => boolean;
    isRowMark?: (markName: string) => boolean;
    isCellMark?: (markName: string) => boolean;
    isBlockMark?: (markName: string) => boolean;
    isTextMark?: (markName: string) => boolean;
    isBlockEmbedMark?: (embedName: string, markName: string) => boolean;
    isInlineEmbedMark?: (embedName: string, markName: string) => boolean;
}
```

### Table, row, and cell nodes

You can override the default table, row, and cell components using the `renderNode` property of the `Editor` component like this:

```jsx
import React, { PureComponent } from "react";
import { NodeType, Value, Editor } from "squa-doc-js";

const { value } = Value.createEmpty()
    .change()
    .insertText("Hello, World!");

class App extends PureComponent {
    state = { value };
    render() {
        return (
            <Editor
                value={this.state.value}
                onChange={this.onChange}
                renderNode={renderNode}
            />
        );
    }
    onChange = ({ value }) => {
        this.setState({ value });
    };
}

function renderNode(node) {
    if (node.type === NodeType.Table) {
        return renderTableNode(node);
    }
    if (node.type === NodeType.Row) {
        return renderRowNode(node);
    }
    if (node.type === NodeType.Cell) {
        return renderCellNode(node);
    }
}

function renderTableNode(node) {
    return { component: Table };
}

function renderRowNode(node) {
    return { component: Row };
}

function renderCellNode(node) {
    return { component: Cell };
}

function Table({ children, ...props }) {
    return (
        <table {...props}>
            <tbody>{children}</tbody>
        </table>
    );
}

function Row({ children, ...props }) {
    return <tr {...props}>{children}</tr>;
}

function Cell({ children, ...props }) {
    return <tr {...props}>{children}</tr>;
}
```

### Block nodes

You can render your custom block nodes using the `renderNode` property of the `Editor` component like this:

```jsx
import Delta from "quill-delta";
import React, { PureComponent } from "react";
import { NodeType, Value, Editor } from "squa-doc-js";

const schema = {
    isBlockMark(name) {
        return name === "type";
    }
};

const value = Value.fromDelta({
    schema,
    contents: new Delta()
        .insert("Heading one")
        .insert("\n", { type: "heading-one" })
        .insert("Heading two")
        .insert("\n", { type: "heading-two" })
});

class App extends PureComponent {
    state = { value };
    render() {
        return (
            <Editor
                value={this.state.value}
                onChange={this.onChange}
                renderNode={renderNode}
            />
        );
    }
    onChange = ({ value }) => {
        this.setState({ value });
    };
}

function renderNode(node) {
    if (node.type === NodeType.Block) {
        return renderBlockNode(node);
    }
}

function renderBlockNode(node) {
    const blockType = node.getAttribute("type");
    if (blockType === "heading-one") {
        return { component: "h1" };
    }
    if (blockType === "heading-two") {
        return { component: "h2" };
    }
}
```

### Embed nodes

You can render your custom embed nodes using the `renderNode` property of the `Editor` component like this:

```jsx
import Delta from "quill-delta";
import React, { PureComponent } from "react";
import { NodeType, Value, Editor } from "squa-doc-js";

const schema = {
    isBlockEmbed(name) {
        return name === "block-image";
    },
    isInlineEmbed(name) {
        return name === "inline-image";
    }
};

const value = Value.fromDelta({
    schema,
    contents: new Delta()
        .insert({ "block-image": "foo.png" })
        .insert({ "inline-image": "bar.png" })
        .insert("\n")
});

class App extends PureComponent {
    state = { value };
    render() {
        return (
            <Editor
                value={this.state.value}
                onChange={this.onChange}
                renderNode={renderNode}
            />
        );
    }
    onChange = ({ value }) => {
        this.setState({ value });
    };
}

function renderNode(node) {
    if (
        node.type === NodeType.BlockEmbed ||
        node.type === NodeType.InlineEmbed
    ) {
        return renderEmbedNode(node);
    }
}

function renderEmbedNode(node) {
    if (node.name === "block-image") {
        return { component: BlockImage, props: { node } };
    }
    if (node.name === "inline-image") {
        return { component: InlineImage, props: { node } };
    }
}

function BlockImage({ node, ...props }) {
    return (
        <figure {...props}>
            <img src={node.value} />
        </figure>
    );
}

function InlineImage({ node, ...props }) {
    return <img src={node.value} {...props} />;
}
```

### Wrapper nodes

You can wrap a group of block nodes using the `renderWrapper` property of the `Editor` component. For example, list items are implemented the following way:

```jsx
import Delta from "quill-delta";
import React, { PureComponent } from "react";
import { NodeType, Value, Editor } from "squa-doc-js";

const schema = {
    isBlockMark(name) {
        return name === "type";
    }
};

const value = Value.fromDelta({
    schema,
    contents: new Delta()
        .insert("Unordered list item 1")
        .insert("\n", { type: "unordered-list-item" })
        .insert("Unordered list item 2")
        .insert("\n", { type: "unordered-list-item" })
        .insert("Ordered list item 1")
        .insert("\n", { type: "ordered-list-item" })
        .insert("Ordered list item 2")
        .insert("\n", { type: "ordered-list-item" })
});
class App extends PureComponent {
    state = { value };
    render() {
        return (
            <Editor
                value={this.state.value}
                onChange={this.onChange}
                renderWrapper={renderWrapper}
                renderNode={renderNode}
            />
        );
    }
    onChange = ({ value }) => {
        this.setState({ value });
    };
}

function renderWrapper(node) {
    if (node.type === NodeType.Block) {
        return renderBlockWrapper(node);
    }
}

function renderBlockWrapper(node) {
    const blockType = node.getAttribute("type");
    if (blockType === "unordered-list-item") {
        return { component: "ul" };
    }
    if (blockType === "ordered-list-item") {
        return { component: "ol" };
    }
}

function renderNode(node) {
    if (node.type === NodeType.Block) {
        return renderBlockNode(node);
    }
}

function renderBlockNode(node) {
    const blockType = node.getAttribute("type");
    if (
        blockType === "unordered-list-item" ||
        blockType === "ordered-list-item"
    ) {
        return { component: "li" };
    }
}
```

### Marks

Attributes of nodes are represented by objects called marks. These marks can be rendered using the `renderMark` property of the `Editor` component. Table, row, cell, and block marks can be rendered as classnames, inline marks can be rendered as classnames and components. For example:

```jsx
import Delta from "quill-delta";
import React, { PureComponent } from "react";
import { NodeType, Value, Editor } from "squa-doc-js";

const schema = {
    isBlockMark(name) {
        return name === "align";
    },
    isTextMark(name) {
        return name === "link";
    }
};

const value = Value.fromDelta({
    schema,
    contents: new Delta()
        .insert("foo", { link: "http://foo.bar" })
        .insert("\n", { align: "left" })
});

class App extends PureComponent {
    state = { value };
    render() {
        return (
            <Editor
                value={this.state.value}
                onChange={this.onChange}
                renderMark={renderMark}
            />
        );
    }
    onChange = ({ value }) => {
        this.setState({ value });
    };
}

function renderMark(mark) {
    if (mark.name === "align") {
        return { className: `align-${mark.value}` };
    }
    if (mark.name === "link") {
        return { component: "a", props: { href: mark.value } };
    }
}
```

## Licence

GNU LGPLv3
