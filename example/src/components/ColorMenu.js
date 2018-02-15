import React, { PureComponent } from "react";
import ColorButton from "./ColorButton";

export default class ColorMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleToggleClick = event => {
    event.preventDefault();
    this.setState(state => {
      return {
        isOpen: !state.isOpen
      };
    });
  };

  handleColorClick = attributes => {
    const { onClick } = this.props;
    this.setState({
      isOpen: false
    });
    onClick(attributes);
  };

  render() {
    const { format } = this.props;
    const { isOpen } = this.state;
    return (
      <div className="color-menu">
        <div className="color-menu__header">
          <button className="button" onMouseDown={this.handleToggleClick}>
            <i className="fas fa-paint-brush" style={{ color: format.color }} />
          </button>
        </div>
        {isOpen && (
          <div className="color-menu__body">
            <ColorButton color={null} onClick={this.handleColorClick} />
            <ColorButton color="silver" onClick={this.handleColorClick} />
            <ColorButton color="gray" onClick={this.handleColorClick} />
            <ColorButton color="maroon" onClick={this.handleColorClick} />
            <ColorButton color="red" onClick={this.handleColorClick} />
            <ColorButton color="purple" onClick={this.handleColorClick} />
            <ColorButton color="fuchsia" onClick={this.handleColorClick} />
            <ColorButton color="green" onClick={this.handleColorClick} />
            <ColorButton color="lime" onClick={this.handleColorClick} />
            <ColorButton color="olive" onClick={this.handleColorClick} />
            <ColorButton color="yellow" onClick={this.handleColorClick} />
            <ColorButton color="navy" onClick={this.handleColorClick} />
            <ColorButton color="blue" onClick={this.handleColorClick} />
            <ColorButton color="teal" onClick={this.handleColorClick} />
            <ColorButton color="aqua" onClick={this.handleColorClick} />
          </div>
        )}
      </div>
    );
  }
}
