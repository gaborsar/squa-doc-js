import React, { PureComponent } from "react";

export default class InlineImage extends PureComponent {
  render() {
    const { src, alt } = this.props;
    return <img src={src} alt={alt} />;
  }
}
