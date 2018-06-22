import React, { PureComponent } from "react";
import classNames from "classnames";

export default class ToggleButton extends PureComponent {
  handleMouseDown = event => {
    event.preventDefault();
    const { onClick, attributes, name, value } = this.props;
    onClick({
      [name]: attributes[name] === value ? null : value
    });
  };

  render() {
    const { attributes, name, value, disabled, children } = this.props;
    return (
      <button
        type="button"
        className={classNames("Menu-button", {
          "Menu-button-active": attributes[name] === value
        })}
        onMouseDown={this.handleMouseDown}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
