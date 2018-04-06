import React, { PureComponent } from "react";
import joinClassNames from "classnames";

export default class Embed extends PureComponent {
  render() {
    const { node, EmbedComponent, embedProps, embedClassName } = this.props;
    return (
      <EmbedComponent
        {...embedProps}
        data-embed
        data-key={node.key}
        className={joinClassNames("ed-embed", embedClassName)}
        contentEditable={false}
      />
    );
  }
}
