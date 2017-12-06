import React, { PureComponent } from "react";
import { isEqual } from "lodash/fp";
import Block from "./Block";
import Embed from "./Embed";

export default class Document extends PureComponent {
  render() {
    const {
      node,
      renderWrapper,
      renderBlock,
      renderEmbed,
      renderMark
    } = this.props;

    const blocks = [];

    let buffer = {
      key: "",
      component: "",
      props: {},
      blocks: []
    };

    const flush = (key = "", component = "", props = {}) => {
      if (buffer.blocks.length !== 0) {
        if (buffer.component) {
          const {
            component: WrapperComponent,
            props: wrapperProps,
            key: wrapperKey,
            blocks: wrappedBlocks
          } = buffer;

          blocks.push(
            <WrapperComponent
              {...wrapperProps}
              key={wrapperKey}
              data-wrapper
              data-key={wrapperKey}
            >
              {wrappedBlocks}
            </WrapperComponent>
          );
        } else {
          blocks.push(...buffer.blocks);
        }
      }

      buffer = {
        key,
        component,
        props,
        blocks: []
      };
    };

    node.children.forEach(child => {
      if (child.kind === "block") {
        const { component = "", props = {} } = renderWrapper(child);

        if (buffer.component !== component || !isEqual(buffer.props, props)) {
          flush(child.key, component, props);
        }

        buffer.blocks.push(
          <Block
            key={child.key}
            node={child}
            renderBlock={renderBlock}
            renderEmbed={renderEmbed}
            renderMark={renderMark}
          />
        );
      } else {
        flush(child.key);

        buffer.blocks.push(
          <Embed
            key={child.key}
            node={child}
            renderEmbed={renderEmbed}
            renderMark={renderMark}
          />
        );
      }
    });

    flush();

    return (
      <div className="ed-document" data-document data-key={node.key}>
        {blocks}
      </div>
    );
  }
}
