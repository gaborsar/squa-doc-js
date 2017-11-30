import React, { PureComponent } from "react";
import Text from "./Text";
import Embed from "./Embed";

export default class Block extends PureComponent {
  render() {
    const { node, renderBlock, renderEmbed, renderMark } = this.props;

    let content = node.children.map(
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
    );

    const classNames = ["ed-block"];
    let style = {};

    node.style.marks.forEach(mark => {
      const {
        component: MarkComponent = "",
        props: markProps = {},
        className: markClassName = "",
        style: markStyle
      } = renderMark(mark);

      if (MarkComponent) {
        content = <MarkComponent {...markProps}>{content}</MarkComponent>;
      }

      if (markClassName) {
        classNames.push(markClassName);
      }

      if (markStyle) {
        style = { ...style, ...markStyle };
      }
    });

    const {
      component: BlockComponent = "div",
      props: blockProps = {}
    } = renderBlock(node);

    return (
      <BlockComponent
        {...blockProps}
        className={classNames.join(" ")}
        style={style}
      >
        {content}
      </BlockComponent>
    );
  }
}
