import React, { PureComponent } from "react";

export default class ContentEditable extends PureComponent {
    node = null;

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
            onKeyDown,
            onKeyUp,
            onCompositionStart,
            onCompositionEnd,
            onInput,
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
                onTouchStart={onSelect}
                onTouchMove={onSelect}
                onTouchEnd={onSelect}
                onTouchCancel={onSelect}
                onCut={onCut}
                onPaste={onPaste}
                onDragStart={onDragStart}
                onDrop={onDrop}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                onCompositionStart={onCompositionStart}
                onCompositionEnd={onCompositionEnd}
                onInput={onInput}
                ref={this.editableRef}
            >
                {children}
            </div>
        );
    }

    editableRef = node => {
        const { editableRef, onInput } = this.props;

        editableRef(node);

        if (this.node) {
            this.node.removeEventListener("textinput", onInput);
        }

        this.node = node;

        if (this.node) {
            this.node.addEventListener("textinput", onInput);
        }
    };
}
