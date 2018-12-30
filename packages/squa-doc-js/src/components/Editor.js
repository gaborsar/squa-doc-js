import React, { PureComponent } from "react";
import joinClassNames from "classnames";

import SnapshotType from "../model/SnapshotType";
import SpecialCharacter from "../model/SpecialCharacter";
import { isBlockNode, isBlockLevelNode } from "../model/Predicates";

import ErrorBoundary from "./ErrorBoundary";
import ContentEditable from "./ContentEditable";
import Document from "./Document";

import getModelSelection from "../dom/getModelSelection";
import setNativeSelection from "../dom/setNativeSelection";
import findBlockParentNode from "../dom/findBlockParentNode";

import parseNode from "../parser/parseNode";
import parseHTML from "../parser/parseHTML";

import isMobile from "./isMobile";
import optimizeInsertDelta from "./optimizeInsertDelta";
import optimizeFragmentDelta from "./optimizeFragmentDelta";

import defaultRenderWrapper from "../defaults/renderWrapper";
import defaultRenderNode from "../defaults/renderNode";
import defaultRenderMark from "../defaults/renderMark";
import defaultOnKeyDown from "../defaults/onKeyDown";
import defaultTokenizeNode from "../defaults/tokenizeNode";
import defaultTokenizeClassName from "../defaults/tokenizeClassName";
import defaultAfterInput from "../defaults/afterInput";

import "./Editor.css";
import fixBlockEndSelection from "../dom/fixBlockEndSelection";

const sink = () => {};

const preventDefault = event => {
    event.preventDefault();
};

export default class Editor extends PureComponent {
    state = { isFocused: false };

    rootNode = null;
    isMouseDown = false;

    componentDidUpdate(prevProps) {
        if (
            prevProps.value.document !== this.props.value.document ||
            prevProps.value.selection !== this.props.value.selection
        ) {
            this.updateSelection();
        }
    }

    render() {
        const {
            value,
            onChange,
            disabled = false,
            spellCheck = true,
            renderWrapper = defaultRenderWrapper,
            renderNode = defaultRenderNode,
            renderMark = defaultRenderMark
        } = this.props;
        return (
            <div
                className={joinClassNames("SquaDocJs-editor", {
                    "SquaDocJs-editor--focused": this.state.isFocused
                })}
            >
                <ErrorBoundary>
                    {this.renderPlaceholder()}
                    <ContentEditable
                        editableRef={this.setRootNode}
                        className="SquaDocJs-editable"
                        disabled={disabled}
                        spellCheck={spellCheck}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        onSelect={this.handleSelect}
                        onCut={this.handleCut}
                        onPaste={this.handlePaste}
                        onDragStart={preventDefault}
                        onDrop={preventDefault}
                        onKeyDown={this.handleKeyDown}
                        onKeyUp={this.handleKeyUp}
                        onCompositionStart={this.handleCompositionStart}
                        onCompositionEnd={this.handleCompositionEnd}
                        onInput={this.handleInput}
                    >
                        <Document
                            key={value.document.key}
                            node={value.document}
                            createChange={this.createChange}
                            onChange={onChange}
                            renderWrapper={renderWrapper}
                            renderNode={renderNode}
                            renderMark={renderMark}
                        />
                    </ContentEditable>
                </ErrorBoundary>
            </div>
        );
    }

    renderPlaceholder() {
        const { value, placeholder } = this.props;
        const { document } = value;

        if (placeholder && value.isEditing && document.isPristine) {
            return (
                <span
                    className="SquaDocJs-placeholder"
                    onClick={this.handlePlaceholderClick}
                >
                    {placeholder}
                </span>
            );
        }
    }

    setRootNode = rootNode => {
        this.rootNode = rootNode;
    };

    focus = () => {
        if (this.rootNode === null) {
            return;
        }
        this.rootNode.focus();
    };

    createChange = () => {
        const { value } = this.props;
        return value.change();
    };

    handlePlaceholderClick = event => {
        event.preventDefault();
        this.focus();
    };

    handleFocus = () => {
        this.setState({ isFocused: true });
    };

    handleBlur = () => {
        this.setState({ isFocused: false });
    };

    handleSelect = () => {
        if (this.rootNode === null) {
            return;
        }

        const { value, onChange = sink } = this.props;
        const { selection: currentSelection } = value;

        if (value.isComposing) {
            return;
        }

        const nativeSelection = window.getSelection();
        if (
            !nativeSelection ||
            !nativeSelection.anchorNode ||
            !nativeSelection.focusNode
        ) {
            return;
        }

        const nextSelection = getModelSelection(this.rootNode, nativeSelection);
        if (nextSelection === null) {
            return;
        }
        if (
            currentSelection.anchorOffset === nextSelection.anchorOffset &&
            currentSelection.focusOffset === nextSelection.focusOffset
        ) {
            return;
        }

        const change = value.change();
        change.select(nextSelection.anchorOffset, nextSelection.focusOffset);

        onChange(change);
    };

