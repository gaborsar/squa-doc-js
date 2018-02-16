import React, { PureComponent } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faUndo from "@fortawesome/fontawesome-free-solid/faUndo";
import faRedo from "@fortawesome/fontawesome-free-solid/faRedo";
import faHeading from "@fortawesome/fontawesome-free-solid/faHeading";
import faQuoteRight from "@fortawesome/fontawesome-free-solid/faQuoteRight";
import faCode from "@fortawesome/fontawesome-free-solid/faCode";
import faListUl from "@fortawesome/fontawesome-free-solid/faListUl";
import faListOl from "@fortawesome/fontawesome-free-solid/faListOl";
import faCheckSquare from "@fortawesome/fontawesome-free-solid/faCheckSquare";
import faAlignLeft from "@fortawesome/fontawesome-free-solid/faAlignLeft";
import faAlignCenter from "@fortawesome/fontawesome-free-solid/faAlignCenter";
import faAlignRight from "@fortawesome/fontawesome-free-solid/faAlignRight";
import faAlignJustify from "@fortawesome/fontawesome-free-solid/faAlignJustify";
import faIndent from "@fortawesome/fontawesome-free-solid/faIndent";
import faOutdent from "@fortawesome/fontawesome-free-solid/faOutdent";
import faBold from "@fortawesome/fontawesome-free-solid/faBold";
import faItalic from "@fortawesome/fontawesome-free-solid/faItalic";
import faUnderline from "@fortawesome/fontawesome-free-solid/faUnderline";
import faStrikethrough from "@fortawesome/fontawesome-free-solid/faStrikethrough";
import faLink from "@fortawesome/fontawesome-free-solid/faLink";
import SimpleButton from "./SimpleButton";
import BlockTypeButton from "./BlockTypeButton";
import ToggleButton from "./ToggleButton";
import ColorMenu from "./ColorMenu";
import LinkButton from "./LinkButton";
import { indent, outdent } from "../../../packages/squa-editor/src";
import "./Menu.scss";

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
          <FontAwesomeIcon icon={faUndo} />
        </SimpleButton>
        <SimpleButton format={format} onClick={this.redo} disabled={!canRedo}>
          <FontAwesomeIcon icon={faRedo} />
        </SimpleButton>
        <span className="separator" />
        <BlockTypeButton
          format={format}
          type="heading-one"
          resetIndent
          resetChecked
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faHeading} />1
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="heading-two"
          resetIndent
          resetChecked
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faHeading} />2
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="blockquote"
          resetIndent
          resetChecked
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faQuoteRight} />
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="code"
          resetIndent
          resetChecked
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faCode} />
        </BlockTypeButton>
        <span className="separator" />
        <BlockTypeButton
          format={format}
          type="unordered-list-item"
          resetChecked
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faListUl} />
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="ordered-list-item"
          resetChecked
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faListOl} />
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="checkable"
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faCheckSquare} />
        </BlockTypeButton>
        <span className="separator" />
        <ToggleButton
          format={format}
          type="align"
          value="left"
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faAlignLeft} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="center"
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faAlignCenter} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="right"
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faAlignRight} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="justify"
          onClick={this.formatBlock}
        >
          <FontAwesomeIcon icon={faAlignJustify} />
        </ToggleButton>
        <span className="separator" />
        <SimpleButton format={format} onClick={this.outdent}>
          <FontAwesomeIcon icon={faOutdent} />
        </SimpleButton>
        <SimpleButton format={format} onClick={this.indent}>
          <FontAwesomeIcon icon={faIndent} />
        </SimpleButton>
        <span className="separator" />
        <ToggleButton
          format={format}
          type="bold"
          value={true}
          onClick={this.formatInline}
        >
          <FontAwesomeIcon icon={faBold} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="italic"
          value={true}
          onClick={this.formatInline}
        >
          <FontAwesomeIcon icon={faItalic} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="underline"
          value={true}
          onClick={this.formatInline}
        >
          <FontAwesomeIcon icon={faUnderline} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="strikethrough"
          value={true}
          onClick={this.formatInline}
        >
          <FontAwesomeIcon icon={faStrikethrough} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="code"
          value={true}
          onClick={this.formatInline}
        >
          <FontAwesomeIcon icon={faCode} />
        </ToggleButton>
        <ColorMenu format={format} onClick={this.formatInline} />
        <span className="separator" />
        <LinkButton format={format} onClick={this.formatInline}>
          <FontAwesomeIcon icon={faLink} />
        </LinkButton>
      </div>
    );
  }
}
