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
import { indent, outdent } from "../../../packages/squa-doc-js/src";
import "./Menu.scss";

export default class Menu extends PureComponent {
  handleUndoClick = () => {
    const { value, onChange } = this.props;
    const change = value.change().undo();
    onChange(change);
  };

  handleRedoClick = () => {
    const { value, onChange } = this.props;
    const change = value.change().redo();
    onChange(change);
  };

  handleBlockFormatClick = attributes => {
    const { value, onChange } = this.props;
    const change = value
      .change()
      .formatBlock(attributes)
      .save();
    onChange(change);
  };

  handleInlineFormatClick = attributes => {
    const { value, onChange } = this.props;
    const change = value
      .change()
      .formatInline(attributes)
      .save();
    onChange(change);
  };

  handleIndentClick = () => {
    const { value, onChange } = this.props;
    const change = value
      .change()
      .call(indent)
      .save();
    onChange(change);
  };

  handleOutdentClick = () => {
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

    const canIndent =
      format.type === "unordered-list-item" ||
      format.type === "ordered-list-item" ||
      format.type === "checkable";

    return (
      <div className="Menu">
        <SimpleButton
          format={format}
          onClick={this.handleUndoClick}
          disabled={!canUndo}
        >
          <FontAwesomeIcon icon={faUndo} />
        </SimpleButton>
        <SimpleButton
          format={format}
          onClick={this.handleRedoClick}
          disabled={!canRedo}
        >
          <FontAwesomeIcon icon={faRedo} />
        </SimpleButton>

        <span className="Menu-separator" />

        <BlockTypeButton
          format={format}
          type="heading-one"
          resetIndent
          resetChecked
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faHeading} />1
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="heading-two"
          resetIndent
          resetChecked
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faHeading} />2
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="blockquote"
          resetIndent
          resetChecked
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faQuoteRight} />
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="code"
          resetIndent
          resetChecked
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faCode} />
        </BlockTypeButton>

        <span className="Menu-separator" />

        <BlockTypeButton
          format={format}
          type="unordered-list-item"
          resetChecked
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faListUl} />
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="ordered-list-item"
          resetChecked
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faListOl} />
        </BlockTypeButton>
        <BlockTypeButton
          format={format}
          type="checkable"
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faCheckSquare} />
        </BlockTypeButton>

        <span className="Menu-separator" />

        <ToggleButton
          format={format}
          type="align"
          value="left"
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faAlignLeft} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="center"
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faAlignCenter} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="right"
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faAlignRight} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="align"
          value="justify"
          onClick={this.handleBlockFormatClick}
        >
          <FontAwesomeIcon icon={faAlignJustify} />
        </ToggleButton>

        <span className="Menu-separator" />

        <SimpleButton
          format={format}
          onClick={this.handleOutdentClick}
          disabled={!canIndent}
        >
          <FontAwesomeIcon icon={faOutdent} />
        </SimpleButton>
        <SimpleButton
          format={format}
          onClick={this.handleIndentClick}
          disabled={!canIndent}
        >
          <FontAwesomeIcon icon={faIndent} />
        </SimpleButton>

        <span className="Menu-separator" />

        <ToggleButton
          format={format}
          type="bold"
          value={true}
          onClick={this.handleInlineFormatClick}
        >
          <FontAwesomeIcon icon={faBold} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="italic"
          value={true}
          onClick={this.handleInlineFormatClick}
        >
          <FontAwesomeIcon icon={faItalic} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="underline"
          value={true}
          onClick={this.handleInlineFormatClick}
        >
          <FontAwesomeIcon icon={faUnderline} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="strikethrough"
          value={true}
          onClick={this.handleInlineFormatClick}
        >
          <FontAwesomeIcon icon={faStrikethrough} />
        </ToggleButton>
        <ToggleButton
          format={format}
          type="code"
          value={true}
          onClick={this.handleInlineFormatClick}
        >
          <FontAwesomeIcon icon={faCode} />
        </ToggleButton>

        <ColorMenu format={format} onClick={this.handleInlineFormatClick} />

        <span className="Menu-separator" />

        <LinkButton format={format} onClick={this.handleInlineFormatClick}>
          <FontAwesomeIcon icon={faLink} />
        </LinkButton>
      </div>
    );
  }
}
