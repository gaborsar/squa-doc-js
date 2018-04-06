import React, { PureComponent } from "react";
import createId from "./createId";

export default class Outline extends PureComponent {
  render() {
    const { value: { document: { children: blocks } } } = this.props;
    return (
      <div className="outline">
        <div className="outline__title">Outline</div>
        {blocks
          .filter(block => block.type && block.type.startsWith("heading-"))
          .map(block => (
            <a
              key={block.key}
              className="outline__link"
              href={`#${createId(block.text)}`}
            >
              {block.text}
            </a>
          ))}
      </div>
    );
  }
}
