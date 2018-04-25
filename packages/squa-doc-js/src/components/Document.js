import React, { PureComponent } from "react";
import joinClassNames from "classnames";
import Block from "./Block";
import { isBlockEmbedNode } from "../model/Predicates";

export default class Document extends PureComponent {
  render() {
    const { node, createChange, onChange, renderNode, renderMark } = this.props;

    const blocks = [];

    node.getChildren().forEach(child => {
      const classNames = [];

      child.getMarks().forEach(mark => {
        const markObj = renderMark(mark) || {};

        const { className: markClassName } = markObj;

        if (markClassName) {
          classNames.push(markClassName);
        }
      });

      if (isBlockEmbedNode(child)) {
        const embedObj = renderNode(child, { createChange, onChange });

        if (!embedObj) {
          throw new Error(`Invalid embed: ${child.getNodeType()}`);
        }

        const { component: EmbedComponent, props: embedProps = {} } = embedObj;

        const element = (
          <EmbedComponent
            {...embedProps}
            key={child.getKey()}
            data-embed
            data-key={child.getKey()}
            contentEditable={false}
            className={joinClassNames("SquaDocJs-embed", classNames)}
          />
        );

        blocks.push({ key: child.getKey(), element });
      } else {
        const blockObj = renderNode(child, { createChange, onChange });

        if (!blockObj) {
          throw new Error(`Invalid block: ${child.getNodeType()}`);
        }

        const { wrapper, component, props } = blockObj;

        const element = (
          <Block
            key={child.getKey()}
            node={child}
            BlockComponent={component}
            blockProps={props}
            blockClassName={joinClassNames(classNames)}
            createChange={createChange}
            onChange={onChange}
            renderNode={renderNode}
            renderMark={renderMark}
          />
        );

        blocks.push({ wrapper, key: child.getKey(), element });
      }
    });

    const children = [];

    let CurrentWrapper;
    let currentKey;
    let currentChildren = [];

    const renderWrapper = () => {
      if (CurrentWrapper) {
        children.push(
          <CurrentWrapper key={currentKey} data-wrapper data-key={currentKey}>
            {currentChildren}
          </CurrentWrapper>
        );
      } else {
        children.push(...currentChildren);
      }
    };

    blocks.forEach(block => {
      const { wrapper, key, element } = block;

      if (CurrentWrapper !== wrapper) {
        if (currentChildren.length) {
          renderWrapper();
        }

        CurrentWrapper = wrapper;
        currentKey = key;
        currentChildren = [];
      }

      currentChildren.push(element);
    });

    if (currentChildren.length) {
      renderWrapper();
    }

    return <div className="SquaDocJs-document">{children}</div>;
  }
}
