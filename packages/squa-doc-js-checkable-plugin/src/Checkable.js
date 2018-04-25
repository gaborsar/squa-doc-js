import React, { PureComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
import "./Checkable.scss";

export default class Checkable extends PureComponent {
  handleClick = event => {
    const {
      internal: { node, createChange, onChange }
    } = this.props;
    event.preventDefault();
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
          contentEditable={false}
          onMouseDown={this.handleClick}
        >
          <FontAwesomeIcon
            icon={node.getAttribute("checked") ? faCheckSquare : faSquare}
          />
        </span>
        {children}
      </div>
    );
  }
}
