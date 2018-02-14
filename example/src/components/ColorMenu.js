import React, { PureComponent } from "react";
import ColorButton from "./ColorButton";

export default class ColorMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleToggleClick = () => {
    this.setState(state => ({
      isOpen: !state.isOpen
    }));
  };

  handleColorClick = value => {
    const { onChange } = this.props;
    this.setState({ isOpen: false });
    onChange(value);
  };

  render() {
    const { value } = this.props;
    const { isOpen } = this.state;
    return (
      <div className="color-menu">
        <div className="color-menu__header">
          <button className="button" onMouseDown={this.handleToggleClick}>
            <i className="fas fa-paint-brush" style={{ color: value }} />
          </button>
        </div>
        {isOpen && (
          <div className="color-menu__body">
            <ColorButton value={null} onClick={this.handleColorClick} />
            <ColorButton value="silver" onClick={this.handleColorClick} />
            <ColorButton value="gray" onClick={this.handleColorClick} />
            <ColorButton value="maroon" onClick={this.handleColorClick} />
            <ColorButton value="red" onClick={this.handleColorClick} />
            <ColorButton value="purple" onClick={this.handleColorClick} />
            <ColorButton value="fuchsia" onClick={this.handleColorClick} />
            <ColorButton value="green" onClick={this.handleColorClick} />
            <ColorButton value="lime" onClick={this.handleColorClick} />
            <ColorButton value="olive" onClick={this.handleColorClick} />
            <ColorButton value="yellow" onClick={this.handleColorClick} />
            <ColorButton value="navy" onClick={this.handleColorClick} />
            <ColorButton value="blue" onClick={this.handleColorClick} />
            <ColorButton value="teal" onClick={this.handleColorClick} />
            <ColorButton value="aqua" onClick={this.handleColorClick} />
          </div>
        )}
      </div>
    );
  }
}
