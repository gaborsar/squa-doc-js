import React, { PureComponent } from "react";
import joinClassNames from "classnames";
import ErrorBoundary from "./ErrorBoundary";
import ContentEditable from "./ContentEditable";
import Document from "./Document";
import getRange from "../dom/getRange";
import getNativeRange from "../dom/getNativeRange";
import findBlockParentNode from "../dom/findBlockParentNode";
import parseNode from "../parser/parseNode";
import parseHTML from "../parser/parseHTML";
import optimizeInsertDelta from "./utils/optimizeInsertDelta";
import optimizeFragmentDelta from "./utils/optimizeFragmentDelta";
import defaultOnKeyDown from "../defaults/handlers/onKeyDown";

import {
  EOL,
  KEY_BACKSPACE,
  KEY_DELETE,
  KEY_ENTER,
  KEY_LEFT,
  KEY_RIGHT,
  KEY_Z,
  EDITOR_MODE_EDIT,
  EDITOR_MODE_COMPOSITION
} from "../constants";

import "./Editor.css";

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
    const { selection: editorSelection } = value;

    if (value.mode === EDITOR_MODE_COMPOSITION) {
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

    if (
      editorSelection.anchorOffset === editorRange.anchorOffset &&
      editorSelection.focusOffset === editorRange.focusOffset
    ) {
      return;
    }

    const change = value.change();

    change.select(editorRange.anchorOffset, editorRange.focusOffset);

    onChange(change);
  };

  updateSelection() {
    if (!this.rootNode) {
      return;
    }

    const { value } = this.props;
    const { selection: editorSelection } = value;
    const { isBackward } = editorSelection;

    const domRange = getNativeRange(
      this.rootNode,
      editorSelection.anchorOffset,
      editorSelection.focusOffset
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

      if (isBackward) {
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

  handleMouseMove = event => {
    if (!this.isMouseDown) {
      return;
    }

    requestAnimationFrame(() => this.handleSelect(event));
  };

  handleMouseUp = () => {
    if (!this.isMouseDown) {
      return;
    }

    this.isMouseDown = false;

    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  };

  handleMouseDown = event => {
    if (this.isMouseDown) {
      return;
    }

    this.isMouseDown = true;

    requestAnimationFrame(() => this.handleSelect(event));

    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  };

  handleKeyDownBackspace = (change, event) => {
    const { value, afterKeyDownBackspace = sink, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    if (isCollapsed) {
      if (event.metaKey) {
        change.selectBlockBackward();
      } else if (event.altKey) {
        change.selectWordBackward();
      } else {
        change.selectCharacterBackward();
      }
    }

    change.delete();

    afterKeyDownBackspace(change, event);

    if (isCollapsed && !event.metaKey && !event.altKey) {
      change.save("delete_character_backward");
    } else {
      change.save();
    }

    onChange(change);
  };

  handleKeyDownDelete = (change, event) => {
    const { value, afterKeyDownDelete = sink, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    if (isCollapsed) {
      if (event.metaKey) {
        change.selectBlockForward();
      } else if (event.altKey) {
        change.selectWordForward();
      } else {
        change.selectCharacterForward();
      }
    }

    change.delete();

    afterKeyDownDelete(change, event);

    if (isCollapsed && !event.metaKey && !event.altKey) {
      change.save("delete_character_forward");
    } else {
      change.save();
    }

    onChange(change);
  };

  handleKeyDownEnter = (change, event) => {
    const { value, afterKeyDownEnter = sink, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    if (!isCollapsed) {
      change.delete();
    }

    const format = value.getFormat();

    change.insertText(EOL, format);

    afterKeyDownEnter(change, event);

    change.save();

    onChange(change);
  };

  handleKeyDownLeft = (change, event) => {
    const { value, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    if (event.metaKey || event.altKey || event.shiftKey || !isCollapsed) {
      return;
    }

    event.preventDefault();

    change.moveCursorLeft();

    onChange(change);
  };

  handleKeyDownRight = (change, event) => {
    const { value, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    if (event.metaKey || event.altKey || event.shiftKey || !isCollapsed) {
      return;
    }

    event.preventDefault();

    change.moveCursorRight();

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
    const { value, onKeyDown = sink, onChange = sink } = this.props;

    const change = value.change();

    if (onKeyDown(change, event) || defaultOnKeyDown(change, event)) {
      return onChange(change);
    }

    if (event.keyCode === KEY_BACKSPACE) {
      return this.handleKeyDownBackspace(change, event);
    }

    if (event.keyCode === KEY_DELETE) {
      return this.handleKeyDownDelete(change, event);
    }

    if (event.keyCode === KEY_ENTER) {
      return this.handleKeyDownEnter(change, event);
    }

    if (event.keyCode === KEY_LEFT) {
      return this.handleKeyDownLeft(change, event);
    }

    if (event.keyCode === KEY_RIGHT) {
      return this.handleKeyDownRight(change, event);
    }

    if (event.metaKey && event.key === "z") {
      return this.handleKeyDownUndo(change, event);
    }

    if (event.metaKey && event.key === "Z") {
      return this.handleKeyDownRedo(change, event);
    }

    if (event.ctrlKey && event.key === "z") {
      return this.handleKeyDownUndo(change, event);
    }

    if (event.ctrlKey && event.key === "y") {
      return this.handleKeyDownRedo(change, event);
    }
  };

  afterInput = change => {
    const { tokenizeNode: customTokenizeNode } = this.props;
    const { value } = change;
    const { document, inlineStyleOverride } = value;

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

    const blockBefore = document.getChildByKey(
      blockNode.getAttribute("data-key")
    );

    if (!blockBefore) {
      return;
    }

    const delta = parseNode(blockNode, customTokenizeNode);

    const diff = blockBefore.delta.diff(delta);

    if (inlineStyleOverride) {
      optimizeInsertDelta(diff, inlineStyleOverride);
    }

    let blockAfter = blockBefore.apply(diff);

    if (blockBefore.length === EOL.length) {
      blockAfter = blockAfter.regenerateKey();
    }

    const editorRange = getRange(
      this.rootNode,
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset
    );

    change
      .replaceBlock(blockAfter, blockBefore)
      .select(editorRange.anchorOffset, editorRange.focusOffset)
      .save("input");
  };

  handleCompositionStart = () => {
    const { value, onChange = sink } = this.props;

    const change = value.change().setMode(EDITOR_MODE_COMPOSITION);

    onChange(change);
  };

  handleCompositionEnd = () => {
    const { value, onChange = sink } = this.props;

    const change = value.change().setMode(EDITOR_MODE_EDIT);

    this.afterInput(change);

    onChange(change);
  };

  handleBeforeInput = () => {
    const { value, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    if (value.mode === EDITOR_MODE_COMPOSITION) {
      return;
    }

    if (isCollapsed) {
      return;
    }

    const change = value
      .change()
      .delete()
      .save();

    onChange(change);
  };

  handleInput = () => {
    const { value, onChange = sink } = this.props;

    if (value.mode === EDITOR_MODE_COMPOSITION) {
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
      .setMode(EDITOR_MODE_EDIT)
      .regenerateKey()
      .delete()
      .save();

    onChange(change);
  };

  handleCut = () => {
    const { value, onChange = sink } = this.props;

    const change = value.change().setMode(EDITOR_MODE_COMPOSITION);

    onChange(change);

    window.requestAnimationFrame(this.afterCut);
  };

  handlePasteHTML = (change, event) => {
    const {
      value,
      tokenizeNode: customTokenizeNode,
      onChange = sink
    } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    const data = event.clipboardData.getData("text/html");

    const fragment = parseHTML(data, customTokenizeNode);

    optimizeFragmentDelta(fragment);

    if (!isCollapsed) {
      change.delete();
    }

    change.insertFragment(fragment).save();

    onChange(change);
  };

  handlePasteText = (change, event) => {
    const { value, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    const data = event.clipboardData.getData("text/plain");

    if (!isCollapsed) {
      change.delete();
    }

    const format = value.getFormat();

    change.insertText(data, format).save();

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

  replaceBlockByKey = (blockKey, newBlock) => {
    const { value, onChange = sink } = this.props;

    const change = value
      .change()
      .replaceBlockByKey(blockKey, newBlock)
      .save();

    onChange(change);
  };

  replaceInlineByKey = (blockKey, inlineKey, newInline) => {
    const { value, onChange = sink } = this.props;

    const change = value
      .change()
      .replaceInlineByKey(blockKey, inlineKey, newInline)
      .save();

    onChange(change);
  };

  formatBlockByKey = (blockKey, attributes) => {
    const { value, onChange = sink } = this.props;

    const change = value
      .change()
      .formatBlockByKey(blockKey, attributes)
      .save();

    onChange(change);
  };

  formatInlineByKey = (blockKey, inlineKey, attributes) => {
    const { value, onChange = sink } = this.props;

    const change = value
      .change()
      .formatInlineByKey(blockKey, inlineKey, attributes)
      .save();

    onChange(change);
  };

  deleteBlockByKey = blockKey => {
    const { value, onChange = sink } = this.props;

    const change = value
      .change()
      .deleteBlockByKey(blockKey)
      .save();

    onChange(change);
  };

  deleteInlineByKey = (blockKey, inlineKey) => {
    const { value, onChange = sink } = this.props;

    const change = value
      .change()
      .deleteInlineByKey(blockKey, inlineKey)
      .save();

    onChange(change);
  };

  componentDidUpdate() {
    this.updateSelection();
  }

  renderPlaceholder() {
    const { value: { document: { isEmpty } }, placeholder } = this.props;

    if (isEmpty && placeholder) {
      return (
        <span className="ed-placeholder" onClick={this.handlePlaceholderClick}>
          {placeholder}
        </span>
      );
    }
  }

  render() {
    const {
      value: { document },
      blockStyleFn,
      inlineStyleFn,
      blockRenderFn,
      embedRenderFn
    } = this.props;
    const { isFocused } = this.state;
    return (
      <div
        className={joinClassNames("ed-editor", {
          "ed-editor--focused": isFocused
        })}
      >
        <ErrorBoundary>
          {this.renderPlaceholder()}
          <ContentEditable
            editableRef={this.setRootNode}
            className="ed-editable"
            spellCheck
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onSelect={this.handleSelect}
            onMouseDown={this.handleMouseDown}
            onKeyDown={this.handleKeyDown}
            onCompositionStart={this.handleCompositionStart}
            onCompositionEnd={this.handleCompositionEnd}
            onBeforeInput={this.handleBeforeInput}
            onInput={this.handleInput}
            onCut={this.handleCut}
            onPaste={this.handlePaste}
            onDragStart={preventDefault}
            onDrop={preventDefault}
          >
            <Document
              key={document.key}
              node={document}
              replaceBlockByKey={this.replaceBlockByKey}
              formatBlockByKey={this.formatBlockByKey}
              deleteBlockByKey={this.deleteBlockByKey}
              replaceInlineByKey={this.replaceInlineByKey}
              formatInlineByKey={this.formatInlineByKey}
              deleteInlineByKey={this.deleteInlineByKey}
              blockRenderFn={blockRenderFn}
              embedRenderFn={embedRenderFn}
              blockStyleFn={blockStyleFn}
              inlineStyleFn={inlineStyleFn}
            />
          </ContentEditable>
        </ErrorBoundary>
      </div>
    );
  }
}
