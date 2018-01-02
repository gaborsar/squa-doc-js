import React, { PureComponent } from "react";

export default class Embed extends PureComponent {
  render() {
    const { node, renderEmbed, renderMark, deleteBlockByKey } = this.props;

    const { component: EmbedComponent = "", props: embedProps = {} } =
      renderEmbed(node) || {};

    let content = (
      <EmbedComponent {...embedProps} deleteBlockByKey={deleteBlockByKey} />
    );

    const classNames = ["ed-embed"];
    let style = {};

    node.style.marks.forEach(mark => {
      const {
        component: MarkComponent = "",
        props: markProps = {},
        className: markClassName = "",
        style: markStyle
      } =
        renderMark(mark) || {};

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

    const Container = node.isBlockEmbed ? "div" : "span";

    return (
      <Container
        contentEditable={false}
        className={classNames.join(" ")}
        style={style}
        data-embed
        data-key={node.key}
      >
        {content}
      </Container>
    );
  }
}
