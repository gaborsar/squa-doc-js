import React, { PureComponent } from "react";
import "./InlineImage.css";

export default class BlockImage extends PureComponent {
  render() {
    const { src, alt, ...otherProps } = this.props;
    return (
      <span{...otherProps}>
        <img src={src} alt={alt} />
      </span>
    );
  }
}
