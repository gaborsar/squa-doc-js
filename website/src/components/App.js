import React, { PureComponent } from "react";
import {
  Value,
  Editor,
  combinePlugins,
  defaultPlugin
} from "../../../packages/squa-editor/src";
import blockImagePlugin from "../../../packages/squa-editor-block-image-plugin/src";
import inlineImagePlugin from "../../../packages/squa-editor-inline-image-plugin/src";
import checkablePlugin from "../../../packages/squa-editor-checkable-plugin/src";
import Menu from "./Menu";

const {
  schema,
  renderNode,
  renderMark,
  tokenizeNode,
  tokenizeClassName,
  onKeyDown
} = combinePlugins([
  blockImagePlugin,
  inlineImagePlugin,
  checkablePlugin,
  defaultPlugin
]);

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    const { initialContents } = props;
    this.state = {
      value: Value.fromDelta({
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
            spellCheck={false}
            value={value}
            onChange={this.onChange}
            renderNode={renderNode}
            renderMark={renderMark}
            tokenizeNode={tokenizeNode}
            tokenizeClassName={tokenizeClassName}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    );
  }
}
