import React, { PureComponent } from "react";
import joinClassNames from "classnames";

import {
    isTableNode,
    isBlockNode,
    isBlockEmbedNode
} from "../model/Predicates";
import Table from "./Table";
import Block from "./Block";
import renderWrappedNodes from "./renderWrappedNodes";

const defaultWrapper = {};

export default class Document extends PureComponent {
    render() {
        const { node } = this.props;
        return (
            <div className="SquaDocJs-document">
                {renderWrappedNodes(
                    node.children,
                    this.renderWrapper,
                    this.renderNode
                )}
            </div>
        );
    }

    renderWrapper = node => {
        return {
            wrapper: this.props.renderWrapper(node) || defaultWrapper,
            node
        };
    };

    renderNode = node => {
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

        if (isTableNode(node)) {
            return this.renderTable(node, classNames);
        }
        if (isBlockNode(node)) {
            return this.renderBlock(node, classNames);
        }
        if (isBlockEmbedNode(node)) {
            return this.renderBlockEmbed(node, classNames);
        }
        throw new Error();
    };

    renderTable(node, classNames) {
        const {
            createChange,
            onChange,
            renderWrapper,
            renderNode,
            renderMark
        } = this.props;

        const obj = renderNode(node, { createChange, onChange });
        if (obj === undefined) {
            throw new Error();
        }

        return (
            <Table
                key={node.key}
                TableComponent={obj.component}
                tableClassName={joinClassNames("SquaDocJs-table", classNames)}
                tableProps={obj.props}
                node={node}
                createChange={createChange}
                onChange={onChange}
                renderWrapper={renderWrapper}
                renderNode={renderNode}
                renderMark={renderMark}
            />
        );
    }

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

        const { component: EmbedComponent, props } = obj;
        return (
            <EmbedComponent
                {...props}
                key={node.key}
                className={joinClassNames("SquaDocJs-embed", classNames)}
                data-embed={true}
                data-key={node.key}
            />
        );
    }
}
