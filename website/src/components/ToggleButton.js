import React, { PureComponent } from "react";
import classNames from "classnames";

export default class ToggleButton extends PureComponent {
  handleMouseDown = event => {
    event.preventDefault();
    const { onClick, format, type, value } = this.props;
    onClick({
      [type]: format[type] === value ? null : value
    });
  };

  render() {
    const { format, type, value, disabled, children } = this.props;
    return (
      <button
        type="button"
        className={classNames("button", {
          "button--active": format[type] === value
        })}
        onMouseDown={this.handleMouseDown}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
