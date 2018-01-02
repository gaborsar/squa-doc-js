import React, { PureComponent } from "react";

import "./Figure.css";

export default class Figure extends PureComponent {
  constructor(props) {
    super(props);
  }

  onClickDelete = () => {
    const { node: { key }, deleteBlockByKey } = this.props;
    deleteBlockByKey(key);
  };

  render() {
    const { node, children } = this.props;
    return (
      <figure className="ed-figure">
        {children}
        <figcaption className="ed-figure__caption">
          {node.getMark("caption")}
        </figcaption>
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
