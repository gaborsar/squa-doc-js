import React, { PureComponent } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faCheckSquare from "@fortawesome/fontawesome-free-solid/faCheckSquare";
import faSquare from "@fortawesome/fontawesome-free-solid/faSquare";
import "./Checkable.scss";

export default class Checkable extends PureComponent {
  handleClick = event => {
    event.preventDefault();
    const { blockKey, formatBlockByKey, checked } = this.props;
    formatBlockByKey(blockKey, {
      checked: checked ? null : true
    });
  };

  render() {
    const {
      blockKey, // eslint-disable-line no-unused-vars
      formatBlockByKey, // eslint-disable-line no-unused-vars
      checked,
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
          <FontAwesomeIcon icon={checked ? faCheckSquare : faSquare} />
        </span>
        {children}
      </div>
    );
  }
}
