import React, { PureComponent } from "react";
import Delta from "quill-delta";
import ErrorBoundary from "./ErrorBoundary";
import Document from "./Document";
import getRange from "../dom/getRange";
import getNativeRange from "../dom/getNativeRange";
import findBlockParentNode from "../dom/findBlockParentNode";
import parseNode from "../parser/parseNode";
import parseHTML from "../parser/parseHTML";
import { EOL } from "../model/Block";
import { MODE_EDIT, MODE_COMPOSITION } from "../model/Value";

import {
  renderWrapper as defaultRenderWrapper,
  renderBlock as defaultRenderBlock,
  renderEmbed as defaultRenderEmbed,
  renderMark as defaultRenderMark
} from "../plugins/renderer";

import { tokenizeNode as defaultTokenizeNode } from "../plugins/parser";

const sink = () => {};

const preventDefault = event => event.preventDefault();

export default class Editor extends PureComponent {
  constructor(props) {
    super(props);

    this.rootNode = null;
    this.isMouseDown = false;

    this.setRootNode = this.setRootNode.bind(this);

    this.onSelect = this.onSelect.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onCompositionStart = this.onCompositionStart.bind(this);
    this.onCompositionEnd = this.onCompositionEnd.bind(this);
    this.onBeforeInput = this.onBeforeInput.bind(this);
    this.onInput = this.onInput.bind(this);
    this.afterCut = this.afterCut.bind(this);
    this.onCut = this.onCut.bind(this);
    this.onPaste = this.onPaste.bind(this);
  }

  setRootNode(rootNode) {
    this.rootNode = rootNode;
  }

  onSelect(event) {
    const { value, onSelect = sink, onChange = sink } = this.props;
    const { selection: editorSelection } = value;

    if (value.mode === MODE_COMPOSITION) {
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

    onSelect(event, change, this);

    onChange(change);
  }

  onMouseMove(event) {
    if (!this.isMouseDown) {
      return;
    }

    requestAnimationFrame(() => this.onSelect(event));
  }

  onMouseUp() {
    if (!this.isMouseDown) {
      return;
    }

    this.isMouseDown = false;

    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  onMouseDown(event) {
    if (this.isMouseDown) {
      return;
    }

    this.isMouseDown = true;

    requestAnimationFrame(() => this.onSelect(event));

    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  onKeyDownBackspace(event) {
    const { value, onChange = sink } = this.props;
    const { selection } = value;

    event.preventDefault();

    const change = value.change();

    if (selection.isCollapsed) {
      change
        .selectCharacterBackward()
        .delete()
        .save("delete_character_backward");
    } else {
      change.delete().save();
    }

    onChange(change);
  }

  onKeyDownDelete(event) {
    const { value, onChange = sink } = this.props;
    const { selection } = value;

    event.preventDefault();

    const change = value.change();

    if (selection.isCollapsed) {
      change
        .selectCharacterForward()
        .delete()
        .save("delete_character_forward");
    } else {
      change.delete().save();
    }

    onChange(change);
  }

  onKeyDownEnter(event) {
    const { value, onChange = sink } = this.props;
    const { selection } = value;

    event.preventDefault();

    const change = value.change();

    if (!selection.isCollapsed) {
      change.delete();
    }

    change.insert(EOL, value.getBlockFormat()).save();

    onChange(change);
  }

  onKeyDownUndo(event) {
    const { value, onChange = sink } = this.props;

    event.preventDefault();

    const change = value.change().undo();

    onChange(change);
  }

  onKeyDownRedo(event) {
    const { value, onChange = sink } = this.props;

    event.preventDefault();

    const change = value.change().redo();

    onChange(change);
  }

  onKeyDown(event) {
    const { value, onKeyDown = sink, onChange = sink } = this.props;

    if (event.keyCode === 8) {
      return this.onKeyDownBackspace(event);
    }

    if (event.keyCode === 46) {
      return this.onKeyDownDelete(event);
    }

    if (event.keyCode === 13) {
      return this.onKeyDownEnter(event);
    }

    if (event.keyCode === 90 && event.metaKey) {
      if (event.shiftKey) {
        return this.onKeyDownRedo(event);
      } else {
        return this.onKeyDownUndo(event);
      }
    }

    const change = value.change();

    if (onKeyDown(change, event, this)) {
      onChange(change);
    }
  }

  handleInput(change) {
    const { tokenizeNode = defaultTokenizeNode } = this.props;
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

    const blockBefore = document.findChildByKey(
      blockNode.getAttribute("data-key")
    );

    if (!blockBefore) {
      return;
    }

    const delta = parseNode(blockNode, tokenizeNode);

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
  }

  onCompositionStart() {
    const { value, onChange = sink } = this.props;

    const change = value.change().setMode(MODE_COMPOSITION);

    onChange(change);
  }

  onCompositionEnd() {
    const { value, onChange = sink } = this.props;

    const change = value.change().setMode(MODE_EDIT);

    this.handleInput(change);

    onChange(change);
  }

  onBeforeInput(event) {
    const { value, onChange = sink } = this.props;
    const { selection } = value;

    if (value.mode === MODE_COMPOSITION) {
      return;
    }

    if (selection.isCollapsed) {
      return;
    }

    event.preventDefault();

    const change = value
      .change()
      .delete()
      .save();

    if (event.data) {
      change.insert(event.data, value.getInlineFormat()).save("input");
    }

    onChange(change);
  }

  onInput() {
    const { value, onChange = sink } = this.props;

    if (value.mode === MODE_COMPOSITION) {
      return;
    }

    const change = value.change();

    this.handleInput(change);

    onChange(change);
  }

  afterCut() {
    const { value, onChange = sink } = this.props;

    const change = value
      .change()
      .setMode(MODE_EDIT)
      .regenerateKey()
      .delete()
      .save();

    onChange(change);
  }

  onCut() {
    const { value, onChange = sink } = this.props;

    const change = value.change().setMode(MODE_COMPOSITION);

    onChange(change);

    window.requestAnimationFrame(this.afterCut);
  }

  onPasteHTML(event) {
    const {
      value,
      tokenizeNode = defaultTokenizeNode,
      onChange = sink
    } = this.props;
    const { selection } = value;

    event.preventDefault();

    const data = event.clipboardData.getData("text/html");

    let fragment = parseHTML(data, tokenizeNode);

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

    const change = value.change();

    if (!selection.isCollapsed) {
      change.delete();
    }

    change.insertFragment(fragment).save();

    onChange(change);
  }

  onPasteText(event) {
    const { value, onChange = sink } = this.props;
    const { selection } = value;

    event.preventDefault();

    const data = event.clipboardData.getData("text/plain");

    const change = value.change();

    if (!selection.isCollapsed) {
      change.delete();
    }

    change.insert(data, value.getFormat()).save();

    change.save();

    onChange(change);
  }

  onPaste(event) {
    const { value, onPaste = sink, onChange = sink } = this.props;

    if (event.clipboardData.types.indexOf("text/html") !== -1) {
      return this.onPasteHTML(event);
    }

    if (event.clipboardData.types.indexOf("text/plain") !== -1) {
      return this.onPasteText(event);
    }

    const change = value.change();

    if (onPaste(change, event, this)) {
      onChange(change);
    }
  }

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
      renderWrapper = defaultRenderWrapper,
      renderBlock = defaultRenderBlock,
      renderEmbed = defaultRenderEmbed,
      renderMark = defaultRenderMark
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
            />
          </div>
        </ErrorBoundary>
      </div>
    );
  }
}