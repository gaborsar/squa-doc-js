import React, { PureComponent } from "react";
import { Editor } from "../../../src/SquaDocEditor";
import Menu from "./Menu";

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    const { initialValue: value } = props;
    this.state = { value };
  }

  onChange = change => {
    const { value } = change;
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <div className="app">
        <div className="editor">
          <Menu value={value} onChange={this.onChange} />
          <Editor value={value} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}
