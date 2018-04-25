import InlineImage from "./InlineImage";

export default function renderNode(node) {
  if (
    node.getNodeType() === "inline-embed" &&
    node.getName() === "inline-image"
  ) {
    return {
      component: InlineImage,
      props: { node }
    };
  }
}
