import React, { PureComponent } from "react";
import {
  Value,
  Editor,
  combinePlugins,
  defaultPlugin
} from "../../../packages/squa-editor/src";
import blockImagePlugin from "../../../packages/squa-editor-block-image-plugin/plugin";
import inlineImagePlugin from "../../../packages/squa-editor-inline-image-plugin/plugin";
import checkableListPlugin from "../checkable-list-plugin/plugin";
import Menu from "./Menu";

const {
  schema,
  renderNode,
  renderMark,
  tokenizeNode,
  onKeyDown
} = combinePlugins([
  blockImagePlugin,
  inlineImagePlugin,
  checkableListPlugin,
  defaultPlugin
]);

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
            placeholder="Enter some text..."
            value={value}
            onChange={this.onChange}
            renderNode={renderNode}
            renderMark={renderMark}
            tokenizeNode={tokenizeNode}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    );
  }
}
