import React, { PureComponent } from "react";
import { isEqual } from "lodash/fp";
import Embed from "./Embed";
import Block from "./Block";
import defaultRenderWrapper from "../plugins/renderers/renderWrapper";
import defaultRenderBlock from "../plugins/renderers/renderBlock";
import defaultRenderEmbed from "../plugins/renderers/renderEmbed";

const emptyProps = {};

export default class Document extends PureComponent {
  render() {
    const {
      node,
      renderWrapper: customRenderWrapper,
      renderBlock: customRenderBlock,
      renderEmbed: customRenderEmbed,
      renderMark: customRenderMark,
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
      if (child.kind === "block") {
        let wrapperObj;

        if (customRenderWrapper) {
          wrapperObj = customRenderWrapper(child);
        }

        if (wrapperObj === undefined) {
          wrapperObj = defaultRenderWrapper(child);
        }

        if (wrapperObj === undefined) {
          wrapperObj = {};
        }

        if (wrapperObj) {
          let blockObj;

          if (customRenderBlock) {
            blockObj = customRenderBlock(child);
          }

          if (blockObj === undefined) {
            blockObj = defaultRenderBlock(child);
          }

          if (blockObj) {
            const {
              component: WrapperComponent = "",
              props: wrapperProps = emptyProps
            } = wrapperObj;

            if (
              buffer.component !== WrapperComponent ||
              !isEqual(buffer.props, wrapperProps)
            ) {
              flush(child.key, WrapperComponent, wrapperProps);
            }

            const {
              component: BlockComponent = "p",
              props: blockProps = emptyProps
            } = blockObj;

            buffer.children.push(
              <Block
                key={child.key}
                node={child}
                renderEmbed={customRenderEmbed}
                renderMark={customRenderMark}
                deleteInlineByKey={deleteInlineByKey}
                BlockComponent={BlockComponent}
                blockProps={blockProps}
              />
            );
          }
        }
      } else {
        flush(child.key);

        let embedObj;

        if (customRenderEmbed) {
          embedObj = customRenderEmbed(child);
        }

        if (embedObj === undefined) {
          embedObj = defaultRenderEmbed(child);
        }

        if (embedObj) {
          const {
            component: EmbedComponent,
            props: embedProps = emptyProps
          } = embedObj;

          buffer.children.push(
            <Embed key={child.key} node={child} renderMark={customRenderMark}>
              <EmbedComponent
                {...embedProps}
                deleteBlockByKey={deleteBlockByKey}
              />
            </Embed>
          );
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
