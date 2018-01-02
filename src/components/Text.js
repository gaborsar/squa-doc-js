import React, { Component } from "react";
import { findDOMNode } from "react-dom";

export default class Text extends Component {
  constructor(props) {
    super(props);
    this.forceFlag = true;
  }

  shouldComponentUpdate(nextProps) {
    const { node: { style } } = this.props;
    const { node: { value: nextValue, style: nextStyle } } = nextProps;

    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(this);

    return style !== nextStyle || node.textContent !== nextValue;
  }

  componentDidMount() {
    this.forceFlag = !this.forceFlag;
  }

  componentDidUpdate() {
    this.forceFlag = !this.forceFlag;
  }

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
      } =
        renderMark(mark) || {};

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
      <span
        key={this.forceFlag ? "A" : "B"}
        className={classNames.join(" ")}
        style={style}
        data-text
        data-key={node.key}
      >
        {content}
      </span>
    );
  }
}
