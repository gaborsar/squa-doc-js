import React, { PureComponent } from "react";
import joinClassNames from "classnames";
import "./BlockImage.scss";

export default class BlockImage extends PureComponent {
  handleDeleteClick = event => {
    const {
      internals: { node, createChange, onChange }
    } = this.props;
    event.stopPropagation();
    onChange(
      createChange()
        .removeNode(node)
        .save()
    );
  };

  render() {
    const {
      internals: { node },
      className,
      ...otherProps
    } = this.props;
    return (
      <figure
        {...otherProps}
        className={joinClassNames(className, "BlockImage")}
      >
        <img src={node.getValue()} alt={node.getAttribute("alt")} />
        <figcaption>{node.getAttribute("caption")}</figcaption>
        <div className="BlockImage-controls">
          <button onClick={this.handleDeleteClick}>Delete</button>
        </div>
      </figure>
    );
  }
}
