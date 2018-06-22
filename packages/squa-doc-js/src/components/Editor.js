import React, { PureComponent } from "react";
import joinClassNames from "classnames";

import SpecialCharacter from "../model/SpecialCharacter";
import { isBlockNode, isBlockOrBlockEmbedNode } from "../model/Predicates";

import ErrorBoundary from "./ErrorBoundary";
import ContentEditable from "./ContentEditable";
import Document from "./Document";

import getRange from "../dom/getRange";
import getNativeRange from "../dom/getNativeRange";
import findBlockParentNode from "../dom/findBlockParentNode";

import parseNode from "../parser/parseNode";
import parseHTML from "../parser/parseHTML";

import isMobile from "./utils/isMobile";
import optimizeInsertDelta from "./utils/optimizeInsertDelta";
import optimizeFragmentDelta from "./utils/optimizeFragmentDelta";

import defaultRenderNode from "../defaults/renderNode";
import defaultRenderMark from "../defaults/renderMark";
import defaultOnKeyDown from "../defaults/onKeyDown";
import defaultTokenizeNode from "../defaults/tokenizeNode";
import defaultTokenizeClassName from "../defaults/tokenizeClassName";
import defaultAfterInput from "../defaults/afterInput";

import "./Editor.scss";

const sink = () => {};

const preventDefault = event => {
  event.preventDefault();
};

