import React, { PureComponent } from "react";
import { isEqual } from "lodash/fp";
import Embed from "./Embed";
import Block from "./Block";
import defaultRenderWrapper from "../defaults/renderers/renderWrapper";
import defaultRenderBlock from "../defaults/renderers/renderBlock";
import defaultRenderEmbed from "../defaults/renderers/renderEmbed";

const emptyProps = {};

export default class Document extends PureComponent {
  render() {
    const {
      node,
      renderWrapper: customRenderWrapper,
      renderBlock: customRenderBlock,
      renderEmbed: customRenderEmbed,
      renderMark: customRenderMark,
      replaceBlockByKey,
      replaceInlineByKey,
      formatBlockByKey,
      formatInlineByKey,
      deleteBlockByKey,
      deleteInlineByKey
    } = this.props;

    const children = [];

    let buffer = {
      key: "",
      component: "",
      props: emptyProps,
      children: []
    };

    const flush = (key = "", component = "", props = emptyProps) => {
      if (buffer.children.length !== 0) {
        if (buffer.component) {
          const {
            component: WrapperComponent,
            props: wrapperProps,
            key: wrapperKey,
            children: wrapperChildren
          } = buffer;

          children.push(
            <WrapperComponent
              {...wrapperProps}
              key={wrapperKey}
              data-wrapper
              data-key={wrapperKey}
            >
              {wrapperChildren}
            </WrapperComponent>
          );
        } else {
          children.push(...buffer.children);
        }
      }

      buffer = {
        key,
        component,
        props,
        children: []
      };
    };

    node.children.forEach(child => {
      if (child.isEmbed) {
        flush(child.key);

        const defaultEmbedProps = {
          blockKey: child.key,
          replaceBlockByKey: replaceBlockByKey,
          formatBlockByKey: formatBlockByKey,
          deleteBlockByKey: deleteBlockByKey
        };

        let embedObj;

        if (customRenderEmbed) {
          embedObj = customRenderEmbed(child, defaultEmbedProps);
        }

        if (embedObj === undefined) {
          embedObj = defaultRenderEmbed(child, defaultEmbedProps);
        }

        if (embedObj) {
          const {
            component: EmbedComponent,
            props: embedProps = emptyProps
          } = embedObj;

          buffer.children.push(
            <Embed
              key={child.key}
              node={child}
              EmbedComponent={EmbedComponent}
              embedProps={embedProps}
              renderMark={customRenderMark}
            />
          );
        }
      } else {
        let wrapperObj;

        if (customRenderWrapper) {
          wrapperObj = customRenderWrapper(child);
        }

        if (wrapperObj === undefined) {
          wrapperObj = defaultRenderWrapper(child);
        }

        if (wrapperObj === undefined) {
          wrapperObj = {
            componet: ""
          };
        }

        if (wrapperObj) {
          const defaultBlockProps = {
            blockKey: child.key,
            replaceBlockByKey: replaceBlockByKey,
            formatBlockByKey: formatBlockByKey,
            deleteBlockByKey: deleteBlockByKey
          };

          let blockObj;

          if (customRenderBlock) {
            blockObj = customRenderBlock(child, defaultBlockProps);
          }

          if (blockObj === undefined) {
            blockObj = defaultRenderBlock(child, defaultBlockProps);
          }

          if (blockObj) {
            const {
              component: WrapperComponent,
              props: wrapperProps = emptyProps
            } = wrapperObj;

            if (
              buffer.component !== WrapperComponent ||
              !isEqual(buffer.props, wrapperProps)
            ) {
              flush(child.key, WrapperComponent, wrapperProps);
            }

            const {
              component: BlockComponent,
              props: blockProps = emptyProps
            } = blockObj;

            buffer.children.push(
              <Block
                key={child.key}
                node={child}
                BlockComponent={BlockComponent}
                blockProps={blockProps}
                renderEmbed={customRenderEmbed}
                renderMark={customRenderMark}
                replaceInlineByKey={replaceInlineByKey}
                formatInlineByKey={formatInlineByKey}
                deleteInlineByKey={deleteInlineByKey}
              />
            );
          }
        }
      }
    });

    flush();

    return (
      <div className="ed-document" data-document data-key={node.key}>
        {children}
      </div>
    );
  }
}
