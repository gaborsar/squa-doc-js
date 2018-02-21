import React, { PureComponent } from "react";
import { Value, Editor } from "../../../packages/squa-editor/src";
import Menu from "./Menu";
import schema from "../editor/schema";
import blockRenderFn from "../editor/blockRenderFn";
import blockStyleFn from "../editor/blockStyleFn";
import tokenizeNode from "../editor/tokenizeNode";
import onKeyDown from "../editor/onKeyDown";
import afterKeyDownEnter from "../editor/afterKeyDownEnter";

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    const { initialContents } = props;
    this.state = {
      value: Value.fromJSON({
        schema,
        contents: initialContents
      })
    };
  }

  onChange = change => {
    const { value } = change;
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <div className="app">
        <div className="header">
          <Menu value={value} onChange={this.onChange} />
        </div>
        <div className="content">
          <Editor
            value={value}
            onChange={this.onChange}
            blockRenderFn={blockRenderFn}
            blockStyleFn={blockStyleFn}
            tokenizeNode={tokenizeNode}
            onKeyDown={onKeyDown}
            afterKeyDownEnter={afterKeyDownEnter}
          />
        </div>
      </div>
    );
  }
}
