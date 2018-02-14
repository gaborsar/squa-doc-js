import React, { PureComponent } from "react";
import classNames from "classnames";

export default class LinkButton extends PureComponent {
  onMouseDownCallback = () => {
    const { onClick, format, type } = this.props;
    onClick(format[type] ? null : prompt("Enter link."));
  };

  handleMouseDown = event => {
    event.preventDefault();
    window.requestAnimationFrame(this.onMouseDownCallback);
  };

  render() {
    const { format, type, disabled, children } = this.props;
    return (
      <button
        type="button"
        className={classNames("button", {
          "button--active": format[type]
        })}
        onMouseDown={this.handleMouseDown}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
