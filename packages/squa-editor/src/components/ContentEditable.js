import React, { PureComponent } from "react";

const getEventKey = event => {
  let key = event.key;

  if (key === "Spacebar") {
    key = " ";
  }

  return key;
};

const isPotentialInputEvent = event => {
  if (event.ctrlKey === true || event.metaKey === true) {
    return false;
  }

  const key = getEventKey(event);

  return key.length === 1;
};

export default class ContentEditable extends PureComponent {
  constructor(props) {
    super(props);
  }

  handleKeyDown = event => {
    const { onKeyDown, onBeforeInput } = this.props;

    if (event.defaultPrevented === true) {
      return;
    }

    onKeyDown(event);

    if (event.defaultPrevented === true) {
      return;
    }

    const isInputEvent = isPotentialInputEvent(event);

    if (isInputEvent === false) {
      return;
    }

    onBeforeInput(event);
  };

  handleKeyUp = event => {
    const { onInput } = this.props;

    if (event.defaultPrevented === true) {
      return;
    }

    const isInputEvent = isPotentialInputEvent(event);

    if (isInputEvent === false) {
      return;
    }

    onInput(event);
  };

  setRootNode = node => {
    const { editableRef } = this.props;

    if (node) {
      editableRef(node);
    }
  };

  render() {
    const {
      className,
      spellCheck,
      onFocus,
      onBlur,
      onSelect,
      onMouseDown,
      onCut,
      onPaste,
      onDragStart,
      onDrop,
      onCompositionStart,
      onCompositionEnd,
      children
    } = this.props;
    return (
      <div
        ref={this.setRootNode}
        className={className}
        contentEditable
        suppressContentEditableWarning
        spellCheck={spellCheck}
        onFocus={onFocus}
        onBlur={onBlur}
        onSelect={onSelect}
        onMouseDown={onMouseDown}
        onCut={onCut}
        onPaste={onPaste}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
      >
        {children}
      </div>
    );
  }
}
