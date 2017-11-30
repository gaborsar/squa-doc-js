import React, { PureComponent } from "react";
import ErrorBoundary from "./ErrorBoundary";
import Document from "./Document";

export default class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this._element = null;
    this._setElement = this._setElement.bind(this);
  }

  _setElement(element) {
    this._element = element;
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
      <div className="ed-editor">
        <ErrorBoundary>
          <div
            ref={this._setElement}
            className="ed-editable"
            contentEditable={true}
            spellCheck={true}
            suppressContentEditableWarning={true}
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
