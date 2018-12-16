import React, { PureComponent } from "react";
import joinClassNames from "classnames";
import "./BlockImage.css";

export default class BlockImage extends PureComponent {
    render() {
        const {
            internals: { node },
            className,
            ...otherProps
        } = this.props;
        return (
            <figure
                className={joinClassNames(className, "BlockImage")}
                contentEditable={false}
                {...otherProps}
            >
                <img src={node.value} alt={node.getAttribute("alt")} />
                <figcaption>{node.getAttribute("caption")}</figcaption>
                <div className="BlockImage-controls">
                    <button onClick={this.handleDeleteClick}>Delete</button>
                </div>
            </figure>
        );
    }

    handleDeleteClick = event => {
        event.stopPropagation();
        const {
            internals: { node, createChange, onChange }
        } = this.props;
        onChange(
            createChange()
                .removeNode(node)
                .save()
        );
    };
}
