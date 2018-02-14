import React, { PureComponent } from "react";

export default class Checkable extends PureComponent {
  handleClick = event => {
    event.preventDefault();
    const { blockKey, formatBlockByKey, checked } = this.props;
    formatBlockByKey(blockKey, {
      checked: checked ? null : true
    });
  };

  render() {
    const {
      blockKey, // eslint-disable-line no-unused-vars
      formatBlockByKey, // eslint-disable-line no-unused-vars
      checked,
      children,
      ...otherProps
    } = this.props;
    return (
      <div {...otherProps}>
        <span
          className="checkbox"
          contentEditable={false}
          onMouseDown={this.handleClick}
        >
          <i className={`fas ${checked ? "fa-check-square" : "fa-square"}`} />
        </span>
        {children}
      </div>
    );
  }
}
