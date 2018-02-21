import React, { PureComponent } from "react";
import joinClassNames from "classnames";
import Embed from "./Embed";
import Block from "./Block";
import defaultBlockRenderFn from "../defaults/renderers/blockRenderFn";
import defaultEmbedRenderFn from "../defaults/renderers/embedRenderFn";
import defaultBlockStyleFn from "../defaults/renderers/blockStyleFn";

export default class Document extends PureComponent {
  render() {
    const {
      node,
      replaceBlockByKey,
      formatBlockByKey,
      deleteBlockByKey,
      replaceInlineByKey,
      formatInlineByKey,
      deleteInlineByKey,
      blockRenderFn: customBlockRenderFn,
      embedRenderFn: customEmbedRenderFn,
      blockStyleFn: customBlockStyleFn,
      inlineStyleFn: customInlineStyleFn
    } = this.props;

    const blocks = [];

    node.children.forEach(child => {
      const classNames = [];

      child.style.marks.forEach(mark => {
        let markObj;

        if (customBlockStyleFn) {
          markObj = customBlockStyleFn(mark);
        }

        if (!markObj) {
          markObj = defaultBlockStyleFn(mark);
        }

        if (!markObj) {
          markObj = {};
        }

        const { className: markClassName } = markObj;

        if (markClassName) {
          classNames.push(markClassName);
        }
      });

      if (child.isEmbed) {
        const defaultEmbedProps = {
          blockKey: child.key,
          replaceBlockByKey,
          formatBlockByKey,
          deleteBlockByKey
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
          replaceBlockByKey,
          formatBlockByKey,
          deleteBlockByKey
        };

        let blockObj;

        if (customBlockRenderFn) {
          blockObj = customBlockRenderFn(child, defaultBlockProps);
        }

        if (!blockObj) {
          blockObj = defaultBlockRenderFn(child, defaultBlockProps);
        }

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
            replaceInlineByKey={replaceInlineByKey}
            formatInlineByKey={formatInlineByKey}
            deleteInlineByKey={deleteInlineByKey}
            embedRenderFn={customEmbedRenderFn}
            inlineStyleFn={customInlineStyleFn}
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
