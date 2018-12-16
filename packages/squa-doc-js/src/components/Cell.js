import React, { Component } from "react";
import joinClassNames from "classnames";

import { isBlockNode, isBlockEmbedNode } from "../model/Predicates";
import Block from "./Block";
import renderWrappedNodes from "./renderWrappedNodes";

export default class Cell extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.node !== nextProps.node;
    }

    render() {
        const { CellComponent, cellClassName, cellProps, node } = this.props;
        return (
            <CellComponent
                className={cellClassName}
                data-cell={true}
                data-key={node.key}
                {...cellProps}
            >
                <div
                    className="SquaDocJs-cell-inner"
                    contentEditable={true}
                    suppressContentEditableWarning
                >
                    {renderWrappedNodes(
                        node.children,
                        this.renderWrapper,
                        this.renderChild
                    )}
                </div>
            </CellComponent>
        );
    }

    renderWrapper = node => {
        return {
            wrapper: this.props.renderWrapper(node) || {},
            node
        };
    };

    renderChild = node => {
        const { renderMark } = this.props;

        const classNames = [];
        node.style.marks.map(renderMark).forEach(obj => {
            if (obj === undefined) {
                return;
            }
            if (obj.className === undefined) {
                return;
            }
            classNames.push(obj.className);
        });

        if (isBlockNode(node)) {
            return this.renderBlock(node, classNames);
        }
        if (isBlockEmbedNode(node)) {
            return this.renderBlockEmbed(node, classNames);
        }
        throw new Error();
    };

    renderBlock(node, classNames) {
        const { createChange, onChange, renderNode, renderMark } = this.props;

        const obj = renderNode(node, { createChange, onChange });
        if (obj === undefined) {
            throw new Error();
        }

        return (
            <Block
                key={node.key}
                BlockComponent={obj.component}
                blockClassName={joinClassNames("SquaDocJs-block", classNames)}
                blockProps={obj.props}
                node={node}
                createChange={createChange}
                onChange={onChange}
                renderNode={renderNode}
                renderMark={renderMark}
            />
        );
    }

    renderBlockEmbed(node, classNames) {
        const { renderNode, createChange, onChange } = this.props;

        const obj = renderNode(node, { createChange, onChange });
        if (obj === undefined) {
            throw new Error();
        }

        const { component: EmbedComponent, props: embedProps } = obj;
        return (
            <EmbedComponent
                {...embedProps}
                key={node.key}
                className={joinClassNames("SquaDocJs-embed", classNames)}
                contentEditable={false}
                data-embed={true}
                data-key={node.key}
            />
        );
    }
}
