import React, { PureComponent } from "react";
import {
  Value,
  Editor,
  combinePlugins,
  defaultPlugin
} from "../../../packages/squa-doc-js/src";
import { blockImagePlugin } from "../../../packages/squa-doc-js-block-image-plugin/src";
import { inlineImagePlugin } from "../../../packages/squa-doc-js-inline-image-plugin/src";
import { checkablePlugin } from "../../../packages/squa-doc-js-checkable-plugin/src";
import {
  outlinePlugin,
  Outline
} from "../../../packages/squa-doc-js-outline-plugin/src";
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
  outlinePlugin,
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
      <div className="App">
        <div className="App-header">
          <Menu value={value} onChange={this.onChange} />
        </div>
        <div className="App-content">
          <div className="App-outline">
            <Outline value={value} />
          </div>
          <div className="App-editor">
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
      </div>
    );
  }
}
