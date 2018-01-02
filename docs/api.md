# SquaDoc Editor

## Quickstart

```jsx
import React, { PureComponent } from "react";
import { Delta, Value, Editor, schema } from "squa-editor";

const initialDelta = new Delta().insert("Hello world!\n");
const initialValue = Value.fromDelta(schema, delta);

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: initialValue
    };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return <Editor value={value} onChange={this.onChange} />;
  }
}
```

## Custom Embed Components

```jsx
import React, { PureComponent } from "react";
import { Delta, Schema, Value, Editor } from "squa-editor";

const schema = new Schema({
  block: {
    embeds: ["image"]
  },
  image: {
    marks: ["alt"]
  }
});

function renderEmbed(node) {
  if (node.type === "image") {
    return {
      component: "img",
      props: {
        src: node.value.image,
        alt: node.getMark("alt")
      }
    };
  }
}

function tokenizeNode(node) {
  if (node.nodeName === "IMG") {
    return {
      insert: {
        image: node.getAttribute("src")
      },
      attributes: {
        alt: node.getAttribute("alt")
      }
    };
  }
}

const initialDelta = new Delta()
  .insert({ image: "foo.png" })
  .insert("Hello world!\n");

const initialValue = Value.fromDelta(schema, delta);

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: initialValue
    };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Editor
        value={value}
        renderEmbed={renderEmbed}
        tokenizeNode={tokenizeNode}
        onChange={this.onChange}
      />
    );
  }
}
```

## Custom Block Components

```jsx
import React, { PureComponent } from "react";
import { Delta, Schema, Value, Editor } from "squa-editor";

const schema = new Schema({
  block: {
    marks: ["type"]
  }
});

function renderWrapper(node) {
  switch (node.type) {
    case "unordered-list-item":
      return { component: "ul" };

    case "ordered-list-item":
      return { component: "ol" };
  }
}

function renderBlock(node) {
  switch (node.type) {
    case "unordered-list-item":
      return { component: "li" };

    case "ordered-list-item":
      return { component: "li" };

    case "heading-one":
      return { component: "h1" };

    case "heading-two":
      return { component: "h2" };

    case "paragraph":
      return { component: "P" };
  }
}

function tokenizeNode(node, context) {
  const tokens = [];

  switch (node.nodeName) {
    case "UL":
      tokens.push({
        wrapper: {
          type: "unordered-list"
        }
      });
      break;

    case "OL":
      tokens.push({
        wrapper: {
          type: "ordered-list"
        }
      });
      break;

    case "LI":
      tokens.push({
        block: {
          type: `${context.wrapper.type}-item`
        }
      });
      break;

    case "H1":
      tokens.push({
        block: {
          type: "heading-one"
        }
      });
      break;

    case "H2":
      tokens.push({
        block: {
          type: "heading-two"
        }
      });
      break;

    case "P":
      tokens.push({
        block: {
          type: "paragraph"
        }
      });
      break;
  }

  return tokens;
}

const initialDelta = new Delta()
  .insert("Heading one")
  .insert("\n", { type: "heading-one" })
  .insert("Heading two")
  .insert("\n", { type: "heading-two" })
  .insert("Paragraph")
  .insert("\n", { type: "paragraph" })
  .insert("Unordered list item 1")
  .insert("\n", { type: "unordered-list-item" })
  .insert("Unordered list item 2")
  .insert("\n", { type: "unordered-list-item" })
  .insert("Unordered list item 3")
  .insert("\n", { type: "unordered-list-item" })
  .insert("Ordered list item 1")
  .insert("\n", { type: "ordered-list-item" })
  .insert("Ordered list item 2")
  .insert("\n", { type: "ordered-list-item" })
  .insert("Ordered list item 3")
  .insert("\n", { type: "ordered-list-item" });

const initialValue = Value.fromDelta(schema, delta);

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: initialValue
    };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Editor
        value={value}
        renderWrapper={renderWrapper}
        renderBlock={renderBlock}
        tokenizeNode={tokenizeNode}
        onChange={this.onChange}
      />
    );
  }
}
```

## Custom Marks

```jsx
import React, { PureComponent } from "react";
import { Delta, Schema, Value, Editor } from "squa-editor";

const schema = new Schema({
  inline: {
    marks: ["link", "background", "color"]
  }
});

function renderMark(mark) {
  switch (mark.type) {
    case "link":
      return {
        component: "a",
        props: {
          href: mark.value
        }
      };

    case "background":
      return {
        style: {
          background: mark.value
        }
      };

    case "color":
      return {
        className: `color-${mark.value}`
      };
  }
}

function tokenizeNode(node) {
  const tokens = [];

  if (node.nodeName === "A") {
    tokens.push({
      inline: {
        link: node.getAttribute("href")
      }
    });
  }

  for (let i = 0; i < node.classList.length; i++) {
    const className = node.classList.item(i);

    if (className.startsWith("color-")) {
      tokens.push({
        inline: {
          color: className.replace("color-")
        }
      });
    }
  }

  if (node.style.background) {
    tokens.push({
      inline: {
        background: node.style.background
      }
    });
  }

  return tokens;
}

const initialDelta = new Delta()
  .insert("Hello world!", {
    link: "http://foo.bar",
    bold: true,
    background: "red"
  })
  .insert("\n");

const initialValue = Value.fromDelta(schema, delta);

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: initialValue
    };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Editor
        value={value}
        renderMark={renderMark}
        tokenizeNode={tokenizeNode}
        onChange={this.onChange}
      />
    );
  }
}
```

## Custom Event Handlers

```jsx
import React, { PureComponent } from "react";
import { Delta, Value, Editor, schema } from "squa-editor";

const initialDelta = new Delta().insert("Hello world!\n");
const initialValue = Value.fromDelta(schema, delta);

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: initialValue
    };
  }

  onKeyDownCtrlM(event, change, editor) {
    const { props: { value } } = editor;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    if (!isCollapsed) {
      change.delete();
    }

    change.insertText("\n", value.getFormat()).save();

    return true;
  }

  onKeyDown = (event, change) => {
    if (event.ctrlKey && event.keyCode === 77) {
      return this.onKeyDownCtrlM(event, change);
    }

    return false;
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return <Editor value={value} onChange={this.onChange} />;
  }
}
```
