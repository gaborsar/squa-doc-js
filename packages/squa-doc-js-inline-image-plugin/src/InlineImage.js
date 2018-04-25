import React, { PureComponent } from "react";
import joinClassNames from "classnames";

export default class InlineImage extends PureComponent {
  render() {
    const { node, className, ...otherProps } = this.props;
    return (
      <img
        {...otherProps}
        src={node.getValue()}
        alt={node.getAttribute("alt")}
        className={joinClassNames(className, "InlineImage")}
      />
    );
  }
}
