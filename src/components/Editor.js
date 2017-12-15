import React, { PureComponent } from "react";
import ErrorBoundary from "./ErrorBoundary";
import Document from "./Document";
import getRange from "../dom/getRange";
import getNativeRange from "../dom/getNativeRange";
import findBlockParentNode from "../dom/findBlockParentNode";
import parseNode from "../parser/parseNode";
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
  }

  setRootNode(rootNode) {
    this.rootNode = rootNode;
  }

  onSelect(event) {
    const { value, onSelect = sink, onChange = sink } = this.props;
    const { selection: editorSelection } = value;

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

    event.preventDefault();

    const change = value
      .change()
      .insert(EOL)
      .save("input");

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

  onCompositionStart(event) {
    const { value, onCompositionStart = sink, onChange = sink } = this.props;

    const change = value.change().setMode(MODE_COMPOSITION);

    onCompositionStart(change, event, this);

    onChange(change);
  }

  onCompositionEnd(event) {
    const { value, onCompositionEnd = sink, onChange = sink } = this.props;

    const change = value.change().setMode(MODE_EDIT);

    this.handleInput(change);

    onCompositionEnd(change, event, this);

    onChange(change);
  }

  onBeforeInput(event) {
    const { value, onBeforeInput = sink, onChange = sink } = this.props;
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
      change.insert(event.data).save("input");
    }

    onBeforeInput(change, event, this);

    onChange(change);
  }

  onInput(event) {
    const { value, onInput = sink, onChange = sink } = this.props;

    if (value.mode === MODE_COMPOSITION) {
      return;
    }

    const change = value.change();

    this.handleInput(change);

    onInput(change, event, this);

    onChange(change);
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
            onDragStart={preventDefault}
            onDrop={preventDefault}
          >
            <Document
              node={document}
              key={document.key}
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
