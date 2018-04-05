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
import defaultRenderNode from "../defaults/renderNode";
import defaultRenderMark from "../defaults/renderMark";
import defaultOnKeyDown from "../defaults/onKeyDown";
import defaultTokenizeNode from "../defaults/tokenizeNode";
import defaultTokenizeClassName from "../defaults/tokenizeClassName";
import { EOL, EDITOR_MODE_EDIT, EDITOR_MODE_COMPOSITION } from "../constants";

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

  handleCompositionKeyDownEnter = event => {
    const { value, onChange = sink } = this.props;

    event.preventDefault();

    const change = value.change().setMode(EDITOR_MODE_EDIT);

    onChange(change);
  };

  handleCompositionKeyDown = event => {
    // missing IME composition end event fix

    if (event.key === "Enter") {
      return this.handleCompositionKeyDownEnter(event);
    }
  };

  handleKeyDownBackspace = (change, event) => {
    const { value, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    if (isCollapsed) {
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
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    if (isCollapsed) {
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
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    if (!isCollapsed) {
      change.delete();
    }

    const format = value.getFormat();

    change.insertText(EOL, format).save();

    onChange(change);
  };

  handleKeyDownLeft = (change, event) => {
    const { onChange = sink } = this.props;

    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    event.preventDefault();

    if (event.shiftKey) {
      change.selectCharacterBackward();
    } else {
      change.moveCursorLeft();
    }

    onChange(change);
  };

  handleKeyDownRight = (change, event) => {
    const { onChange = sink } = this.props;

    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    event.preventDefault();

    if (event.shiftKey) {
      change.selectCharacterForward();
    } else {
      change.moveCursorRight();
    }

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

    if (value.mode === EDITOR_MODE_COMPOSITION) {
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

    if (event.key === "ArrowLeft") {
      return this.handleKeyDownLeft(change, event);
    }

    if (event.key === "ArrowRight") {
      return this.handleKeyDownRight(change, event);
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

  afterInput = change => {
    const {
      tokenizeNode = defaultTokenizeNode,
      tokenizeClassName = defaultTokenizeClassName
    } = this.props;
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

    const delta = parseNode(blockNode, tokenizeNode, tokenizeClassName);

    const diff = blockBefore.delta.diff(delta);

    if (inlineStyleOverride) {
      optimizeInsertDelta(diff, inlineStyleOverride);
    }

    let blockAfter = blockBefore.apply(diff);

    if (blockBefore.isEmpty) {
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
      tokenizeNode = defaultTokenizeNode,
      tokenizeClassName = defaultTokenizeClassName,
      onChange = sink
    } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    const data = event.clipboardData.getData("text/html");

    const fragment = parseHTML(data, tokenizeNode, tokenizeClassName);

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

  componentDidUpdate() {
    this.updateSelection();
  }

  renderPlaceholder() {
    const { value, placeholder } = this.props;
    const { document } = value;

    if (value.mode === EDITOR_MODE_EDIT && placeholder && document.isEmpty) {
      return (
        <span className="ed-placeholder" onClick={this.handlePlaceholderClick}>
          {placeholder}
        </span>
      );
    }
  }

  render() {
    const {
      disabled = false,
      spellCheck = true,
      value: { document, selection: { startOffset, endOffset } },
      onChange,
      renderNode = defaultRenderNode,
      renderMark = defaultRenderMark
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
            onBeforeInput={this.handleBeforeInput}
            onInput={this.handleInput}
          >
            <Document
              key={document.key}
              node={document}
              startOffset={startOffset}
              endOffset={endOffset}
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
