import React, { PureComponent } from "react";
import joinClassNames from "classnames";
import Embed from "./Embed";
import Block from "./Block";

export default class Document extends PureComponent {
  render() {
    const { node, createChange, onChange, renderNode, renderMark } = this.props;

    const blocks = [];

    node.children.forEach(child => {
      const classNames = [];

      child.style.marks.forEach(mark => {
        const markObj = renderMark(mark) || {};

        const { className: markClassName } = markObj;

        if (markClassName) {
          classNames.push(markClassName);
        }
      });

      if (child.isEmbed) {
        const defaultEmbedProps = {
          blockKey: child.key,
          createChange,
          onChange
        };

        const embedObj = renderNode(child, defaultEmbedProps);

        if (!embedObj) {
          throw new Error(`Invalid embed: ${child.type}`);
        }

        const { component, props } = embedObj;

        const element = (
          <Embed
            key={child.key}
            node={child}
            EmbedComponent={component}
            embedProps={props}
            embedClassName={joinClassNames(classNames)}
          />
        );

        blocks.push({ key: child.key, element });
      } else {
        const defaultBlockProps = {
          blockKey: child.key,
          createChange,
          onChange
        };

        const blockObj = renderNode(child, defaultBlockProps);

        if (!blockObj) {
          throw new Error(`Invalid block: ${child.type}`);
        }

        const { wrapper, component, props } = blockObj;

        const element = (
          <Block
            key={child.key}
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

        blocks.push({ wrapper, key: child.key, element });
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

    return (
      <div className="ed-document" data-key={node.key}>
        {children}
      </div>
    );
  }
}
