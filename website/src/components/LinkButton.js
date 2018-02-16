import React, { PureComponent } from "react";
import classNames from "classnames";

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
        className={classNames("button", {
          "button--active": format.link
        })}
        onMouseDown={this.handleMouseDown}
      >
        {children}
      </button>
    );
  }
}
