import React, { PureComponent } from "react";
import defaultRenderMark from "../plugins/renderers/renderMark";

const emptyProps = {};

export default class Embed extends PureComponent {
  render() {
    const {
      node,
      EmbedComponent,
      embedProps,
      renderMark: customRenderMark
    } = this.props;

    const Container = node.isBlock ? "div" : "span";

    const markObjects = [];

    node.style.marks.forEach(mark => {
      let markObj;

      if (customRenderMark) {
        markObj = customRenderMark(mark);
      }

      if (markObj === undefined) {
        markObj = defaultRenderMark(mark);
      }

      if (markObj) {
        markObjects.push(markObj);
      }
    });

    const classNames = [];
    let style = {};

    markObjects.forEach(markObj => {
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
    });

    let content = (
      <EmbedComponent
        {...embedProps}
        className={classNames.join(" ")}
        style={style}
      />
    );

    markObjects.forEach(markObj => {
      const {
        component: MarkComponent = "",
        props: markProps = emptyProps
      } = markObj;

      if (MarkComponent) {
        content = <MarkComponent {...markProps}>{content}</MarkComponent>;
      }
    });

    return (
      <Container
        className="ed-embed"
        contentEditable={false}
        data-embed
        data-key={node.key}
      >
        {content}
      </Container>
    );
  }
}
