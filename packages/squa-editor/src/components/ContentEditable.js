import React, { PureComponent } from "react";

const config = {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true
};

function getEventKey(event) {
  let key = event.key;

  if (key === "Spacebar") {
    key = " ";
  }

  return key;
}

function isPotentialInputEvent(event) {
  if (event.ctrlKey === true || event.metaKey === true) {
    return false;
  }

  const key = getEventKey(event);

  return key.length === 1;
}

export default class ContentEditable extends PureComponent {
  constructor(props) {
    super(props);

    this.isUpdating = false;
    this.observer = new MutationObserver(this.handleMutations);
  }

  handleKeyDown = event => {
    const { onKeyDown, onBeforeInput } = this.props;

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

  handleMutations = () => {
    const { onInput } = this.props;

    if (this.isUpdating) {
      return;
    }

    onInput();
  };

  setRootNode = node => {
    const { editableRef } = this.props;

    editableRef(node);

    this.observer.disconnect();

    if (node) {
      this.observer.observe(node, config);
    }
  };

  componentWillUpdate() {
    this.isUpdating = true;
  }

  componentDidUpdate() {
    window.requestAnimationFrame(() => {
      this.isUpdating = false;
    });
  }

  render() {
    const {
      className,
      spellCheck,
      onFocus,
      onBlur,
      onSelect,
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
        onCut={onCut}
        onPaste={onPaste}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onKeyDown={this.handleKeyDown}
      >
        {children}
      </div>
    );
  }
}
