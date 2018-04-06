import React, { PureComponent } from "react";
import joinClassNames from "classnames";
import Embed from "./Embed";
import Block from "./Block";

export default class Document extends PureComponent {
  render() {
    const {
      node,
      startOffset,
      endOffset,
      createChange,
      onChange,
      renderNode,
      renderMark
    } = this.props;

    const blocks = [];
    let offset = 0;

    node.children.forEach(child => {
      const classNames = [];

      child.style.marks.forEach(mark => {
        const markObj = renderMark(mark) || {};

        const { className: markClassName } = markObj;

        if (markClassName) {
          classNames.push(markClassName);
        }
      });

      const { length: childLength } = child;

      const childStartOffset = Math.min(
        Math.max(startOffset - offset, 0),
        childLength
      );

      const childEndOffset = Math.min(
        Math.max(endOffset - offset, 0),
        childLength
      );

      const isChildSelected = childStartOffset < childEndOffset;

      const defaultProps = {
        isSelected: isChildSelected,
        blockKey: child.key,
        createChange,
        onChange
      };

      offset += childLength;

      if (child.isEmbed) {
        const embedObj = renderNode(child, defaultProps);

        if (!embedObj) {
          throw new Error(`Invalid embed: ${child.type}`);
        }

        const { component, props: { className, ...props } = {} } = embedObj;

        if (className) {
          classNames.push(className);
        }

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
        const blockObj = renderNode(child, defaultProps);

        if (!blockObj) {
          throw new Error(`Invalid block: ${child.type}`);
        }

        const {
          wrapper,
          component,
          props: { className, ...props } = {}
        } = blockObj;

        if (className) {
          classNames.push(className);
        }

        const element = (
          <Block
            key={child.key}
            node={child}
            startOffset={childStartOffset}
            endOffset={childEndOffset}
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
