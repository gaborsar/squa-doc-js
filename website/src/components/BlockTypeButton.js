import React, { PureComponent } from "react";
import classNames from "classnames";

export default class BlockTypeButton extends PureComponent {
  handleMouseDown = event => {
    const { attributes, type, resetIndent, resetChecked, onClick } = this.props;
    event.preventDefault();
    if (attributes.type === type) {
      onClick({ type: null, indent: null, checked: null });
    } else if (resetIndent) {
      if (resetChecked) {
        onClick({ type, indent: null, checked: null });
      } else {
        onClick({ type, indent: null });
      }
    } else {
      if (resetChecked) {
        onClick({ type, checked: null });
      } else {
        onClick({ type });
      }
    }
  };

  render() {
    const { attributes, type, disabled, children } = this.props;
    return (
      <button
        type="button"
        className={classNames("Menu-button", {
          "Menu-button-active": attributes.type === type
        })}
        onMouseDown={this.handleMouseDown}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
