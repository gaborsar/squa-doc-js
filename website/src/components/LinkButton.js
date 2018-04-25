import React, { PureComponent } from "react";
import joinClassNames from "classnames";

export default class LinkButton extends PureComponent {
  onMouseDownCallback = () => {
    const { onClick, attributes } = this.props;
    onClick({
      link: attributes.link ? null : prompt("Enter link.")
    });
  };

  handleMouseDown = event => {
    event.preventDefault();
    window.requestAnimationFrame(this.onMouseDownCallback);
  };

  render() {
    const { attributes, children } = this.props;
    return (
      <button
        type="button"
        className={joinClassNames("Menu-button", {
          "Menu-button-active": attributes.link
        })}
        onMouseDown={this.handleMouseDown}
      >
        {children}
      </button>
    );
  }
}
