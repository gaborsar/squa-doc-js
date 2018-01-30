## Quickstart

```jsx
import React, { PureComponent } from "react";
import { Delta, Value, Editor } from "squa-editor";

const initialValue = Value.fromJSON({
  contents: new Delta().insert("Hello world!\n")
});

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: initialValue
    };
  }

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return <Editor value={value} onChange={this.onChange} />;
  }
}
```
