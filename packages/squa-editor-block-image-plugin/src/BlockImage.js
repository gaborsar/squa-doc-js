import React, { PureComponent } from "react";
import "./BlockImage.css";

export default class BlockImage extends PureComponent {
  handleDeleteClick = () => {
    const { blockKey, createChange, onChange } = this.props;

    const change = createChange()
      .deleteBlockByKey(blockKey)
      .save();

    onChange(change);
  };

  render() {
    const {
      src,
      alt,
      caption,
      blockKey, // eslint-disable-line no-unused-vars
      createChange, // eslint-disable-line no-unused-vars
      onChange, // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;
    return (
      <figure {...otherProps}>
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
        <div className="block-image__controls">
          <button onClick={this.handleDeleteClick}>Delete</button>
        </div>
      </figure>
    );
  }
}
