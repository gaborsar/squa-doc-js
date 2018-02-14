import React, { PureComponent } from "react";

export default class SimpleButton extends PureComponent {
  handleMouseDown = event => {
    event.preventDefault();
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const { children } = this.props;
    return (
      <button
        type="button"
        className="button"
        onMouseDown={this.handleMouseDown}
      >
        {children}
      </button>
    );
  }
}