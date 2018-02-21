import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import joinClassNames from "classnames";

export default class Text extends Component {
  constructor(props) {
    super(props);
    this.forceFlag = true;
  }

  shouldComponentUpdate(nextProps) {
    const { node: { value: nextValue } } = nextProps;

    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(this);

    return node.textContent !== nextValue;
  }

  componentDidMount() {
    this.forceFlag = !this.forceFlag;
  }

  componentDidUpdate() {
    this.forceFlag = !this.forceFlag;
  }

  render() {
    const { node, textClassName } = this.props;
    return (
      <span
        key={this.forceFlag ? "A" : "B"}
        data-text
        data-key={node.key}
        className={joinClassNames("ed-text", textClassName)}
      >
        {node.text}
      </span>
    );
  }
}
