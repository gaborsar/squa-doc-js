import React, { PureComponent } from "react";
import { Value, Editor } from "../../../src/SquaEditor";
import Menu from "./Menu";
import schema from "./editor/schema";
import renderBlock from "./editor/renderBlock";
import renderMark from "./editor/renderMark";
import tokenizeNode from "./editor/tokenizeNode";
import onKeyDown from "./editor/onKeyDown";
import afterKeyDownEnter from "./editor/afterKeyDownEnter";

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
            renderBlock={renderBlock}
            renderMark={renderMark}
            tokenizeNode={tokenizeNode}
            onKeyDown={onKeyDown}
            afterKeyDownEnter={afterKeyDownEnter}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
