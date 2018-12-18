import React, { PureComponent } from "react";

const COMPOSITION_END_DELAY = 100;

export default class ContentEditable extends PureComponent {
    state = { isComposing: false };

    node = null;
    inputTimeout = 0;

    componentWillUnmount = () => {
        window.clearTimeout(this.inputTimeout);
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
            onKeyDown,
            onKeyUp,
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
                onCompositionStart={this.handleCompositionStart}
                onCompositionEnd={this.handleCompositionEnd}
                onInput={this.handleInput}
                ref={this.editableRef}
            >
                {children}
            </div>
        );
    }

    editableRef = node => {
        const { editableRef } = this.props;

        editableRef(node);

        if (this.node) {
            this.node.removeEventListener("textinput", this.handleInput);
        }

        this.node = node;

        if (this.node) {
            this.node.addEventListener("textinput", this.handleInput);
        }
    };

    handleCompositionStart = () => {
        this.startComposing();
    };

    handleCompositionEnd = () => {
        window.clearTimeout(this.inputTimeout);
        this.inputTimeout = window.setTimeout(
            this.stopComposing,
            COMPOSITION_END_DELAY
        );
    };

    handleInput = () => {
        this.startComposing();
        window.clearTimeout(this.inputTimeout);
        this.inputTimeout = window.setTimeout(
            this.stopComposing,
            COMPOSITION_END_DELAY
        );
    };

    startComposing = () => {
        if (this.state.isComposing) {
            return;
        }
        this.setState({ isComposing: true });
        this.props.onCompositionStart();
    };

    stopComposing = () => {
        if (!this.state.isComposing) {
            return;
        }
        this.setState({ isComposing: false });
        this.props.onCompositionEnd();
    };
}
