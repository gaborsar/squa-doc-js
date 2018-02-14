import React, { PureComponent } from "react";
import { Value, Editor } from "../../../src/SquaDocEditor";
import Menu from "./Menu";
import Checkable from "./Checkable";

const schema = {
  isBlockMark(markType) {
    if (markType === "checked") {
      return true;
    }
  }
};

function renderBlock(node, defaultProps) {
  if (node.type === "checkable") {
    const { blockKey, formatBlockByKey } = defaultProps;
    return {
      component: Checkable,
      props: {
        blockKey,
        formatBlockByKey,
        checked: !!node.getMark("checked")
      }
    };
  }
}

function renderMark(mark) {
  if (mark.type === "type" && mark.value === "checkable") {
    return {
      className: "checkable"
    };
  }
  if (mark.type === "checked") {
    return {
      className: "checked"
    };
  }
}

function tokenizeNode(node) {
  const tokens = [];
  if (node.classList.contains("checkable")) {
    tokens.push({
      block: {
        type: "checkable"
      }
    });
  }
  if (node.classList.contains("checked")) {
    tokens.push({
      block: {
        checked: true
      }
    });
  }
  return tokens;
}

function onKeyDownEnter(change) {
  change.formatBlock({
    checked: null
  });
}

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    const { initialContents } = props;
    const value = Value.fromJSON({
      schema,
      contents: initialContents
    });
    this.state = { value };
  }

  onChange = change => {
    // eslint-disable-next-line no-console
    console.log(change);
    const { value } = change;
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <div className="app">
        <div className="editor">
          <Menu value={value} onChange={this.onChange} />
          <Editor
            value={value}
            renderBlock={renderBlock}
            renderMark={renderMark}
            tokenizeNode={tokenizeNode}
            onKeyDownEnter={onKeyDownEnter}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
