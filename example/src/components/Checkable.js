import React, { PureComponent } from "react";

export default class Checkable extends PureComponent {
  handleChange = event => {
    const { blockKey, formatBlockByKey } = this.props;
    formatBlockByKey(blockKey, {
      checked: event.target.checked || null
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
        <span contentEditable={false}>
          <input
            type="checkbox"
            checked={checked}
            onChange={this.handleChange}
          />
        </span>
        {children}
      </div>
    );
  }
}
