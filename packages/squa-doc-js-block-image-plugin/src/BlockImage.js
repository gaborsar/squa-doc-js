import React, { PureComponent } from "react";
import "./BlockImage.scss";

export default class BlockImage extends PureComponent {
  handleClick = () => {
    const { blockKey, createChange, onChange } = this.props;

    const change = createChange()
      .selectBlockByKey(blockKey)
      .save();

    onChange(change);
  };

  handleDeleteClick = event => {
    const { blockKey, createChange, onChange } = this.props;

    event.stopPropagation();

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
      <figure {...otherProps} onClick={this.handleClick}>
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
        <div className="BlockImage-controls">
          <button onClick={this.handleDeleteClick}>Delete</button>
        </div>
      </figure>
    );
  }
}