import React, { PureComponent } from "react";
import Text from "./Text";
import Embed from "./Embed";
import defaultRenderEmbed from "../plugins/renderers/renderEmbed";
import defaultRenderMark from "../plugins/renderers/renderMark";

const emptyProps = {};

export default class Block extends PureComponent {
  render() {
    const {
      node,
      renderEmbed: customRenderEmbed,
      renderMark: customRenderMark,
      deleteInlineByKey,
      BlockComponent,
      blockProps
    } = this.props;

    const classNames = ["ed-block"];

    node.style.marks.forEach(mark => {
      let markObj;

      if (customRenderMark) {
        markObj = customRenderMark(mark);
      }

      if (markObj === undefined) {
        markObj = defaultRenderMark(mark);
      }

      if (markObj) {
        const { className: markClassName } = markObj;

        if (markClassName) {
          classNames.push(markClassName);
        }
      }
    });

    let children;

    if (node.children.length) {
      children = [];

      node.children.forEach(child => {
        if (child.isEmbed) {
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

            children.push(
              <Embed key={child.key} node={child} renderMark={customRenderMark}>
                <EmbedComponent
                  {...embedProps}
                  blockNode={node}
                  deleteInlineByKey={deleteInlineByKey}
                />
              </Embed>
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
        data-block
        data-key={node.key}
      >
        {children}
      </BlockComponent>
    );
  }
}
