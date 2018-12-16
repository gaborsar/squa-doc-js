import React, { Component } from "react";
import joinClassNames from "classnames";

import { isTextNode, isInlineEmbedNode } from "../model/Predicates";
import Text from "./Text";

export default class Block extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.node !== nextProps.node;
    }

    render() {
        const { BlockComponent, blockClassName, blockProps, node } = this.props;
        return (
            <BlockComponent
                className={blockClassName}
                data-block={true}
                data-key={node.key}
                {...blockProps}
            >
                {node.isEmpty() ? (
                    <br data-ignore />
                ) : (
                    node.children.map(this.renderNode)
                )}
            </BlockComponent>
        );
    }

    renderNode = node => {
        const { renderMark } = this.props;

        const classNames = [];
        let element;

        const markObjects = node.style.marks.map(renderMark);
        markObjects.forEach(obj => {
            if (obj === undefined) {
                return;
            }
            if (obj.className === undefined) {
                return;
            }
            classNames.push(obj.className);
        });

        if (isTextNode(node)) {
            element = this.renderText(node, classNames);
        } else if (isInlineEmbedNode(node)) {
            element = this.renderInlineEmbed(node, classNames);
        } else {
            throw new Error();
        }

        markObjects.forEach(obj => {
            if (obj === undefined) {
                return;
            }
            if (obj.component === undefined) {
                return;
            }
            const { component: Mark, props } = obj;
            element = <Mark {...props}>{element}</Mark>;
        });

        return element;
    };

    renderText(node, classNames) {
        return (
            <Text
                key={node.key}
                className={joinClassNames("SquaDocJs-text", classNames)}
            >
                {node.value}
            </Text>
        );
    }

    renderInlineEmbed(node, classNames) {
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
                className={joinClassNames("SquaDocJs-InlineEmbed", classNames)}
                data-embed={true}
                data-key={node.key}
            />
        );
    }
}
