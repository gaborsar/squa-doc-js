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

  handleKeyDown = event => {
    const { onBeforeInput, onKeyDown } = this.props;

    if (!event.ctrlKey && !event.metaKey && event.key.length === 1) {
      onBeforeInput(event);
    } else {
      onKeyDown(event);
    }
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
      onCompositionStart,
      onCompositionEnd,
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
        onKeyDown={this.handleKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
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
