import BlockImage from "../components/BlockImage";
import InlineImage from "../components/InlineImage";

export default function renderEmbed(node) {
  switch (node.type) {
    case "block-image":
      return { component: BlockImage, props: { node } };

    case "inline-image":
      return { component: InlineImage, props: { node } };
  }
}
