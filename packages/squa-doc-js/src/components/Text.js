import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import joinClassNames from "classnames";

export default class Text extends Component {
  constructor(props) {
    super(props);
    this.forceFlag = true;
  }

  shouldComponentUpdate(nextProps) {
    const { textClassName: className } = this.props;
    const { textClassName: nextClassName } = nextProps;

    if (className !== nextClassName) {
      return true;
    }

    const nextValue = nextProps.node.getValue();

    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(this);

    if (node.textContent !== nextValue) {
      return true;
    }

    return false;
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
        className={joinClassNames("SquaDocJs-text", textClassName)}
      >
        {node.getValue()}
      </span>
    );
  }
}
