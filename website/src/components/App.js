import React, { PureComponent } from "react";
import {
    Value,
    Editor,
    combinePlugins,
    Plugin as DefaultPlugin
} from "squa-doc-js";
import { Plugin as BlockImagePlugin } from "squa-doc-js-block-image-plugin";
import { Plugin as InlineImagePlugin } from "squa-doc-js-inline-image-plugin";
import { Plugin as CheckablePlugin } from "squa-doc-js-checkable-plugin";
import { Plugin as OutlinePlugin, Outline } from "squa-doc-js-outline-plugin";

import Menu from "./Menu";

const {
    schema,
    renderWrapper,
    renderNode,
    renderMark,
    tokenizeNode,
    tokenizeClassName,
    onKeyDown,
    afterInput
} = combinePlugins([
    BlockImagePlugin,
    InlineImagePlugin,
    CheckablePlugin,
    OutlinePlugin,
    DefaultPlugin
]);

export default class App extends PureComponent {
    state = {
        value: Value.fromDelta({
            schema,
            delta: this.props.initialContents
        })
    };

    onChange = change => {
        const { value } = change;
        this.setState({ value });
    };

    render() {
        const { value } = this.state;
        return (
            <div className="App">
                <div className="App-outline">
                    <Outline value={value} />
                </div>
                <div className="App-editor">
                    <Menu value={value} onChange={this.onChange} />
                    <Editor
                        placeholder="Enter some text..."
                        spellCheck={false}
                        value={value}
                        onChange={this.onChange}
                        renderWrapper={renderWrapper}
                        renderNode={renderNode}
                        renderMark={renderMark}
                        tokenizeNode={tokenizeNode}
                        tokenizeClassName={tokenizeClassName}
                        onKeyDown={onKeyDown}
                        afterInput={afterInput}
                    />
                </div>
            </div>
        );
    }
}
