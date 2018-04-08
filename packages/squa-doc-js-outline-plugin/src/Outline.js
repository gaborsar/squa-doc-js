import React, { PureComponent } from "react";
import createId from "./createId";
import "./Outline.scss";

export default class Outline extends PureComponent {
  render() {
    const { value: { document: { children: blocks } } } = this.props;
    return (
      <div className="Outline">
        {blocks
          .filter(block => block.type && block.type.startsWith("heading-"))
          .map(block => (
            <a
              key={block.key}
              className={`Outline-${block.type}`}
              href={`#${createId(block.text)}`}
            >
              {block.text}
            </a>
          ))}
      </div>
    );
  }
}
