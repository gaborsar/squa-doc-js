import React, { PureComponent } from "react";
import defaultRenderMark from "../plugins/renderers/renderMark";

const emptyProps = {};

export default class Embed extends PureComponent {
  render() {
    const { node, renderMark: customRenderMark, children } = this.props;

    let content = children;
    const classNames = ["ed-embed"];

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
          component: MarkComponent,
          props: markProps = emptyProps,
          className: markClassName
        } = markObj;

        if (MarkComponent) {
          content = <MarkComponent {...markProps}>{content}</MarkComponent>;
        }

        if (markClassName) {
          classNames.push(markClassName);
        }
      }
    });

    const Container = node.isBlockEmbed ? "div" : "span";

    return (
      <Container
        contentEditable={false}
        className={classNames.join(" ")}
        data-embed
        data-key={node.key}
      >
        {content}
      </Container>
    );
  }
}
