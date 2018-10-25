import React, { Component } from "react";
import { NodeType } from "squa-doc-js";
import createId from "./createId";
import "./Outline.scss";

export default class Outline extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.value.document !== nextProps.value.document;
    }

    render() {
        return (
            <div className="Outline">
                {this.props.value.document.children
                    .filter(
                        node =>
                            node.type === NodeType.Block &&
                            node.hasAttribute("type") &&
                            node.getAttribute("type").startsWith("heading-")
                    )
                    .map(node => (
                        <a
                            key={node.key}
                            className={`Outline-${node.getAttribute("type")}`}
                            href={`#${createId(node.text)}`}
                        >
                            {node.text}
                        </a>
                    ))}
            </div>
        );
    }
}
