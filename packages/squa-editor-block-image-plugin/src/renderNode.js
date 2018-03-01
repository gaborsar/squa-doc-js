import BlockImage from "./BlockImage";

export default function renderNode(node) {
  if (node.type === "block-image") {
    return {
      component: BlockImage,
      props: {
        src: node.value[node.type],
        alt: node.getMark("alt"),
        caption: node.getMark("caption")
      }
    };
  }
}
