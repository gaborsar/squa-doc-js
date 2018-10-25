import React, { PureComponent } from "react";
import joinClassNames from "classnames";

export default class InlineImage extends PureComponent {
    render() {
        const { node, className, ...otherProps } = this.props;
        return (
            <img
                src={node.value}
                alt={node.getAttribute("alt")}
                className={joinClassNames(className, "InlineImage")}
                {...otherProps}
            />
        );
    }
}
