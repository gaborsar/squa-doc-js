import React, { PureComponent } from "react";

export default class ColorButton extends PureComponent {
    handleMouseDown = event => {
        event.preventDefault();
        const { color, onClick } = this.props;
        onClick({ color });
    };

    render() {
        const { color } = this.props;
        return (
            <button
                type="button"
                className="Menu-button"
                style={{ background: color || "black" }}
                onMouseDown={this.handleMouseDown}
            />
        );
    }
}
