import React, { PureComponent } from "react";
import createId from "./createId";
import "./Outline.scss";

export default class Outline extends PureComponent {
  render() {
    return (
      <div className="Outline">
        {this.props.value
          .getDocument()
          .getChildren()
          .filter(
            node =>
              node.getNodeType() === "block" &&
              node.hasAttribute("type") &&
              node.getAttribute("type").startsWith("heading-")
          )
          .map(node => (
            <a
              key={node.getKey()}
              className={`Outline-${node.getAttribute("type")}`}
              href={`#${createId(node.getText())}`}
            >
              {node.getText()}
            </a>
          ))}
      </div>
    );
  }
}
