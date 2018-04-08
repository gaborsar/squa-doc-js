import React, { PureComponent } from "react";
import joinClassNames from "classnames";

export default class LinkButton extends PureComponent {
  onMouseDownCallback = () => {
    const { onClick, format } = this.props;
    onClick({
      link: format.link ? null : prompt("Enter link.")
    });
  };

  handleMouseDown = event => {
    event.preventDefault();
    window.requestAnimationFrame(this.onMouseDownCallback);
  };

  render() {
    const { format, children } = this.props;
    return (
      <button
        type="button"
        className={joinClassNames("Menu-button", {
          "Menu-button-active": format.link
        })}
        onMouseDown={this.handleMouseDown}
      >
        {children}
      </button>
    );
  }
}