export default class Editor extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false
    };

    this.rootNode = null;
    this.isMouseDown = false;
  }

  setRootNode = rootNode => {
    this.rootNode = rootNode;
  };

  focus = () => {
    if (this.rootNode) {
      this.rootNode.focus();
    }
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
    const { value, onChange = sink } = this.props;

    if (value.isComposing()) {
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

    if (!this.rootNode) {
      return;
    }

    const editorRange = getRange(
      this.rootNode,
      nativeSelection.anchorNode,
      nativeSelection.anchorOffset,
      nativeSelection.focusNode,
      nativeSelection.focusOffset
    );

    const editorSelection = value.getSelection();

    if (
      editorSelection.getAnchorOffset() === editorRange.anchorOffset &&
      editorSelection.getFocusOffset() === editorRange.focusOffset
    ) {
      return;
    }

    const change = value.change();

    change.select(
      editorRange.anchorOffset,
      editorRange.focusOffset - editorRange.anchorOffset
    );

    onChange(change);
  };

  updateSelection() {
    if (!this.rootNode) {
      return;
    }

    const { value } = this.props;

    const editorSelection = value.getSelection();

    const domRange = getNativeRange(
      this.rootNode,
      editorSelection.getAnchorOffset(),
      editorSelection.getFocusOffset()
    );

    const nativeSelection = window.getSelection();

    if (!nativeSelection) {
      return;
    }
    if (
      domRange.anchorNode === nativeSelection.anchorNode &&
      domRange.anchorOffset === nativeSelection.anchorOffset &&
      domRange.focusNode === nativeSelection.focusNode &&
      domRange.focusOffset === nativeSelection.focusOffset
    ) {
      return;
    }

    if (nativeSelection.setBaseAndExtent) {
      nativeSelection.setBaseAndExtent(
        domRange.anchorNode,
        domRange.anchorOffset,
        domRange.focusNode,
        domRange.focusOffset
      );
    } else if (nativeSelection.extend) {
      const nativeRange = document.createRange();

      nativeRange.setStart(domRange.anchorNode, domRange.anchorOffset);

      nativeSelection.removeAllRanges();
      nativeSelection.addRange(nativeRange);
      nativeSelection.extend(domRange.focusNode, domRange.focusOffset);
    } else {
      const nativeRange = document.createRange();

      if (editorSelection.isBackward()) {
        nativeRange.setStart(domRange.focusNode, domRange.focusOffset);
        nativeRange.setEnd(domRange.anchorNode, domRange.anchorOffset);
      } else {
        nativeRange.setStart(domRange.anchorNode, domRange.anchorOffset);
        nativeRange.setEnd(domRange.focusNode, domRange.focusOffset);
      }

      nativeSelection.removeAllRanges();
      nativeSelection.addRange(nativeRange);
    }
  }

  handleCompositionKeyDownEnter = event => {
    const { value, onChange = sink } = this.props;

    event.preventDefault();

    onChange(value.change().stopComposing());
  };

  handleCompositionKeyDown = event => {
    // missing IME composition end event fix

    if (event.key === "Enter") {
      return this.handleCompositionKeyDownEnter(event);
    }
  };

  handleKeyDownBackspace = (change, event) => {
    const { value, onChange = sink } = this.props;

    event.preventDefault();

    if (value.getSelection().isCollapsed()) {
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
          .save("delete_character_backward");
      }
    } else {
      change.delete().save();
    }

    onChange(change);
  };

  handleKeyDownDelete = (change, event) => {
    const { value, onChange = sink } = this.props;

    event.preventDefault();

    if (value.getSelection().isCollapsed()) {
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
          .save("delete_character_forward");
      }
    } else {
      change.delete().save();
    }

    onChange(change);
  };

  handleKeyDownEnter = (change, event) => {
    const { value, onChange = sink } = this.props;

    event.preventDefault();

    if (!value.getSelection().isCollapsed()) {
      change.delete();
    }

    change
      .insertText(SpecialCharacter.BlockEnd, value.getBlockAttributes())
      .save();

    onChange(change);
  };

  handleKeyDownUndo = (change, event) => {
    const { onChange = sink } = this.props;

    event.preventDefault();

    change.undo();

    onChange(change);
  };

  handleKeyDownRedo = (change, event) => {
    const { onChange = sink } = this.props;

    event.preventDefault();

    change.redo();

    onChange(change);
  };

  handleKeyDown = event => {
    const { value, onKeyDown = defaultOnKeyDown, onChange = sink } = this.props;

    if (value.isComposing()) {
      return this.handleCompositionKeyDown(event);
    }

    const change = value.change();

    if (onKeyDown(change, event)) {
      return onChange(change);
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

  afterInputMobile = change => {
    const {
      tokenizeNode = defaultTokenizeNode,
      tokenizeClassName = defaultTokenizeClassName
    } = this.props;

    // get DOM details

    const nativeSelection = window.getSelection();

    if (!nativeSelection) {
      return;
    }

    const {
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset
    } = nativeSelection;

    if (!anchorNode || !focusNode) {
      return;
    }

    // get the new content

    const delta = parseNode(this.rootNode, tokenizeNode, tokenizeClassName);

    const diff = change
      .getValue()
      .toDelta()
      .diff(delta);

    // get the new selection

    const editorRange = getRange(
      this.rootNode,
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset
    );

    // regenerating the key here is a bit slow,
    // but I do not have any better idea for the moment

    change
      .apply(diff)
      .regenerateKey()
      .select(
        editorRange.anchorOffset,
        editorRange.focusOffset - editorRange.anchorOffset
      )
      .save();
  };

  afterInputDefault = change => {
    const {
      tokenizeNode = defaultTokenizeNode,
      tokenizeClassName = defaultTokenizeClassName
    } = this.props;

    // get DOM details

    const nativeSelection = window.getSelection();

    if (!nativeSelection) {
      return;
    }

    const {
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset
    } = nativeSelection;

    if (!anchorNode || !focusNode) {
      return;
    }

    const blockNode = findBlockParentNode(nativeSelection.anchorNode);

    if (!blockNode) {
      return;
    }

    const delta = parseNode(blockNode, tokenizeNode, tokenizeClassName);

    const value = change.getValue();

    const document = value.getDocument();
    const selection = value.getSelection();

    if (selection.isCollapsed()) {
      const pos = document.findChildAtOffset(
        selection.getOffset(),
        isBlockNode
      );

      if (pos === null) {
        return;
      }

      const blockBefore = pos.getNode();

      // apply changes the selected block

      const diff = blockBefore.getDelta().diff(delta);

      if (value.hasInlineStyleOverride()) {
        optimizeInsertDelta(diff, value.getInlineStyleOverride());
      }

      let blockAfter = blockBefore.apply(diff);

      if (blockBefore.isEmpty()) {
        blockAfter = blockAfter.regenerateKey();
      }

      change.replaceNode(blockAfter, blockBefore);
    } else {
      // reset the document key

      change.regenerateKey();

      // find the selected blocks

      const modelRange = document.findChildrenAtRange(
        selection.getOffset(),
        selection.getLength(),
        isBlockOrBlockEmbedNode
      );

      const blocks = modelRange.map(item => item.getNode());

      // apply changes the the first selected block

      const blockBefore = blocks.shift();

      const diff = blockBefore.getDelta().diff(delta);

      if (value.hasInlineStyleOverride()) {
        optimizeInsertDelta(diff, value.getInlineStyleOverride());
      }

      let blockAfter = blockBefore.apply(diff);

      if (blockBefore.isEmpty()) {
        blockAfter = blockAfter.regenerateKey();
      }

      change.replaceNode(blockAfter, blockBefore);

      // delete every other selected block

      blocks.forEach(block => {
        change.removeNode(block);
      });
    }

    const editorRange = getRange(
      this.rootNode,
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset
    );

    change.select(
      editorRange.anchorOffset,
      editorRange.focusOffset - editorRange.anchorOffset
    );

    change.save("input");
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

    if (value.isComposing()) {
      return;
    }

    const change = value.change();

    this.afterInput(change);

    onChange(change);
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

  handleCut = () => {
    const { value, onChange = sink } = this.props;

    const change = value.change().startComposing();

    onChange(change);

    window.requestAnimationFrame(this.afterCut);
  };

  handlePasteHTML = (change, event) => {
    const {
      tokenizeNode = defaultTokenizeNode,
      tokenizeClassName = defaultTokenizeClassName,
      onChange = sink
    } = this.props;

    event.preventDefault();

    const data = event.clipboardData.getData("text/html");

    const fragment = parseHTML(data, tokenizeNode, tokenizeClassName);

    optimizeFragmentDelta(fragment);

    if (
      !change
        .getValue()
        .getSelection()
        .isCollapsed()
    ) {
      change.delete();
    }

    change.insertFragment(fragment).save();

    onChange(change);
  };

  handlePasteText = (change, event) => {
    const { onChange = sink } = this.props;

    event.preventDefault();

    const value = change.getValue();

    if (!value.getSelection().isCollapsed()) {
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

  handlePaste = event => {
    const { value, onPaste = sink, onChange = sink } = this.props;

    const change = value.change();

    if (onPaste(change, event)) {
      return onChange(change);
    }

    if (event.clipboardData.types.indexOf("text/html") !== -1) {
      return this.handlePasteHTML(change, event);
    }

    if (event.clipboardData.types.indexOf("text/plain") !== -1) {
      return this.handlePasteText(change, event);
    }
  };

  componentDidUpdate() {
    this.updateSelection();
  }

  renderPlaceholder() {
    const { value, placeholder } = this.props;

    if (placeholder && value.isEditing() && value.getDocument().isPristine()) {
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

  render() {
    const {
      disabled = false,
      spellCheck = true,
      value,
      onChange,
      renderNode = defaultRenderNode,
      renderMark = defaultRenderMark
    } = this.props;
    const { isFocused } = this.state;
    const document = value.getDocument();
    return (
      <div
        className={joinClassNames("SquaDocJs-editor", {
          "SquaDocJs-editor--focused": isFocused
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
            onCompositionStart={this.handleCompositionStart}
            onCompositionEnd={this.handleCompositionEnd}
            onKeyDown={this.handleKeyDown}
            onInput={this.handleInput}
          >
            <Document
              key={document.getKey()}
              node={document}
              createChange={this.createChange}
              onChange={onChange}
              renderNode={renderNode}
              renderMark={renderMark}
            />
          </ContentEditable>
        </ErrorBoundary>
      </div>
    );
  }
}
