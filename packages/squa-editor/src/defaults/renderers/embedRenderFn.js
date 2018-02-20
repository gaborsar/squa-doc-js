import BlockImage from "../components/BlockImage";

function blockImageRenderFn(node) {
  return {
    component: BlockImage,
    props: {
      src: node.value[node.type],
      alt: node.getMark("alt"),
      caption: node.getMark("caption")
    }
  };
}

function inlineImageRenderFn(node) {
  return {
    component: "img",
    props: {
      src: node.value[node.type],
      alt: node.getMark("alt")
    }
  };
}

export default function embedRenderFn(node, defaultProps) {
  switch (node.type) {
    case "block-image":
      return blockImageRenderFn(node, defaultProps);

    case "inline-image":
      return inlineImageRenderFn(node);
  }
}
