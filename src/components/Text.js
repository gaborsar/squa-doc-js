import React, { PureComponent } from "react";

export default class Text extends PureComponent {
  render() {
    const { node, renderMark } = this.props;

    let content = node.value;
    const classNames = ["ed-text"];
    let style = {};

    node.style.marks.forEach(mark => {
      const {
        component: MarkComponent = "",
        props: markProps = {},
        className: markClassName = "",
        style: markStyle
      } = renderMark(mark);

      if (MarkComponent) {
        content = <MarkComponent {...markProps}>{content}</MarkComponent>;
      }

      if (markClassName) {
        classNames.push(markClassName);
      }

      if (markStyle) {
        style = { ...style, ...markStyle };
      }
    });

    return (
      <span className={classNames.join(" ")} style={style}>
        {content}
      </span>
    );
  }
}
