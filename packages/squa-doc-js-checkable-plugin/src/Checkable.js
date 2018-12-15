import React, { PureComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
import "./Checkable.css";

export default class Checkable extends PureComponent {
    handleClick = event => {
        event.preventDefault();
        const {
            internal: { node, createChange, onChange }
        } = this.props;
        onChange(
            createChange()
                .replaceNode(
                    node.setAttribute(
                        "checked",
                        node.getAttribute("checked") ? null : true
                    ),
                    node
                )
                .save()
        );
    };

    render() {
        const {
            internal: { node },
            children,
            ...otherProps
        } = this.props;
        return (
            <div {...otherProps}>
                <span
                    className="checkbox"
                    onMouseDown={this.handleClick}
                    contentEditable={false}
                    data-ignore={true}
                >
                    <FontAwesomeIcon
                        icon={
                            node.getAttribute("checked")
                                ? faCheckSquare
                                : faSquare
                        }
                    />
                </span>
                {children}
            </div>
        );
    }
}
