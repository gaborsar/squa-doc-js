import React, { PureComponent } from "react";

function isPotentialInputEvent(event) {
  if (event.ctrlKey === true || event.metaKey === true) {
    return false;
  }

  let key = event.key;

  // IE11 uses different keys ...

  if (key === "Spacebar") {
    key = " ";
  }

  return key.length === 1;
}

function removeEventListeners(node, handlers) {
  for (const [type, handler] of handlers) {
    node.removeEventListener(type, handler);
  }
}

function addEventListeners(node, handlers) {
  for (const [type, handler] of handlers) {
    node.addEventListener(type, handler);
  }
}

export default class ContentEditable extends PureComponent {
  constructor(props) {
    super(props);
    this.node = null;
  }

  handleCompositionStart = event => {
    const { onCompositionStart } = this.props;

    onCompositionStart(event);
  };

  handleCompositionEnd = event => {
    const { onCompositionEnd } = this.props;

    onCompositionEnd(event);
  };

  handleKeyDown = event => {
    const { onKeyDown, onBeforeInput } = this.props;

    onKeyDown(event);

    if (!event.defaultPrevented && isPotentialInputEvent(event)) {
      onBeforeInput(event);
    }
  };

  handleInput = event => {
    const { onInput } = this.props;

    onInput(event);
  };

  editableRef = node => {
    const { editableRef } = this.props;

    editableRef(node);

    const handlers = [
      ["compositionstart", this.handleCompositionStart],
      ["compositionend", this.handleCompositionEnd],
      ["keydown", this.handleKeyDown],
      ["input", this.handleInput],
      ["textinput", this.handleInput]
    ];

    if (this.node) {
      removeEventListeners(node, handlers);
    }

    this.node = node;

    if (this.node) {
      addEventListeners(node, handlers);
    }
  };

  render() {
    const {
      className,
      spellCheck,
      disabled,
      onFocus,
      onBlur,
      onSelect,
      onCut,
      onPaste,
      onDragStart,
      onDrop,
      children
    } = this.props;
    return (
      <div
        contentEditable={!disabled}
        suppressContentEditableWarning
        className={className}
        spellCheck={spellCheck}
        onFocus={onFocus}
        onBlur={onBlur}
        onSelect={onSelect}
        onCut={onCut}
        onPaste={onPaste}
        onDragStart={onDragStart}
        onDrop={onDrop}
        ref={this.editableRef}
      >
        {children}
      </div>
    );
  }
}
