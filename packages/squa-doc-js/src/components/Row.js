import React, { Component } from "react";
import joinClassNames from "classnames";

import Cell from "./Cell";

export default class Row extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.node !== nextProps.node;
    }

    render() {
        const { RowComponent, rowClassName, rowProps, node } = this.props;
        return (
            <RowComponent
                className={rowClassName}
                data-row={true}
                data-key={node.key}
                {...rowProps}
            >
                {node.children.map(this.renderChild)}
            </RowComponent>
        );
    }

    renderChild = node => {
        const {
            createChange,
            onChange,
            renderWrapper,
            renderNode,
            renderMark
        } = this.props;

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

        const obj = renderNode(node, { createChange, onChange });
        if (obj === undefined) {
            throw new Error();
        }

        return (
            <Cell
                key={node.key}
                CellComponent={obj.component}
                cellClassName={joinClassNames("SquaDocJs-cell", classNames)}
                cellProps={obj.props}
                node={node}
                createChange={createChange}
                onChange={onChange}
                renderWrapper={renderWrapper}
                renderNode={renderNode}
                renderMark={renderMark}
            />
        );
    };
}
