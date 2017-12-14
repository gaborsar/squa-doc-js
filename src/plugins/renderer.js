import BlockImage from "./BlockImage";
import InlineImage from "./InlineImage";

export function renderWrapper(node) {
  switch (node.type) {
    case "unordered-list-item":
      return { component: "ul" };

    case "ordered-list-item":
      return { component: "ol" };

    default:
      return {};
  }
}

export function renderBlock(node) {
  switch (node.type) {
    case "heading-one":
      return { component: "h1" };

    case "heading-two":
      return { component: "h2" };

    case "paragraph":
      return { component: "p" };

    case "unordered-list-item":
      return { component: "li" };

    case "ordered-list-item":
      return { component: "li" };

    default:
      return {};
  }
}

export function renderEmbed(node) {
  switch (node.type) {
    case "block-image":
      return { component: BlockImage, props: { node } };

    case "inline-image":
      return { component: InlineImage, props: { node } };

    default:
      return {};
  }
}

export function renderMark(mark) {
  switch (mark.type) {
    case "bold":
      return { component: "b" };

    case "italic":
      return { component: "i" };

    default:
      return {};
  }
}
