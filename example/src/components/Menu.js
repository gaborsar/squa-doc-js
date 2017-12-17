import React, { PureComponent } from "react";
import classNames from "classnames";

class Button extends PureComponent {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  onMouseDown(event) {
    const { onClick, format, type, value } = this.props;
    event.preventDefault();
    onClick(type, format[type] === value ? null : value);
  }

  render() {
    const { format, type, value, children } = this.props;
    return (
      <button
        type="button"
        className={classNames("ed-button", {
          "ed-button--active": format[type] === value
        })}
        onMouseDown={this.onMouseDown}
      >
        {children}
      </button>
    );
  }
}

export default class Menu extends PureComponent {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick(type, value) {
    const { onButtonClick } = this.props;
    onButtonClick(type, value);
  }

  render() {
    const { format } = this.props;
    return (
      <div className="ed-menu">
        <Button
          format={format}
          type="type"
          value="H1"
          onClick={this.onButtonClick}
        >
          H1
        </Button>
        <Button
          format={format}
          type="type"
          value="H2"
          onClick={this.onButtonClick}
        >
          H2
        </Button>
      </div>
    );
  }
}
