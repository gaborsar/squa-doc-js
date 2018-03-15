import BlockImage from "./BlockImage";

export default function renderNode(node, defaultProps) {
  if (node.type === "block-image") {
    const { blockKey, createChange, onChange } = defaultProps;
    return {
      component: BlockImage,
      props: {
        blockKey,
        createChange,
        onChange,
        src: node.value[node.type],
        alt: node.getMark("alt"),
        caption: node.getMark("caption")
      }
    };
  }
}
