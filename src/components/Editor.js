import React, { PureComponent } from "react";
import Delta from "quill-delta";
import ErrorBoundary from "./ErrorBoundary";
import Document from "./Document";
import getRange from "../dom/getRange";
import getNativeRange from "../dom/getNativeRange";
import findBlockParentNode from "../dom/findBlockParentNode";
import parseNode from "../parser/parseNode";
import parseHTML from "../parser/parseHTML";
import defaultOnKeyDown from "../plugins/handlers/onKeyDown";

import {
  EOL,
  KEY_BACKSPACE,
  KEY_DELETE,
  KEY_ENTER,
  KEY_Z,
  EDITOR_MODE_EDIT,
  EDITOR_MODE_COMPOSITION
} from "../constants";

import "./Editor.css";

const sink = () => {};

const preventDefault = event => event.preventDefault();

export default class Editor extends PureComponent {
  constructor(props) {
    super(props);

    this.rootNode = null;
    this.isMouseDown = false;
  }

  setRootNode = rootNode => {
    this.rootNode = rootNode;
  };

  onSelect = () => {
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

  onMouseMove = event => {
    if (!this.isMouseDown) {
      return;
    }

    requestAnimationFrame(() => this.onSelect(event));
  };

  onMouseUp = () => {
    if (!this.isMouseDown) {
      return;
    }

    this.isMouseDown = false;

    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  };

  onMouseDown = event => {
    if (this.isMouseDown) {
      return;
    }

    this.isMouseDown = true;

    requestAnimationFrame(() => this.onSelect(event));

    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  };

  onKeyDownBackspace = (change, event) => {
    const { value, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    if (isCollapsed) {
      if (event.metaKey) {
        change
          .selectBlockBackward()
          .delete()
          .save();
      } else if (event.altKey) {
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

  onKeyDownDelete = (change, event) => {
    const { value, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    if (isCollapsed) {
      if (event.metaKey) {
        change
          .selectBlockForward()
          .delete()
          .save();
      } else if (event.altKey) {
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

  onKeyDownEnter = (change, event) => {
    const { value, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    if (!isCollapsed) {
      change.delete();
    }

    change.insertText(EOL, value.getFormat()).save();

    onChange(change);
  };

  onKeyDownUndo = (change, event) => {
    const { onChange = sink } = this.props;

    event.preventDefault();

    change.undo();

    onChange(change);
  };

  onKeyDownRedo = (change, event) => {
    const { onChange = sink } = this.props;

    event.preventDefault();

    change.redo();

    onChange(change);
  };

  onKeyDown = event => {
    const { value, onKeyDown = defaultOnKeyDown, onChange = sink } = this.props;

    const change = value.change();

    if (onKeyDown(change, event, this)) {
      return onChange(change);
    }

    if (event.keyCode === KEY_BACKSPACE) {
      return this.onKeyDownBackspace(change, event);
    }

    if (event.keyCode === KEY_DELETE) {
      return this.onKeyDownDelete(change, event);
    }

    if (event.keyCode === KEY_ENTER) {
      return this.onKeyDownEnter(change, event);
    }

    if (event.keyCode === KEY_Z && event.metaKey) {
      if (event.shiftKey) {
        return this.onKeyDownRedo(change, event);
      } else {
        return this.onKeyDownUndo(change, event);
      }
    }
  };

  handleInput = change => {
    const { tokenizeNode: customTokenizeNode } = this.props;
    const { value } = change;
    const { document } = value;

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

  onCompositionStart = () => {
    const { value, onChange = sink } = this.props;

    const change = value.change().setMode(EDITOR_MODE_COMPOSITION);

    onChange(change);
  };

  onCompositionEnd = () => {
    const { value, onChange = sink } = this.props;

    const change = value.change().setMode(EDITOR_MODE_EDIT);

    this.handleInput(change);

    onChange(change);
  };

  onBeforeInput = event => {
    const { value, onChange = sink } = this.props;
    const { hasInlineStyleOverride } = value;
    const { selection: { isCollapsed } } = value;

    if (value.mode === EDITOR_MODE_COMPOSITION) {
      return;
    }

    if (isCollapsed && !hasInlineStyleOverride) {
      return;
    }

    event.preventDefault();

    const attributes = value.getFormat();

    const change = value
      .change()
      .delete()
      .save();

    if (event.data) {
      change.insertText(event.data, attributes).save("input");
    }

    onChange(change);
  };

  onInput = () => {
    const { value, onChange = sink } = this.props;

    if (value.mode === EDITOR_MODE_COMPOSITION) {
      return;
    }

    const change = value.change();

    this.handleInput(change);

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

  onCut = () => {
    const { value, onChange = sink } = this.props;

    const change = value.change().setMode(EDITOR_MODE_COMPOSITION);

    onChange(change);

    window.requestAnimationFrame(this.afterCut);
  };

  onPasteHTML = (change, event) => {
    const {
      value,
      tokenizeNode: customTokenizeNode,
      onChange = sink
    } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    const data = event.clipboardData.getData("text/html");

    let fragment = parseHTML(data, customTokenizeNode);

    if (fragment.ops.length) {
      const op = fragment.ops[fragment.ops.length - 1];

      if (typeof op.insert === "string") {
        const { insert: text } = op;

        if (text[text.length - 1] === EOL) {
          fragment = fragment.compose(
            new Delta().retain(fragment.length() - 1).delete(1)
          );
        }
      }
    }

    if (!isCollapsed) {
      change.delete();
    }

    change.insertFragment(fragment).save();

    onChange(change);
  };

  onPasteText = (change, event) => {
    const { value, onChange = sink } = this.props;
    const { selection: { isCollapsed } } = value;

    event.preventDefault();

    const data = event.clipboardData.getData("text/plain");

    if (!isCollapsed) {
      change.delete();
    }

    change.insertText(data, value.getFormat()).save();

    onChange(change);
  };

  onPaste = event => {
    const { value, onPaste = sink, onChange = sink } = this.props;

    const change = value.change();

    if (onPaste(change, event, this)) {
      return onChange(change);
    }

    if (event.clipboardData.types.indexOf("text/html") !== -1) {
      return this.onPasteHTML(change, event);
    }

    if (event.clipboardData.types.indexOf("text/plain") !== -1) {
      return this.onPasteText(change, event);
    }
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

  updateSelection() {
    if (!this.rootNode) {
      return;
    }

    const { value } = this.props;
    const { selection: editorSelection } = value;

    const domRange = getNativeRange(
      this.rootNode,
      editorSelection.anchorOffset,
      editorSelection.focusOffset
    );

    const nativeSelection = window.getSelection();

    if (!nativeSelection) {
      return;
    }

    nativeSelection.removeAllRanges();

    const nativeRange = document.createRange();
    nativeSelection.addRange(nativeRange);

    nativeRange.setStart(domRange.anchorNode, domRange.anchorOffset);
    nativeSelection.extend(domRange.focusNode, domRange.focusOffset);
  }

  componentDidUpdate() {
    this.updateSelection();
  }

  render() {
    const {
      value,
      renderWrapper,
      renderBlock,
      renderEmbed,
      renderMark
    } = this.props;
    const { document } = value;

    return (
      <div className="ed-editor" data-editor>
        <ErrorBoundary>
          <div
            ref={this.setRootNode}
            className="ed-editable"
            contentEditable
            spellCheck
            suppressContentEditableWarning
            onSelect={this.onSelect}
            onMouseDown={this.onMouseDown}
            onKeyDown={this.onKeyDown}
            onCompositionStart={this.onCompositionStart}
            onCompositionEnd={this.onCompositionEnd}
            onBeforeInput={this.onBeforeInput}
            onInput={this.onInput}
            onCut={this.onCut}
            onPaste={this.onPaste}
            onDragStart={preventDefault}
            onDrop={preventDefault}
          >
            <Document
              key={document.key}
              node={document}
              renderWrapper={renderWrapper}
              renderBlock={renderBlock}
              renderEmbed={renderEmbed}
              renderMark={renderMark}
              deleteBlockByKey={this.deleteBlockByKey}
              deleteInlineByKey={this.deleteInlineByKey}
            />
          </div>
        </ErrorBoundary>
      </div>
    );
  }
}
