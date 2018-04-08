import BlockImage from "./BlockImage";
import joinClassNames from "classnames";

export default function renderNode(node, defaultProps) {
  if (node.type === "block-image") {
    const { isSelected, blockKey, createChange, onChange } = defaultProps;
    return {
      component: BlockImage,
      props: {
        blockKey,
        createChange,
        onChange,
        className: joinClassNames("BlockImage", {
          "BlockImage-selected": isSelected
        }),
        src: node.value[node.type],
        alt: node.getMark("alt"),
        caption: node.getMark("caption")
      }
    };
  }
}
