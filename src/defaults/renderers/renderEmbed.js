import BlockImage from "../components/BlockImage";
import InlineImage from "../components/InlineImage";

function renderBlockImage(node, defaultProps) {
  const { blockKey, deleteBlockByKey } = defaultProps;
  return {
    component: BlockImage,
    props: {
      blockKey,
      deleteBlockByKey,
      src: node.value["block-image"],
      alt: node.getMark("alt"),
      caption: node.getMark("caption")
    }
  };
}

function renderInlineImage(node) {
  return {
    component: InlineImage,
    props: {
      src: node.value["inline-image"],
      alt: node.getMark("alt")
    }
  };
}

export default function renderEmbed(node, defaultProps) {
  switch (node.type) {
    case "block-image":
      return renderBlockImage(node, defaultProps);

    case "inline-image":
      return renderInlineImage(node);
  }
}
