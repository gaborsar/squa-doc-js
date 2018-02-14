import React, { PureComponent } from "react";
import SimpleButton from "./SimpleButton";
import BlockTypeButton from "./BlockTypeButton";
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

  formatBlock = attributes => {
    const { value, onChange } = this.props;
    const change = value
      .change()
      .formatBlock(attributes)
      .save();
    onChange(change);
  };

  formatInline = attributes => {
    const { value, onChange } = this.props;
    const change = value
      .change()
      .formatInline(attributes)
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
        <BlockTypeButton
          format={format}
          type="heading-one"
          resetIndent
          resetChecked
          onClick={this.formatBlock}
        >
          <i className="fas fa-heading" />1
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="heading-two"
          resetIndent
          resetChecked
          onClick={this.formatBlock}
        >
          <i className="fas fa-heading" />2
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="blockquote"
          resetIndent
          resetChecked
          onClick={this.formatBlock}
        >
          <i className="fas fa-quote-right" />
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="code"
          resetIndent
          resetChecked
          onClick={this.formatBlock}
        >
          <i className="fas fa-code" />
        </BlockTypeButton>
        <span className="separator" />
        <BlockTypeButton
          format={format}
          type="unordered-list-item"
          resetChecked
          onClick={this.formatBlock}
        >
          <i className="fas fa-list-ul" />
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="ordered-list-item"
          resetChecked
          onClick={this.formatBlock}
        >
          <i className="fas fa-list-ol" />
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="checkable"
          onClick={this.formatBlock}
        >
          <i className="fas fa-check-square" />
        </BlockTypeButton>
        <span className="separator" />
        <ToggleButton
          format={format}
          type="align"
          value="left"
          onClick={this.formatBlock}
        >
          <i className="fas fa-align-left" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="center"
          onClick={this.formatBlock}
        >
          <i className="fas fa-align-center" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="right"
          onClick={this.formatBlock}
        >
          <i className="fas fa-align-right" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="justify"
          onClick={this.formatBlock}
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
          onClick={this.formatInline}
        >
          <i className="fas fa-bold" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="italic"
          value={true}
          onClick={this.formatInline}
        >
          <i className="fas fa-italic" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="underline"
          value={true}
          onClick={this.formatInline}
        >
          <i className="fas fa-underline" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="strikethrough"
          value={true}
          onClick={this.formatInline}
        >
          <i className="fas fa-strikethrough" />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="code"
          value={true}
          onClick={this.formatInline}
        >
          <i className="fas fa-code" />
        </ToggleButton>
        <ColorMenu format={format} onClick={this.formatInline} />
        <span className="separator" />
        <LinkButton format={format} onClick={this.formatInline}>
          <i className="fas fa-link" />
        </LinkButton>
      </div>
    );
  }
}
