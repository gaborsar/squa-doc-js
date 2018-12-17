import React, { Component } from "react";
import joinClassNames from "classnames";

import Row from "./Row";

export default class Table extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.node !== nextProps.node;
    }

    render() {
        const {
            tableComponent: TableComponent,
            tableClassName,
            tableProps,
            node
        } = this.props;
        return (
            <div className="SquaDocJs-table-outter" contentEditable={false}>
                <TableComponent
                    className={tableClassName}
                    data-table={true}
                    data-key={node.key}
                    {...tableProps}
                >
                    {node.children.map(this.renderChild)}
                </TableComponent>
            </div>
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
            <Row
                key={node.key}
                rowComponent={obj.component}
                rowClassName={joinClassNames("SquaDocJs-row", classNames)}
                rowProps={obj.props}
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
