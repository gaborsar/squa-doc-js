import React, { PureComponent } from "react";
import classNames from "classnames";

export default class BlockTypeButton extends PureComponent {
  handleMouseDown = event => {
    const { format, type, resetIndent, resetChecked, onClick } = this.props;

    event.preventDefault();

    let attributes;

    if (format.type === type) {
      attributes = {
        type: null
      };
    } else {
      attributes = { type };

      if (resetIndent) {
        attributes = {
          ...attributes,
          indent: null
        };
      }

      if (resetChecked) {
        attributes = {
          ...attributes,
          checked: null
        };
      }
    }

    onClick(attributes);
  };

  render() {
    const { format, type, disabled, children } = this.props;
    return (
      <button
        type="button"
        className={classNames("button", {
          "button--active": format.type === type
        })}
        onMouseDown={this.handleMouseDown}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
