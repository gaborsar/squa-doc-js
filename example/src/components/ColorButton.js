import React, { PureComponent } from "react";

export default class ColorButton extends PureComponent {
  handleMouseDown = event => {
    event.preventDefault();
    const { onClick, value } = this.props;
    onClick(value);
  };

  render() {
    const { value } = this.props;
    return (
      <button
        type="button"
        className="color-button"
        style={{ background: value || "black" }}
        onMouseDown={this.handleMouseDown}
      />
    );
  }
}
