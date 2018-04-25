import React, { PureComponent } from "react";
import joinClassNames from "classnames";
import Text from "./Text";
import { isInlineEmbedNode } from "../model/Predicates";

export default class Block extends PureComponent {
  render() {
    const {
      node,
      BlockComponent,
      blockProps,
      blockClassName,
      createChange,
      onChange,
      renderNode,
      renderMark
    } = this.props;

    const children = [];

    if (node.isEmpty()) {
      children.push(<br key="br" data-ignore />);
    } else {
      node.getChildren().forEach(child => {
        const markObjects = [];

        child.getMarks().forEach(mark => {
          const markObj = renderMark(mark);

          if (markObj) {
            markObjects.push(markObj);
          }
        });

        const classNames = [];

        markObjects.forEach(markObj => {
          const { className: markClassName } = markObj;

          if (markClassName) {
            classNames.push(markClassName);
          }
        });

        let element;

        if (isInlineEmbedNode(child)) {
          const embedObj = renderNode(child, { createChange, onChange });

          if (!embedObj) {
            throw new Error(`Invalid embed: ${child.getNodeType()}`);
          }

          const {
            component: EmbedComponent,
            props: embedProps = {}
          } = embedObj;

          element = (
            <EmbedComponent
              {...embedProps}
              key={child.getKey()}
              data-embed
              data-key={child.getKey()}
              contentEditable={false}
              className={joinClassNames("SquaDocJs-embed", classNames)}
            />
          );
        } else {
          element = (
            <Text
              key={child.getKey()}
              node={child}
              textClassName={joinClassNames(classNames)}
            />
          );
        }

        markObjects.forEach(markObj => {
          const { component: MarkComponent, props: markProps } = markObj;

          if (MarkComponent) {
            element = (
              <MarkComponent {...markProps} key={child.getKey()}>
                {element}
              </MarkComponent>
            );
          }
        });

        children.push(element);
      });
    }

    return (
      <BlockComponent
        {...blockProps}
        data-block
        data-key={node.getKey()}
        className={joinClassNames("SquaDocJs-block", blockClassName)}
      >
        {children}
      </BlockComponent>
    );
  }
}
