import InlineImage from "./InlineImage";
import joinClassNames from "classnames";

export default function renderNode(node, defaultProps) {
  if (node.type === "inline-image") {
    const { isSelected } = defaultProps;
    return {
      component: InlineImage,
      props: {
        className: joinClassNames("inline-image", {
          "inline-image--selected": isSelected
        }),
        src: node.value[node.type],
        alt: node.getMark("alt")
      }
    };
  }
}
