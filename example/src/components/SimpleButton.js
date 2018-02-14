import React, { PureComponent } from "react";

export default class SimpleButton extends PureComponent {
  handleMouseDown = event => {
    event.preventDefault();
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const { disabled, children } = this.props;
    return (
      <button
        type="button"
        disabled={disabled}
        className="button"
        onMouseDown={this.handleMouseDown}
      >
        {children}
      </button>
    );
  }
}