    updateSelection() {
        if (this.rootNode === null) {
            return;
        }

        const { value } = this.props;
        const { document, selection } = value;

        setNativeSelection(this.rootNode, document, selection);
    }

    handleCut = () => {
        const { value, onChange = sink } = this.props;

        const change = value.change().startComposing();
        onChange(change);

        window.requestAnimationFrame(this.afterCut);
    };

    afterCut = () => {
        const { value, onChange = sink } = this.props;

        const change = value
            .change()
            .stopComposing()
            .regenerateKey()
            .delete()
            .save();

        onChange(change);
    };

    handlePaste = event => {
        const { value } = this.props;

        const change = value.change();

        if (
            Array.prototype.includes.call(
                event.clipboardData.types,
                "text/html"
            )
        ) {
            return this.handlePasteHTML(change, event);
        }
        if (
            Array.prototype.includes.call(
                event.clipboardData.types,
                "text/plain"
            )
        ) {
            return this.handlePasteText(change, event);
        }
    };

    handlePasteHTML = (change, event) => {
        event.preventDefault();

        const {
            tokenizeNode = defaultTokenizeNode,
            tokenizeClassName = defaultTokenizeClassName,
            onChange = sink
        } = this.props;

        const { value } = change;
        const { selection } = value;

        if (selection.isExpanded) {
            change.delete();
        }

        const fragment = parseHTML(
            event.clipboardData.getData("text/html"),
            tokenizeNode,
            tokenizeClassName
        );
        optimizeFragmentDelta(fragment);
        change.insertFragment(fragment).save();

        onChange(change);
    };

    handlePasteText = (change, event) => {
        event.preventDefault();

        const { onChange = sink } = this.props;
        const { value } = change;
        const { selection } = value;

        if (selection.isExpanded) {
            change.delete();
        }

        change
            .insertText(
                event.clipboardData.getData("text/plain"),
                value.getInlineAttributes()
            )
            .save();

        onChange(change);
    };

    handleKeyDown = event => {
        const {
            value,
            onKeyDown = defaultOnKeyDown,
            onChange = sink
        } = this.props;

        if (value.isComposing) {
            return this.handleCompositionKeyDown(event);
        }

        const change = value.change();

        if (onKeyDown(change, event)) {
            return onChange(change);
        }

        // select all for Windows
        if (event.ctrlKey && event.key === "a") {
            return this.handleKeyDownSelectAll(change, event);
        }

        // select all for OSX
        if (event.metaKey && event.key === "a") {
            return this.handleKeyDownSelectAll(change, event);
        }

        if (event.key === "Backspace") {
            return this.handleKeyDownBackspace(change, event);
        }
        if (event.key === "Delete") {
            return this.handleKeyDownDelete(change, event);
        }
        if (event.key === "Enter") {
            return this.handleKeyDownEnter(change, event);
        }

        // undo / redo for Windows
        if (event.ctrlKey && event.key === "z") {
            return this.handleKeyDownUndo(change, event);
        }
        if (event.ctrlKey && event.key === "y") {
            return this.handleKeyDownRedo(change, event);
        }

        // undo / redo for OSX
        if (event.metaKey && event.key === "z") {
            if (event.shiftKey) {
                return this.handleKeyDownRedo(change, event);
            } else {
                return this.handleKeyDownUndo(change, event);
            }
        }
    };

    handleCompositionKeyDown = event => {
        // missing IME composition end event fix
        if (event.key === "Enter") {
            this.handleCompositionKeyDownEnter(event);
        }
    };

    handleCompositionKeyDownEnter = event => {
        event.preventDefault();
        const { value, onChange = sink } = this.props;
        onChange(value.change().stopComposing());
    };

    handleKeyDownSelectAll = (change, event) => {
        event.preventDefault();

        const { onChange = sink } = this.props;
        change.selectAll().save();

        onChange(change);
    };

    handleKeyDownBackspace = (change, event) => {
        event.preventDefault();

        const { value, onChange = sink } = this.props;
        const { selection } = value;

        if (selection.isCollapsed) {
            if (event.metaKey) {
                change
                    .selectBlockBackward()
                    .delete()
                    .save();
            } else if (event.ctrlKey || event.altKey) {
                change
                    .selectWordBackward()
                    .delete()
                    .save();
            } else {
                change
                    .selectCharacterBackward()
                    .delete()
                    .save(SnapshotType.DeleteCharacterBackward);
            }
        } else {
            change.delete().save();
        }

        onChange(change);
    };

    handleKeyDownDelete = (change, event) => {
        event.preventDefault();

        const { value, onChange = sink } = this.props;
        const { selection } = value;

        if (selection.isCollapsed) {
            if (event.metaKey) {
                change
                    .selectBlockForward()
                    .delete()
                    .save();
            } else if (event.ctrlKey || event.altKey) {
                change
                    .selectWordForward()
                    .delete()
                    .save();
            } else {
                change
                    .selectCharacterForward()
                    .delete()
                    .save(SnapshotType.DeleteCharacterForward);
            }
        } else {
            change.delete().save();
        }

        onChange(change);
    };

