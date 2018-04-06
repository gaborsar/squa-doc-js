import React, { PureComponent } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faCheckSquare from "@fortawesome/fontawesome-free-solid/faCheckSquare";
import faSquare from "@fortawesome/fontawesome-free-regular/faSquare";
import "./Checkable.scss";

export default class Checkable extends PureComponent {
  handleClick = event => {
    const { blockKey, createChange, onChange, checked } = this.props;

    event.preventDefault();

    const change = createChange()
      .formatBlockByKey(blockKey, {
        checked: checked ? null : true
      })
      .save();

    onChange(change);
  };

  render() {
    const {
      blockKey, // eslint-disable-line no-unused-vars
      createChange, // eslint-disable-line no-unused-vars
      onChange, // eslint-disable-line no-unused-vars
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
