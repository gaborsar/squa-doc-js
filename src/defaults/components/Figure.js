import React, { PureComponent } from "react";

import "./Figure.css";

export default class Figure extends PureComponent {
  constructor(props) {
    super(props);
  }

  onClickDelete = () => {
    const { blockKey, deleteBlockByKey } = this.props;
    deleteBlockByKey(blockKey);
  };

  render() {
    const { caption, children } = this.props;
    return (
      <figure className="ed-figure">
        <div className="ed-figure__content">{children}</div>
        <figcaption className="ed-figure__caption">{caption}</figcaption>
        <div className="ed-figure__controls">
          <button
            type="button"
            className="ed-figure__button"
            onClick={this.onClickDelete}
          >
            Delete
          </button>
        </div>
      </figure>
    );
  }
}
