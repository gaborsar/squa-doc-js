import React, { PureComponent } from "react";

const config = {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true
};

export default class ContentEditable extends PureComponent {
  constructor(props) {
    super(props);

    this.isUpdating = false;
    this.observer = new MutationObserver(this.callback);
  }

  callback = () => {
    if (this.isUpdating) {
      return;
    }

    const { onInput } = this.props;

    onInput();
  };

  editableRef = node => {
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

  componentWillUnmount() {
    this.observer.disconnect();
  }

  render() {
    const {
      className,
      spellCheck,
      onFocus,
      onBlur,
      onSelect,
      onMouseDown,
      onKeyDown,
      onCompositionStart,
      onCompositionEnd,
      onBeforeInput,
      onCut,
      onPaste,
      onDragStart,
      onDrop,
      children
    } = this.props;
    return (
      <div
        ref={this.editableRef}
        className={className}
        contentEditable
        suppressContentEditableWarning
        spellCheck={spellCheck}
        onFocus={onFocus}
        onBlur={onBlur}
        onSelect={onSelect}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onBeforeInput={onBeforeInput}
        onCut={onCut}
        onPaste={onPaste}
        onDragStart={onDragStart}
        onDrop={onDrop}
      >
        {children}
      </div>
    );
  }
}
