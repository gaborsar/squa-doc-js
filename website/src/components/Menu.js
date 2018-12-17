import React, { PureComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUndo,
    faRedo,
    faHeading,
    faQuoteRight,
    faCode,
    faListUl,
    faListOl,
    faCheckSquare,
    faAlignLeft,
    faAlignCenter,
    faAlignRight,
    faAlignJustify,
    faIndent,
    faOutdent,
    faBold,
    faItalic,
    faUnderline,
    faStrikethrough,
    faLink
} from "@fortawesome/free-solid-svg-icons";
import { indent, outdent } from "squa-doc-js";

import SimpleButton from "./SimpleButton";
import BlockTypeButton from "./BlockTypeButton";
import ToggleButton from "./ToggleButton";
import ColorMenu from "./ColorMenu";
import LinkButton from "./LinkButton";

import "./Menu.css";

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

    handleBlockButtonClick = attributes => {
        const { value, onChange } = this.props;
        const change = value
            .change()
            .setBlockAttributes(attributes)
            .save();
        onChange(change);
    };

    handleInlineButtonClick = attributes => {
        const { value, onChange } = this.props;
        const change = value
            .change()
            .setInlineAttributes(attributes)
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

        const attributes = value.getAttributes();
        const canIndent =
            attributes.type === "unordered-list-item" ||
            attributes.type === "ordered-list-item" ||
            attributes.type === "checkable";

        return (
            <div className="Menu">
                <SimpleButton
                    onClick={this.handleUndoClick}
                    disabled={!canUndo}
                >
                    <FontAwesomeIcon icon={faUndo} />
                </SimpleButton>
                <SimpleButton
                    onClick={this.handleRedoClick}
                    disabled={!canRedo}
                >
                    <FontAwesomeIcon icon={faRedo} />
                </SimpleButton>

                <span className="Menu-separator" />

                <BlockTypeButton
                    attributes={attributes}
                    type="heading-one"
                    resetIndent
                    resetChecked
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faHeading} />1
                </BlockTypeButton>
                <BlockTypeButton
                    attributes={attributes}
                    type="heading-two"
                    resetIndent
                    resetChecked
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faHeading} />2
                </BlockTypeButton>
                <BlockTypeButton
                    attributes={attributes}
                    type="blockquote"
                    resetIndent
                    resetChecked
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faQuoteRight} />
                </BlockTypeButton>
                <BlockTypeButton
                    attributes={attributes}
                    type="code"
                    resetIndent
                    resetChecked
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faCode} />
                </BlockTypeButton>

                <span className="Menu-separator" />

                <BlockTypeButton
                    attributes={attributes}
                    type="unordered-list-item"
                    resetChecked
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faListUl} />
                </BlockTypeButton>
                <BlockTypeButton
                    attributes={attributes}
                    type="ordered-list-item"
                    resetChecked
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faListOl} />
                </BlockTypeButton>
                <BlockTypeButton
                    attributes={attributes}
                    type="checkable"
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faCheckSquare} />
                </BlockTypeButton>

                <span className="Menu-separator" />

                <ToggleButton
                    attributes={attributes}
                    name="align"
                    value="left"
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faAlignLeft} />
                </ToggleButton>
                <ToggleButton
                    attributes={attributes}
                    name="align"
                    value="center"
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faAlignCenter} />
                </ToggleButton>
                <ToggleButton
                    attributes={attributes}
                    name="align"
                    value="right"
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faAlignRight} />
                </ToggleButton>
                <ToggleButton
                    attributes={attributes}
                    name="align"
                    value="justify"
                    onClick={this.handleBlockButtonClick}
                >
                    <FontAwesomeIcon icon={faAlignJustify} />
                </ToggleButton>

                <span className="Menu-separator" />

                <SimpleButton
                    onClick={this.handleOutdentClick}
                    disabled={!canIndent}
                >
                    <FontAwesomeIcon icon={faOutdent} />
                </SimpleButton>
                <SimpleButton
                    onClick={this.handleIndentClick}
                    disabled={!canIndent}
                >
                    <FontAwesomeIcon icon={faIndent} />
                </SimpleButton>

                <span className="Menu-separator" />

                <ToggleButton
                    attributes={attributes}
                    name="bold"
                    value={true}
                    onClick={this.handleInlineButtonClick}
                >
                    <FontAwesomeIcon icon={faBold} />
                </ToggleButton>
                <ToggleButton
                    attributes={attributes}
                    name="italic"
                    value={true}
                    onClick={this.handleInlineButtonClick}
                >
                    <FontAwesomeIcon icon={faItalic} />
                </ToggleButton>
                <ToggleButton
                    attributes={attributes}
                    name="underline"
                    value={true}
                    onClick={this.handleInlineButtonClick}
                >
                    <FontAwesomeIcon icon={faUnderline} />
                </ToggleButton>
                <ToggleButton
                    attributes={attributes}
                    name="strikethrough"
                    value={true}
                    onClick={this.handleInlineButtonClick}
                >
                    <FontAwesomeIcon icon={faStrikethrough} />
                </ToggleButton>
                <ToggleButton
                    attributes={attributes}
                    name="code"
                    value={true}
                    onClick={this.handleInlineButtonClick}
                >
                    <FontAwesomeIcon icon={faCode} />
                </ToggleButton>

                <ColorMenu
                    attributes={attributes}
                    onClick={this.handleInlineButtonClick}
                />

                <span className="Menu-separator" />

                <LinkButton
                    attributes={attributes}
                    onClick={this.handleInlineButtonClick}
                >
                    <FontAwesomeIcon icon={faLink} />
                </LinkButton>
            </div>
        );
    }
}
