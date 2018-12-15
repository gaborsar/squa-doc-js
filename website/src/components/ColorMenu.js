import React, { PureComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
import SimpleButton from "./SimpleButton";
import ColorButton from "./ColorButton";
import "./ColorMenu.scss";

export default class ColorMenu extends PureComponent {
    state = { isOpen: false };

    handleToggleClick = () => {
        this.setState(state => ({ isOpen: !state.isOpen }));
    };

    handleColorClick = attributes => {
        this.setState({ isOpen: false });
        this.props.onClick(attributes);
    };

    render() {
        const { attributes } = this.props;
        const { isOpen } = this.state;
        return (
            <div className="ColorMenu">
                <div className="ColorMenu-header">
                    <SimpleButton onClick={this.handleToggleClick}>
                        <FontAwesomeIcon
                            icon={faPaintBrush}
                            style={{ color: attributes.color }}
                        />
                    </SimpleButton>
                </div>
                {isOpen && (
                    <div className="ColorMenu-body">
                        <ColorButton
                            color={null}
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="silver"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="gray"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="maroon"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="red"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="purple"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="fuchsia"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="green"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="lime"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="olive"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="yellow"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="navy"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="blue"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="teal"
                            onClick={this.handleColorClick}
                        />
                        <ColorButton
                            color="aqua"
                            onClick={this.handleColorClick}
                        />
                    </div>
                )}
            </div>
        );
    }
}