    handleKeyDownEnter = (change, event) => {
        event.preventDefault();

        const { value, onChange = sink } = this.props;
        const { selection } = value;

        if (selection.isExpanded) {
            change.delete();
        }

        change
            .insertText(SpecialCharacter.BlockEnd, value.getBlockAttributes())
            .save();

        onChange(change);
    };

    handleKeyDownUndo = (change, event) => {
        event.preventDefault();

        const { onChange = sink } = this.props;
        change.undo();

        onChange(change);
    };

    handleKeyDownRedo = (change, event) => {
        event.preventDefault();

        const { onChange = sink } = this.props;
        change.redo();

        onChange(change);
    };

    handleKeyUp = event => {
        // missing selection events in Edge
        if (event.shiftKey && event.key === "End") {
            this.handleKeyUpShiftEnd(event);
        }
    };

    handleKeyUpShiftEnd = () => {
        fixBlockEndSelection(this.onSelect);
    };

    handleCompositionStart = () => {
        const { value, onChange = sink } = this.props;

        const change = value.change().startComposing();

        onChange(change);
    };

    handleCompositionEnd = () => {
        const { value, onChange = sink } = this.props;

        const change = value.change().stopComposing();
        this.afterInput(change);

        onChange(change);
    };

    handleInput = () => {
        const { value, onChange = sink } = this.props;

        if (value.isComposing) {
            return;
        }

        const change = value.change();
        this.afterInput(change);

        onChange(change);
    };

    afterInput = change => {
        const { afterInput = defaultAfterInput } = this.props;

        if (isMobile()) {
            this.afterInputMobile(change);
        } else {
            this.afterInputDefault(change);
        }

        afterInput(change);
    };

    afterInputMobile = change => {
        const {
            tokenizeNode = defaultTokenizeNode,
            tokenizeClassName = defaultTokenizeClassName
        } = this.props;

        // get DOM details

        const nativeSelection = window.getSelection();
        if (
            !nativeSelection ||
            !nativeSelection.anchorNode ||
            !nativeSelection.focusNode
        ) {
            return;
        }

        // get the new content

        const delta = parseNode(this.rootNode, tokenizeNode, tokenizeClassName);
        const diff = change.value.toDelta().diff(delta);

        // get the new selection

        const modelSelection = getModelSelection(
            this.rootNode,
            nativeSelection
        );
        if (modelSelection === null) {
            return;
        }

        // regenerating the key here is a bit slow,
        // but I do not have any better idea for the moment

        change
            .apply(diff)
            .regenerateKey()
            .select(modelSelection.anchorOffset, modelSelection.focusOffset)
            .save();
    };

    afterInputDefault = change => {
        const {
            tokenizeNode = defaultTokenizeNode,
            tokenizeClassName = defaultTokenizeClassName
        } = this.props;

        // get DOM details

        const nativeSelection = window.getSelection();
        if (
            !nativeSelection ||
            !nativeSelection.anchorNode ||
            !nativeSelection.focusNode
        ) {
            return;
        }

        const blockNode = findBlockParentNode(nativeSelection.anchorNode);
        if (!blockNode) {
            return;
        }

        // get the new content

        const delta = parseNode(blockNode, tokenizeNode, tokenizeClassName);

        const { value } = change;
        const { document, selection } = value;

        if (selection.isCollapsed) {
            const pos = document.findDescendantAtOffset(
                selection.offset,
                isBlockNode
            );
            if (pos === null) {
                return;
            }

            // apply changes the selected block

            const { node: blockBefore } = pos;

            const diff = blockBefore.delta.diff(delta, pos.offset);
            if (value.hasInlineStyleOverride) {
                optimizeInsertDelta(diff, value.inlineStyleOverride);
            }

            let blockAfter = blockBefore.apply(diff);
            if (
                blockBefore.isEmpty ||
                nativeSelection.anchorNode.parentNode === blockNode
            ) {
                blockAfter = blockAfter.regenerateKey();
            }

            change.replaceNode(blockAfter, blockBefore);
        } else {
            // reset the document key

            change.regenerateKey();

            // find the selected blocks

            const modelRange = document.findChildrenAtRange(
                selection.offset,
                selection.length,
                isBlockLevelNode
            );

            const blocks = modelRange.map(item => item.node);

            // apply changes the the first selected block

            const blockBefore = blocks.shift();

            const diff = blockBefore.delta.diff(delta);
            if (value.hasInlineStyleOverride) {
                optimizeInsertDelta(diff, value.inlineStyleOverride);
            }

            let blockAfter = blockBefore.apply(diff);
            if (blockBefore.isEmpty) {
                blockAfter = blockAfter.regenerateKey();
            }

            change.replaceNode(blockAfter, blockBefore);

            // delete every other selected block

            blocks.forEach(block => {
                change.removeNode(block);
            });
        }

        const modelSelection = getModelSelection(
            this.rootNode,
            nativeSelection
        );
        if (modelSelection === null) {
            return;
        }

        change.select(modelSelection.anchorOffset, modelSelection.focusOffset);

        change.save(SnapshotType.Input);
    };
}
