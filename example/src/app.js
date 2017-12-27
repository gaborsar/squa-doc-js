import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import {
  Delta,
  Value,
  Editor,
  schema,
  indent,
  outdent
} from "../../src/SquaDocEditor";

class SimpleButton extends PureComponent {
  constructor(props) {
    super(props);
  }

  onMouseDown = event => {
    const { onClick } = this.props;

    event.preventDefault();

    onClick();
  };

  render() {
    const { disabled, children } = this.props;

    return (
      <button
        type="button"
        className="button"
        disabled={disabled}
        onMouseDown={this.onMouseDown}
      >
        {children}
      </button>
    );
  }
}

class ToggleButton extends PureComponent {
  constructor(props) {
    super(props);
  }

  onMouseDown = event => {
    const { onClick, format, type, value } = this.props;

    event.preventDefault();

    onClick(format[type] === value ? null : value);
  };

  render() {
    const { format, type, value, disabled, children } = this.props;

    return (
      <button
        type="button"
        className={classNames("button", {
          "button--active": format[type] === value
        })}
        onMouseDown={this.onMouseDown}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}

class LinkButton extends PureComponent {
  constructor(props) {
    super(props);
  }

  onMouseDownCallback = () => {
    const { onClick, format, type } = this.props;

    onClick(format[type] ? null : prompt("Enter link."));
  };

  onMouseDown = event => {
    event.preventDefault();

    window.requestAnimationFrame(this.onMouseDownCallback);
  };

  render() {
    const { format, type, disabled, children } = this.props;

    return (
      <button
        type="button"
        className={classNames("button", {
          "button--active": format[type]
        })}
        onMouseDown={this.onMouseDown}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}

class Menu extends PureComponent {
  constructor(props) {
    super(props);
  }

  undo = () => {
    const { value, onChange } = this.props;

    const change = value.change().undo();

    onChange(change);
  };

  redo = () => {
    const { value, onChange } = this.props;

    const change = value.change().redo();

    onChange(change);
  };

  toggleBlockType = type => {
    const { value, onChange } = this.props;

    const change = value
      .change()
      .formatBlock({ type })
      .save();

    onChange(change);
  };

  toggleAlign = align => {
    const { value, onChange } = this.props;

    const change = value
      .change()
      .formatBlock({ align })
      .save();

    onChange(change);
  };

  indent = () => {
    const { value, onChange } = this.props;

    const change = value
      .change()
      .call(indent)
      .save();

    onChange(change);
  };

  outdent = () => {
    const { value, onChange } = this.props;

    const change = value
      .change()
      .call(outdent)
      .save();

    onChange(change);
  };

  toggleBold = bold => {
    const { value, onChange } = this.props;

    const change = value
      .change()
      .formatInline({ bold })
      .save();

    onChange(change);
  };

  toggleItalic = italic => {
    const { value, onChange } = this.props;

    const change = value
      .change()
      .formatInline({ italic })
      .save();

    onChange(change);
  };

  toggleUnderline = underline => {
    const { value, onChange } = this.props;

    const change = value
      .change()
      .formatInline({ underline })
      .save();

    onChange(change);
  };

  toggleCode = code => {
    const { value, onChange } = this.props;

    const change = value
      .change()
      .formatInline({ code })
      .save();

    onChange(change);
  };

  toggleLink = link => {
    const { value, onChange } = this.props;

    const change = value
      .change()
      .formatInline({ link })
      .save();

    onChange(change);
  };

  render() {
    const { value } = this.props;
    const { canUndo, canRedo } = value;

    const format = value.getFormat();

    return (
      <div className="menu">
        <SimpleButton format={format} onClick={this.undo} disabled={!canUndo}>
          <i className="fas fa-undo" />
        </SimpleButton>
        <SimpleButton format={format} onClick={this.redo} disabled={!canRedo}>
          <i className="fas fa-redo" />
        </SimpleButton>
        <span className="separator" />
        <ToggleButton
          format={format}
          type="type"
          value="heading-one"
          onClick={this.toggleBlockType}
        >
          <i className="fas fa-heading" />1
        </ToggleButton>
        <ToggleButton
          format={format}
          type="type"
          value="heading-two"
          onClick={this.toggleBlockType}
        >
          <i className="fas fa-heading" />2
        </ToggleButton>
        <ToggleButton
          format={format}
          type="type"
          value="blockquote"
          onClick={this.toggleBlockType}
        >
          <i className="fas fa-quote-right" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="type"
          value="code"
          onClick={this.toggleBlockType}
        >
          <i className="fas fa-code" />
        </ToggleButton>
        <span className="separator" />
        <ToggleButton
          format={format}
          type="type"
          value="unordered-list-item"
          onClick={this.toggleBlockType}
        >
          <i className="fas fa-list-ul" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="type"
          value="ordered-list-item"
          onClick={this.toggleBlockType}
        >
          <i className="fas fa-list-ol" />
        </ToggleButton>
        <span className="separator" />
        <ToggleButton
          format={format}
          type="align"
          value="left"
          onClick={this.toggleAlign}
        >
          <i className="fas fa-align-left" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="center"
          onClick={this.toggleAlign}
        >
          <i className="fas fa-align-center" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="right"
          onClick={this.toggleAlign}
        >
          <i className="fas fa-align-right" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="justify"
          onClick={this.toggleAlign}
        >
          <i className="fas fa-align-justify" />
        </ToggleButton>
        <span className="separator" />
        <SimpleButton format={format} onClick={this.indent}>
          <i className="fas fa-indent" />
        </SimpleButton>
        <SimpleButton format={format} onClick={this.outdent}>
          <i className="fas fa-outdent" />
        </SimpleButton>
        <span className="separator" />
        <ToggleButton
          format={format}
          type="bold"
          value={true}
          onClick={this.toggleBold}
        >
          <i className="fas fa-bold" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="italic"
          value={true}
          onClick={this.toggleItalic}
        >
          <i className="fas fa-italic" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="underline"
          value={true}
          onClick={this.toggleUnderline}
        >
          <i className="fas fa-underline" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="code"
          value={true}
          onClick={this.toggleCode}
        >
          <i className="fas fa-code" />
        </ToggleButton>
        <span className="separator" />
        <LinkButton format={format} type="link" onClick={this.toggleLink}>
          <i className="fas fa-link" />
        </LinkButton>
      </div>
    );
  }
}

class App extends PureComponent {
  constructor(props) {
    super(props);

    const { value } = props;
    this.state = { value };
  }

  onChange = change => {
    // eslint-disable-next-line no-console
    console.log(change);

    const { value } = change;

    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <div className="app">
        <div className="editor">
          <Menu value={value} onChange={this.onChange} />
          <Editor value={value} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

const delta = new Delta()
  .insert("Heading level one")
  .insert("\n", { type: "heading-one", align: "center" })
  .insert("Heading level two")
  .insert("\n", { type: "heading-two" })
  .insert(
    { "block-image": "http://mirtchovski.com/p9/plan9-guru.gif" },
    { alt: "Plan 9", caption: "Plan 9" }
  )
  .insert("Lorem ipsum dolor sit amet, ")
  .insert("consectetur", { bold: true })
  .insert(" ")
  .insert("adipiscing", { italic: true })
  .insert(" elit. ")
  .insert(
    { "inline-image": "http://9p.io/plan9/img/9logo.jpg" },
    { alt: "Plan 9" }
  )
  .insert(" ")
  .insert("Mauris enim quam, semper eu ex id, consectetur vulputate elit. ")
  .insert("Suspendisse molestie vel arcu et euismod. ")
  .insert(
    "Sed tincidunt, erat vel convallis finibus, ante purus tempus purus, at suscipit nisl ex vel magna."
  )
  .insert("\n", { type: "paragraph" })
  .insert("Unordered list item 1")
  .insert("\n", { type: "unordered-list-item" })
  .insert("Unordered list item 2")
  .insert("\n", { type: "unordered-list-item", indent: 1 })
  .insert("Unordered list item 3")
  .insert("\n", { type: "unordered-list-item", indent: 1 })
  .insert("Ordered list item 1")
  .insert("\n", { type: "ordered-list-item" })
  .insert("Ordered list item 2")
  .insert("\n", { type: "ordered-list-item", indent: 1 })
  .insert("Ordered list item 3")
  .insert("\n", { type: "ordered-list-item", indent: 1 })
  .insert("Donec at lacus sed eros cursus tincidunt. ")
  .insert("Pellentesque ac convallis turpis, ut tincidunt nisi. ")
  .insert("Suspendisse rutrum auctor tellus, in lobortis erat dapibus et. ")
  .insert("Aliquam ac sem tellus. ")
  .insert(
    "Integer pretium sapien et dui pellentesque, vitae ultrices neque placerat. "
  )
  .insert("Ut tempus nibh neque, et dapibus magna venenatis ac. ")
  .insert("Nulla scelerisque non ligula et varius. ")
  .insert("Etiam condimentum in purus sit amet auctor. ")
  .insert("In eros est, posuere nec erat ac, feugiat pretium metus. ")
  .insert("Nunc nec ultrices risus. ")
  .insert("Fusce eu nulla ante. ")
  .insert("Vivamus in faucibus felis.")
  .insert("\n", { type: "paragraph" });

const value = Value.fromDelta(schema, delta);

ReactDOM.render(<App value={value} />, document.getElementById("app"));
