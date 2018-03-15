import React, { PureComponent } from "react";
import joinClassNames from "classnames";
import Text from "./Text";
import Embed from "./Embed";

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

    if (node.isEmpty) {
      children.push(<br data-ignore />);
    } else {
      node.children.forEach(child => {
        const { key } = child;

        const markObjects = [];

        child.style.marks.forEach(mark => {
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

        if (child.isEmbed) {
          const defaultEmbedProps = {
            inlineKey: key,
            createChange,
            onChange
          };

          const embedObj = renderNode(child, defaultEmbedProps);

          if (!embedObj) {
            throw new Error(`Invalid embed: ${child.type}`);
          }

          const { component, props } = embedObj;

          element = (
            <Embed
              key={child.key}
              node={child}
              EmbedComponent={component}
              embedProps={props}
              embedClassName={joinClassNames(classNames)}
            />
          );
        } else {
          element = (
            <Text
              key={child.key}
              node={child}
              textClassName={joinClassNames(classNames)}
            />
          );
        }

        markObjects.forEach(markObj => {
          const { component: MarkComponent, props: markProps } = markObj;

          if (MarkComponent) {
            element = <MarkComponent {...markProps}>{element}</MarkComponent>;
          }
        });

        children.push(element);
      });
    }

    return (
      <BlockComponent
        {...blockProps}
        data-block
        data-key={node.key}
        className={joinClassNames("ed-block", blockClassName)}
      >
        {children}
      </BlockComponent>
    );
  }
}
