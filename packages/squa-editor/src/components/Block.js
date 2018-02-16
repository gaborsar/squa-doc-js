import React, { PureComponent } from "react";
import Text from "./Text";
import Embed from "./Embed";
import defaultRenderEmbed from "../defaults/renderers/renderEmbed";
import defaultRenderMark from "../defaults/renderers/renderMark";

const emptyProps = {};

export default class Block extends PureComponent {
  render() {
    const {
      node,
      BlockComponent,
      blockProps,
      blockClassName,
      renderEmbed: customRenderEmbed,
      renderMark: customRenderMark,
      replaceInlineByKey,
      formatInlineByKey,
      deleteInlineByKey
    } = this.props;

    const classNames = ["ed-block"];
    let style = {};

    if (blockClassName) {
      classNames.push(blockClassName);
    }

    node.style.marks.forEach(mark => {
      let markObj;

      if (customRenderMark) {
        markObj = customRenderMark(mark);
      }

      if (markObj === undefined) {
        markObj = defaultRenderMark(mark);
      }

      if (markObj) {
        const {
          className: markClassName = "",
          style: markStyle = null
        } = markObj;

        if (markClassName) {
          classNames.push(markClassName);
        }

        if (markStyle) {
          style = {
            ...style,
            ...markStyle
          };
        }
      }
    });

    let children;

    if (node.children.length) {
      children = [];

      node.children.forEach(child => {
        if (child.isEmbed) {
          const defaultEmbedProps = {
            blockKey: node.key,
            inlineKey: child.key,
            replaceInlineByKey: replaceInlineByKey,
            formatInlineByKey: formatInlineByKey,
            deleteInlineByKey: deleteInlineByKey
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

            children.push(
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
          children.push(
            <Text key={child.key} node={child} renderMark={customRenderMark} />
          );
        }
      });
    } else {
      children = <br data-ignore />;
    }

    return (
      <BlockComponent
        {...blockProps}
        className={classNames.join(" ")}
        style={style}
        data-block
        data-key={node.key}
      >
        {children}
      </BlockComponent>
    );
  }
}
