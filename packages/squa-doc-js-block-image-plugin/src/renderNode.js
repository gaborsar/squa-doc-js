import BlockImage from "./BlockImage";

export default function renderNode(node, { createChange, onChange }) {
  if (
    node.getNodeType() === "block-embed" &&
    node.getName() === "block-image"
  ) {
    return {
      component: BlockImage,
      props: {
        internals: {
          node,
          createChange,
          onChange
        }
      }
    };
  }
}
