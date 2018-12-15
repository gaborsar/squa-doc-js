import React, { Component } from "react";
import { findDOMNode } from "react-dom";

export default class Text extends Component {
    forceFlag = true;

    componentDidMount() {
        this.forceFlag = !this.forceFlag;
    }

    shouldComponentUpdate(nextProps) {
        return (
            this.props.className !== nextProps.className ||
            // eslint-disable-next-line react/no-find-dom-node
            findDOMNode(this).textContent !== nextProps.children
        );
    }

    componentDidUpdate() {
        this.forceFlag = !this.forceFlag;
    }

    render() {
        const { className, children } = this.props;
        return (
            <span
                ref={this.rootRef}
                key={this.forceFlag ? "A" : "B"}
                className={className}
            >
                {children}
            </span>
        );
    }
}
