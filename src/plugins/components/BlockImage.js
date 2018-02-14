import React, { PureComponent } from "react";
import Figure from "./Figure";

export default class BlockImage extends PureComponent {
  render() {
    const { blockKey, deleteBlockByKey, src, alt, caption } = this.props;
    return (
      <Figure
        blockKey={blockKey}
        deleteBlockByKey={deleteBlockByKey}
        caption={caption}
      >
        <img src={src} alt={alt} />
      </Figure>
    );
  }
}
