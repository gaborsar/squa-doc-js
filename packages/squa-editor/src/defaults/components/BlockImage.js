import React, { PureComponent } from "react";
import "./BlockImage.css";

export default class BlockImage extends PureComponent {
  render() {
    const { src, alt, caption, ...otherProps } = this.props;
    return (
      <figure {...otherProps}>
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
      </figure>
    );
  }
}
