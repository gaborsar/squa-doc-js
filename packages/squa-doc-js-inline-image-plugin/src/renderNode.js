import InlineImage from "./InlineImage";
import joinClassNames from "classnames";

export default function renderNode(node, defaultProps) {
  if (node.type === "inline-image") {
    const {
      isSelected,
      blockKey,
      inlineKey,
      createChange,
      onChange
    } = defaultProps;
    return {
      component: InlineImage,
      props: {
        blockKey,
        inlineKey,
        createChange,
        onChange,
        className: joinClassNames("InlineImage", {
          "InlineImage-selected": isSelected
        }),
        src: node.value[node.type],
        alt: node.getMark("alt")
      }
    };
  }
}
