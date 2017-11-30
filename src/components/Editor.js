import React, { PureComponent } from "react";
import ErrorBoundary from "./ErrorBoundary";
import Document from "./Document";
import getRange from "../dom/getRange";
import getNativeRange from "../dom/getNativeRange";

export default class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this._element = null;
    this._setElement = this._setElement.bind(this);
    this._onSelect = this._onSelect.bind(this);
  }

  _setElement(element) {
    this._element = element;
  }

  /**
   * This is just a temporary method to test the new selection helper functions.
   * @private
   */
  _onSelect() {
    if (this._element) {
      const selection = window.getSelection();

      if (selection) {
        const editorRange = getRange(
          this._element,
          selection.anchorNode,
          selection.anchorOffset,
          selection.focusNode,
          selection.focusOffset
        );

        // eslint-disable-next-line no-console
        console.log(editorRange);

        const nativeRange = getNativeRange(
          this._element,
          editorRange.startOffset,
          editorRange.endOffset
        );

        // eslint-disable-next-line no-console
        console.log(nativeRange);

        selection.removeAllRanges();

        const range = document.createRange();

        if (typeof selection.extend === "function") {
          range.setStart(nativeRange.anchorNode, nativeRange.anchorOffset);
          selection.addRange(range);
          selection.extend(nativeRange.focusNode, nativeRange.focusOffset);
        } else {
          range.setStart(nativeRange.anchorNode, nativeRange.anchorOffset);
          range.setEnd(nativeRange.focusNode, nativeRange.focusOffset);
          selection.addRange(range);
        }
      }
    }
  }

  render() {
    const {
      document,
      renderWrapper,
      renderBlock,
      renderEmbed,
      renderMark
    } = this.props;
    return (
      <div className="ed-editor" data-editor>
        <ErrorBoundary>
          <div
            ref={this._setElement}
            className="ed-editable"
            contentEditable={true}
            spellCheck={true}
            suppressContentEditableWarning={true}
            onSelect={this._onSelect}
          >
            <Document
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
