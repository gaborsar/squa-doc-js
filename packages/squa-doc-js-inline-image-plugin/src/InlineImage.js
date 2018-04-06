import React, { PureComponent } from "react";
import "./InlineImage.css";

export default class InlineImage extends PureComponent {
  handleClick = () => {
    const { blockKey, inlineKey, createChange, onChange } = this.props;

    const change = createChange()
      .selectInlineByKey(blockKey, inlineKey)
      .save();

    onChange(change);
  };

  render() {
    const {
      src,
      alt,
      inlineKey, // eslint-disable-line no-unused-vars
      blockKey, // eslint-disable-line no-unused-vars
      createChange, // eslint-disable-line no-unused-vars
      onChange, // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;
    return (
      <span {...otherProps} onClick={this.handleClick}>
        <img src={src} alt={alt} />
      </span>
    );
  }
}
