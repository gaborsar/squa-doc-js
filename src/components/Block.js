import React, { PureComponent } from "react";
import Text from "./Text";
import Embed from "./Embed";

export default class Block extends PureComponent {
  render() {
    const { node, renderBlock, renderEmbed, renderMark } = this.props;

    const classNames = ["ed-block"];
    let style = {};

    node.style.marks.forEach(mark => {
      const { className: markClassName = "", style: markStyle } = renderMark(
        mark
      );

      if (markClassName) {
        classNames.push(markClassName);
      }

      if (markStyle) {
        style = { ...style, ...markStyle };
      }
    });

    const content = node.children.length ? (
      node.children.map(
        child =>
          child.kind === "text" ? (
            <Text key={child.key} node={child} renderMark={renderMark} />
          ) : (
            <Embed
              key={child.key}
              node={child}
              renderEmbed={renderEmbed}
              renderMark={renderMark}
            />
          )
      )
    ) : (
      <br data-ignore />
    );

    const {
      component: BlockComponent = "div",
      props: blockProps = {}
    } = renderBlock(node);

    return (
      <BlockComponent
        {...blockProps}
        className={classNames.join(" ")}
        style={style}
        data-block
        data-key={node.key}
      >
        {content}
      </BlockComponent>
    );
  }
}
