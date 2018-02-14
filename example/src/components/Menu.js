import React, { PureComponent } from "react";
import SimpleButton from "./SimpleButton";
import ToggleButton from "./ToggleButton";
import ColorMenu from "./ColorMenu";
import LinkButton from "./LinkButton";
import { indent, outdent } from "../../../src/SquaDocEditor";

export default class Menu extends PureComponent {
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

  toggleStrikethrough = strikethrough => {
    const { value, onChange } = this.props;
    const change = value
      .change()
      .formatInline({ strikethrough })
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

  changeColor = color => {
    const { value, onChange } = this.props;
    const change = value
      .change()
      .formatInline({ color })
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
          type="strikethrough"
          value={true}
          onClick={this.toggleStrikethrough}
        >
          <i className="fas fa-strikethrough" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="code"
          value={true}
          onClick={this.toggleCode}
        >
          <i className="fas fa-code" />
        </ToggleButton>
        <ColorMenu value={format.color} onChange={this.changeColor} />
        <span className="separator" />
        <LinkButton format={format} type="link" onClick={this.toggleLink}>
          <i className="fas fa-link" />
        </LinkButton>
      </div>
    );
  }
}
