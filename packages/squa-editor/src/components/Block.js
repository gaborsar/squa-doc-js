import React, { PureComponent } from "react";
import joinClassNames from "classnames";
import Text from "./Text";
import Embed from "./Embed";
import defaultEmbedRenderFn from "../defaults/renderers/embedRenderFn";
import defaultInlineStyleFn from "../defaults/renderers/inlineStyleFn";

export default class Block extends PureComponent {
  render() {
    const {
      node,
      BlockComponent,
      blockProps,
      blockClassName,
      replaceInlineByKey,
      formatInlineByKey,
      deleteInlineByKey,
      embedRenderFn: customEmbedRenderFn,
      inlineStyleFn: customInlineStyleFn
    } = this.props;

    const children = [];

    if (node.isEmpty) {
      children.push(<br data-ignore />);
    } else {
      node.children.forEach(child => {
        const { key } = child;

        const markObjects = [];

        child.style.marks.forEach(mark => {
          let markObj;

          if (customInlineStyleFn) {
            markObj = customInlineStyleFn(mark);
          }

          if (!markObj) {
            markObj = defaultInlineStyleFn(mark);
          }

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
            replaceInlineByKey,
            formatInlineByKey,
            deleteInlineByKey
          };

          let embedObj;

          if (customEmbedRenderFn) {
            embedObj = customEmbedRenderFn(child, defaultEmbedProps);
          }

          if (!embedObj) {
            embedObj = defaultEmbedRenderFn(child, defaultEmbedProps);
          }

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
